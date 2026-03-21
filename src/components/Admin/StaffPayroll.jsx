import React, { useState } from 'react';

const StaffPayroll = () => {
  const [payrollStatus, setPayrollStatus] = useState([
    { id: 1, name: 'Divyanshi', role: 'Teacher', salary: 45000, status: 'Processed' },
    { id: 2, name: 'Sunil Singh', role: 'Driver', salary: 18000, status: 'Pending' },
    { id: 3, name: 'Raj Kumar', role: 'Peon', salary: 12000, status: 'Processed' },
  ]);

  const [selectedStaff, setSelectedStaff] = useState(null);

  const processSalary = (id) => {
    setPayrollStatus(prev => prev.map(s => s.id === id ? { ...s, status: 'Processed' } : s));
    alert('Salary processed successfully!');
  };

  return (
    <div className="staff-payroll">
      <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
              <th style={{ padding: '15px' }}>Staff Name</th>
              <th style={{ padding: '15px' }}>Designation</th>
              <th style={{ padding: '15px' }}>Monthly CTC</th>
              <th style={{ padding: '15px' }}>Status</th>
              <th style={{ padding: '15px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {payrollStatus.map(mem => (
              <tr key={mem.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px' }}>{mem.name}</td>
                <td style={{ padding: '15px' }}>{mem.role}</td>
                <td style={{ padding: '15px' }}>₹{mem.salary}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: 600,
                    background: mem.status === 'Processed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: mem.status === 'Processed' ? '#10b981' : '#f59e0b'
                  }}>
                    {mem.status}
                  </span>
                </td>
                <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => setSelectedStaff(mem)}
                    style={{ padding: '6px 15px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: 'none', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    📄 View Slip
                  </button>
                  {mem.status === 'Pending' && (
                    <button 
                      onClick={() => processSalary(mem.id)}
                      style={{ padding: '6px 15px', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Process
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStaff && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1e293b', padding: '40px', borderRadius: '24px', maxWidth: '500px', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <h2 style={{ margin: 0 }}>Salary Pay Slip</h2>
              <button onClick={() => setSelectedStaff(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '20px' }}>
              <p><b>Staff Name:</b> {selectedStaff.name}</p>
              <p><b>Designation:</b> {selectedStaff.role}</p>
              <p><b>Month:</b> {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
            </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Basic Pay</span>
                <span>₹{Math.round(selectedStaff.salary * 0.7)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>HRA + Allowances</span>
                <span>₹{Math.round(selectedStaff.salary * 0.3)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold' }}>
                <span>Net Payable</span>
                <span style={{ color: '#10b981' }}>₹{selectedStaff.salary}</span>
              </div>
            <button style={{ width: '100%', padding: '15px', borderRadius: '12px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              Download PDF Receipt
            </button>
          </div>
        </div>
      )}

      <button style={{ marginTop: '25px', padding: '12px 30px', borderRadius: '12px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
        Generate Bulk Payroll
      </button>
    </div>
  );
};

export default StaffPayroll;
