import { createContext, useState, useContext, useEffect } from 'react';

const GlobalContext = createContext();

// Default offline mock data
const mockUsers = [
  { id: 'u1', name: 'Dr. Arthur Pendelton', email: 'admin@careconnect.com', role: 'Management', department: 'Administration' },
  { id: 'u2', name: 'Dr. Evelyn Smith', email: 'doctor@careconnect.com', role: 'Doctor', department: 'Cardiology', specialization: 'Cardiologist' },
  { id: 'u3', name: 'Dr. Marcus Johnson', email: 'doctor2@careconnect.com', role: 'Doctor', department: 'General Medicine', specialization: 'Physician' },
  { id: 'u4', name: 'Sarah Connor, RN', email: 'nurse@careconnect.com', role: 'Nurse', department: 'Critical Care', assignedWard: 'ICU' },
  { id: 'u5', name: 'David Miller, RN', email: 'nurse2@careconnect.com', role: 'Nurse', department: 'Emergency Care', assignedWard: 'Emergency' },
  { id: 'u6', name: 'Jane Doe', email: 'reception@careconnect.com', role: 'Reception Staff', department: 'OPD Desk' }
];

const mockPatients = [
  {
    _id: 'p1',
    patientId: 'PT-1001',
    name: 'James Watson',
    age: 45,
    gender: 'Male',
    phone: '9876543210',
    address: '12 Baker St, New Delhi',
    medicalHistory: ['Hypertension', 'Type-2 Diabetes'],
    currentVitals: { bloodPressure: '135/85', heartRate: 82, temperature: 98.9, oxygenLevel: 97, updatedAt: new Date().toISOString() }
  },
  {
    _id: 'p2',
    patientId: 'PT-1002',
    name: 'Clara Oswald',
    age: 29,
    gender: 'Female',
    phone: '9988776655',
    address: '56 Rosewood Rd, Kolkata',
    medicalHistory: ['Asthma'],
    currentVitals: { bloodPressure: '118/76', heartRate: 70, temperature: 98.4, oxygenLevel: 99, updatedAt: new Date().toISOString() }
  },
  {
    _id: 'p3',
    patientId: 'PT-1003',
    name: 'Robert Stark',
    age: 62,
    gender: 'Male',
    phone: '9898989898',
    address: '7 Winterfell Ave, Shimla',
    medicalHistory: ['Chronic Kidney Disease', 'Cardiovascular disease'],
    currentVitals: { bloodPressure: '142/90', heartRate: 88, temperature: 101.2, oxygenLevel: 93, updatedAt: new Date().toISOString() }
  },
  {
    _id: 'p4',
    patientId: 'PT-1004',
    name: 'Martha Jones',
    age: 34,
    gender: 'Female',
    phone: '9000100020',
    address: '221B Regent Dr, Mumbai',
    medicalHistory: ['None'],
    currentVitals: { bloodPressure: '120/80', heartRate: 75, temperature: 98.6, oxygenLevel: 98, updatedAt: new Date().toISOString() }
  }
];

