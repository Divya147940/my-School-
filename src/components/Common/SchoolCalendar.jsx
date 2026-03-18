import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './SchoolCalendar.css';

const SchoolCalendar = () => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const events = [
    { date: '2026-03-25', title: 'Term 2 Discussion (PTM)', type: 'exam' },
    { date: '2026-03-28', title: 'Annual Sports Day', type: 'event' },
    { date: '2026-04-10', title: 'Good Friday', type: 'holiday' },
    { date: '2026-04-14', title: 'Ambedkar Jayanti', type: 'holiday' },
  ];

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderDays = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const totalDays = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);
    const dayElements = [];

    // Blank spaces for previous month
    for (let i = 0; i < firstDay; i++) {
      dayElements.push(<div key={`blank-${i}`} className="calendar-day blank"></div>);
    }

    // Days of actual month
    for (let day = 1; day <= totalDays; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateString);
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

      dayElements.push(
        <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
          <span className="day-number">{day}</span>
          <div className="day-events">
            {dayEvents.map((e, idx) => (
              <div key={idx} className={`event-dot ${e.type}`} title={e.title}></div>
            ))}
          </div>
          {dayEvents.length > 0 && (
            <div className="event-tooltips">
               {dayEvents.map((e, idx) => (
                 <div key={idx} className={`event-tooltip ${e.type}`}>{e.title}</div>
               ))}
            </div>
          )}
        </div>
      );
    }

    return dayElements;
  };

  return (
    <div className={`school-calendar-container glass-panel ${theme === 'light' ? 'light-mode' : ''}`}>
      <div className="calendar-header">
        <button onClick={prevMonth} className="nav-btn">‹</button>
        <h2>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
        <button onClick={nextMonth} className="nav-btn">›</button>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="weekday-header">{d}</div>
        ))}
        {renderDays()}
      </div>

      <div className="calendar-legend">
        <div className="legend-item"><span className="dot exam"></span> Exams/PTM</div>
        <div className="legend-item"><span className="dot event"></span> School Events</div>
        <div className="legend-item"><span className="dot holiday"></span> Holidays</div>
      </div>
    </div>
  );
};

export default SchoolCalendar;
