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
  }
};
