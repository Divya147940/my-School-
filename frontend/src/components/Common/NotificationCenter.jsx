import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './NotificationCenter.css';

const NotificationCenter = ({ isOpen, onClose }) => {
    const { theme } = useTheme();
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Exam Schedule Out', message: 'Final term exams start from April 15th.', type: 'alert', time: '2 hours ago', read: false },
        { id: 2, title: 'Fee Reminder', message: 'Monthly tuition fees for March are due.', type: 'info', time: '1 day ago', read: true },
        { id: 3, title: 'Library Book Due', message: 'Please return "Introduction to Physics" by Friday.', type: 'warning', time: '3 days ago', read: false },
        { id: 4, title: 'New Achievement', message: 'Congratulations! You won the Inter-school Debate.', type: 'success', time: '1 week ago', read: true }
    ]);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    if (!isOpen) return null;

    return (
        <div className={`notification-sidebar ${theme === 'light' ? 'light-mode' : ''} ${isOpen ? 'open' : ''}`}>
            <div className="notification-header">
                <h3>Notifications</h3>
                <div className="header-actions">
                    <button onClick={markAllRead}>Mark all read</button>
                    <button className="close-notif" onClick={onClose}>×</button>
                </div>
            </div>
            
            <div className="notification-list">
                {notifications.map(notif => (
                    <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'} ${notif.type}`}>
                        <div className="notif-icon">
                            {notif.type === 'alert' && '🚨'}
                            {notif.type === 'info' && 'ℹ️'}
                            {notif.type === 'warning' && '⚠️'}
                            {notif.type === 'success' && '🌟'}
                        </div>
                        <div className="notif-content">
                            <h4>{notif.title}</h4>
                            <p>{notif.message}</p>
                            <span>{notif.time}</span>
                        </div>
                        {!notif.read && <div className="unread-dot"></div>}
                    </div>
                ))}
            </div>
            <div className="notification-footer">
                <button>View All Activity</button>
            </div>
        </div>
    );
};

export default NotificationCenter;
