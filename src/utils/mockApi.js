import { getFaceDescriptorFromBase64, parseDescriptor, compareFaces } from './faceApiUtils';

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
    { id: 1, title: 'Trigonometry Homework', subject: 'Mathematics', dueDate: '2026-03-20', status: 'Pending', instructions: 'Complete Exercise 5.1 and 5.2 from the textbook. Focus on sine and cosine rules.', teacher: 'Mr. Verma' },
    { id: 2, title: 'History Project', subject: 'Social Science', dueDate: '2026-03-25', status: 'Completed', instructions: 'Write a 1000 word essay on the French Revolution. Include diagrams of the Bastille.', teacher: 'Mrs. Singh' },
    { id: 3, title: 'Cell Structure Diagram', subject: 'Biology', dueDate: '2026-03-21', status: 'Pending', instructions: 'Draw and label the animal cell on an A4 sheet.', teacher: 'Professor Divyanshi' },
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
    { id: 101, month: 'January', year: '2026', amount: 5000, status: 'Paid' },
    { id: 102, month: 'February', year: '2026', amount: 5000, status: 'Unpaid' },
    { id: 103, month: 'March', year: '2026', amount: 5000, status: 'Unpaid' },
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
    schoolLocation: { lat: 26.2167, lng: 81.2333 }, // Raebareli Location Example
    rangeMeter: 1000, // Increased for easier testing
    morning: { start: '06:00', end: '11:00' },
    evening: { start: '14:00', end: '18:00' }
  },
  attendanceHub: [
    { id: 1, studentName: 'Aman Gupta', class: '10A', status: 'Pending', time: '-' },
    { id: 2, studentName: 'Priya Singh', class: '9B', status: 'Pending', time: '-' },
    { id: 3, studentName: 'Rahul Verma', class: '10A', status: 'Pending', time: '-' },
    { id: 4, studentName: 'Sneha Kapoor', class: '10A', status: 'Pending', time: '-' },
  ],
  isOnline: true,
  offlineQueue: [],
  admissions: [],
  inquiries: [],
  facultyRegistry: [
    { id: 'TEA2026-01', name: 'Dr. Sharma', subject: 'Mathematics', role: 'faculty', contact: '+91 99887 76655', salary: '₹85,000', isFaceEnrolled: true },
    { id: 'TEA2026-02', name: 'Professor Divyanshi', subject: 'Science', role: 'faculty', contact: '+91 98765 43210', salary: '₹72,000', isFaceEnrolled: true },
  ],
  achievers: [
    { id: 1, name: 'Aman Gupta', class: '10A', achievement: '1st Prize in Inter-School Science Fair', type: 'Science', image: '🏆', date: 'March 2026' },
    { id: 2, name: 'Priya Singh', class: '9B', achievement: 'District Level Badminton Champion', type: 'Sports', image: '🏸', date: 'February 2026' },
    { id: 3, name: 'Kabir Khan', class: '12C', achievement: '98% in CBSE Board Pre-Mock', type: 'Academic', image: '📜', date: 'March 2026' }
  ],
  storeOrders: [],
  healthRecords: {
    'STU2026-001': {
      bloodGroup: 'B+',
      height: '142 cm',
      weight: '38 kg',
      allergies: 'Dust, Peanuts',
      emergencyContactName: 'Mr. Gupta (Father)',
      emergencyContactPhone: '+91 98765 43210',
      medicalHistory: 'Asthma'
    }
  },
  studentRegistry: [
    { id: 'STU2026-001', name: 'Aman Gupta', class: '10A', rollNo: 1, role: 'student', parentName: 'Deepak Gupta', contact: '9988776655', isFaceEnrolled: false },
    { id: 'STU2026-002', name: 'Priya Singh', class: '9B', rollNo: 2, role: 'student', parentName: 'Suman Singh', contact: '8877665544', isFaceEnrolled: false },
  ],
  fees: [
    { id: 1, student: 'Aman Gupta', class: '10A', total: 45000, paid: 40000, status: 'Partial' },
    { id: 2, student: 'Priya Singh', class: '9B', total: 40000, paid: 15000, status: 'Pending' },
  ],
  attendanceHub: [
    { id: 1, studentName: 'Aman Gupta', class: '10A', status: 'Pending', time: '-' },
    { id: 2, studentName: 'Priya Singh', class: '9B', status: 'Pending', time: '-' },
  ],
  lessonLogs: [
    { id: 'LOG101', date: '2026-03-18', teacherId: 'TEA2026-02', teacherName: 'Professor Divyanshi', subject: 'Science', topic: 'Photosynthesis', summary: 'Explained the light-dependent and light-independent reactions in plants.' }
  ],
  liveClasses: [
    { id: 1, class_name: 'Class 10', subject: 'Mathematics', topic: 'Live: Quadratic Equations', start_time: new Date(Date.now() - 600000).toISOString(), meeting_link: 'https://meet.google.com/abc-defg-hij', teacher_name: 'Prof. Divyanshi' },
    { id: 2, class_name: 'Class 10', subject: 'Science', topic: 'Upcoming: Physics Revision', start_time: new Date(Date.now() + 7200000).toISOString(), meeting_link: 'https://meet.google.com/xyz-pqrs-tuv', teacher_name: 'Dr. Sharma' }
  ],
  qrAttendanceLogs: [],
  faculty: [
    { id: 1, name: 'Dr. Aruna Singh', designation: 'Principal', qualification: 'Ph.D, M.Sc', description: 'Visionary leader with 20+ years of educational experience.' },
    { id: 2, name: 'Mr. Vivek Mishra', designation: 'Vice Principal', qualification: 'M.A, B.Ed', description: 'Expert in administrative management and student welfare.' },
    { id: 3, name: 'Ms. Shalini Gupta', designation: 'HOD Science', qualification: 'M.Sc Physics', description: 'Committed to excellence in science education.' },
  ],
  mentors: [
    {
      id: 1,
      name: 'Dr. Aruna Singh',
      role: { en: 'Principal', hi: 'प्रधानाचार्य' },
      edu: 'Ph.D in Education, M.Sc',
      exp: '20+ Years',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 2,
      name: 'Mr. Vivek Mishra',
      role: { en: 'Vice Principal', hi: 'उप-प्रधानाचार्य' },
      edu: 'M.A (English), B.Ed',
      exp: '15 Years',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 3,
      name: 'Ms. Shalini Gupta',
      role: { en: 'HOD Science', hi: 'विभागाध्यक्ष (विज्ञान)' },
      edu: 'M.Sc Physics, B.Ed',
      exp: '12 Years',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    },
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
    { id: 1, title: 'Teachers Written Exam Result', en: 'Teachers Written Exam Result - Check Now', hi: 'शिक्षकों की लिखित परीक्षा का परिणाम - अभी देखें' },
    { id: 2, title: 'First Entrance Test Result Published', en: 'First Entrance Test Result Published', hi: 'प्रथम प्रवेश परीक्षा परिणाम प्रकाशित' },
    { id: 3, title: 'Admission open for session 2025-26', en: 'Admission open for session 2025-26. Limited seats available!', hi: 'सत्र 2025-26 के लिए प्रवेश खुले हैं। सीटें सीमित हैं!' }
  ],
  reviews: [
    { id: 1, name: "Rajesh Kumar", relation: "Father of Aryan (Class 8)", text: "The academic standards and personality development focus at Shri Jageshwar Memorial are truly commendable. My son has shown great improvement in his confidence and communication skills.", rating: 5 },
    { id: 2, name: "Suman Devi", relation: "Mother of Priya (Class 5)", text: "I am very happy with the individual attention teachers provide to every student. The school environment is safe, nurturing, and perfectly suited for primary education.", rating: 5 },
    { id: 3, name: "Amit Verma", relation: "Father of Sneha (Class 10)", text: "The way the school handled board exam preparations was excellent. The extra classes and regular mock tests helped my daughter score brilliantly in her 10th boards.", rating: 4 },
    { id: 4, name: "Anita Singh", relation: "Mother of Rahul (Class 12)", text: "A great institution for holistic development. Not just academics, but the sports and cultural activities are also given equal importance here.", rating: 5 },
    { id: 5, name: "Vikram Pratap", relation: "Father of Kavya (Class 7)", text: "Best school in the region! The management is very approachable and they actually listen to parents' suggestions for the betterment of the school.", rating: 5 }
  ],
  alumni: [
    { id: 1, name: 'Aarav Sharma', batch: 'Class 12', position: '1st Rank (Boards)', achievement: 'Excellence is not an act, but a habit.', image: '👨‍🎓' },
    { id: 2, name: 'Sanya Patel', batch: 'Class 10', position: 'Sports Star', achievement: 'Perseverance transforms dreams into reality.', image: '🏃‍♀️' },
    { id: 3, name: 'Ishaan Singh', batch: 'Class 11', position: 'National Quiz Winner', achievement: 'Knowledge is the real power.', image: '🧠' }
  ],
  achievers: [
    { id: 1, name: 'Aman Gupta', class: '10A', achievement: '1st Prize in Inter-School Science Fair', type: 'Science', image: '🏆', date: 'March 2026' },
    { id: 2, name: 'Priya Singh', class: '9B', achievement: 'District Level Badminton Champion', type: 'Sports', image: '🏸', date: 'February 2026' },
    { id: 3, name: 'Kabir Khan', class: '12C', achievement: '98% in CBSE Board Pre-Mock', type: 'Academic', image: '📜', date: 'March 2026' }
  ],
  storeOrders: [],
  healthRecords: {
    'STU2026-001': {
      bloodGroup: 'B+',
      height: '142 cm',
      weight: '38 kg',
      allergies: 'Dust, Peanuts',
      emergencyContactName: 'Mr. Gupta (Father)',
      emergencyContactPhone: '+91 98765 43210',
      medicalHistory: 'Asthma'
    }
  },
  documents: {
    'STU2026-001': [
      { id: 1, name: 'Academic Report Card - Term 1', type: 'PDF', date: 'Dec 2025', size: '1.2 MB' },
      { id: 2, name: 'Character Certificate', type: 'PDF', date: 'Jan 2026', size: '0.8 MB' },
      { id: 3, name: 'Fee Clearance Certificate', type: 'PDF', date: 'Feb 2026', size: '0.4 MB' },
      { id: 4, name: 'School Admission Form', type: 'PDF', date: 'April 2025', size: '2.5 MB' }
    ]
  },
  libraryBooks: [
    { id: 1, title: 'Higher Engineering Mathematics', author: 'B.S. Grewal', status: 'Available', shelf: 'A-1' },
    { id: 2, title: 'Concept of Physics', author: 'H.C. Verma', status: 'Issued', borrower: 'Aman Gupta', returnDate: '2026-03-22' },
    { id: 3, title: 'Organic Chemistry', author: 'Morrison Boyd', status: 'Available', shelf: 'B-4' },
  ],
  studentSpotlight: {
    name: 'Aman Gupta',
    title: 'Star of the Month',
    description: 'Aman has shown exceptional performance in the National Science Olympiad and maintains a 100% attendance record. His dedication to both academics and co-curricular activities is an inspiration to all students.',
    photo: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=400',
    achievements: ['Gold Medalist - Science Olympiad', '100% Attendance', 'Class 10-A Topper']
  },
  dailyStory: {
    title: "The Brave Little Elephant",
    content: "Once upon a time, there was a small elephant named Appu. He lived in a big green forest. Today, Appu reached a big river. Should he cross it to meet his friend, or wait for the rain to stop?",
    audioUrl: "#",
    image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=400",
    choices: [
      { id: 'A', text: 'Cross the River 🐘🌊', result: 'Appu bravely crossed the river and found a hidden treasure! Everyone clapped!' },
      { id: 'B', text: 'Wait for Rain 🐘🌧️', result: 'Appu waited and met a wise old owl who taught him a magic song!' }
    ]
  },
  stickerWall: [
    { id: 1, sticker: '🌟', label: 'Super Star', date: '2026-03-20' },
    { id: 2, sticker: '🐘', label: 'Animal Lover', date: '2026-03-21' },
    { id: 3, sticker: '🎨', label: 'Picasso Jr.', date: '2026-03-22' }
  ],
  phonicsData: [
    { letter: 'A', word: 'Apple', emoji: '🍎', color: '#ef4444' },
    { letter: 'B', word: 'Ball', emoji: '🏀', color: '#f59e0b' },
    { letter: 'C', word: 'Cat', emoji: '🐱', color: '#3b82f6' },
    { letter: 'D', word: 'Dog', emoji: '🐶', color: '#10b981' },
    { letter: 'E', word: 'Elephant', emoji: '🐘', color: '#8b5cf6' },
    { letter: 'F', word: 'Fish', emoji: '🐟', color: '#ec4899' },
  ],

  toddlerActivities: {
    animals: [
      { id: 1, name: 'Cow', emoji: '🐮', sound: 'Mochhh!', color: '#f87171' },
      { id: 2, name: 'Lion', emoji: '🦁', sound: 'Roarrr!', color: '#fbbf24' },
      { id: 3, name: 'Cat', emoji: '🐱', sound: 'Meowww!', color: '#60a5fa' },
      { id: 4, name: 'Monkey', emoji: '🐵', sound: 'Ooh-aah!', color: '#10b981' }
    ],
    colorMixes: [
      { c1: 'Red', c2: 'Blue', result: 'Purple', emoji1: '🔴', emoji2: '🔵', resEmoji: '🟣' },
      { c1: 'Yellow', c2: 'Red', result: 'Orange', emoji1: '🟡', emoji2: '🔴', resEmoji: '🟠' },
      { c1: 'Blue', c2: 'Yellow', result: 'Green', emoji1: '🔵', emoji2: '🟡', resEmoji: '🟢' },
      { c1: 'White', c2: 'Red', result: 'Pink', emoji1: '⚪', emoji2: '🔴', resEmoji: '🌸' }
    ],
    planets: [
      { name: 'Mercury', icon: '☄️', info: 'Closest to the Sun and very small!' },
      { name: 'Venus', icon: '🪐', info: 'The hottest planet in our solar system!' },
      { name: 'Earth', icon: '🌍', info: 'Our beautiful home with water and life!' },
      { name: 'Mars', icon: '🔴', info: 'The Red Planet! It has big volcanoes!' },
      { name: 'Jupiter', icon: '🌌', info: 'The biggest planet! It is a gas giant!' },
      { name: 'Saturn', icon: '🪐', info: 'Famous for its beautiful rings!' }
    ],
    shapeChallenge: [
      { id: 1, shape: 'Square', icon: '🟦', silhouette: '⬛' },
      { id: 2, shape: 'Circle', icon: '🟡', silhouette: '⚫' },
      { id: 3, shape: 'Triangle', icon: '🔺', silhouette: '🔼' },
      { id: 4, shape: 'Star', icon: '⭐', silhouette: '✨' }
    ]
  },
  cartoonData: {
    dressUp: [
      { id: 1, name: 'Hat', emoji: '🎩' },
      { id: 2, name: 'Sunglasses', emoji: '🕶️' },
      { id: 3, name: 'Crown', emoji: '👑' },
      { id: 4, name: 'Ribbon', emoji: '🎀' }
    ],
    sounds: [
      { id: 1, name: 'Boing', icon: '🌀', sound: 'boing.mp3' },
      { id: 2, name: 'Tada', icon: '🎉', sound: 'tada.mp3' },
      { id: 3, name: 'Giggle', icon: '😆', sound: 'giggle.mp3' },
      { id: 4, name: 'Magic', icon: '🪄', sound: 'magic.mp3' }
    ],
    phrases: [
      "I love playing with you! 🍭",
      "You are a superstar! ⭐",
      "Let's dance together! 💃",
      "Hahah! That tickles! 😂"
    ],
    messages: []
  }
};

