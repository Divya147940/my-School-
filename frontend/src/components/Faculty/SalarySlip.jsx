import React, { useState } from 'react';
import './SalarySlip.css';

const SalarySlip = () => {
    const [selectedMonth, setSelectedMonth] = useState('March 2026');
    
    const salaryData = {
        basic: 45000,
        hra: 12000,
        conveyance: 3000,
        special: 5000,
        pf: 5400,
        tax: 2500,
        insurance: 1000
    };

    const grossSalary = salaryData.basic + salaryData.hra + salaryData.conveyance + salaryData.special;
    const deductions = salaryData.pf + salaryData.tax + salaryData.insurance;
    const netSalary = grossSalary - deductions;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="payroll-container no-print">
            <header className="payroll-header">
                <div>
                    <h2>💳 Faculty Payroll & Slips</h2>
                    <p style={{ color: '#94a3b8' }}>View and download your monthly salary breakdown.</p>
                </div>
                <div className="payroll-actions">
                    <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                        <option>March 2026</option>
                        <option>February 2026</option>
                        <option>January 2026</option>
                    </select>
                    <button className="download-slip-btn" onClick={handlePrint}>Download Slip</button>
                </div>
            </header>

            <div className="salary-overview-grid">
                <div className="salary-card gross">
                    <label>Gross Salary</label>
                    <p>₹{grossSalary.toLocaleString()}</p>
                </div>
                <div className="salary-card deduction">
                    <label>Total Deductions</label>
                    <p>₹{deductions.toLocaleString()}</p>
                </div>
                <div className="salary-card net">
                    <label>Net Take Home</label>
                    <p>₹{netSalary.toLocaleString()}</p>
                </div>
            </div>

            <div className="slip-preview-card print-only-slip">
                <div className="slip-brand">
                    <div className="brand-logo">NSGI</div>
                    <div className="brand-info">
                        <h3>NSGI Group of Institutions</h3>
                        <p>Salary Statement for {selectedMonth}</p>
                    </div>
                </div>
                
                <div className="slip-details-table">
                    <div className="slip-grid-section">
                        <h4>EARNINGS</h4>
                        <div className="slip-row"><span>Basic Pay</span> <span>₹{salaryData.basic.toLocaleString()}</span></div>
                        <div className="slip-row"><span>H.R.A</span> <span>₹{salaryData.hra.toLocaleString()}</span></div>
                        <div className="slip-row"><span>Conveyance</span> <span>₹{salaryData.conveyance.toLocaleString()}</span></div>
                        <div className="slip-row"><span>Special Allowance</span> <span>₹{salaryData.special.toLocaleString()}</span></div>
                        <div className="slip-row total"><span>Total Earnings</span> <span>₹{grossSalary.toLocaleString()}</span></div>
                    </div>

                    <div className="slip-grid-section">
                        <h4>DEDUCTIONS</h4>
                        <div className="slip-row"><span>P.F. Contribution</span> <span>₹{salaryData.pf.toLocaleString()}</span></div>
                        <div className="slip-row"><span>Professional Tax</span> <span>₹{salaryData.tax.toLocaleString()}</span></div>
                        <div className="slip-row"><span>Health Insurance</span> <span>₹{salaryData.insurance.toLocaleString()}</span></div>
                        <div className="slip-row total"><span>Total Deductions</span> <span>₹{deductions.toLocaleString()}</span></div>
                    </div>
                </div>

                <div className="slip-footer">
                    <div className="net-pay-box">
                        <label>Net Salary Payable</label>
                        <h3>₹{netSalary.toLocaleString()}</h3>
                    </div>
                    <p className="words">** (Rupees Fifty-Eight Thousand One Hundred Only) **</p>
                </div>
            </div>
        </div>
    );
};

export default SalarySlip;