const mockBeds = [
  // ICU Beds
  { _id: 'b1', bedNumber: 'ICU-01', wardType: 'ICU', status: 'Occupied', patient: mockPatients[0] },
  { _id: 'b2', bedNumber: 'ICU-02', wardType: 'ICU', status: 'Available', patient: null },
  { _id: 'b3', bedNumber: 'ICU-03', wardType: 'ICU', status: 'Available', patient: null },
  { _id: 'b4', bedNumber: 'ICU-04', wardType: 'ICU', status: 'Available', patient: null },
  { _id: 'b5', bedNumber: 'ICU-05', wardType: 'ICU', status: 'Available', patient: null },
  // ER Beds
  { _id: 'b6', bedNumber: 'ER-01', wardType: 'Emergency', status: 'Occupied', patient: mockPatients[1] },
  { _id: 'b7', bedNumber: 'ER-02', wardType: 'Emergency', status: 'Available', patient: null },
  { _id: 'b8', bedNumber: 'ER-03', wardType: 'Emergency', status: 'Available', patient: null },
  { _id: 'b9', bedNumber: 'ER-04', wardType: 'Emergency', status: 'Available', patient: null },
  { _id: 'b10', bedNumber: 'ER-05', wardType: 'Emergency', status: 'Available', patient: null },
  // General Ward Beds
  { _id: 'b11', bedNumber: 'GEN-01', wardType: 'General', status: 'Available', patient: null },
  { _id: 'b12', bedNumber: 'GEN-02', wardType: 'General', status: 'Available', patient: null },
  { _id: 'b13', bedNumber: 'GEN-03', wardType: 'General', status: 'Available', patient: null },
  { _id: 'b14', bedNumber: 'GEN-04', wardType: 'General', status: 'Available', patient: null },
  { _id: 'b15', bedNumber: 'GEN-05', wardType: 'General', status: 'Available', patient: null },
  { _id: 'b16', bedNumber: 'GEN-06', wardType: 'General', status: 'Available', patient: null },
  { _id: 'b17', bedNumber: 'GEN-07', wardType: 'General', status: 'Available', patient: null },
  { _id: 'b18', bedNumber: 'GEN-08', wardType: 'General', status: 'Available', patient: null },
  { _id: 'b19', bedNumber: 'GEN-09', wardType: 'General', status: 'Available', patient: null },
  { _id: 'b20', bedNumber: 'GEN-10', wardType: 'General', status: 'Available', patient: null }
];

const mockQueue = [
  {
    _id: 'q1',
    tokenNumber: 'TKN-101',
    patient: mockPatients[2], // Robert Stark
    doctor: mockUsers[1], // Dr. Smith
    priority: true,
    queueStatus: 'Waiting',
    estimatedWaitTime: 12,
    averageConsultationTime: 12,
    predictedStartTime: new Date(Date.now() + 12 * 60 * 1000).toISOString()
  },
  {
    _id: 'q2',
    tokenNumber: 'TKN-102',
    patient: mockPatients[3], // Martha Jones
    doctor: mockUsers[1],
    priority: false,
    queueStatus: 'In Progress',
    estimatedWaitTime: 0,
    averageConsultationTime: 10,
    predictedStartTime: new Date().toISOString()
  }
];

const mockAdmissions = [
  {
    _id: 'a1',
    patient: mockPatients[0],
    doctor: mockUsers[1],
    bed: mockBeds[0], // ICU-01
    admissionReason: 'Acute myocardial infarction',
    admissionDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    status: 'Admitted'
  },
  {
    _id: 'a2',
    patient: mockPatients[1],
    doctor: mockUsers[2],
    bed: mockBeds[5], // ER-01
    admissionReason: 'Severe respiratory distress secondary to asthma',
    admissionDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'Admitted'
  }
];

const mockInventory = [
  { _id: 'i1', itemName: 'Paracetamol 650mg', category: 'Medicines', quantity: 500, minimumStock: 100, expiryDate: '2028-12-31' },
  { _id: 'i2', itemName: 'Insulin Glargine', category: 'Medicines', quantity: 15, minimumStock: 25, expiryDate: '2027-04-15' },
  { _id: 'i3', itemName: 'Amoxicillin 500mg', category: 'Medicines', quantity: 200, minimumStock: 50, expiryDate: '2026-07-01' },
  { _id: 'i4', itemName: 'Atorvastatin 20mg', category: 'Medicines', quantity: 300, minimumStock: 50, expiryDate: '2027-10-30' },
  { _id: 'i5', itemName: 'Nitrile Gloves (Box)', category: 'Consumables', quantity: 120, minimumStock: 30, expiryDate: '2030-01-01' },
  { _id: 'i6', itemName: 'Surgical Masks (Box)', category: 'Consumables', quantity: 8, minimumStock: 20, expiryDate: '2029-05-20' },
  { _id: 'i7', itemName: 'Sterile Syringes 5ml', category: 'Consumables', quantity: 450, minimumStock: 100, expiryDate: '2029-10-15' }
];