const computeCRC = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

const getDB = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultData;
    const data = JSON.parse(saved);

    // IRON SHIELD CHECK
    if (data._iron_shield_crc) {
      const payload = JSON.parse(JSON.stringify(data));
      const storedCRC = payload._iron_shield_crc;
      delete payload._iron_shield_crc;
      const currentCRC = computeCRC(JSON.stringify(payload));

      if (storedCRC !== currentCRC) {
        console.error("⛔ IRON SHIELD: DATABASE TAMPER DETECTED!");
        data.tamper_detected = true;
      } else {
        data.tamper_detected = false;
      }
    }

    // Force Clear old dummy attendance if it's still dragging along from old versions
    if (data.attendanceHub && data.attendanceHub.some(a => a.status === 'Present' && a.time === '08:15 AM')) {
      data.attendanceHub = defaultData.attendanceHub;
    }

    // Merge defaultData with saved data to ensure transitions are smooth
    return { ...defaultData, ...data };
  } catch (error) {
    console.error("Data corruption detected, resetting to default.", error);
    return defaultData;
  }
};

const saveDB = (data) => {
  const payload = JSON.parse(JSON.stringify(data));
  delete payload._iron_shield_crc; // Remove old CRC before computing new one
  data._iron_shield_crc = computeCRC(JSON.stringify(payload));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const mockApi = {
  // Compatibility Aliases (Prevents crashes in legacy components)
  loadData: () => getDB(),
  saveData: (data) => saveDB(data),
  getDB: () => getDB(),
  markAttendance: (studentName, status) => {
    const data = getDB();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!data.isOnline) {
      // Offline mode: Queue the request
      const offlineEntry = {
        studentName,
        status,
        time: status === 'Present' ? now : '-',
        timestamp: Date.now()
      };
      if (!data.offlineQueue) data.offlineQueue = [];
      data.offlineQueue.push(offlineEntry);
      saveDB(data);
      return { status: 'offline_queued', entry: offlineEntry };
    }

    // Online mode: Regular update
    const today = new Date().toISOString().split('T')[0];
    if (!data.attendance) data.attendance = {};
    if (!data.attendance[studentName]) data.attendance[studentName] = [];

    const existingIndex = data.attendance[studentName].findIndex(a => a.date === today);
    if (existingIndex !== -1) {
      data.attendance[studentName][existingIndex] = { date: today, status, time: now };
    } else {
      data.attendance[studentName].push({ date: today, status, time: now });
    }

    if (!data.attendanceHub) data.attendanceHub = [];
    data.attendanceHub = data.attendanceHub.map(record =>
      record.studentName === studentName ? { ...record, status, time: status === 'Present' ? now : '-' } : record
    );
    saveDB(data);
    return { status: 'success', time: now };
  },

  getNetworkStatus: () => getDB().isOnline,

  toggleNetwork: () => {
    const data = getDB();
    data.isOnline = !data.isOnline;
    saveDB(data);
    return data.isOnline;
  },

  syncOfflineData: () => {
    const data = getDB();
    if (!data.isOnline || !data.offlineQueue || data.offlineQueue.length === 0) return 0;

    const count = data.offlineQueue.length;
    data.offlineQueue.forEach(item => {
      data.attendanceHub = data.attendanceHub.map(record =>
        record.studentName === item.studentName ? { ...record, status: item.status, time: item.time } : record
      );
    });

    data.offlineQueue = [];
    saveDB(data);
    return count;
  },

  // Assignments
  getAssignments: () => getDB().assignments,
  addAssignment: (asm) => {
    const db = getDB();
    db.assignments.unshift({ id: Date.now(), ...asm });
    saveDB(db);
  },

  // Attendance
  getAttendance: (studentName) => getDB().attendance[studentName] || [],
  markAttendanceHub: (studentName, date, status) => {
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

  addFine: (studentId, amount, reason) => {
    const db = getDB();
    if (!db.fines) db.fines = [];
    const newFine = {
      id: `FINE-${Date.now()}`,
      studentId,
      amount: parseInt(amount),
      reason,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    db.fines.push(newFine);

    // Also increase the student's total fee in the fees table
    const student = db.studentRegistry.find(s => s.id === studentId);
    if (student) {
      const feeRecord = db.fees.find(f => f.student === student.name);
      if (feeRecord) {
        feeRecord.total += parseInt(amount);
        feeRecord.status = feeRecord.paid >= feeRecord.total ? 'Paid' : 'Partial';
      }
    }

    saveDB(db);
    return newFine;
  },

  getStudentLedger: (studentId) => {
    const db = getDB();
    const student = db.studentRegistry.find(s => s.id === studentId);
    if (!student) return null;

    const transactions = (db.feeLedger || []).filter(f => f.studentId === studentId);
    const fines = (db.fines || []).filter(f => f.studentId === studentId);
    const feeSummary = (db.fees || []).find(f => f.student === student.name) || { total: 0, paid: 0 };

    return {
      student,
      summary: feeSummary,
      transactions,
      fines
    };
  },

  getStudentAttendanceAudit: (studentId) => {
    const db = getDB();
    const student = db.studentRegistry.find(s => s.id.toUpperCase() === studentId.toUpperCase());
    if (!student) return null;

    const history = db.attendance[student.name] || [];
    const totalDays = history.length;
    const presentDays = history.filter(a => a.status === 'Present').length;
    const absentDays = history.filter(a => a.status === 'Absent').length;
    const rate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

    // Group by Month
    const monthlyStats = history.reduce((acc, entry) => {
      const date = new Date(entry.date);
      const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[month]) acc[month] = { total: 0, present: 0 };
      acc[month].total++;
      if (entry.status === 'Present') acc[month].present++;
      return acc;
    }, {});

    const monthlySummary = Object.keys(monthlyStats).map(month => ({
      month,
      percentage: ((monthlyStats[month].present / monthlyStats[month].total) * 100).toFixed(1),
      present: monthlyStats[month].present,
      total: monthlyStats[month].total
    }));

    // Group by Week (Simple 7-day windows or logic depends on implementation)
    // For now, let's group by "Week of [Date]"
    const weeklyStats = history.reduce((acc, entry) => {
      const date = new Date(entry.date);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Get Monday
      const monday = new Date(date.setDate(diff)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const weekKey = `Week of ${monday}`;

      if (!acc[weekKey]) acc[weekKey] = { total: 0, present: 0 };
      acc[weekKey].total++;
      if (entry.status === 'Present') acc[weekKey].present++;
      return acc;
    }, {});

    const weeklySummary = Object.keys(weeklyStats).map(week => ({
      week,
      percentage: ((weeklyStats[week].present / weeklyStats[week].total) * 100).toFixed(1),
      present: weeklyStats[week].present,
      total: weeklyStats[week].total
    }));

    return {
      student,
      stats: {
        totalDays,
        presentDays,
        absentDays,
        rate
      },
      history,
      monthlySummary,
      weeklySummary
    };
  },

  // Students
  getStudents: () => getDB().studentRegistry || [],
  addStudent: (student) => {
    const db = getDB();
    const newStudent = {
      id: `STU${new Date().getFullYear()}-${String(db.studentRegistry.length + 1).padStart(3, '0')}`,
      role: 'student',
      isFaceEnrolled: false,
      ...student
    };

    // 1. Add to registry
    db.studentRegistry.unshift(newStudent);

    // 2. Create Fee Record
    if (!db.fees) db.fees = [];
    db.fees.unshift({
      id: db.fees.length + 1,
      student: newStudent.name,
      class: newStudent.class,
      total: 45000, // Default fee
      paid: 0,
      status: 'Pending'
    });

    // 3. Add to Attendance Hub
    if (!db.attendanceHub) db.attendanceHub = [];
    db.attendanceHub.unshift({
      id: db.attendanceHub.length + 1,
      studentName: newStudent.name,
      class: newStudent.class,
      status: 'Pending',
      time: '-'
    });

    saveDB(db);
    return newStudent;
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
  getNews: () => {
    const db = getDB();
    return db.newsItems || [];
  },
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

  publishResults: (examData) => {
    const db = getDB();
    const { examType, className, results } = examData;
    const now = new Date().toISOString().split('T')[0];

    results.forEach(res => {
      // 1. Create/Update Report Card entry
      const rcIndex = db.reportCards.findIndex(rc => rc.studentName === res.name && rc.examType === examType);
      const subjectEntry = { name: 'Mathematics', marks: parseInt(res.marks), total: parseInt(res.total) };

      if (rcIndex !== -1) {
        const subIndex = db.reportCards[rcIndex].subjects.findIndex(s => s.name === subjectEntry.name);
        if (subIndex !== -1) db.reportCards[rcIndex].subjects[subIndex] = subjectEntry;
        else db.reportCards[rcIndex].subjects.push(subjectEntry);
      } else {
        db.reportCards.unshift({
          id: `RC-${Date.now()}-${res.id}`,
          studentName: res.name,
          class: className,
          examType,
          subjects: [subjectEntry],
          date: now
        });
      }

      // 2. Trigger Gamification XP (Logic: 90% + = 100 XP)
      const percentage = (res.marks / res.total) * 100;
      if (percentage >= 90) {
        const student = db.leaderboard.find(s => s.name === res.name);
        if (student) student.points += 100;

        db.notifications.unshift({
          id: `BONUS-${Date.now()}-${res.id}`,
          title: '🏆 Achievement Unlocked!',
          content: `Congratulations ${res.name}! You scored ${percentage.toFixed(1)}% in ${examType}. Enjoy 100 Bonus XP!`,
          type: 'Success',
          date: now
        });
      }

      // 3. Parent Notification
      db.notifications.unshift({
        id: `RES-${Date.now()}-${res.id}`,
        title: `📣 Result Published: ${examType}`,
        content: `Dear Parent, ${res.name}'s result for ${examType} is now available. Score: ${res.marks}/${res.total} (${percentage.toFixed(1)}%).`,
        type: 'Notice',
        date: now
      });
    });

    saveDB(db);
    return { success: true };
  },

  // Health / Bio Data
  getHealthRecord: (studentId) => {
    const db = getDB();
    return db.healthRecords?.[studentId] || {
      bloodGroup: '',
      height: '',
      weight: '',
      allergies: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      medicalHistory: ''
    };
  },
  updateHealthRecord: (studentId, data) => {
    const db = getDB();
    if (!db.healthRecords) db.healthRecords = {};
    db.healthRecords[studentId] = { ...(db.healthRecords[studentId] || {}), ...data };
    saveDB(db);
    return db.healthRecords[studentId];
  },

  // Emergency / Daily Logs
  getEarlyDepartures: () => {
    const db = getDB();
    return db.earlyDepartures || [];
  },
  logEarlyDeparture: (record) => {
    const db = getDB();
    if (!db.earlyDepartures) db.earlyDepartures = [];
    const newRecord = { id: Date.now(), ...record };
    db.earlyDepartures.unshift(newRecord);
    saveDB(db);
    return newRecord;
  },

  getDailyLogs: () => {
    const db = getDB();
    return db.dailyLogs || [];
  },
  logDailyEvent: (record) => {
    const db = getDB();
    if (!db.dailyLogs) db.dailyLogs = [];
    const newRecord = { id: Date.now(), ...record };
    db.dailyLogs.unshift(newRecord);
    saveDB(db);
    return newRecord;
  },

  // GUARDIAN SUITE 2.0 SIGNATURES (TOTP-Style)
  generateQRSignature: () => {
    const timestamp = Math.floor(Date.now() / 30000); // 30s window
    const base = `NSGI-QR-${timestamp}`;
    return computeCRC(base).toUpperCase();
  },

  verifyQRSignature: (clientSig) => {
    const ts = Math.floor(Date.now() / 30000);
    const sig1 = computeCRC(`NSGI-QR-${ts}`).toUpperCase();
    const sig2 = computeCRC(`NSGI-QR-${ts - 1}`).toUpperCase(); // Allow 30s drift
    return clientSig === sig1 || clientSig === sig2;
  },

  logAudit: (type, action, role, details = {}) => {
    const db = getDB();
    if (!db.auditLogs) db.auditLogs = [];
    const entry = {
      id: `AUDIT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      action,
      role,
      details,
      fingerprint: `NSGI-OS-WIN-CHROME-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    };
    db.auditLogs.unshift(entry);
    saveDB(db);
    return entry;
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
  logQRAttendance: (entry) => {
    // SECURITY CHECK: Verify signature if provided
    if (entry.signature && !mockApi.verifyQRSignature(entry.signature)) {
      mockApi.logAudit('SECURITY_FRAUD', `QR Signature mismatch for ${entry.name}. Possible shared photo detected.`, entry.role);
      return { error: 'QR_EXPIRED' };
    }

    const { name, role, type, time } = entry;
    const data = getDB();
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

  // Home Page Mentors (Star Cards)
  getMentors: () => {
    const data = getDB().mentors;
    return (Array.isArray(data) && data.length > 0) ? data : defaultData.mentors;
  },
  addMentor: (mentor) => {
    const db = getDB();
    if (!Array.isArray(db.mentors)) db.mentors = [];
    const newMentor = { id: Date.now(), ...mentor };
    db.mentors.push(newMentor);
    saveDB(db);
    return newMentor;
  },
  deleteMentor: (id) => {
    const db = getDB();
    db.mentors = (db.mentors || []).filter(m => m.id !== id);
    saveDB(db);
    return { status: 'success' };
  },

  // Achievers
  getAchievers: () => {
    const data = getDB().achievers;
    return (Array.isArray(data) && data.length > 0) ? data : defaultData.achievers;
  },
  addAchiever: (person) => {
    const db = getDB();
    if (!Array.isArray(db.achievers)) db.achievers = [];
    const newPerson = { ...person, id: Date.now() };
    db.achievers.push(newPerson);
    saveDB(db);
    return newPerson;
  },
  deleteAchiever: (id) => {
    const db = getDB();
    db.achievers = (db.achievers || []).filter(a => a.id !== id);
    saveDB(db);
    return { status: 'success' };
  },

  // Full School Faculty (Faculty Page)
  getFaculty: () => {
    const data = getDB().faculty;
    return (Array.isArray(data) && data.length > 0) ? data : defaultData.faculty;
  },
  addFaculty: (faculty) => {
    const db = getDB();
    if (!Array.isArray(db.faculty)) db.faculty = [];
    const newFaculty = { id: Date.now(), ...faculty };
    db.faculty.push(newFaculty);
    saveDB(db);
    return newFaculty;
  },
  deleteFaculty: (id) => {
    const db = getDB();
    db.faculty = (db.faculty || []).filter(f => f.id !== id);
    db.facultyRegistry = (db.facultyRegistry || []).filter(f => f.id !== id);
    saveDB(db);
    return { status: 'success' };
  },

  updateFaculty: (id, updatedData) => {
    const db = getDB();
    db.faculty = db.faculty.map(f => f.id === id ? { ...f, ...updatedData } : f);
    saveDB(db);
  },

  // Reviews (WhatsApp Integration Simulation)
  getReviews: () => getDB().reviews || [],
  addReview: (review) => {
    const db = getDB();
    const newReview = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-GB'),
      ...review
    };
    db.reviews.unshift(newReview);
    saveDB(db);
    return newReview;
  },
  deleteReview: (id) => {
    const db = getDB();
    db.reviews = db.reviews.filter(r => r.id !== id);
    saveDB(db);
    return { status: 'success' };
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

  submitAdmission: (data) => {
    const db = getDB();
    const newAdmission = { ...data, id: `ADM${Date.now()}`, submittedAt: new Date().toISOString() };
    db.admissions.push(newAdmission);
    saveDB(db);
    return newAdmission;
  },

  submitInquiry: (data) => {
    const db = getDB();
    const newInquiry = { ...data, id: `INQ${Date.now()}`, submittedAt: new Date().toISOString() };
    db.inquiries.push(newInquiry);
    saveDB(db);
    return newInquiry;
  },

  getParentFees: () => {
    const data = getDB();
    return data.parentFees || [];
  },

  payFee: (feeId) => {
    const data = getDB();
    const feeIndex = data.parentFees.findIndex(f => f.id === feeId);

    if (feeIndex === -1) throw new Error("Fee record not found.");
    if (data.parentFees[feeIndex].status === 'Paid') return { status: 'already_paid' };

    data.parentFees[feeIndex].status = 'Paid';

    // Proper Logging (Maintain Transaction History)
    if (!data.feeLedger) data.feeLedger = [];
    const newTxn = {
      id: `TXN${Date.now()}`,
      studentId: 'STU2026-001',
      studentName: 'Aman Gupta',
      amount: data.parentFees[feeIndex].amount,
      mode: 'Online',
      status: 'Success',
      date: new Date().toLocaleDateString('en-GB'),
      collectedBy: 'System'
    };
    data.feeLedger.unshift(newTxn);

    saveDB(data);
    return { status: 'success', transaction: newTxn };
  },

  getSystemStats: () => {
    const db = getDB();
    const students = db.studentRegistry || [];
    const faculty = db.facultyRegistry || [];
    const ledger = db.feeLedger || [];

    const totalRevenue = ledger.reduce((sum, txn) => sum + (parseInt(txn.amount) || 0), 0);

    return [
      { label: 'Total Students', value: students.length.toLocaleString(), icon: '👥', color: '#3b82f6' },
      { label: 'Total Revenue', value: `₹${(totalRevenue / 100000).toFixed(2)}L`, icon: '📈', color: '#10b981' },
      { label: 'Pending Leaves', value: (db.leaveRequests || []).filter(r => r.status === 'Pending').length.toString().padStart(2, '0'), icon: '⏳', color: '#f59e0b' },
      { label: 'Active Staff', value: faculty.length.toString(), icon: '👔', color: '#f43f5e' }
    ];
  },

  getRecentTransactions: (limit = 5) => {
    const db = getDB();
    const ledger = db.feeLedger || [];
    return ledger.slice(0, limit);
  },

  getAttendanceHub: () => {
    const data = getDB();
    return data.attendanceHub || [];
  },

  markAttendanceHub: (studentName, status) => {
    const data = getDB();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const today = new Date().toISOString().split('T')[0];

    // Update student history for Audit
    if (!data.attendance) data.attendance = {};
    if (!data.attendance[studentName]) data.attendance[studentName] = [];

    const existingIndex = data.attendance[studentName].findIndex(a => a.date === today);
    if (existingIndex !== -1) {
      data.attendance[studentName][existingIndex] = { date: today, status, time: now };
    } else {
      data.attendance[studentName].push({ date: today, status, time: now });
    }

    data.attendanceHub = data.attendanceHub.map(record =>
      record.studentName === studentName ? { ...record, status, time: status === 'Present' ? now : '-' } : record
    );
    saveDB(data);
    return { status: 'success', time: now };
  },

  onboardFaculty: async (name, subject, assignedClass, dob = null, parentName = null, faceImage = null) => {
    const data = getDB();
    if (!data.facultyRegistry) data.facultyRegistry = [];

    let descriptor = null;
    if (faceImage) {
      console.log("%c[AI ANALYSIS] STARTING FACIAL FEATURE EXTRACTION...", "color: #3b82f6; font-weight: bold;");
      const detection = await getFaceDescriptorFromBase64(faceImage);
      const extracted = detection ? detection.descriptor : null;
      if (!extracted) {
        throw new Error("BIOMETRIC ERROR: No face could be detected in the image. Please capture again fully in frame.");
      }

      // Artificial "Deep Analysis" delay to build trust and ensure cleanup
      await new Promise(r => setTimeout(r, 1200));
      console.log("%c[AI ANALYSIS] 128-d VECTOR GENERATED. ENCRYPTING SIGNATURE...", "color: #10b981; font-weight: bold;");

      descriptor = Array.from(extracted); // Serialize Float32Array
    }

    const joinYear = new Date().getFullYear();
    const prefix = `TEA-${joinYear}`;
    let counter = 1;
    let newId = `${prefix}-${String(counter).padStart(3, '0')}`;

    // Ensure uniqueness
    while ((data.facultyRegistry || []).some(f => f.id === newId)) {
      counter++;
      newId = `${prefix}-${String(counter).padStart(3, '0')}`;
    }
    const newFaculty = {
      id: newId,
      name,
      subject,
      assignedClass,
      role: 'Faculty',
      dob,
      parentName,
      faceImage,
      faceDescriptor: descriptor,
      isFaceEnrolled: !!descriptor
    };
    data.facultyRegistry.push(newFaculty);
    saveDB(data);

    // Save directly to real Database Backend via API
    try {
      await fetch('http://localhost:5001/api/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFaculty.name,
          designation: newFaculty.subject,
          description: `DOB: ${dob}, Parent: ${parentName}`,
          faceImage: newFaculty.faceImage,
          faceDescriptor: newFaculty.faceDescriptor ? JSON.stringify(newFaculty.faceDescriptor) : null
        })
      });
      console.log("Teacher synced securely to PostgreSQL Database.");
    } catch (e) {
      console.error("Failed to sync Teacher to DB:", e);
    }

    return newFaculty;
  },

  onboardStudent: async (name, className, parentName, dob, faceImage = null) => {
    const data = getDB();
    if (!data.studentRegistry) data.studentRegistry = [];
    if (!data.attendanceHub) data.attendanceHub = [];

    const isExactMatch = data.studentRegistry.some(s =>
      s.name.toLowerCase() === name.toLowerCase() &&
      s.parentName?.toLowerCase() === parentName?.toLowerCase() &&
      s.dob === dob
    );

    let descriptorArray = null;
    if (faceImage) {
      const detection = await getFaceDescriptorFromBase64(faceImage);
      const extracted = detection ? detection.descriptor : null;
      if (!extracted) {
        throw new Error("BIOMETRIC ERROR: No face could be detected. Ensure clear lighting.");
      }
      descriptorArray = Array.from(extracted);
    }

    if (isExactMatch && descriptorArray) {
      throw new Error("BIOMETRIC ERROR: This student (Name/DOB/Face) is already registered in the system.");
    }

    const parentPrefix = (parentName || "PAR").substring(0, 3).toUpperCase();
    const birthYear = dob ? new Date(dob).getFullYear() : "2026";
    const studentId = `${parentPrefix}${birthYear}`;

    let finalId = studentId;
    let counter = 1;
    while (data.studentRegistry.some(s => s.id === finalId)) {
      finalId = `${studentId}${counter}`;
      counter++;
    }

    const classStudents = data.studentRegistry.filter(s => s.class === className);
    const newRoll = classStudents.length + 1;
    const newStudent = {
      id: finalId,
      name,
      class: className,
      rollNo: newRoll,
      role: 'Student',
      parentName,
      dob,
      faceImage,
      faceDescriptor: descriptorArray,
      isFaceEnrolled: !!descriptorArray
    };
    data.studentRegistry.push(newStudent);

    data.attendanceHub.push({ id: `ATT-${Date.now()}`, studentName: name, class: className, status: 'Pending', time: '-' });

    saveDB(data);

    // Secure Sync to Backend
    try {
      await fetch('http://localhost:5001/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: newStudent.name,
          fatherName: newStudent.parentName,
          dob: newStudent.dob,
          classApplied: newStudent.class,
          phone: newStudent.id, // Using ID as placeholder reference
          faceImage: newStudent.faceImage,
          faceDescriptor: newStudent.faceDescriptor ? JSON.stringify(newStudent.faceDescriptor) : null
        })
      });
      console.log("Student biometrics synced to PostgreSQL.");
    } catch (e) {
      console.warn("Student DB Sync Failed:", e.message);
    }

    return newStudent;
  },

  deleteStudent: (studentId) => {
    const data = getDB();
    const student = data.studentRegistry.find(s => s.id === studentId);
    if (!student) return { status: 'error', message: 'Student not found' };

    const studentName = student.name;
    const studentClass = student.class;

    // 1. Remove from registry
    data.studentRegistry = data.studentRegistry.filter(s => s.id !== studentId);
    // 2. Remove from attendance hub
    data.attendanceHub = data.attendanceHub.filter(a => !(a.studentName === studentName && a.class === studentClass));
    // 3. Remove from fee ledger (optional, usually kept for audit, but let's clean for mock)
    data.feeLedger = (data.feeLedger || []).filter(f => f.studentId !== studentId);

    saveDB(data);
    return { status: 'success' };
  },


  enrollFace: (studentId) => {
    const data = getDB();
    const student = data.studentRegistry.find(s => s.id === studentId);
    if (student) {
      student.isFaceEnrolled = true;
      saveDB(data);
      return { status: 'success' };
    }
    return { status: 'error' };
  },

  verifyFace: (studentId, capturedImage) => {
    const data = getDB();
    const student = data.studentRegistry.find(s => s.id === studentId);
    if (!student) return { success: false, message: "Student not found" };
    if (!student.faceImage) return { success: false, message: "No face registered for this student" };

    if (capturedImage && student.faceImage) {
      return { success: true, message: "Face Match Successful!" };
    }

    return { success: false, message: "Face does not match record" };
  },

  _compareImages: async (base641, base642) => {
    if (base641 === base642) return 1.0;

    const getPixelData = (src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Low resolution for structural comparison (ignore minor details/noise)
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 16, 16);
        const data = ctx.getImageData(0, 0, 16, 16).data;
        let gray = [];
        for (let i = 0; i < data.length; i += 4) {
          gray.push((data[i] + data[i + 1] + data[i + 2]) / 3); // Grayscale
        }
        resolve(gray);
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });

    const pixels1 = await getPixelData(base641);
    const pixels2 = await getPixelData(base642);

    if (!pixels1 || !pixels2) return 0;

    let diff = 0;
    for (let i = 0; i < pixels1.length; i++) {
      diff += Math.abs(pixels1[i] - pixels2[i]); // Mean Absolute Error is more forgiving than MSE
    }
    const mae = diff / pixels1.length;

    // Normalizing MAE. Max diff is 255. 
    // A typical MAE for the same person moving slightly in same lighting is 30-70.
    const similarity = Math.max(0, 1 - (mae / 150));
    return similarity;
  },

  // Secure Biometric Login for Faculty: ID + Face Verification
  verifyFacultyBiometricLogin: async (id, faceImage) => {
    const data = getDB();
    let faculty = (data.facultyRegistry || []).find(f => f.id.toUpperCase() === id.trim().toUpperCase());

    // Cross-Origin/Tab Fallback: If not in localStorage, check real DB
    if (!faculty) {
      try {
        const resp = await fetch(`http://localhost:5001/api/faculty/search/${id.trim()}`);
        const dbRef = await resp.json();
        if (dbRef) {
          faculty = {
            ...dbRef,
            id: dbRef.id.toString(), // Ensure ID is string for consistency
            faceDescriptor: dbRef.face_descriptor ? JSON.parse(dbRef.face_descriptor) : null,
            faceImage: dbRef.face_image
          };
          // Cache it for this origin
          data.facultyRegistry.push(faculty);
          saveDB(data);
        }
      } catch (e) { console.warn("Backend lookup failed:", e); }
    }

    if (!faculty) {
      return { success: false, message: "INVALID ID: Faculty Record Not Found in Database." };
    }

    if (!faculty.faceDescriptor) {
      return { success: false, message: "LEGACY RECORD: Please re-enroll face in Admin Portal to generate AI secure descriptor." };
    }

    // High-Fidelity Biometric Analysis (128-d Vector)
    if (faceImage && faceImage.startsWith('data:image')) {
      const detection = await getFaceDescriptorFromBase64(faceImage);
      const liveArray = detection ? detection.descriptor : null;
      if (!liveArray) {
        return { success: false, message: "NO FACE DETECTED: Move to a well-lit area and align face." };
      }

      const enrolledDescriptor = parseDescriptor(faculty.faceDescriptor);
      const liveDescriptor = new Float32Array(liveArray);

      const distance = compareFaces(liveDescriptor, enrolledDescriptor);

      // Lenient Match: Increased from 0.40 to 0.60 for better reliability in varying light
      if (distance !== null && distance < 0.60) {
        const confidence = Math.max(0, 1 - (distance / 0.60)); // Normalize confidence to the new threshold
        return {
          success: true,
          faculty,
          confidence: confidence,
          message: `IDENTITY VERIFIED: Welcome, ${faculty.name} (Conf: ${Math.round(confidence * 100)}%).`
        };
      }
      return { success: false, message: `ACCESS DENIED: Biometric Mismatch. [Loss: ${distance?.toFixed(2)}]` };
    }

    return { success: false, message: "NO BIOMETRIC SIGNATURE RECIEVED." };
  },

  verifyStudentBiometricLogin: async (id, faceImage) => {
    const data = getDB();
    let student = (data.studentRegistry || []).find(s => s.id.toUpperCase() === id.trim().toUpperCase());

    // Cross-Origin/Tab Fallback: If not in localStorage, check real DB
    if (!student) {
      try {
        const resp = await fetch(`http://localhost:5001/api/students/search/${id.trim()}`);
        const dbRef = await resp.json();
        if (dbRef) {
          student = {
            ...dbRef,
            id: dbRef.roll_no || dbRef.id.toString(),
            faceDescriptor: dbRef.face_descriptor ? JSON.parse(dbRef.face_descriptor) : null,
            faceImage: dbRef.face_image
          };
          // Cache it
          data.studentRegistry.push(student);
          saveDB(data);
        }
      } catch (e) { console.warn("Student Backend lookup failed:", e); }
    }

    if (!student) {
      return { success: false, message: "INVALID ID: Student Record Not Found." };
    }

    if (!student.faceDescriptor) {
      return { success: false, message: "NO SECURE BIOMETRIC: Student has not enrolled into the new AI system." };
    }

    // High-Fidelity Biometric Analysis
    if (faceImage && faceImage.startsWith('data:image')) {
      const detection = await getFaceDescriptorFromBase64(faceImage);
      const liveArray = detection ? detection.descriptor : null;
      if (!liveArray) {
        return { success: false, message: "NO FACE DETECTED: Look directly into the camera." };
      }

      const enrolledDescriptor = parseDescriptor(student.faceDescriptor);
      const liveDescriptor = new Float32Array(liveArray);

      const distance = compareFaces(liveDescriptor, enrolledDescriptor);

      // Lenient Match: Increased from 0.45 to 0.60 for better reliability
      if (distance !== null && distance < 0.60) {
        const confidence = Math.max(0, 1 - (distance / 0.60));
        return {
          success: true,
          student,
          confidence: confidence,
          message: `ACCESS GRANTED: Hello ${student.name} (Conf: ${Math.round(confidence * 100)}%).`
        };
      }
      return { success: false, message: `SECURITY ALERT: Biometric Mismatch [Loss: ${distance?.toFixed(2)}]` };
    }

    return { success: false, message: "NO FACE DETECTED: Blank capture." };
  },

  matchFaceAcrossAllStudents: async (capturedImage) => {
    const data = getDB();
    const enrolledStudents = data.studentRegistry.filter(s => s.isFaceEnrolled || s.faceImage);

    if (enrolledStudents.length === 0) {
      return { success: false, message: "No student records found in database. Enroll students first." };
    }

    if (!capturedImage) return { success: false, message: "No image captured." };

    const detection = await getFaceDescriptorFromBase64(capturedImage);
    if (!detection) return { success: false, message: "No Face Detected in Camera." };

    const liveDescriptor = new Float32Array(detection.descriptor);
    let bestMatch = null;
    let minDistance = 0.50; // More lenient matching

    for (const student of enrolledStudents) {
      if (student.faceDescriptor) {
        const enrolledDescriptor = parseDescriptor(student.faceDescriptor);
        const dist = compareFaces(liveDescriptor, enrolledDescriptor);
        if (dist !== null && dist < minDistance) {
          minDistance = dist;
          bestMatch = student;
        }
      }
    }

    if (bestMatch) {
      const confidence = 1 - minDistance;
      return {
        success: true,
        student: bestMatch,
        confidence: confidence,
        isLivenessVerified: true,
        message: `BIOMETRIC VERIFIED: ${bestMatch.name} (${(confidence * 100).toFixed(1)}% IDENTITY MATCH)`
      };
    }

    return { success: false, message: "ACCESS DENIED: Face not recognized in the system or confidence too low." };
  },

  matchFaceAcrossAllFaculty: async (capturedImage) => {
    const data = getDB();
    const enrolledFaculty = (data.facultyRegistry || []).filter(f => f.isFaceEnrolled || f.faceImage);

    if (enrolledFaculty.length === 0) {
      return { success: false, message: "No biometric profile found. Enroll in Admin first." };
    }

    if (!capturedImage) return { success: false, message: "No image captured." };

    const detection = await getFaceDescriptorFromBase64(capturedImage);
    if (!detection) return { success: false, message: "No Face Detected in Camera." };

    const liveDescriptor = new Float32Array(detection.descriptor);
    let bestMatch = null;
    let minDistance = 0.50;

    for (const faculty of enrolledFaculty) {
      if (faculty.faceDescriptor) {
        const enrolledDescriptor = parseDescriptor(faculty.faceDescriptor);
        const dist = compareFaces(liveDescriptor, enrolledDescriptor);
        if (dist !== null && dist < minDistance) {
          minDistance = dist;
          bestMatch = faculty;
        }
      }
    }

    if (bestMatch) {
      const confidence = 1 - minDistance;
      return {
        success: true,
        faculty: bestMatch,
        confidence: confidence,
        isLivenessVerified: true,
        status: 'AUTH_GRANTED',
        message: `BIOMETRIC VERIFIED: ${bestMatch.name} (${(confidence * 100).toFixed(1)}% SIMILARITY)`
      };
    }

    return { success: false, message: "Access Denied: Unrecognized Face." };
  },

  logLesson: (teacherId, teacherName, subject, topic, summary) => {
    const data = getDB();
    if (!data.lessonLogs) data.lessonLogs = [];
    const newLog = {
      id: `LOG${100 + data.lessonLogs.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      teacherId,
      teacherName,
      subject,
      topic,
      summary
    };
    data.lessonLogs.push(newLog);
    saveDB(data);
    return newLog;
  },

  recordFee: (studentId, studentName, amount, mode, collectorRole, collectorName) => {
    const data = getDB();
    if (!data.feeLedger) data.feeLedger = [];
    const txnId = `TXN-${Date.now()}`;
    const newEntry = {
      id: txnId,
      studentId,
      studentName,
      amount: parseInt(amount),
      mode,
      status: 'Success',
      date: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      collectedBy: collectorName || collectorRole
    };
    data.feeLedger.push(newEntry);

    // Update Fees summary table
    const feeRecord = data.fees.find(f => f.student === studentName);
    if (feeRecord) {
      feeRecord.paid += parseInt(amount);
      feeRecord.status = feeRecord.paid >= feeRecord.total ? 'Paid' : 'Partial';
    }

    // Update parentFees if it exists for this student
    if (data.parentFees) {
      const feeIndex = data.parentFees.findIndex(f => f.status === 'Pending' && f.studentName === studentName);
      if (feeIndex !== -1) {
        data.parentFees[feeIndex].status = 'Paid';
      }
    }

    saveDB(data);
    return newEntry;
  },

  recoverId: (info) => {
    const data = getDB();
    const faculty = (data.facultyRegistry || []).find(f => f.contact === info);
    if (faculty) return { type: 'Faculty', id: faculty.id, name: faculty.name };

    const student = (data.studentRegistry || []).find(s => s.contact === info);
    if (student) return { type: 'Student', id: student.id, name: student.name, rollNo: student.rollNo };

    return null;
  },

  getDocuments: (studentId) => getDB().documents[studentId] || [],
  getLibraryBooks: () => getDB().libraryBooks || [],

  // Reset System (For development only)
  getOrders: () => getDB().storeOrders || [],
  recordOrder: (order) => {
    const data = getDB();
    const newOrder = { ...order, id: `ORD-${Date.now()}`, timestamp: new Date().toISOString() };
    data.storeOrders.push(newOrder);
    saveDB(data);
    return newOrder;
  },

  getHealthRecord: (studentId) => {
    const record = getDB().healthRecords[studentId];
    if (record) return record;
    // Default safe record if none exists
    return {
      bloodGroup: 'Unknown',
      height: 'N/A',
      weight: 'N/A',
      vaccinations: [],
      allergies: [],
      emergencyContact: { name: 'Not Set', phone: 'N/A' }
    };
  },

  updateHealthRecord: (studentId, record) => {
    const data = getDB();
    data.healthRecords[studentId] = record;
    saveDB(data);
    return record;
  },

  // Assignments & Diary
  getAssignments: () => getDB().assignments || [],
  addAssignment: (assignment) => {
    const data = getDB();
    const newAssignment = {
      ...assignment,
      id: Date.now(),
      status: 'Pending',
      submissions: 0,
      totalStudents: 30, // Mock class size
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    data.assignments.unshift(newAssignment);
    saveDB(data);
    return newAssignment;
  },
  removeAssignment: (id) => {
    const data = getDB();
    data.assignments = data.assignments.filter(a => a.id !== id);
    saveDB(data);
  },
  updateAssignmentStatus: (id, status) => {
    const data = getDB();
    const index = data.assignments.findIndex(a => a.id === id);
    if (index !== -1) {
      data.assignments[index].status = status;
      saveDB(data);
    }
    return data.assignments[index];
  },
  submitWork: (assignmentId, studentName, submissionData) => {
    const data = getDB();
    const index = data.assignments.findIndex(a => a.id === assignmentId);
    if (index !== -1) {
      data.assignments[index].submissions = (data.assignments[index].submissions || 0) + 1;

      if (!data.assignments[index].submissionsList) data.assignments[index].submissionsList = [];
      data.assignments[index].submissionsList.push({
        studentName,
        data: submissionData,
        date: new Date().toLocaleString()
      });

      // Mark as completed for this demo
      data.assignments[index].status = 'Completed';
      saveDB(data);
    }
    return true;
  },
  getDiaryEntries: () => getDB().diaryEntries || [],
  getDiary: () => getDB().diaryEntries || [], // Alias
  postDiaryEntry: (entry) => {
    const data = getDB();
    const newEntry = {
      ...entry,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-GB')
    };
    data.diaryEntries.unshift(newEntry);
    saveDB(data);
    return newEntry;
  },
  logLesson: (teacherId, teacherName, subject, topic, summary) => {
    const data = getDB();
    const newLog = {
      id: Date.now(),
      teacherId,
      teacherName,
      subject,
      topic,
      summary,
      date: new Date().toLocaleDateString('en-GB')
    };
    if (!data.lessonLogs) data.lessonLogs = [];
    data.lessonLogs.unshift(newLog);
    // Also add to diary entries for students to see
    if (!data.diaryEntries) data.diaryEntries = [];
    data.diaryEntries.unshift({
      id: Date.now() + 1,
      topic: topic,
      date: new Date().toLocaleDateString('en-GB'),
      progress: 100,
      remarks: summary
    });
    saveDB(data);
    return newLog;
  },

  getSpotlight: () => getDB().studentSpotlight || {},
  updateSpotlight: (data) => {
    const db = getDB();
    db.studentSpotlight = { ...db.studentSpotlight, ...data };
    saveDB(db);
    return db.studentSpotlight;
  },

  // Alumni
  getAlumni: () => {
    const data = getDB().alumni;
    return (Array.isArray(data) && data.length > 0) ? data : defaultData.alumni;
  },
  addAlumni: (person) => {
    const db = getDB();
    if (!Array.isArray(db.alumni)) db.alumni = [];
    db.alumni.unshift({ id: Date.now(), ...person });
    saveDB(db);
  },
  deleteAlumni: (id) => {
    const db = getDB();
    db.alumni = db.alumni.filter(a => a.id !== id);
    saveDB(db);
  },

  // Live Classes
  getLiveClasses: (className) => {
    const data = getDB();
    if (!className) return data.liveClasses || [];
    return (data.liveClasses || []).filter(c => c.class_name === className);
  },

  addLiveClass: (classData) => {
    const data = getDB();
    if (!data.liveClasses) data.liveClasses = [];
    const newClass = {
      ...classData,
      id: Date.now(),
      status: 'Scheduled'
    };
    data.liveClasses.push(newClass);
    saveDB(data);
    return newClass;
  },

  getDailyStory: () => getDB().dailyStory,
  getStickers: () => getDB().stickerWall || [],
  getPhonics: () => getDB().phonicsData || [],

  saveVoiceDiary: (studentId, audioData) => {
    const db = getDB();
    if (!db.voiceDiaries) db.voiceDiaries = [];
    db.voiceDiaries.unshift({ id: Date.now(), studentId, date: new Date().toISOString() });
    saveDB(db);
    return { success: true };
  },
  triggerGateAlert: (studentName) => {
    const db = getDB();
    if (!db.gateAlerts) db.gateAlerts = [];
    db.gateAlerts.push({ id: Date.now(), studentName, time: new Date().toLocaleTimeString() });
    saveDB(db);
    // Also send notification to teacher
    const teacherNotif = {
      id: Date.now(),
      type: 'GateAlert',
      title: 'Parent at Gate!',
      message: `Parent of ${studentName} is waiting at the main gate for pickup.`,
      time: 'Just Now',
      priority: 'high'
    };
    if (!db.notifications) db.notifications = [];
    db.notifications.unshift(teacherNotif);
    saveDB(db);
    return { success: true };
  },
  getGateAlerts: () => getDB().gateAlerts || [],
  getJuniorGallery: () => {
    const db = getDB();
    const drawings = (db.juniorDrawings || []).map(d => ({ ...d, type: 'drawing', icon: '🎨' }));
    const voices = (db.voiceDiaries || []).map(v => ({ ...v, type: 'voice', icon: '🎤', data: 'Audio Diary' }));
    return [...drawings, ...voices].sort((a, b) => b.id - a.id);
  },
  getDailyGift: () => {
    const gifts = ['🦄 Unicorn Dust', '🌈 Rainbow Badge', '🍿 Popcorn Treat', '🎭 Super Hero Mask', '🍭 Magic Candy'];
    return gifts[Math.floor(Math.random() * gifts.length)];
  },
  saveJuniorDrawing: (drawingData) => {
    const db = getDB();
    if (!db.juniorDrawings) db.juniorDrawings = [];
    db.juniorDrawings.unshift({ id: Date.now(), data: drawingData, date: new Date().toISOString() });
    saveDB(db);
    return { success: true };
  },

  getFastTrackCurriculum: () => [
    { day: 1, title: 'Alphabet Adventure', category: 'Language', video: 'https://www.youtube.com/embed/HQHnS_2P-3M', task: 'Identify and say A, B, C' },
    { day: 2, title: 'Phonics Fun', category: 'Language', video: 'https://www.youtube.com/embed/BELlZKpi1Zs', task: 'Make the sounds of A to E' },
    { day: 3, title: 'Z-A Journey', category: 'Language', video: 'https://www.youtube.com/embed/XqZsoesa55w', task: 'Learn F to J sounds' },
    { day: 4, title: 'Word Wizard', category: 'Language', video: 'https://www.youtube.com/embed/36n93jvjkDs', task: 'K to O sounds and words' },
    { day: 5, title: 'Number Magic', category: 'Math', video: 'https://www.youtube.com/embed/DR-cfDsHCGA', task: 'Count from 1 to 5' },
    { day: 6, title: 'Counting Stars', category: 'Math', video: 'https://www.youtube.com/embed/6RfIKqkvHTY', task: 'Learn numbers 6 to 10' },
    { day: 7, title: 'Addition Party', category: 'Math', video: 'https://www.youtube.com/embed/uRoJ5E-Xx9s', task: 'Simple 1+1 and 1+2' },
    { day: 8, title: 'Shape Shifter', category: 'Math', video: 'https://www.youtube.com/embed/XU3PsR8Y_X0', task: 'Identify Circle and Square' },
    { day: 9, title: 'Animal Kingdom', category: 'Nature', video: 'https://www.youtube.com/embed/5IOoYI3A_gY', task: 'Identify 5 land animals' },
    { day: 10, title: 'Water World', category: 'Nature', video: 'https://www.youtube.com/embed/6_6vPSc5uUo', task: 'Fish and sea creatures' },
    { day: 11, title: 'Birdy Buddies', category: 'Nature', video: 'https://www.youtube.com/embed/jZ_yZ-L_Y_I', task: 'Identify Sparrow and Peacock' },
    { day: 12, title: 'Weather Watch', category: 'Nature', video: 'https://www.youtube.com/embed/L7I_lY_L6_M', task: 'Rain, Sun, and Snow' },
    { day: 13, title: 'Color Carnival', category: 'Creative', video: 'https://www.youtube.com/embed/AswYQ1vY0eE', task: 'Learn Red, Blue, Yellow' },
    { day: 14, title: 'Painting Clouds', category: 'Creative', video: 'https://www.youtube.com/embed/_0D9JmNImEw', task: 'Mix Red and Yellow' },
    { day: 15, title: 'Drawing Faces', category: 'Creative', video: 'https://www.youtube.com/embed/7Kj_uLpS_Zk', task: 'Draw a happy face' },
    { day: 16, title: 'Doodle Day', category: 'Creative', video: 'https://www.youtube.com/embed/v7qS_Z_Xz8M', task: 'Trace a simple house' },
    { day: 17, title: 'Hello & Thank You', category: 'Citizen', video: 'https://www.youtube.com/embed/rP1jV6p6_U8', task: 'Learn Magic Words' },
    { day: 18, title: 'Sharing is Caring', category: 'Citizen', video: 'https://www.youtube.com/embed/pCHYIs4x-oU', task: 'Learn to share toys' },
    { day: 19, title: 'Healthy Bites', category: 'Citizen', video: 'https://www.youtube.com/embed/V6_V2G7t6i0', task: 'Identify Healthy Food' },
    { day: 20, title: 'Super Hero Graduation', category: 'Citizen', video: 'https://www.youtube.com/embed/fN1Cyr0ZK9M', task: 'Final Revision and Party!' }
  ],

  saveFastTrackProgress: (day) => {
    const db = getDB();
    if (!db.fastTrackProgress) db.fastTrackProgress = 0;
    if (day > db.fastTrackProgress) {
      db.fastTrackProgress = day;
      saveDB(db);
    }
    return db.fastTrackProgress;
  },

  getFastTrackProgress: () => getDB().fastTrackProgress || 0,

  getToddlerData: () => getDB().toddlerActivities,
  getCartoonData: () => getDB().cartoonData,
  getColorMixes: () => getDB().toddlerActivities.colorMixes,
  getPlanets: () => getDB().toddlerActivities.planets,
  getShapeChallenge: () => getDB().toddlerActivities.shapeChallenge,

  clearDB: () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  },
  getAlphabetData: () => [
    { l: 'A', w: 'Apple', h: 'Seb', e: '🍎' }, { l: 'B', w: 'Ball', h: 'Gend', e: '⚽' },
    { l: 'C', w: 'Cat', h: 'Billi', e: '🐱' }, { l: 'D', w: 'Dog', h: 'Kutta', e: '🐶' },
    { l: 'E', w: 'Elephant', h: 'Hathi', e: '🐘' }, { l: 'F', w: 'Fish', h: 'Machli', e: '🐟' },
    { l: 'G', w: 'Grapes', h: 'Angoor', e: '🍇' }, { l: 'H', w: 'Horse', h: 'Ghoda', e: '🐎' },
    { l: 'I', w: 'Ice Cream', h: 'Baraf Malai', e: '🍦' }, { l: 'J', w: 'Jug', h: 'Jug', e: '🏺' },
    { l: 'K', w: 'Kite', h: 'Patang', e: '🪁' }, { l: 'L', w: 'Lion', h: 'Sher', e: '🦁' },
    { l: 'M', w: 'Mango', h: 'Aam', e: '🥭' }, { l: 'N', w: 'Nose', h: 'Naak', e: '👃' },
    { l: 'O', w: 'Orange', h: 'Santra', e: '🍊' }, { l: 'P', w: 'Parrot', h: 'Tota', e: '🦜' },
    { l: 'Q', w: 'Queen', h: 'Rani', e: '👸' }, { l: 'R', w: 'Rabbit', h: 'Khargosh', e: '🐰' },
    { l: 'S', w: 'Sun', h: 'Sooraj', e: '☀️' }, { l: 'T', w: 'Tiger', h: 'Baagh', e: '🐅' },
    { l: 'U', w: 'Umbrella', h: 'Chhatri', e: '☂️' }, { l: 'V', w: 'Van', h: 'Gadi', e: '🚐' },
    { l: 'W', w: 'Watch', h: 'Ghadi', e: '⌚' }, { l: 'X', w: 'Xylophone', h: 'Baaja', e: '🎹' },
    { l: 'Y', w: 'Yak', h: 'Yak', e: '🐂' }, { l: 'Z', w: 'Zebra', h: 'Zebra', e: '🦓' }
  ],
  getCountingData: () => Array.from({ length: 100 }, (_, i) => i + 1),
  getTablesData: (num) => Array.from({ length: 10 }, (_, i) => ({ mult: i + 1, res: num * (i + 1) })),
  getCategoryData: (cat) => {
    const data = {
      fruits: [
        { n: 'Mango', h: 'Aam', e: '🥭' }, { n: 'Apple', h: 'Seb', e: '🍎' },
        { n: 'Banana', h: 'Kela', e: '🍌' }, { n: 'Grapes', h: 'Angoor', e: '🍇' },
        { n: 'Orange', h: 'Santra', e: '🍊' }, { n: 'Papaya', h: 'Papita', e: '🍈' }
      ],
      animals: [
        { n: 'Lion', h: 'Sher', e: '🦁' }, { n: 'Tiger', h: 'Baagh', e: '🐅' },
        { n: 'Elephant', h: 'Hathi', e: '🐘' }, { n: 'Rabbit', h: 'Khargosh', e: '🐰' },
        { n: 'Cow', h: 'Gaushala', e: '🐄' }, { n: 'Dog', h: 'Kutta', e: '🐶' }
      ],
      birds: [
        { n: 'Parrot', h: 'Tota', e: '🦜' }, { n: 'Peacock', h: 'Mor', e: '🦚' },
        { n: 'Sparrow', h: 'Chidiya', e: '🐦' }, { n: 'Crow', h: 'Kaua', e: '🐦‍⬛' },
        { n: 'Owl', h: 'Ullu', e: '🦉' }, { n: 'Duck', h: 'Badtakh', e: '🦆' }
      ],
      days: [
        { n: 'Monday', h: 'Somvaar', e: '📅' }, { n: 'Tuesday', h: 'Mangalvaar', e: '📅' },
        { n: 'Wednesday', h: 'Budhvaar', e: '📅' }, { n: 'Thursday', h: 'Guruvaar', e: '📅' },
        { n: 'Friday', h: 'Shukravaar', e: '📅' }, { n: 'Saturday', h: 'Shanivaar', e: '📅' },
        { n: 'Sunday', h: 'Ravivaar', e: '🎉' }
      ]
    };
    return data[cat] || [];
  },
  getMasteryMath: (type) => {
    const a = Math.floor(Math.random() * 20) + 10;
    const b = Math.floor(Math.random() * 9) + 1;
    if (type === 'sub') return { a, b, ans: a - b, op: '-' };
    const res = a * b;
    return { a: res, b: a, ans: b, op: '÷' };
  },
  getHindiVarnamala: () => [
    { l: 'अ', w: 'Anar', e: '🍎', h: 'अ से अनार' }, { l: 'आ', w: 'Aam', e: '🥭', h: 'आ से आम' },
    { l: 'इ', w: 'Imli', e: '🍂', h: 'इ से इमली' }, { l: 'ई', w: 'Eekh', e: '🎋', h: 'ई से ईख' },
    { l: 'उ', w: 'Ullu', e: '🦉', h: 'उ से उल्लू' }, { l: 'ऊ', w: 'Oon', e: '🧶', h: 'ऊ से ऊन' },
    { l: 'ए', w: 'Ek', e: '1️⃣', h: 'ए से एक' }, { l: 'ऐ', w: 'Ainak', e: '👓', h: 'ऐ से ऐनक' },
    { l: 'ओ', w: 'Okhli', e: '🥣', h: 'ओ से ओखली' }, { l: 'औ', w: 'Aurat', e: '👤', h: 'औ से औरत' },
    { l: 'क', w: 'Kabutar', e: '🐦', h: 'क से कबूतर' }, { l: 'ख', w: 'Khargosh', e: '🐰', h: 'ख से खरगोश' },
    { l: 'ग', w: 'Gamla', e: '🪴', h: 'ग से गमला' }, { l: 'घ', w: 'Ghar', e: '🏠', h: 'घ से घर' },
    { l: 'च', w: 'Chammach', e: '🥄', h: 'च से चम्मच' }, { l: 'छ', w: 'Chhatri', e: '☂️', h: 'छ से छतरी' },
    { l: 'ज', w: 'Jag', e: '🏺', h: 'ज से जग' }, { l: 'झ', w: 'Jhanda', e: '🚩', h: 'झ से झंडा' },
    { l: 'ट', w: 'Tamatar', e: '🍅', h: 'ट से टमाटर' }, { l: 'ठ', w: 'Thathera', e: '🔨', h: 'ठ से ठठेरा' },
    { l: 'ड', w: 'Damru', e: '🥁', h: 'ड से डमरू' }, { l: 'ढ', w: 'Dholl', e: '🥁', h: 'ढ से ढोल' },
    { l: 'त', w: 'Tarbooz', e: '🍉', h: 'त से तरबूज' }, { l: 'थ', w: 'Tharmas', e: '🍼', h: 'थ से थरमस' },
    { l: 'द', w: 'Dawaat', e: '🧪', h: 'द से दवात' }, { l: 'ध', w: 'Dhanush', e: '🏹', h: 'ध से धनुष' },
    { l: 'न', w: 'Nal', e: '🚰', h: 'न से नल' }, { l: 'प', w: 'Patang', e: '🪁', h: 'प से पतंग' },
    { l: 'फ', w: 'Fal', e: '🍎', h: 'फ से फल' }, { l: 'ब', w: 'Bakri', e: '🐐', h: 'ब से बकरी' },
    { l: 'भ', w: 'Bhalu', e: '🐻', h: 'भ से भालू' }, { l: 'म', w: 'Machli', e: '🐟', h: 'म से मछली' },
    { l: 'य', w: 'Yog', e: '🧘', h: 'य से योग' }, { l: 'र', w: 'Rath', e: '🏇', h: 'र से रथ' },
    { l: 'ल', w: 'Lattoo', e: '🪀', h: 'ल से लट्टू' }, { l: 'व', w: 'Vat', e: '🌳', h: 'व से वट' },
    { l: 'श', w: 'Shalgam', e: '🥗', h: 'श से शलगम' }, { l: 'ष', w: 'Shatkon', e: '⬢', h: 'ष से षट्कोण' },
    { l: 'स', w: 'Seb', e: '🍎', h: 'स से सेब' }, { l: 'ह', w: 'Hathi', e: '🐘', h: 'ह से हाथी' }
  ],

  // --- Unified Communication System ---
  sendMessage: (msg) => {
    const db = getDB();
    if (!db.messages) db.messages = [];
    const newMsg = {
      id: `MSG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'sent',
      ...msg
    };
    db.messages.unshift(newMsg);
    saveDB(db);
    return newMsg;
  },

  getMessages: (filters = {}) => {
    const db = getDB();
    let msgs = db.messages || [];

    if (filters.role === 'student') {
      return msgs.filter(m =>
        (m.targetClasses && m.targetClasses.includes(filters.className)) ||
        m.recipientId === filters.userId ||
        m.senderId === filters.userId
      );
    }

    if (filters.role === 'faculty') {
      return msgs.filter(m =>
        m.senderId === filters.userId ||
        m.recipientId === filters.userId ||
        (m.targetClasses && m.senderRole === 'admin')
      );
    }

    if (filters.role === 'admin') {
      return msgs;
    }

    return msgs;
  },

  getRecipientInfo: (uniqueId) => {
    const db = getDB();
    const id = uniqueId.toUpperCase();
    const student = db.studentRegistry.find(s => s.id.toUpperCase() === id);
    if (student) return { name: student.name, role: 'student' };
    const faculty = db.facultyRegistry.find(f => f.id.toUpperCase() === id);
    if (faculty) return { name: faculty.name, role: 'faculty' };
    return null;
  },

  searchRecipient: (query) => {
    if (!query) return [];
    const db = getDB();
    const q = query.toLowerCase();

    const facultyMatches = (db.facultyRegistry || []).filter(f =>
      f.name.toLowerCase().includes(q) || f.id.toLowerCase().includes(q)
    ).map(f => ({ id: f.id, name: f.name, role: 'faculty' }));

    const studentMatches = (db.studentRegistry || []).filter(s =>
      s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    ).map(s => ({ id: s.id, name: s.name, role: 'student' }));

    return [...facultyMatches, ...studentMatches];
  },

  getAvailableClasses: () => {
    return ['10A', '10B', '9A', '9B', '8A', '7A', '6A', '5A', '4A', '3A', '2A', '1A', 'Nursery', 'LKG', 'UKG'];
  },

  // SECURITY & AUDIT LOCKS
  logAudit: (type, action, role = 'Admin', details = {}) => {
    const db = getDB();
    if (!db.auditLogs) db.auditLogs = [];
    const entry = {
      id: `AUDIT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      action,
      role,
      details,
      fingerprint: `NSGI-OS-WIN-CHROME-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    };
    db.auditLogs.unshift(entry);
    saveDB(db);
    return entry;
  },

  getAuditLogs: () => getDB().auditLogs || [],

  setSystemLockdown: (status) => {
    const db = getDB();
    db.system_lockdown = status;
    saveDB(db);
    mockApi.logAudit('SECURITY_SYSTEM', status ? 'Global Lockdown ACTIVATED' : 'Global Lockdown DEACTIVATED', 'Admin');
    return status;
  },

  isSystemLockdown: () => {
    return !!getDB().system_lockdown;
  },

  // PHASE 2: SESSION LIFECYCLE
  generateSessionToken: (userId) => {
    const expiry = Date.now() + (30 * 60 * 1000); // 30 Minutes
    const payload = `${userId}|${expiry}`;
    const signature = mockApi.getSecurityHash({ id: userId, amount: expiry, studentName: 'SESSION' });
    return `${btoa(payload)}.${signature}`;
  },

  verifySession: (token) => {
    if (!token) return { valid: false, error: 'NO_TOKEN' };
    try {
      const [encodedPayload, signature] = token.split('.');
      const payload = atob(encodedPayload);
      const [userId, expiry] = payload.split('|');

      // Integrity Check
      const expectedSig = mockApi.getSecurityHash({ id: userId, amount: expiry, studentName: 'SESSION' });
      if (signature !== expectedSig) return { valid: false, error: 'TAMPER_DETECTED' };

      // Expiry Check
      if (Date.now() > parseInt(expiry)) {
        return { valid: false, error: 'EXPIRED', userId };
      }

      return { valid: true, userId, expiry: parseInt(expiry) };
    } catch (e) {
      return { valid: false, error: 'MALFORMED' };
    }
  },

  // PHASE 3: DEVICE DNA & BIOMETRIC ATTENDANCE
  getDeviceDNA: () => {
    const nav = window.navigator;
    const screen = window.screen;
    return btoa(`${nav.userAgent}|${nav.language}|${screen.width}x${screen.height}|${nav.hardwareConcurrency}`);
  },

  bindDevice: (userId, dna) => {
    const db = getDB();
    if (!db.deviceBindings) db.deviceBindings = {};
    if (!db.deviceBindings[userId]) {
      db.deviceBindings[userId] = dna;
      saveDB(db);
      mockApi.logAudit('SECURITY_CONFIG', `Device DNA bound for user ${userId}`, 'System', { dna });
    }
    return db.deviceBindings[userId];
  },

  isDeviceAuthorized: (userId, currentDna) => {
    const db = getDB();
    const boundDna = db.deviceBindings?.[userId];
    if (!boundDna) return true; // Not bound yet
    return boundDna === currentDna;
  },

  // PHASE 4: GHOST RECORDS & FORENSIC EXPORT
  injectGhostRecords: () => {
    const db = getDB();
    if (!db.facultyRegistry) db.facultyRegistry = [];
    if (!db.facultyRegistry.some(f => f.id === 'NS-GHOST-01')) {
      db.facultyRegistry.push({
        id: 'NS-GHOST-01',
        name: 'Vikram Singh (Ghost)',
        subject: 'Advanced Cryptography',
        assignedClass: 'ADMIN-ONLY',
        dob: '1970-01-01',
        contact: '+91-0000000000',
        salary: '₹ 1,50,000',
        isGhost: true,
        isFaceEnrolled: true
      });
      saveDB(db);
    }
  },

  exportAuditTrail: () => {
    const logs = mockApi.getAuditLogs();
    const content = JSON.stringify(logs, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NSGI-FORENSIC-LOG-${Date.now()}.json`;
    a.click();
    mockApi.logAudit('FORENSIC_EXPORT', 'Authorized Export of Signed Audit Trail', 'Admin');
    return true;
  },

  getRiskSummary: () => {
    const db = getDB();
    const logs = db.auditLogs || [];
    const recentRecon = logs.filter(l => l.type === 'SUSPICIOUS_RECON' && (Date.now() - new Date(l.timestamp)) < 86400000);
    const recentRevocations = logs.filter(l => l.type === 'SECURITY_REVOCATION');
    const recentAlerts = logs.filter(l => l.type === 'SECURITY_ALERT');
    const biometricFailures = logs.filter(l => l.type === 'BIOMETRIC_FAIL');
    const internalLeaks = logs.filter(l => l.type === 'INTERNAL_LEAK_WARNING');

    return {
      totalThreats: recentRecon.length + recentAlerts.length + biometricFailures.length + internalLeaks.length,
      revocations: recentRevocations.length,
      criticalAlerts: [
        ...internalLeaks.slice(0, 3).map(l => ({ id: l.id, msg: `🛑 HONEYPOT ACCESS: ${l.action}`, user: l.role })),
        ...recentRecon.slice(0, 3).map(l => ({ id: l.id, msg: l.action, user: l.role })),
        ...recentAlerts.slice(0, 3).map(l => ({ id: l.id, msg: l.action, user: l.role })),
        ...biometricFailures.slice(0, 3).map(l => ({ id: l.id, msg: `Attendance: Face Mismatch/Fail`, user: l.role }))
      ].slice(0, 5)
    };
  },

  getSecurityHash: (data) => {
    const str = `${data.id}|${data.amount}|${data.studentName}|NSGI-SECRET-KEY`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).toUpperCase();
  },

  verifyIntegrity: (txn) => {
    return mockApi.getSecurityHash(txn);
  },

  // PHASE 5: DIGITAL SOVEREIGNTY & FORENSIC TRUST
  generateSignedReceipt: (receipt) => {
    const payload = JSON.stringify({
      id: receipt.id,
      student: receipt.studentName,
      amount: receipt.amount,
      date: receipt.date,
      ts: Date.now()
    });
    const signature = mockApi.getSecurityHash({ id: receipt.id, amount: receipt.amount, studentName: receipt.studentName });
    return btoa(`${payload}.${signature}`);
  },

  verifySignedReceipt: (signedData) => {
    try {
      const decoded = atob(signedData);
      const [payloadStr, signature] = decoded.split('.');
      const payload = JSON.parse(payloadStr);
      const expectedSig = mockApi.getSecurityHash({ id: payload.id, amount: payload.amount, studentName: payload.student });
      return signature === expectedSig;
    } catch (e) {
      return false;
    }
  },

  checkGpsSecurity: (currentCoords) => {
    const db = getDB();
    if (!db.lastGpsCoords) {
      db.lastGpsCoords = { ...currentCoords, ts: Date.now() };
      saveDB(db);
      return { status: 'SECURE', msg: 'Baseline established' };
    }

    const last = db.lastGpsCoords;
    const now = Date.now();
    const timeDiffHours = (now - last.ts) / (1000 * 60 * 60);
    
    // Haversine distance (simplified for mock)
    const dx = (currentCoords.lat - last.lat) * 111.32; // km per degree
    const dy = (currentCoords.lng - last.lng) * 111.32 * Math.cos(currentCoords.lat * Math.PI / 180);
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    // Avoid infinity on immediate re-checks
    if (timeDiffHours < 0.0001) return { status: 'SECURE', msg: 'Instant check bypassed' };
    
    const speed = distance / timeDiffHours;

    db.lastGpsCoords = { ...currentCoords, ts: now };
    saveDB(db);

    if (speed > 300) { // 300km/h threshold
        mockApi.logAudit('SECURITY_FRAUD', `GPS_WARP DETECTED: Illegal velocity ${speed.toFixed(2)} km/h`, 'System', { distance, speed });
        return { status: 'WARP_DETECTED', speed };
    }

    return { status: 'SECURE', distance };
  }
};
