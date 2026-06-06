const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { protect, authorize, JWT_SECRET } = require('../middleware/authMiddleware');

const User = require('../models/User');
const Patient = require('../models/Patient');
const Queue = require('../models/Queue');
const Bed = require('../models/Bed');
const Admission = require('../models/Admission');
const Inventory = require('../models/Inventory');
const ConsumableRequest = require('../models/ConsumableRequest');
const Alert = require('../models/Alert');
const Notice = require('../models/Notice');
const Hospital = require('../models/Hospital');

const router = express.Router();

// ==========================================
// AUTHENTICATION
// ==========================================

// Login
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        specialization: user.specialization,
        assignedWard: user.assignedWard
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Register User
router.post('/auth/register', protect, authorize('Management'), async (req, res) => {
  const { name, email, password, role, department, specialization, assignedWard } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      specialization: role === 'Doctor' ? specialization : undefined,
      assignedWard: role === 'Nurse' ? assignedWard : undefined
    });

    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      specialization: newUser.specialization,
      assignedWard: newUser.assignedWard
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
});

// Get all Doctors
router.get('/doctors', protect, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'Doctor' }).select('-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error retrieving doctors', error: err.message });
  }
});

// Get profile
router.get('/auth/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// ==========================================
// PATIENTS
// ==========================================
router.get('/patients', protect, async (req, res) => {
  try {
    const patients = await Patient.find({});
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/patients', protect, async (req, res) => {
  const { name, age, gender, phone, address, medicalHistory } = req.body;
  try {
    const patientId = `PT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient = await Patient.create({
      patientId,
      name,
      age,
      gender,
      phone,
      address,
      medicalHistory: medicalHistory ? medicalHistory.split(',').map(h => h.trim()) : []
    });
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update vitals (Nurses/Doctors)
router.put('/patients/:id/vitals', protect, async (req, res) => {
  const { bloodPressure, heartRate, temperature, oxygenLevel } = req.body;
  try {
    const patient = await Patient.findById(req.id || req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    patient.currentVitals = {
      bloodPressure,
      heartRate: Number(heartRate),
      temperature: Number(temperature),
      oxygenLevel: Number(oxygenLevel),
      updatedAt: new Date()
    };
    await patient.save();

    // Trigger alert if oxygen levels are critical
    if (Number(oxygenLevel) < 92) {
      await Alert.create({
        title: `Critical Vitals: Patient ${patient.name} Oxygen saturation is ${oxygenLevel}%`,
        type: 'Admission Alert',
        severity: 'Critical'
      });
    }

    res.json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Patient
router.delete('/patients/:id', protect, authorize('Management'), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// SMART OPD QUEUE MANAGEMENT
// ==========================================
router.get('/queue', protect, async (req, res) => {
  try {
    let query = {};
    // If Doctor, filter by their own queue
    if (req.user.role === 'Doctor') {
      query.doctor = req.user._id;
    }
    const queue = await Queue.find(query).populate('patient').populate('doctor', 'name specialization');
    res.json(queue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/queue', protect, authorize('Management', 'Reception Staff'), async (req, res) => {
  const { patientId, doctorId, priority } = req.body;
  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(400).json({ message: 'Valid Doctor required' });
    }

    // Token creation
    const dateStr = new Date().toISOString().slice(2,10).replace(/-/g,'');
    const count = await Queue.countDocuments({ createdAt: { $gte: new Date().setHours(0,0,0,0) } });
    const tokenNumber = `TKN-${count + 101}`;

    // Get doctor's waiting queue to calculate estimate
    const waitingCount = await Queue.countDocuments({
      doctor: doctorId,
      queueStatus: 'Waiting'
    });
    
    // Rule: Avg consultation is 10 mins.
    const averageConsultationTime = 10; 
    const estimatedWaitTime = waitingCount * averageConsultationTime;
    const predictedStartTime = new Date(Date.now() + estimatedWaitTime * 60 * 1000);

    const queueEntry = await Queue.create({
      tokenNumber,
      patient: patientId,
      doctor: doctorId,
      priority: priority || false,
      estimatedWaitTime,
      averageConsultationTime,
      predictedStartTime
    });

    // Create high-waiting time alert if needed
    if (estimatedWaitTime > 45) {
      await Alert.create({
        title: `Queue Bottleneck: Dr. ${doctor.name} waiting time is ${estimatedWaitTime} mins`,
        type: 'Queue Alert',
        severity: 'High'
      });
    }

    const populated = await queueEntry.populate('patient');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Queue Token Status
router.put('/queue/:id', protect, async (req, res) => {
  const { queueStatus } = req.body;
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) return res.status(404).json({ message: 'Token record not found' });

    // Restrict doctors to update their own queue, admins can update any
    if (req.user.role === 'Doctor' && queue.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this doctor queue' });
    }

    queue.queueStatus = queueStatus;
    await queue.save();

    // Recalculate estimates for this doctor's remaining waiting queue
    if (queueStatus === 'Completed' || queueStatus === 'Cancelled') {
      const waitingTokens = await Queue.find({ doctor: queue.doctor, queueStatus: 'Waiting' }).sort({ createdAt: 1 });
      for (let i = 0; i < waitingTokens.length; i++) {
        waitingTokens[i].estimatedWaitTime = Math.max(0, i * 10);
        waitingTokens[i].predictedStartTime = new Date(Date.now() + waitingTokens[i].estimatedWaitTime * 60 * 1000);
        await waitingTokens[i].save();
      }
    }

    res.json(queue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ==========================================
// BED MANAGEMENT
// ==========================================
router.get('/beds', protect, async (req, res) => {
  try {
    let query = {};
    // Nurses only see beds in their assigned ward
    if (req.user.role === 'Nurse') {
      query.wardType = req.user.assignedWard || 'General';
    }
    const beds = await Bed.find(query).populate('patient');
    res.json(beds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Allocate / Release bed directly (Management / Nurse in their ward)
router.put('/beds/:id', protect, async (req, res) => {
  const { status, patientId } = req.body;
  try {
    const bed = await Bed.findById(req.params.id);
    if (!bed) return res.status(404).json({ message: 'Bed not found' });

    if (req.user.role === 'Nurse' && bed.wardType !== req.user.assignedWard) {
      return res.status(403).json({ message: 'Nurses can only manage beds in their assigned ward' });
    }

    bed.status = status;
    bed.patient = status === 'Occupied' ? patientId : null;
    await bed.save();

    // Trigger alerts based on capacity
    const totalWards = await Bed.countDocuments({ wardType: bed.wardType });
    const occupiedWards = await Bed.countDocuments({ wardType: bed.wardType, status: 'Occupied' });
    const occupancyRate = (occupiedWards / totalWards) * 100;

    if (occupancyRate >= 90) {
      await Alert.create({
        title: `${bed.wardType} Ward Critically Full: ${occupancyRate.toFixed(0)}% Occupancy`,
        type: 'Bed Alert',
        severity: 'Critical'
      });
    }

    res.json(bed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ==========================================
// PATIENT ADMISSION MANAGEMENT
// ==========================================
router.get('/admissions', protect, async (req, res) => {
  try {
    const admissions = await Admission.find({})
      .populate('patient')
      .populate('doctor', 'name specialization')
      .populate('bed');
    res.json(admissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create admission request (With Auto-Bed-Allocation Rules)
router.post('/admissions', protect, authorize('Management', 'Reception Staff', 'Doctor'), async (req, res) => {
  const { patientId, doctorId, admissionReason, wardType } = req.body;
  try {
    // 1. Search for available bed in the requested ward
    const availableBed = await Bed.findOne({ wardType, status: 'Available' });

    let bedId = null;
    let admissionStatus = 'Pending';

    if (availableBed) {
      bedId = availableBed._id;
      admissionStatus = 'Admitted';

      // Lock bed
      availableBed.status = 'Occupied';
      availableBed.patient = patientId;
      await availableBed.save();
    } else {
      // Create Alert: ICU/ER has no beds
      await Alert.create({
        title: `Admissions Alert: No Bed Available in ${wardType} Ward for patient ID ${patientId}`,
        type: 'Bed Alert',
        severity: 'Critical'
      });
    }

    const admission = await Admission.create({
      patient: patientId,
      doctor: doctorId || req.user._id,
      bed: bedId,
      admissionReason,
      status: admissionStatus,
      admissionDate: new Date()
    });

    const populated = await Admission.findById(admission._id)
      .populate('patient')
      .populate('doctor', 'name')
      .populate('bed');

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Process Discharge
router.put('/admissions/:id/discharge', protect, authorize('Management', 'Reception Staff', 'Doctor'), async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ message: 'Admission record not found' });

    admission.status = 'Discharged';
    admission.dischargeDate = new Date();
    await admission.save();

    // Release bed if tied
    if (admission.bed) {
      const bed = await Bed.findById(admission.bed);
      if (bed) {
        bed.status = 'Available';
        bed.patient = null;
        await bed.save();
      }
    }

    res.json(admission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ==========================================
// INVENTORY & REPLENISHMENT WORKFLOW
// ==========================================
router.get('/inventory', protect, async (req, res) => {
  try {
    const inventory = await Inventory.find({});
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add stock or new item (Management)
router.post('/inventory', protect, authorize('Management'), async (req, res) => {
  const { itemName, category, quantity, minimumStock, expiryDate } = req.body;
  try {
    const item = await Inventory.create({
      itemName,
      category,
      quantity: Number(quantity),
      minimumStock: Number(minimumStock || 20),
      expiryDate: new Date(expiryDate)
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update stock counts
router.put('/inventory/:id', protect, authorize('Management'), async (req, res) => {
  const { quantity, minimumStock, expiryDate } = req.body;
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (quantity !== undefined) item.quantity = Number(quantity);
    if (minimumStock !== undefined) item.minimumStock = Number(minimumStock);
    if (expiryDate !== undefined) item.expiryDate = new Date(expiryDate);

    await item.save();

    // Alert triggers
    if (item.quantity <= item.minimumStock) {
      await Alert.create({
        title: `Inventory Critical: ${item.itemName} Stock Level at ${item.quantity} (Par: ${item.minimumStock})`,
        type: 'Inventory Alert',
        severity: item.quantity === 0 ? 'Critical' : 'High'
      });
    }

    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Consumable requests list (Nurses see their requests, Management sees all)
router.get('/requests', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Nurse') {
      query.requestedBy = req.user._id;
    }
    const requests = await ConsumableRequest.find(query)
      .populate('requestedBy', 'name role assignedWard');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit consumable request (Nurses)
router.post('/requests', protect, authorize('Nurse'), async (req, res) => {
  const { itemName, quantity } = req.body;
  try {
    const request = await ConsumableRequest.create({
      itemName,
      quantity: Number(quantity),
      requestedBy: req.user._id
    });
    const populated = await request.populate('requestedBy', 'name role assignedWard');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Approve Replenishment Request (Management)
router.put('/requests/:id', protect, authorize('Management'), async (req, res) => {
  const { status } = req.body; // Approved / Rejected
  try {
    const request = await ConsumableRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    await request.save();

    // If approved, decrement the consumable stock from main Inventory
    if (status === 'Approved') {
      const inventoryItem = await Inventory.findOne({ itemName: request.itemName });
      if (inventoryItem) {
        inventoryItem.quantity = Math.max(0, inventoryItem.quantity - request.quantity);
        await inventoryItem.save();

        // Check if now low stock
        if (inventoryItem.quantity <= inventoryItem.minimumStock) {
          await Alert.create({
            title: `Low Stock Trigger: ${inventoryItem.itemName} fell to ${inventoryItem.quantity} units post-approval`,
            type: 'Inventory Alert',
            severity: 'High'
          });
        }
      }
    }

    res.json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ==========================================
// ALERT CENTER
// ==========================================
router.get('/alerts', protect, async (req, res) => {
  try {
    let query = { resolved: false };
    
    // Filtering based on role guidelines:
    // Management: all alerts
    // Doctors: Patient-related / Admission alerts
    // Nurses: Ward-related / Bed alerts
    if (req.user.role === 'Doctor') {
      query.type = { $in: ['Admission Alert', 'Queue Alert'] };
    } else if (req.user.role === 'Nurse') {
      query.type = { $in: ['Bed Alert', 'Inventory Alert'] };
    }

    const alerts = await Alert.find(query).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/alerts/:id/resolve', protect, authorize('Management'), async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    alert.resolved = true;
    await alert.save();
    res.json(alert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ==========================================
// NOTICE BOARD
// ==========================================
router.get('/notices', protect, async (req, res) => {
  try {
    const notices = await Notice.find({}).populate('postedBy', 'name role').sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/notices', protect, authorize('Management'), async (req, res) => {
  const { title, description } = req.body;
  try {
    const notice = await Notice.create({
      title,
      description,
      postedBy: req.user._id
    });
    const populated = await notice.populate('postedBy', 'name role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ==========================================
// CITY-WIDE HOSPITAL SHARING NETWORK
// ==========================================
router.get('/network', protect, async (req, res) => {
  try {
    const network = await Hospital.find({});
    res.json(network);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
