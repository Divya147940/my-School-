// A simple shared state management for the demo to allow portals to "talk" to each other.
// In a real app, this would be handled by a backend database.

const STORAGE_KEY = 'NSGI_MOCK_DATA';

const defaultData = {
  leaderboard: [
    { id: 1, name: 'Aman Gupta', points: 1250, badges: ['🏆 Academic Star', '📝 100% Attendance'] },
    { id: 2, name: 'Priya Singh', points: 1180, badges: ['🎨 Creative Genius', '🤝 Team Player'] },
    { id: 3, name: 'Rahul Verma', points: 950, badges: ['🏀 Sports Hero'] },
  ],
  transport: {
    lat: 28.6139,
    lng: 77.2090,
    status: 'Moving',
    nextStop: 'Civil Lines',
    eta: '12 mins',
    stops: [
      { id: 1, name: 'School Gate', lat: 28.6139, lng: 77.2090, completed: true },
      { id: 2, name: 'Civil Lines', lat: 28.6200, lng: 77.2150, completed: false },
      { id: 3, name: 'Model Town', lat: 28.6300, lng: 77.2250, completed: false },
    ]
  },
  assignments: [
    { id: 1, title: 'Trigonometry Homework', subject: 'Mathematics', dueDate: '2026-03-20', status: 'Pending', instructions: 'Complete Exercise 5.1 and 5.2' },
    { id: 2, title: 'History Project', subject: 'Social Science', dueDate: '2026-03-25', status: 'Submitted', instructions: 'Write a 1000 word essay on the French Revolution.' },
  ],
  attendance: {
    'Aman Gupta': [
      { date: '2026-03-17', status: 'Present' },
      { date: '2026-03-16', status: 'Present' },
      { date: '2026-03-15', status: 'Absent' },
    ]
  },
  leaveRequests: [
    { id: 1, name: 'Divyanshi (Faculty)', type: 'Sick Leave', duration: '2 Days', reason: 'High Fever', status: 'Pending', date: '2026-03-17' },
    { id: 2, name: 'Aman Gupta (Student)', type: 'Casual', duration: '1 Day', reason: 'Sibling wedding', status: 'Pending', date: '2026-03-17' },
  ],
  notifications: [
    { id: 1, title: 'Annual Sports Meet', date: '20th March 2026', content: 'The school is organizing its annual sports meet. Parents are cordially invited.', type: 'Event' },
    { id: 2, title: 'Holi Break', date: '25th - 27th March', content: 'School will remain closed for Holi celebrations.', type: 'Holiday' },
  ],
  diaryEntries: [
    { id: 1, date: '2026-03-16', topic: 'Quadratic Equations', progress: 80, remarks: 'Completed exercise 4.2' },
    { id: 2, date: '2026-03-15', topic: 'Linear Equations', progress: 100, remarks: 'All doubts cleared' },
  ],
  fees: [
    { id: 1, student: 'Aman Gupta', class: '10A', total: 45000, paid: 40000, status: 'Partial' },
    { id: 2, student: 'Priya Singh', class: '9B', total: 40000, paid: 15000, status: 'Pending' },
  ],
  parentFees: [
    { id: 101, month: 'January', year: '2024', amount: 5000, status: 'Paid' },
    { id: 102, month: 'February', year: '2024', amount: 5000, status: 'Unpaid' },
    { id: 103, month: 'March', year: '2024', amount: 5000, status: 'Unpaid' },
  ],
  elearning: [
    { id: 1, title: 'Introduction to Algebra', subject: 'Mathematics', type: 'video', url: 'https://example.com/algebra', author: 'Dr. Smith', date: '2026-03-10' },
    { id: 2, title: 'Cell Structure PDF', subject: 'Biology', type: 'pdf', url: '#', author: 'Prof. Miller', date: '2026-03-12' },
  ],
  transport: {
    busNo: 'NSGI-007',
    driver: 'Rajesh Kumar',
    status: 'on-route',
    currentStop: 'Main Gate',
    nextStop: 'Civil Lines',
    eta: '10 Mins'
  },
  quizzes: [
    {
      id: 1,
      title: 'Monthly Math Quiz',
      subject: 'Mathematics',
      creator: 'Mr. Verma',
      questions: [
        { q: 'What is 5 x 5?', options: ['10', '20', '25', '30'], correct: 2 },
        { q: 'Square root of 81?', options: ['7', '8', '9', '10'], correct: 2 }
      ]
    }
  ],
  reportCards: [
    {
      id: 1,
      studentName: 'Aman Gupta',
      rollNo: '2026001',
      class: '10A',
      examType: 'Final Term',
      subjects: [
        { name: 'Mathematics', marks: 85, total: 100 },
        { name: 'Science', marks: 78, total: 100 },
        { name: 'English', marks: 92, total: 100 },
        { name: 'Social Science', marks: 74, total: 100 },
        { name: 'Hindi', marks: 88, total: 100 }
      ],
      remarks: 'Excellent performance in Mathematics and English.',
      date: '2026-03-15'
    }
  ],
  qrSettings: {
    schoolLocation: { lat: 26.2167, lng: 81.2333 }, // Example: Raebareli
    rangeMeter: 10,
    morning: { start: '07:00', end: '09:00' },
    evening: { start: '15:00', end: '17:00' }
  },
  attendanceHub: [
    { id: 1, studentName: 'Aman Gupta', class: '10A', status: 'Pending', time: '-' },
    { id: 2, studentName: 'Priya Singh', class: '9B', status: 'Present', time: '08:15 AM' },
    { id: 3, studentName: 'Rahul Verma', class: '10A', status: 'Absent', time: '-' },
    { id: 4, studentName: 'Sneha Kapoor', class: '10A', status: 'Pending', time: '-' },
  ],
  facultyRegistry: [
    { id: 'TEA2026-01', name: 'Dr. Sharma', subject: 'Mathematics', role: 'faculty' },
    { id: 'TEA2026-02', name: 'Professor Divyanshi', subject: 'Science', role: 'faculty' },
  ],
  studentRegistry: [
    { id: 'STU2026-001', name: 'Aman Gupta', class: '10A', rollNo: 1, role: 'student', parentName: 'Deepak Gupta' },
  ],
  qrAttendanceLogs: [],
  faculty: [
    {
      id: 1,
      name: "Divyanshi Verma",
      designation: "Principal",
      qualification: "M.Sc, B.Ed (Physics)",
      experience: "12 Years",
      description: "Dedicated to providing quality education and fostering an environment of excellence.",
      image: null, // Will use avatar if null
      avatarBg: "linear-gradient(135deg, #1a1a6e, #3a3aae)"
    }
  ],
  gallery: [
    { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d', title: 'Annual Day 2025' },
    { id: 2, type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'Science Fair Highlights' },
  ],
  jobs: [
    { id: 1, position: 'Mathematics Teacher', department: 'Senior School', status: 'Active', date: '2026-03-15' },
    { id: 2, position: 'Physical Education Coach', department: 'Sports', status: 'Filled', date: '2026-02-10' },
  ],
  newsItems: [
    { id: 1, date: 'Mar 2026', title: 'Teachers Written Exam Result' },
    { id: 2, date: '24 Feb 2026', title: 'NSPS Lalganj First Entrance Test Result' },
  ],
  reviews: [
    { id: 1, name: "Rajesh Kumar", relation: "Father of Aryan (Class 8)", text: "The academic standards and personality development focus at Shri Jageshwar Memorial are truly commendable. My son has shown great improvement in his confidence and communication skills.", rating: 5 },
    { id: 2, name: "Suman Devi", relation: "Mother of Priya (Class 5)", text: "I am very happy with the individual attention teachers provide to every student. The school environment is safe, nurturing, and perfectly suited for primary education.", rating: 5 },
    { id: 3, name: "Amit Verma", relation: "Father of Sneha (Class 10)", text: "The way the school handled board exam preparations was excellent. The extra classes and regular mock tests helped my daughter score brilliantly in her 10th boards.", rating: 4 },
    { id: 4, name: "Anita Singh", relation: "Mother of Rahul (Class 12)", text: "A great institution for holistic development. Not just academics, but the sports and cultural activities are also given equal importance here.", rating: 5 },
    { id: 5, name: "Vikram Pratap", relation: "Father of Kavya (Class 7)", text: "Best school in the region! The management is very approachable and they actually listen to parents' suggestions for the betterment of the school.", rating: 5 }
  ]
};

const getDB = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : defaultData;
};

