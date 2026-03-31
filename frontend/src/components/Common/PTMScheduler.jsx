import React, { useState } from 'react';
import './PTMScheduler.css';

const PTMScheduler = ({ userType = 'parent' }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);
    const [isBooked, setIsBooked] = useState(false);

    const slots = [
        '09:00 AM - 09:15 AM',
        '09:15 AM - 09:30 AM',
        '10:00 AM - 10:15 AM',
        '10:15 AM - 10:30 AM',
        '11:00 AM - 11:15 AM'
    ];

    const handleBooking = (e) => {
        e.preventDefault();
        if (!selectedDate || !selectedSlot) return;

        const newBooking = {
            id: Date.now(),
            date: selectedDate,
            slot: selectedSlot,
            teacher: 'Mr. Verma (Math)',
            status: 'Confirmed'
        };

        setBookedSlots([newBooking, ...bookedSlots]);
        setIsBooked(true);
        setTimeout(() => setIsBooked(false), 3000);
    };

    return (
        <div className="ptm-container">
            <header className="ptm-header">
                <h2>🗓️ Virtual PTM Scheduler</h2>
                <p>Book a 15-minute slot with subject teachers for academic discussion.</p>
            </header>

            <div className="ptm-layout">
                <div className="booking-form-card">
                    <h3>Book an Appointment</h3>
                    <form onSubmit={handleBooking}>
                        <div className="ptm-input-group">
                            <label>Select Date</label>
                            <input 
                                type="date" 
                                required 
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                            />
                        </div>
                        <div className="ptm-input-group">
                            <label>Select Teacher</label>
                            <select required>
                                <option>Mr. Verma (Mathematics)</option>
                                <option>Mrs. Sharma (Science)</option>
                                <option>Mr. Singh (English)</option>
                            </select>
                        </div>
                        <div className="slots-grid">
                            {slots.map(slot => (
                                <button 
                                    key={slot} 
                                    type="button"
                                    className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                                    onClick={() => setSelectedSlot(slot)}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                        <button type="submit" className="confirm-booking-btn">
                            {isBooked ? '✅ Booking Confirmed!' : 'Confirm Meeting'}
                        </button>
                    </form>
                </div>

                <div className="upcoming-ptm-card">
                    <h3>Your Scheduled Meetings</h3>
                    {bookedSlots.length === 0 ? (
                        <div className="no-ptm">No upcoming PTM meetings scheduled.</div>
                    ) : (
                        <div className="ptm-list">
                            {bookedSlots.map(ptm => (
                                <div className="ptm-item" key={ptm.id}>
                                    <div className="ptm-date-box">
                                        <span className="p-day">{new Date(ptm.date).getDate()}</span>
                                        <span className="p-month">{new Date(ptm.date).toLocaleString('default', { month: 'short' })}</span>
                                    </div>
                                    <div className="ptm-details">
                                        <h4>Meeting with {ptm.teacher}</h4>
                                        <p>🕒 {ptm.slot}</p>
                                        <span className="ptm-status-badge">{ptm.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PTMScheduler;