const mockConsumableRequests = [
  {
    _id: 'cr1',
    itemName: 'Nitrile Gloves (Box)',
    quantity: 10,
    requestedBy: mockUsers[3], // Nurse Sarah
    status: 'Pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'cr2',
    itemName: 'Sterile Syringes 5ml',
    quantity: 20,
    requestedBy: mockUsers[4], // Nurse David
    status: 'Approved',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  }
];

const mockAlerts = [
  { _id: 'al1', title: 'Insulin Stock Critical: 15 units remaining (Threshold: 25)', type: 'Inventory Alert', severity: 'Critical', resolved: false, createdAt: new Date().toISOString() },
  { _id: 'al2', title: 'Surgical Masks (Box) Stock Low: 8 boxes remaining (Threshold: 20)', type: 'Inventory Alert', severity: 'High', resolved: false, createdAt: new Date().toISOString() },
  { _id: 'al3', title: 'OPD Queue Congested: Average Waiting Time exceeds 45 mins for Dr. Smith', type: 'Queue Alert', severity: 'High', resolved: false, createdAt: new Date().toISOString() },
  { _id: 'al4', title: 'ICU Ward Reaching Critical Occupancy: 80% full (4 out of 5 beds allocated)', type: 'Bed Alert', severity: 'Medium', resolved: false, createdAt: new Date().toISOString() }
];

