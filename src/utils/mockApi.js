// A simple shared state management for the demo to allow portals to "talk" to each other.
// In a real app, this would be handled by a backend database.

const STORAGE_KEY = 'NSGI_MOCK_DATA';

const defaultData = {
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
  qrAttendanceLogs: [],
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
  getNews: () => getDB().newsItems,
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
  }
};
