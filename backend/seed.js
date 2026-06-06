const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Bed = require('./models/Bed');
const Queue = require('./models/Queue');
const Admission = require('./models/Admission');
const Inventory = require('./models/Inventory');
const ConsumableRequest = require('./models/ConsumableRequest');
const Alert = require('./models/Alert');
const Notice = require('./models/Notice');
const Hospital = require('./models/Hospital');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/careconnect';

const seedDatabase = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Database connected. Clearing old entries...');

    // Clear everything
    await User.deleteMany();
    await Patient.deleteMany();
    await Bed.deleteMany();
    await Queue.deleteMany();
    await Admission.deleteMany();
    await Inventory.deleteMany();
    await ConsumableRequest.deleteMany();
    await Alert.deleteMany();
    await Notice.deleteMany();
    await Hospital.deleteMany();

    console.log('Creating users...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const doctorPassword = await bcrypt.hash('doctor123', salt);
    const nursePassword = await bcrypt.hash('nurse123', salt);
    const receptionPassword = await bcrypt.hash('reception123', salt);

    const management = await User.create({
      name: 'Dr. Arthur Pendelton',
      email: 'admin@careconnect.com',
      password: adminPassword,
      role: 'Management',
      department: 'Administration'
    });

    const docSmith = await User.create({
      name: 'Dr. Evelyn Smith',
      email: 'doctor@careconnect.com',
      password: doctorPassword,
      role: 'Doctor',
      department: 'Cardiology',
      specialization: 'Cardiologist'
    });

    const docJohnson = await User.create({
      name: 'Dr. Marcus Johnson',
      email: 'doctor2@careconnect.com',
      password: doctorPassword,
      role: 'Doctor',
      department: 'General Medicine',
      specialization: 'Physician'
    });

    const nurseSarah = await User.create({
      name: 'Sarah Connor, RN',
      email: 'nurse@careconnect.com',
      password: nursePassword,
      role: 'Nurse',
      department: 'Critical Care',
      assignedWard: 'ICU'
    });

    const nurseDavid = await User.create({
      name: 'David Miller, RN',
      email: 'nurse2@careconnect.com',
      password: nursePassword,
      role: 'Nurse',
      department: 'Emergency Care',
      assignedWard: 'Emergency'
    });

    const receptionJane = await User.create({
      name: 'Jane Doe',
      email: 'reception@careconnect.com',
      password: receptionPassword,
      role: 'Reception Staff',
      department: 'OPD Desk'
    });

    console.log('Users created successfully.');

    console.log('Creating patients...');
    const patients = await Patient.create([
      {
        patientId: 'PT-1001',
        name: 'James Watson',
        age: 45,
        gender: 'Male',
        phone: '9876543210',
        address: '12 Baker St, New Delhi',
        medicalHistory: ['Hypertension', 'Type-2 Diabetes'],
        currentVitals: {
          bloodPressure: '135/85',
          heartRate: 82,
          temperature: 98.9,
          oxygenLevel: 97,
          updatedAt: new Date()
        }
      },
      {
        patientId: 'PT-1002',
        name: 'Clara Oswald',
        age: 29,
        gender: 'Female',
        phone: '9988776655',
        address: '56 Rosewood Rd, Kolkata',
        medicalHistory: ['Asthma'],
        currentVitals: {
          bloodPressure: '118/76',
          heartRate: 70,
          temperature: 98.4,
          oxygenLevel: 99,
          updatedAt: new Date()
        }
      },
      {
        patientId: 'PT-1003',
        name: 'Robert Stark',
        age: 62,
        gender: 'Male',
        phone: '9898989898',
        address: '7 Winterfell Ave, Shimla',
        medicalHistory: ['Chronic Kidney Disease', 'Cardiovascular disease'],
        currentVitals: {
          bloodPressure: '142/90',
          heartRate: 88,
          temperature: 101.2,
          oxygenLevel: 93,
          updatedAt: new Date()
        }
      },
      {
        patientId: 'PT-1004',
        name: 'Martha Jones',
        age: 34,
        gender: 'Female',
        phone: '9000100020',
        address: '221B Regent Dr, Mumbai',
        medicalHistory: ['None'],
        currentVitals: {
          bloodPressure: '120/80',
          heartRate: 75,
          temperature: 98.6,
          oxygenLevel: 98,
          updatedAt: new Date()
        }
      }
    ]);

    console.log('Patients created. Creating beds...');
    // Create Beds
    const beds = [];
    // ICU Beds (5 beds)
    for (let i = 1; i <= 5; i++) {
      beds.push({
        bedNumber: `ICU-0${i}`,
        wardType: 'ICU',
        status: i === 1 ? 'Occupied' : 'Available',
        patient: i === 1 ? patients[0]._id : null
      });
    }
    // Emergency Beds (5 beds)
    for (let i = 1; i <= 5; i++) {
      beds.push({
        bedNumber: `ER-0${i}`,
        wardType: 'Emergency',
        status: i === 2 ? 'Occupied' : 'Available',
        patient: i === 2 ? patients[1]._id : null
      });
    }
    // General Ward Beds (10 beds)
    for (let i = 1; i <= 10; i++) {
      beds.push({
        bedNumber: `GEN-${i < 10 ? '0' + i : i}`,
        wardType: 'General',
        status: 'Available',
        patient: null
      });
    }

    const seededBeds = await Bed.insertMany(beds);
    console.log('Beds created.');

    console.log('Creating queue logs...');
    // Seed queue
    await Queue.create([
      {
        tokenNumber: 'TKN-101',
        patient: patients[2]._id, // Robert Stark
        doctor: docSmith._id,
        priority: true,
        queueStatus: 'Waiting',
        estimatedWaitTime: 12,
        averageConsultationTime: 12,
        predictedStartTime: new Date(Date.now() + 12 * 60 * 1000)
      },
      {
        tokenNumber: 'TKN-102',
        patient: patients[3]._id, // Martha Jones
        doctor: docSmith._id,
        priority: false,
        queueStatus: 'In Progress',
        estimatedWaitTime: 0,
        averageConsultationTime: 10,
        predictedStartTime: new Date()
      }
    ]);

    console.log('Queue created. Creating admissions...');
    // Seed admissions
    await Admission.create([
      {
        patient: patients[0]._id,
        doctor: docSmith._id,
        bed: seededBeds[0]._id, // ICU-01
        admissionReason: 'Acute myocardial infarction',
        admissionDate: new Date(Date.now() - 48 * 60 * 60 * 1000),
        status: 'Admitted'
      },
      {
        patient: patients[1]._id,
        doctor: docJohnson._id,
        bed: seededBeds[5]._id, // ER-01 (index 5 is ER-01)
        admissionReason: 'Severe respiratory distress secondary to asthma',
        admissionDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'Admitted'
      }
    ]);

    console.log('Admissions created. Creating inventory...');
    // Seed inventory
    const meds = [
      { itemName: 'Paracetamol 650mg', category: 'Medicines', quantity: 500, minimumStock: 100, expiryDate: new Date('2028-12-31') },
      { itemName: 'Insulin Glargine', category: 'Medicines', quantity: 15, minimumStock: 25, expiryDate: new Date('2027-04-15') }, // Low Stock!
      { itemName: 'Amoxicillin 500mg', category: 'Medicines', quantity: 200, minimumStock: 50, expiryDate: new Date('2026-07-01') }, // Expiring soon!
      { itemName: 'Atorvastatin 20mg', category: 'Medicines', quantity: 300, minimumStock: 50, expiryDate: new Date('2027-10-30') },
      { itemName: 'Nitrile Gloves (Box)', category: 'Consumables', quantity: 120, minimumStock: 30, expiryDate: new Date('2030-01-01') },
      { itemName: 'Surgical Masks (Box)', category: 'Consumables', quantity: 8, minimumStock: 20, expiryDate: new Date('2029-05-20') }, // Low Stock!
      { itemName: 'Sterile Syringes 5ml', category: 'Consumables', quantity: 450, minimumStock: 100, expiryDate: new Date('2029-10-15') }
    ];
    await Inventory.insertMany(meds);

    console.log('Inventory created. Creating consumable requests...');
    await ConsumableRequest.create([
      {
        itemName: 'Nitrile Gloves (Box)',
        quantity: 10,
        requestedBy: nurseSarah._id,
        status: 'Pending'
      },
      {
        itemName: 'Sterile Syringes 5ml',
        quantity: 20,
        requestedBy: nurseDavid._id,
        status: 'Approved'
      }
    ]);

    console.log('Creating alerts...');
    await Alert.create([
      {
        title: 'Insulin Stock Critical: 15 units remaining (Threshold: 25)',
        type: 'Inventory Alert',
        severity: 'Critical',
        resolved: false
      },
      {
        title: 'Surgical Masks (Box) Stock Low: 8 boxes remaining (Threshold: 20)',
        type: 'Inventory Alert',
        severity: 'High',
        resolved: false
      },
      {
        title: 'OPD Queue Congested: Average Waiting Time exceeds 45 mins for Dr. Smith',
        type: 'Queue Alert',
        severity: 'High',
        resolved: false
      },
      {
        title: 'ICU Ward Reaching Critical Occupancy: 80% full (4 out of 5 beds allocated)',
        type: 'Bed Alert',
        severity: 'Medium',
        resolved: false
      }
    ]);

    console.log('Creating notices...');
    await Notice.create([
      {
        title: 'City Integration Drills',
        description: 'Mock emergency protocols for inter-hospital bed sharing will run this Tuesday from 2:00 PM to 4:00 PM.',
        postedBy: management._id
      },
      {
        title: 'New Emergency Ward Standard Operating Procedures',
        description: 'Effective immediately, all trauma intakes must be processed through the reception-bed auto-allocation engine prior to bed placement.',
        postedBy: management._id
      }
    ]);

    console.log('Creating city-wide hospital network listings...');
    await Hospital.create([
      {
        hospitalName: 'City Hospital',
        location: 'Sector 15, Gurgaon (2.4 km)',
        totalBeds: 150,
        availableBeds: 42,
        availableICUBeds: 4,
        emergencyCapacity: 'Normal'
      },
      {
        hospitalName: 'Metro Hospital',
        location: 'DLF Phase 3, Gurgaon (4.8 km)',
        totalBeds: 200,
        availableBeds: 15,
        availableICUBeds: 1,
        emergencyCapacity: 'High'
      },
      {
        hospitalName: 'Regional Medical Center',
        location: 'MG Road, Gurgaon (6.1 km)',
        totalBeds: 300,
        availableBeds: 88,
        availableICUBeds: 7,
        emergencyCapacity: 'Normal'
      },
      {
        hospitalName: 'Apex Trauma Clinic',
        location: 'Sohna Road, Gurgaon (7.2 km)',
        totalBeds: 50,
        availableBeds: 2,
        availableICUBeds: 0,
        emergencyCapacity: 'Full'
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