const mockNotices = [
  {
    _id: 'n1',
    title: 'City Integration Drills',
    description: 'Mock emergency protocols for inter-hospital bed sharing will run this Tuesday from 2:00 PM to 4:00 PM.',
    postedBy: mockUsers[0],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'n2',
    title: 'New Emergency Ward Standard Operating Procedures',
    description: 'Effective immediately, all trauma intakes must be processed through the reception-bed auto-allocation engine prior to bed placement.',
    postedBy: mockUsers[0],
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];

const mockHospitals = [
  { _id: 'h1', hospitalName: 'City Hospital', location: 'Sector 15, Gurgaon (2.4 km)', totalBeds: 150, availableBeds: 42, availableICUBeds: 4, emergencyCapacity: 'Normal' },
  { _id: 'h2', hospitalName: 'Metro Hospital', location: 'DLF Phase 3, Gurgaon (4.8 km)', totalBeds: 200, availableBeds: 15, availableICUBeds: 1, emergencyCapacity: 'High' },
  { _id: 'h3', hospitalName: 'Regional Medical Center', location: 'MG Road, Gurgaon (6.1 km)', totalBeds: 300, availableBeds: 88, availableICUBeds: 7, emergencyCapacity: 'Normal' },
  { _id: 'h4', hospitalName: 'Apex Trauma Clinic', location: 'Sohna Road, Gurgaon (7.2 km)', totalBeds: 50, availableBeds: 2, availableICUBeds: 0, emergencyCapacity: 'Full' }
];

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [queue, setQueue] = useState([]);
  const [beds, setBeds] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [notices, setNotices] = useState([]);
  const [network, setNetwork] = useState([]);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper: Get Request Headers
  const getHeaders = () => {
    const activeToken = token || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${activeToken}`
    };
  };

  // Sync state helpers for offline fallback database simulation
  const loadLocalStorageMock = () => {
    const getLocal = (key, initial) => {
      const val = localStorage.getItem(`cc_mock_${key}`);
      return val ? JSON.parse(val) : initial;
    };
    setPatients(getLocal('patients', mockPatients));
    setDoctors(getLocal('doctors', mockUsers.filter(u => u.role === 'Doctor')));
    setQueue(getLocal('queue', mockQueue));
    setBeds(getLocal('beds', mockBeds));
    setAdmissions(getLocal('admissions', mockAdmissions));
    setInventory(getLocal('inventory', mockInventory));
    setRequests(getLocal('requests', mockConsumableRequests));
    setAlerts(getLocal('alerts', mockAlerts));
    setNotices(getLocal('notices', mockNotices));
    setNetwork(getLocal('network', mockHospitals));
  };

  const saveLocalMockState = (key, data) => {
    localStorage.setItem(`cc_mock_${key}`, JSON.stringify(data));
  };

  // Fetch all database categories
  const loadAllData = async () => {
    setLoading(true);
    try {
      const resPatients = await fetch('/api/patients', { headers: getHeaders() });
      if (!resPatients.ok) throw new Error();
      const dataPatients = await resPatients.json();
      setPatients(dataPatients);

      const resDoctors = await fetch('/api/doctors', { headers: getHeaders() });
      const dataDoctors = await resDoctors.json();
      setDoctors(dataDoctors);

      const resQueue = await fetch('/api/queue', { headers: getHeaders() });
      const dataQueue = await resQueue.json();
      setQueue(dataQueue);

      const resBeds = await fetch('/api/beds', { headers: getHeaders() });
      const dataBeds = await resBeds.json();
      setBeds(dataBeds);

      const resAdmissions = await fetch('/api/admissions', { headers: getHeaders() });
      const dataAdmissions = await resAdmissions.json();
      setAdmissions(dataAdmissions);

      const resInventory = await fetch('/api/inventory', { headers: getHeaders() });
      const dataInventory = await resInventory.json();
      setInventory(dataInventory);

      const resRequests = await fetch('/api/requests', { headers: getHeaders() });
      const dataRequests = await resRequests.json();
      setRequests(dataRequests);

      const resAlerts = await fetch('/api/alerts', { headers: getHeaders() });
      const dataAlerts = await resAlerts.json();
      setAlerts(dataAlerts);

      const resNotices = await fetch('/api/notices', { headers: getHeaders() });
      const dataNotices = await resNotices.json();
      setNotices(dataNotices);

      const resNetwork = await fetch('/api/network', { headers: getHeaders() });
      const dataNetwork = await resNetwork.json();
      setNetwork(dataNetwork);

      setIsOfflineMode(false);
    } catch (e) {
      console.warn("Backend API server offline. Falling back to frontend simulated LocalStorage DB.");
      setIsOfflineMode(true);
      loadLocalStorageMock();
    } finally {
      setLoading(false);
    }
  };

  // Load user session on boot
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    loadAllData();
  }, [token]);

  // Auth Operations
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        const errorData = await res.json();
        return { success: false, message: errorData.message || 'Login failed' };
      }
    } catch (e) {
      // Offline fallback login check
      const getLocal = (key, initial) => {
        const val = localStorage.getItem(`cc_mock_${key}`);
        return val ? JSON.parse(val) : initial;
      };
      const currentMockUsers = getLocal('users', mockUsers);
      const matchedMockUser = currentMockUsers.find(
        u => u.email === email && password.length >= 6
      );
      if (matchedMockUser) {
        const fakeToken = `offline_token_${matchedMockUser.role}_${matchedMockUser.email}`;
        localStorage.setItem('token', fakeToken);
        localStorage.setItem('user', JSON.stringify(matchedMockUser));
        setToken(fakeToken);
        setUser(matchedMockUser);
        setIsOfflineMode(true);
        loadLocalStorageMock();
        return { success: true };
      }
      return { success: false, message: 'Server unreachable and credentials not matched offline' };
    }
  };

  const registerUser = async (userData) => {
    if (!isOfflineMode) {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(userData)
        });
        if (res.ok) {
          const newUser = await res.json();
          if (newUser.role === 'Doctor') {
            setDoctors(prev => [...prev, newUser]);
          }
          return { success: true, user: newUser };
        } else {
          const errorData = await res.json();
          return { success: false, message: errorData.message || 'Registration failed' };
        }
      } catch (err) {
        console.error(err);
      }
    }
    // Offline simulation
    const newUserObj = {
      _id: 'u_' + Date.now(),
      id: 'u_' + Date.now(),
      ...userData,
    };
    const getLocal = (key, initial) => {
      const val = localStorage.getItem(`cc_mock_${key}`);
      return val ? JSON.parse(val) : initial;
    };
    const currentMockUsers = getLocal('users', mockUsers);
    const updatedMockUsers = [...currentMockUsers, newUserObj];
    saveLocalMockState('users', updatedMockUsers);

    if (userData.role === 'Doctor') {
      const currentMockDoctors = getLocal('doctors', mockUsers.filter(u => u.role === 'Doctor'));
      const nextMockDoctors = [...currentMockDoctors, newUserObj];
      setDoctors(nextMockDoctors);
      saveLocalMockState('doctors', nextMockDoctors);
    }
    return { success: true, user: newUserObj };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // 1. Patient actions
  const addPatient = async (patientData) => {
    if (!isOfflineMode) {
      try {
        const res = await fetch('/api/patients', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(patientData)
        });
        if (res.ok) {
          const newPat = await res.json();
          setPatients(prev => [...prev, newPat]);
          return newPat;
        }
      } catch (err) {
        console.error(err);
      }
    }
    // Offline implementation
    const newPat = {
      _id: 'p_' + Date.now(),
      patientId: 'PT-' + Math.floor(1000 + Math.random() * 9000),
      ...patientData,
      medicalHistory: patientData.medicalHistory ? patientData.medicalHistory.split(',').map(m => m.trim()) : [],
      currentVitals: { bloodPressure: '120/80', heartRate: 75, temperature: 98.6, oxygenLevel: 98, updatedAt: new Date().toISOString() }
    };
    const updated = [...patients, newPat];
    setPatients(updated);
    saveLocalMockState('patients', updated);
    return newPat;
  };

  const updateVitals = async (id, vitals) => {
    if (!isOfflineMode) {
      try {
        const res = await fetch(`/api/patients/${id}/vitals`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(vitals)
        });
        if (res.ok) {
          const updatedPat = await res.json();
          setPatients(prev => prev.map(p => p._id === id ? updatedPat : p));
          // Refresh alerts just in case
          loadAllData();
          return updatedPat;
        }
      } catch (err) {
        console.error(err);
      }
    }
    // Offline simulation
    const updated = patients.map(p => {
      if (p._id === id) {
        const updatedV = { ...p, currentVitals: { ...vitals, updatedAt: new Date().toISOString() } };
        // Trigger alert if oxygen levels are critical
        if (Number(vitals.oxygenLevel) < 92) {
          const newAlert = {
            _id: 'al_' + Date.now(),
            title: `Critical Vitals: Patient ${p.name} Oxygen saturation is ${vitals.oxygenLevel}%`,
            type: 'Admission Alert',
            severity: 'Critical',
            resolved: false,
            createdAt: new Date().toISOString()
          };
          setAlerts(prevAlerts => {
            const nextAlerts = [newAlert, ...prevAlerts];
            saveLocalMockState('alerts', nextAlerts);
            return nextAlerts;
          });
        }
        return updatedV;
      }
      return p;
    });
    setPatients(updated);
    saveLocalMockState('patients', updated);
  };

  // 2. Queue Optimization
  const addToken = async (patientId, doctorId, priority) => {
    if (!isOfflineMode) {
      try {
        const res = await fetch('/api/queue', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ patientId, doctorId, priority })
        });
        if (res.ok) {
          const newTkn = await res.json();
          setQueue(prev => [...prev, newTkn]);
          return newTkn;
        }
      } catch (err) {
        console.error(err);
      }
    }
    // Offline simulation
    const patientObj = patients.find(p => p._id === patientId);
    const doctorObj = mockUsers.find(u => u.id === doctorId || u._id === doctorId) || mockUsers[1];
    
    // Estimates
    const doctorQueueCount = queue.filter(q => (q.doctor._id === doctorId || q.doctor.id === doctorId) && q.queueStatus === 'Waiting').length;
    const estWait = doctorQueueCount * 10;

    const newTkn = {
      _id: 'q_' + Date.now(),
      tokenNumber: 'TKN-' + (queue.length + 101),
      patient: patientObj,
      doctor: doctorObj,
      priority: priority || false,
      queueStatus: 'Waiting',
      estimatedWaitTime: estWait,
      averageConsultationTime: 10,
      predictedStartTime: new Date(Date.now() + estWait * 60 * 1000).toISOString()
    };

    if (estWait > 45) {
      const newAlert = {
        _id: 'al_' + Date.now(),
        title: `Queue Bottleneck: Dr. ${doctorObj.name} waiting time is ${estWait} mins`,
        type: 'Queue Alert',
        severity: 'High',
        resolved: false,
        createdAt: new Date().toISOString()
      };
      setAlerts(prev => {
        const next = [newAlert, ...prev];
        saveLocalMockState('alerts', next);
        return next;
      });
    }

    const updated = [...queue, newTkn];
    setQueue(updated);
    saveLocalMockState('queue', updated);
    return newTkn;
  };

  const updateTokenStatus = async (id, status) => {
    if (!isOfflineMode) {
      try {
        const res = await fetch(`/api/queue/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ queueStatus: status })
        });
        if (res.ok) {
          const updatedTkn = await res.json();
          // Reload queue to get re-calculated estimates
          loadAllData();
          return updatedTkn;
        }
      } catch (err) {
        console.error(err);
      }
    }
    // Offline simulation
    const updated = queue.map(q => q._id === id ? { ...q, queueStatus: status } : q);
    // Recalculate estimates for remaining waiting queue
    const completedToken = queue.find(q => q._id === id);
    if (completedToken && (status === 'Completed' || status === 'Cancelled')) {
      const docId = completedToken.doctor._id || completedToken.doctor.id;
      let waitCounter = 0;
      for (let i = 0; i < updated.length; i++) {
        const qDocId = updated[i].doctor._id || updated[i].doctor.id;
        if (qDocId === docId && updated[i].queueStatus === 'Waiting') {
          updated[i].estimatedWaitTime = waitCounter * 10;
          updated[i].predictedStartTime = new Date(Date.now() + updated[i].estimatedWaitTime * 60 * 1000).toISOString();
          waitCounter++;
        }
      }
    }
    setQueue(updated);
    saveLocalMockState('queue', updated);
  };

  // 3. Beds Management
  const updateBed = async (bedId, status, patientId = null) => {
    if (!isOfflineMode) {
      try {
        const res = await fetch(`/api/beds/${bedId}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ status, patientId })
        });
        if (res.ok) {
          const updatedBed = await res.json();
          // Reload all beds to pull populated patients
          loadAllData();
          return updatedBed;
        }
      } catch (err) {
        console.error(err);
      }
    }
    // Offline simulation
    const patientObj = patientId ? patients.find(p => p._id === patientId) : null;
    const updated = beds.map(b => b._id === bedId ? { ...b, status, patient: patientObj } : b);
    setBeds(updated);
    saveLocalMockState('beds', updated);
  };

  // 4. Patient Admissions (Auto Bed Allocation logic included)
  const addAdmission = async (admissionData) => {
    if (!isOfflineMode) {
      try {
        const res = await fetch('/api/admissions', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(admissionData)
        });
        if (res.ok) {
          const newAdm = await res.json();
          // Reload beds and admissions
          loadAllData();
          return newAdm;
        }
      } catch (err) {
        console.error(err);
      }
    }
    // Offline simulation (Rule-based allocation)
    const { patientId, doctorId, admissionReason, wardType } = admissionData;
    
    // Find available bed in requested ward
    const availableBed = beds.find(b => b.wardType === wardType && b.status === 'Available');
    const patientObj = patients.find(p => p._id === patientId);
    const doctorObj = mockUsers.find(u => u.id === doctorId || u._id === doctorId) || mockUsers[1];

    let allocatedBed = null;
    let status = 'Pending';

    if (availableBed) {
      allocatedBed = availableBed;
      status = 'Admitted';

      // Update bed list
      const nextBeds = beds.map(b => b._id === availableBed._id ? { ...b, status: 'Occupied', patient: patientObj } : b);
      setBeds(nextBeds);
      saveLocalMockState('beds', nextBeds);
    } else {
      // Trigger critical bed full alert
      const newAlert = {
        _id: 'al_' + Date.now(),
        title: `Admissions Alert: No Bed Available in ${wardType} Ward for patient ID ${patientObj ? patientObj.name : patientId}`,
        type: 'Bed Alert',
        severity: 'Critical',
        resolved: false,
        createdAt: new Date().toISOString()
      };
      setAlerts(prev => {
        const next = [newAlert, ...prev];
        saveLocalMockState('alerts', next);
        return next;
      });
    }

    const newAdm = {
      _id: 'adm_' + Date.now(),
      patient: patientObj,
      doctor: doctorObj,
      bed: allocatedBed,
      admissionReason,
      admissionDate: new Date().toISOString(),
      dischargeDate: null,
      status
    };

    const nextAdmissions = [...admissions, newAdm];
    setAdmissions(nextAdmissions);
    saveLocalMockState('admissions', nextAdmissions);
    return newAdm;
  };

  const dischargePatient = async (admissionId) => {
    if (!isOfflineMode) {
      try {
        const res = await fetch(`/api/admissions/${admissionId}/discharge`, {
          method: 'PUT',
          headers: getHeaders()
        });
        if (res.ok) {
          loadAllData();
          return true;
        }
      } catch (err) {
        console.error(err);
      }
    }
    // Offline simulation
    const adm = admissions.find(a => a._id === admissionId);
    if (adm) {
      // Release bed
      if (adm.bed) {
        const nextBeds = beds.map(b => b._id === adm.bed._id ? { ...b, status: 'Available', patient: null } : b);
        setBeds(nextBeds);
        saveLocalMockState('beds', nextBeds);
      }
      
      const nextAdmissions = admissions.map(a => a._id === admissionId ? { ...a, status: 'Discharged', dischargeDate: new Date().toISOString() } : a);
      setAdmissions(nextAdmissions);
      saveLocalMockState('admissions', nextAdmissions);
    }
  };

  // 5. Inventory & Replenishment
  const addInventory = async (itemData) => {
    if (!isOfflineMode) {
      try {
        const res = await fetch('/api/inventory', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(itemData)
        });
        if (res.ok) {
          const newItem = await res.json();
          setInventory(prev => [...prev, newItem]);
          return newItem;
        }
      } catch (err) {
        console.error(err);
      }
    }
    // Offline
    const newItem = {
      _id: 'inv_' + Date.now(),
      ...itemData,
      quantity: Number(itemData.quantity),
      minimumStock: Number(itemData.minimumStock || 20)
    };
    const updated = [...inventory, newItem];
    setInventory(updated);
    saveLocalMockState('inventory', updated);
    return newItem;
  };

  const updateInventoryStock = async (id, data) => {
    if (!isOfflineMode) {
      try {
        const res = await fetch(`/api/inventory/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(data)
        });
        if (res.ok) {
          const updatedItem = await res.json();
          setInventory(prev => prev.map(i => i._id === id ? updatedItem : i));
          // Refresh alerts
          loadAllData();
          return updatedItem;
        }
      } catch (err) {
        console.error(err);
      }
    }
    // Offline
    const updated = inventory.map(item => {
      if (item._id === id) {
        const updatedItem = { ...item, ...data };
        if (updatedItem.quantity !== undefined) updatedItem.quantity = Number(updatedItem.quantity);
        if (updatedItem.minimumStock !== undefined) updatedItem.minimumStock = Number(updatedItem.minimumStock);

        // Low stock triggers Alert
        if (updatedItem.quantity <= updatedItem.minimumStock) {
          const newAlert = {
            _id: 'al_' + Date.now(),
            title: `Inventory Critical: ${updatedItem.itemName} Stock Level at ${updatedItem.quantity} (Par: ${updatedItem.minimumStock})`,
            type: 'Inventory Alert',
            severity: updatedItem.quantity === 0 ? 'Critical' : 'High',
            resolved: false,
            createdAt: new Date().toISOString()
          };
          setAlerts(prev => {
            const next = [newAlert, ...prev];
            saveLocalMockState('alerts', next);
            return next;
          });
        }
        return updatedItem;
      }
      return item;
    });
    setInventory(updated);
    saveLocalMockState('inventory', updated);
  };

  // Consumable Requests
  const submitRequest = async (itemName, quantity) => {
    if (!isOfflineMode) {
      try {
        const res = await fetch('/api/requests', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ itemName, quantity })
        });
        if (res.ok) {
          const newReq = await res.json();
          setRequests(prev => [...prev, newReq]);
          return newReq;
        }
      } catch (err) {
        console.error(err);
      }
    }
    // Offline
    const newReq = {
      _id: 'req_' + Date.now(),
      itemName,
      quantity: Number(quantity),
      requestedBy: user || mockUsers[3],
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    const updated = [...requests, newReq];
    setRequests(updated);
    saveLocalMockState('requests', updated);
    return newReq;
  };

  const approveRequest = async (requestId, status) => {
    if (!isOfflineMode) {
      try {
        const res = await fetch(`/api/requests/${requestId}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ status })
        });
        if (res.ok) {
          // reload all inventory and requests
          loadAllData();
          return true;
        }
      } catch (err) {
        console.error(err);
      }
    }
    // Offline
    const updatedRequests = requests.map(r => r._id === requestId ? { ...r, status } : r);
    setRequests(updatedRequests);
    saveLocalMockState('requests', updatedRequests);

    if (status === 'Approved') {
      const request = requests.find(r => r._id === requestId);
      if (request) {
        const updatedInventory = inventory.map(item => {
          if (item.itemName === request.itemName) {
            const newQty = Math.max(0, item.quantity - request.quantity);
            const updatedItem = { ...item, quantity: newQty };
            if (newQty <= item.minimumStock) {
              // Trigger low stock alert
              const newAlert = {
                _id: 'al_' + Date.now(),
                title: `Low Stock Trigger: ${item.itemName} fell to ${newQty} units post-approval`,
                type: 'Inventory Alert',
                severity: 'High',
                resolved: false,
                createdAt: new Date().toISOString()
              };
              setAlerts(prev => {
                const next = [newAlert, ...prev];
                saveLocalMockState('alerts', next);
                return next;
              });
            }
            return updatedItem;
          }
          return item;
        });
        setInventory(updatedInventory);
        saveLocalMockState('inventory', updatedInventory);
      }
    }
  };

  // 6. Alerts
  const resolveAlert = async (alertId) => {
    if (!isOfflineMode) {
      try {
        const res = await fetch(`/api/alerts/${alertId}/resolve`, {
          method: 'PUT',
          headers: getHeaders()
        });
        if (res.ok) {
          setAlerts(prev => prev.filter(al => al._id !== alertId));
          return true;
        }
      } catch (err) {
        console.error(err);
      }
    }
    // Offline
    const updated = alerts.filter(al => al._id !== alertId);
    setAlerts(updated);
    saveLocalMockState('alerts', updated);
  };

  // 7. Notices
  const addNotice = async (noticeData) => {
    if (!isOfflineMode) {
      try {
        const res = await fetch('/api/notices', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(noticeData)
        });
        if (res.ok) {
          const newNot = await res.json();
          setNotices(prev => [newNot, ...prev]);
          return newNot;
        }
      } catch (err) {
        console.error(err);
      }
    }
    // Offline
    const newNot = {
      _id: 'not_' + Date.now(),
      ...noticeData,
      postedBy: user || mockUsers[0],
      createdAt: new Date().toISOString()
    };
    const updated = [newNot, ...notices];
    setNotices(updated);
    saveLocalMockState('notices', updated);
    return newNot;
  };

  // Dynamic role list (useful for select options)
  const getDoctorsList = () => {
    return doctors && doctors.length > 0 ? doctors : mockUsers.filter(u => u.role === 'Doctor');
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        token,
        patients,
        doctors,
        queue,
        beds,
        admissions,
        inventory,
        requests,
        alerts,
        notices,
        network,
        isOfflineMode,
        loading,
        login,
        logout,
        addPatient,
        updateVitals,
        addToken,
        updateTokenStatus,
        updateBed,
        addAdmission,
        dischargePatient,
        addInventory,
        updateInventoryStock,
        submitRequest,
        approveRequest,
        resolveAlert,
        addNotice,
        getDoctorsList,
        registerUser,
        refreshData: loadAllData
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
