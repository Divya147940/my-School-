# NSGI School Management Ecosystem

Welcome to the **NSGI Group of Institutions** digital platform—a comprehensive, enterprise-grade school management system designed for a seamless educational experience.

## 🚀 Key Features

### 🏢 Four Integrated Portals
- **Admin Portal**: Fee management, staff payroll, leave approvals, and institutional oversight.
- **Faculty Portal**: Digital attendance, homework assignments, exam entry, and digital diaries.
- **Student Portal**: Academic tracking, homework submission, results, and resource access.
- **Parent Portal**: Real-time ward monitoring, fee payments, and automated absence/fee alerts.

### ✨ Enterprise Pro Features
- **Global Command Palette (Ctrl + K)**: Lightning-fast navigation across all dashboards.
- **Print Optimization**: Professional CSS-styled Fee Receipts and Report Cards.
- **Smart Automation**: Automatic parent notifications for absences and pending fees.
- **Premium UI**: Dark-mode glassmorphism design with full mobile responsiveness.

## 🛠️ Technical Stack
- **Frontend**: React.js, Vite, Vanilla CSS.
- **State Management**: Shared `mockApi` using `localStorage` for real-time inter-portal communication.
- **Backend (API Ready)**: Node.js, Express, PostgreSQL (Schema implemented in `server/setup.js`).

## 🏃 How to Run

### Frontend
```bash
cd my-School--main
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
npm start
```

## 📂 Project Structure
- `/src/pages`: Main portal dashboards and landing pages.
- `/src/components`: Modular UI elements (Attendance, Payroll, Results, etc.).
- `/src/utils`: `mockApi.js` for simulated database interaction.
- `/server`: Database schema and API endpoints.

---
*Built with ❤️ for NSGI Group of Institutions.*
