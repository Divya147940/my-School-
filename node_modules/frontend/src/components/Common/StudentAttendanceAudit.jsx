import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useToast } from '../Common/Toaster';

const StudentAttendanceAudit = ({ initialStudentId = '', viewMode = 'admin' }) => {
    const { addToast } = useToast();
    const [searchId, setSearchId] = useState(initialStudentId);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('All');
    const [selectedYear, setSelectedYear] = useState('All');
    const [selectedWeek, setSelectedWeek] = useState('All');

    useEffect(() => {
        if (initialStudentId) {
            handleSearch();
        }
    }, [initialStudentId]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (!searchId) return;

        setLoading(true);
        const result = mockApi.getStudentAttendanceAudit(searchId);
        
        if (result) {
            setData(result);
        } else {
            addToast("Student not found with this ID.", "error");
            setData(null);
        }
        setLoading(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present': return '#10b981';
            case 'Absent': return '#f43f5e';
            case 'Late': return '#f59e0b';
            case 'Leave': return '#3b82f6';
            default: return 'var(--text-secondary)';
        }
    };

    return (
        <div className="student-attendance-audit">
            {viewMode !== 'student' && viewMode !== 'parent' && (
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', marginBottom: '30px' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '800' }}>🔍 Search Attendance Audit</h3>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px' }}>
                        <input 
                            type="text" 
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="Enter Student ID (e.g. STU2026-001)" 
                            style={{ flex: 1, padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', fontSize: '1rem' }}
                        />
                        <button type="submit" disabled={loading} style={{ padding: '0 30px', borderRadius: '12px', background: 'var(--accent-blue)', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'FETCHING...' : 'AUDIT REPORT'}
                        </button>
                    </form>
                </div>
            )}

            {data && (
                <div style={{ animation: 'fadeIn 0.5s ease' }}>
                    <div style={{ marginBottom: '25px', padding: '0 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: '#fff' }}>
                                {data.student.name} <span style={{ color: 'var(--accent-blue)', opacity: 0.8, fontSize: '1.2rem' }}>#{data.student.id}</span>
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0' }}>Class: {data.student.class} | Roll No: {data.student.rollNo}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: parseFloat(data.stats.rate) > 75 ? '#10b981' : '#f43f5e' }}>{data.stats.rate}%</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>OVERALL ATTENDANCE</div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        <div className="admin-card" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>TOTAL DAYS</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>{data.stats.totalDays}</div>
                        </div>
                        <div className="admin-card" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold' }}>PRESENT</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>{data.stats.presentDays}</div>
                        </div>
                        <div className="admin-card" style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                            <div style={{ fontSize: '0.8rem', color: '#f43f5e', fontWeight: 'bold' }}>ABSENT</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>{data.stats.absentDays}</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
                        {/* Daily History */}
                        <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h4 style={{ margin: '0', fontSize: '1.2rem' }}>📅 Daily Attendance Log</h4>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select 
                                        value={selectedMonth} 
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        style={{ padding: '8px 12px', borderRadius: '8px', background: '#1e293b', border: '1px solid var(--glass-border)', color: '#fff' }}
                                    >
                                        <option value="All">All Months</option>
                                        {Array.from({ length: 12 }, (_, i) => {
                                            const monthName = new Date(0, i).toLocaleString('default', { month: 'long' });
                                            const monthNum = String(i + 1).padStart(2, '0');
                                            return <option key={monthNum} value={monthNum}>{monthName}</option>;
                                        })}
                                    </select>
                                    <select 
                                        value={selectedYear} 
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        style={{ padding: '8px 12px', borderRadius: '8px', background: '#1e293b', border: '1px solid var(--glass-border)', color: '#fff' }}
                                    >
                                        <option value="All">All Years</option>
                                        {[2024, 2025, 2026, 2027, 2028].map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                    <select 
                                        value={selectedWeek} 
                                        onChange={(e) => setSelectedWeek(e.target.value)}
                                        style={{ padding: '8px 12px', borderRadius: '8px', background: '#1e293b', border: '1px solid var(--glass-border)', color: '#fff' }}
                                    >
                                        <option value="All">All Weeks</option>
                                        <option value="1">Week 1 (1-7)</option>
                                        <option value="2">Week 2 (8-14)</option>
                                        <option value="3">Week 3 (15-21)</option>
                                        <option value="4">Week 4 (22-28)</option>
                                        <option value="5">Week 5 (29-31)</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Day</th>
                                            <th>Status</th>
                                            <th>Entry Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            let filteredHistory = data.history.slice().reverse();
                                            if (selectedYear !== 'All') {
                                                filteredHistory = filteredHistory.filter(entry => entry.date.startsWith(selectedYear));
                                            }
                                            if (selectedMonth !== 'All') {
                                                filteredHistory = filteredHistory.filter(entry => entry.date.split('-')[1] === selectedMonth);
                                            }
                                            if (selectedWeek !== 'All') {
                                                filteredHistory = filteredHistory.filter(entry => {
                                                    const day = parseInt(entry.date.split('-')[2], 10);
                                                    if (selectedWeek === '1') return day >= 1 && day <= 7;
                                                    if (selectedWeek === '2') return day >= 8 && day <= 14;
                                                    if (selectedWeek === '3') return day >= 15 && day <= 21;
                                                    if (selectedWeek === '4') return day >= 22 && day <= 28;
                                                    if (selectedWeek === '5') return day >= 29 && day <= 31;
                                                    return true;
                                                });
                                            }

                                            return filteredHistory.length > 0 ? filteredHistory.map((entry, idx) => {
                                                const d = new Date(entry.date);
                                                return (
                                                    <tr key={idx}>
                                                        <td style={{ fontWeight: '600' }}>{entry.date}</td>
                                                        <td style={{ color: 'var(--text-secondary)' }}>{d.toLocaleDateString('default', { weekday: 'long' })}</td>
                                                        <td>
                                                            <span style={{ 
                                                                padding: '4px 12px', 
                                                                borderRadius: '20px', 
                                                                fontSize: '0.75rem', 
                                                                fontWeight: 'bold',
                                                                background: `${getStatusColor(entry.status)}20`,
                                                                color: getStatusColor(entry.status),
                                                                border: `1px solid ${getStatusColor(entry.status)}40`
                                                            }}>
                                                                {entry.status.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td style={{ fontSize: '0.85rem' }}>{entry.time || '08:00 AM'}</td>
                                                    </tr>
                                                );
                                            }) : (
                                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No records available for this selected period.</td></tr>
                                            );
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Monthly Summary Removed */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentAttendanceAudit;
