import React, { useState } from 'react';
import './NotificationSystem.css';

const mockNotifications = [
  { id: 1, type: 'info', message: 'Annual Sports Meet starts this Monday!', time: '2 hours ago', unread: true },
  { id: 2, type: 'alert', message: 'Assignment: Physics Project due in 2 days.', time: '5 hours ago', unread: true },
  { id: 3, type: 'success', message: 'Monthly Fee Payment Received. Thank you!', time: '1 day ago', unread: false },
  { id: 4, type: 'update', message: 'New study material added to E-Learning Hub.', time: '2 days ago', unread: false },
];

const NotificationSystem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="notification-wrapper">
      <button className="notification-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <>
          <div className="notification-overlay" onClick={() => setIsOpen(false)}></div>
          <div className="notification-dropdown glass-panel">
            <div className="notification-header">
              <h3>Notifications</h3>
              {unreadCount > 0 && <button onClick={markAllRead}>Mark all read</button>}
            </div>
            
            <div className="notification-list">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <div key={n.id} className={`notification-item ${n.unread ? 'unread' : ''}`}>
                    <div className={`notification-dot ${n.type}`}></div>
                    <div className="notification-content">
                      <p className="notification-msg">{n.message}</p>
                      <span className="notification-time">{n.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="notification-empty">No new notifications</div>
              )}
            </div>
            
            <div className="notification-footer">
              <button>View All Notifications</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationSystem;