const saveDB = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const mockApi = {
  // Assignments
  getAssignments: () => getDB().assignments,
  addAssignment: (asm) => {
    const db = getDB();
    db.assignments.unshift({ id: Date.now(), ...asm });
    saveDB(db);
  },

  // Attendance
  getAttendance: (studentName) => getDB().attendance[studentName] || [],
  markAttendance: (studentName, date, status) => {
    const db = getDB();
    if (!db.attendance[studentName]) db.attendance[studentName] = [];
    const existing = db.attendance[studentName].find(a => a.date === date);
    if (existing) {
      existing.status = status;
    } else {
      db.attendance[studentName].unshift({ date, status });
    }

    // AUTO-NOTIFICATION logic for parents
    if (status === 'Absent') {
      db.notifications.unshift({
        id: Date.now(),
        title: `Attendance Alert: ${studentName}`,
        date: new Date().toLocaleDateString(),
        content: `${studentName} was marked ABSENT today (${date}). Please check the portal for details.`,
        type: 'Notice'
      });
    }

    saveDB(db);
  },

  // Leaves
  getLeaves: () => getDB().leaveRequests,
  addLeaveRequest: (req) => {
    const db = getDB();
    db.leaveRequests.unshift({ id: Date.now(), status: 'Pending', ...req });
    saveDB(db);
  },
  updateLeaveStatus: (id, status) => {
    const db = getDB();
    const req = db.leaveRequests.find(r => r.id === id);
    if (req) {
      req.status = status;
      // Notify about leave approval
      db.notifications.unshift({
        id: Date.now(),
        title: `Leave Request ${status}`,
        date: new Date().toLocaleDateString(),
        content: `Your leave request for ${req.duration} has been ${status.toLowerCase()} by the Admin.`,
        type: status === 'Approved' ? 'Event' : 'Notice'
      });
    }
    saveDB(db);
  },

  // Notifications
  getNotifications: () => getDB().notifications,
  addNotification: (notif) => {
    const db = getDB();
    db.notifications.unshift({ id: Date.now(), date: new Date().toLocaleDateString(), ...notif });
    saveDB(db);
  },

  // Digital Diary
  getDiary: () => getDB().diaryEntries,
  addDiaryEntry: (entry) => {
    const db = getDB();
    db.diaryEntries.unshift({ id: Date.now(), date: new Date().toISOString().split('T')[0], ...entry });
    saveDB(db);
  },

  // Fees
  getFees: () => {
    const db = getDB();
    // Auto-trigger fee reminders for pending accounts
    db.fees.forEach(fee => {
      if (fee.status === 'Pending' || fee.status === 'Partial') {
        const reminderExists = db.notifications.some(n => n.title.includes(`Fee Reminder: ${fee.student}`));
        if (!reminderExists) {
          db.notifications.unshift({
            id: `fee-${fee.id}`,
            title: `⚠️ Fee Reminder: ${fee.student}`,
            date: new Date().toLocaleDateString(),
            content: `Dear Parent, a pending fee of ₹${fee.total - fee.paid} is recorded for ${fee.student}. Please settle it at your earliest convenience.`,
            type: 'Notice'
          });
        }
      }
    });
    saveDB(db);
    return db.fees;
  },
  updateFeePayment: (studentName, amount) => {
    const db = getDB();
    const record = db.fees.find(f => f.student === studentName);
    if (record) {
      record.paid += amount;
      record.status = record.paid >= record.total ? 'Paid' : 'Partial';
    }
    saveDB(db);
  },

  // Generic Initial Data
  getInitialData: () => getDB(),

  // E-Learning
  addELearning: (resource) => {
    const db = getDB();
    const newRes = { ...resource, id: Date.now(), date: new Date().toISOString().split('T')[0] };
    db.elearning.unshift(newRes);
    saveDB(db);
    return newRes;
  },

  // Quizzes
  addQuiz: (quiz) => {
    const db = getDB();
    const newQuiz = { ...quiz, id: Date.now() };
    db.quizzes.unshift(newQuiz);
    saveDB(db);
    return newQuiz;
  },

  // Gallery
  getGallery: () => getDB().gallery,
  addGallery: (item) => {
    const db = getDB();
    db.gallery.unshift({ id: Date.now(), ...item });
    saveDB(db);
  },
  removeGallery: (id) => {
    const db = getDB();
    db.gallery = db.gallery.filter(item => item.id !== id);
    saveDB(db);
  },

  // Hiring
  getJobs: () => getDB().jobs,
  addJob: (job) => {
    const db = getDB();
    db.jobs.unshift({ id: Date.now(), date: new Date().toISOString().split('T')[0], status: 'Active', ...job });
    saveDB(db);
  },
  updateJobStatus: (id, status) => {
    const db = getDB();
    const job = db.jobs.find(j => j.id === id);
    if (job) job.status = status;
    saveDB(db);
  },

  // News
  getNews: () => getDB().newsItems || [],
  addNews: (news) => {
    const db = getDB();
    db.newsItems.unshift({ id: Date.now(), ...news });
    saveDB(db);
  },

  // Report Cards
  getReportCards: (studentName) => {
    const db = getDB();
    if (studentName) {
      return db.reportCards.filter(rc => rc.studentName === studentName);
    }
    return db.reportCards;
  },
  addReportCard: (card) => {
    const db = getDB();
    db.reportCards.unshift({ id: Date.now(), date: new Date().toISOString().split('T')[0], ...card });
    saveDB(db);
  },

  // QR Attendance
  getQRSettings: () => {
    return getDB().qrSettings;
  },
  updateQRSettings: (settings) => {
    const db = getDB();
    db.qrSettings = { ...db.qrSettings, ...settings };
    saveDB(db);
  },
  getQRAttendance: (name) => {
    const db = getDB();
    if (name) return db.qrAttendanceLogs.filter(log => log.name === name);
    return db.qrAttendanceLogs;
  },
  logQRAttendance: (log) => {
    const db = getDB();
    const today = new Date().toISOString().split('T')[0];
    
    // Find if user already logged today
    let userLog = db.qrAttendanceLogs.find(l => l.name === log.name && l.date === today);
    
    if (!userLog) {
      userLog = { id: Date.now(), name: log.name, role: log.role, date: today, morning: null, evening: null, complete: false };
      db.qrAttendanceLogs.unshift(userLog);
    }
    
    if (log.type === 'morning') userLog.morning = log.time;
    if (log.type === 'evening') userLog.evening = log.time;
    
    if (userLog.morning && userLog.evening) userLog.complete = true;
    
    saveDB(db);
    return userLog;
  },

  // Faculty Management
  getFaculty: () => {
    return getDB().faculty || [];
  },
  addFaculty: (faculty) => {
    const db = getDB();
    const newFaculty = { id: Date.now(), ...faculty };
    db.faculty.push(newFaculty);
    saveDB(db);
    return newFaculty;
  },
  updateFaculty: (id, updatedData) => {
    const db = getDB();
    db.faculty = db.faculty.map(f => f.id === id ? { ...f, ...updatedData } : f);
    saveDB(db);
  },
  deleteFaculty: (id) => {
    const db = getDB();
    db.faculty = db.faculty.filter(f => f.id !== id);
    saveDB(db);
  },

  // Reviews (WhatsApp Integration Simulation)
  getReviews: () => getDB().reviews || [],
  addReview: (review) => {
    const db = getDB();
    db.reviews.unshift({ id: Date.now(), ...review });
    saveDB(db);
  },
  deleteReview: (id) => {
    const db = getDB();
    db.reviews = db.reviews.filter(r => r.id !== id);
    saveDB(db);
  },

  // Leaderboard (Hall of Fame)
  getLeaderboard: () => getDB().leaderboard || [],
  addMeritPoints: (studentName, points) => {
    const db = getDB();
    const student = db.leaderboard.find(s => s.name === studentName);
    if (student) {
      student.points += points;
    } else {
      db.leaderboard.push({ id: Date.now(), name: studentName, points, badges: [] });
    }
    saveDB(db);
  },

  // Transport
  getTransportData: () => getDB().transport || {},

  // AI Assistant (School Bot)
  getBotResponse: (query) => {
    const q = query.toLowerCase();
    if (q.includes('holiday') || q.includes('vacation')) return "The next holiday is Holi on March 25th, followed by Good Friday on March 29th. Check the 'School Calendar' for the full list!";
    if (q.includes('fee') || q.includes('pay')) return "You can pay fees directly via the 'Fees & Receipts' section in your portal. We support UPI, Cards, and NetBanking.";
    if (q.includes('attendance')) return "Your total attendance for this month is 95%. You can scan your unique QR code daily at the gate to mark it!";
    if (q.includes('result') || q.includes('exam')) return "Final exam results will be announced on April 15th. You can view your digital report card in the 'Results' section.";
    if (q.includes('merit') || q.includes('points')) return "You can earn merit points by participating in school activities and maintaining 100% attendance. Check the 'Hall of Fame' for leadboards!";
    if (q.includes('hello') || q.includes('hi')) return "Hello! How can I assist you today? I can help with attendance, fees, results, and school news.";
    return "That's a great question! I'm currently in 'School-Sim' mode, but I've noted this for the administrator. Is there anything else I can help with?";
  },

  getParentFees: () => {
    const data = loadData();
    return data.parentFees;
  },

  payFee: (feeId) => {
    const data = loadData();
    data.parentFees = data.parentFees.map(f => 
      f.id === feeId ? { ...f, status: 'Paid' } : f
    );
    saveData(data);
    return { status: 'success' };
  },

  getAttendanceHub: () => {
    const data = loadData();
    return data.attendanceHub;
  },

  markAttendance: (studentName, status) => {
    const data = loadData();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    data.attendanceHub = data.attendanceHub.map(record => 
      record.studentName === studentName ? { ...record, status, time: status === 'Present' ? now : '-' } : record
    );
    saveData(data);
    return { status: 'success', time: now };
  },

  onboardFaculty: (name, subject) => {
    const data = loadData();
    const newId = `TEA2026-${data.facultyRegistry.length + 1}`;
    const newFaculty = { id: newId, name, subject, role: 'faculty' };
    data.facultyRegistry.push(newFaculty);
    saveData(data);
    return newFaculty;
  },

  onboardStudent: (name, className, parentName) => {
    const data = loadData();
    const classStudents = data.studentRegistry.filter(s => s.class === className);
    const newId = `STU2026-${data.studentRegistry.length + 100}`;
    const newRoll = classStudents.length + 1;
    const newStudent = { id: newId, name, class: className, rollNo: newRoll, role: 'student', parentName };
    data.studentRegistry.push(newStudent);
    
    // Also add to attendance hub
    data.attendanceHub.push({ id: data.attendanceHub.length + 1, studentName: name, class: className, status: 'Pending', time: '-' });
    
    saveData(data);
    return newStudent;
  }
};
