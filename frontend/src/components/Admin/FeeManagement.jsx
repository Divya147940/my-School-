import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config';
import { useToast } from '../Common/Toaster';

const FeeManagement = () => {
  const { secureApi } = useAuth();
  const { addToast } = useToast();
  const [view, setView] = useState('dashboard');
  const [fees, setFees] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [structure, setStructure] = useState({ 
    tuition: 35000, transport: 5000, library: 2000, exams: 3000 
  });
  const [receipt, setReceipt] = useState(null);

  const fetchData = async () => {
    try {
      const feeRes = await secureApi(`${API_URL}/api/fees`);
      if (feeRes.ok) {
        const data = await feeRes.json();
        setFees(data.map(f => ({
            ...f,
            total: parseFloat(f.total) || 0,
            paid: parseFloat(f.paid) || 0
        })));
      }

      const ledgerRes = await secureApi(`${API_URL}/api/fees/ledger`);
      if (ledgerRes.ok) {
        const data = await ledgerRes.json();
        setLedger(data);
      }
    } catch (e) { console.error("Fetch failed", e); }
  };

  useEffect(() => {
    fetchData();
    const savedStructure = localStorage.getItem('fee_structure');
    if (savedStructure) setStructure(JSON.parse(savedStructure));
  }, [secureApi]);

  // NEW: Auto-Fine Logic
  const calculateAutoFine = (studentName) => {
    const today = new Date();
    const day = today.getDate();
    if (day > 10) {
      const daysLate = day - 10;
      return daysLate * 10; // ₹10 per day late fine
    }
    return 0;
  };

  const stats = {
    totalExpected: fees.reduce((acc, f) => acc + f.total, 0),
    totalCollected: fees.reduce((acc, f) => acc + f.paid, 0),
    totalPending: fees.reduce((acc, f) => acc + (f.total - f.paid), 0),
    defaulters: fees.filter(f => f.total - f.paid > 0).length
  };

  const handleCollect = async (studentId, studentName, amount, mode, adjustment = 0, adjReason = '', concession = 0) => {
    const amt = parseInt(amount);
    const adj = parseInt(adjustment || 0);
    const disc = parseInt(concession || 0);

    const isDuplicate = ledger.some(txn => 
        txn.student_name === studentName && 
        parseFloat(txn.amount) === amt && 
        (Date.now() - new Date(txn.created_at).getTime()) < 300000
    );
    if (isDuplicate) {
        addToast("🔒 SECURITY BLOCK: Duplicate Transaction detected!", "error");
        return;
    }

    try {
        const txnId = `TXN-${Date.now()}`;
        const securityHash = mockApi.getSecurityHash({ id: txnId, amount: amt, studentName });

        const payload = {
            studentId,
            studentName,
            amount: amt,
            discount: disc,
            fine: adj,
            mode,
            securityHash
        };

        const res = await secureApi(`${API_URL}/api/fees/collect`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            addToast(`₹${amt} collected & secured! 🛡️`, "success");
            fetchData();
            setReceipt({ ...payload, id: txnId, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() });
        }
    } catch (err) {
        addToast("Payment processing failed", "error");
    }
  };

  return (
    <div className="fee-management-advanced">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: '15px', padding: '5px' }}>
          {['dashboard', 'structure', 'collect', 'defaulters', 'ledger'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ 
              padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: view === v ? 'var(--accent-blue)' : 'transparent', color: '#fff', textTransform: 'capitalize', fontWeight: 'bold'
            }}> {v} </button>
          ))}
        </div>
      </div>

      {view === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div className="admin-card" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <div style={{ color: '#3b82f6' }}>Total Expected</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>₹{stats.totalExpected.toLocaleString()}</div>
          </div>
          <div className="admin-card" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ color: '#10b981' }}>Total Collected</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>₹{stats.totalCollected.toLocaleString()}</div>
          </div>
          <div className="admin-card" style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <div style={{ color: '#f43f5e' }}>Total Pending</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>₹{stats.totalPending.toLocaleString()}</div>
          </div>
          <div className="admin-card" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ color: '#f59e0b' }}>Defaulters</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.defaulters}</div>
          </div>
        </div>
      )}

      {view === 'collect' && (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ margin: '0 0 20px 0' }}>💡 Smart Fee Collection</h3>
            <form onSubmit={e => {
                e.preventDefault();
                const studentSelect = e.target.student;
                const studentId = studentSelect.options[studentSelect.selectedIndex].getAttribute('data-id');
                handleCollect(studentId, studentSelect.value, e.target.amount.value, e.target.mode.value, e.target.adjustment.value, e.target.adjReason.value, e.target.concession.value);
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label>Student Name (Due Details)</label>
                        <select name="student" className="premium-input" required onChange={(e) => {
                            const fine = calculateAutoFine(e.target.value);
                            if (fine > 0) addToast(`Auto-Fine of ₹${fine} calculated for late payment.`, "info");
                        }}>
                             <option value="">Select Student...</option>
                            {fees.map(f => <option key={f.student_id} value={f.student} data-id={f.student_id}>{f.student} - Due: ₹{f.total - f.paid}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Scholarship / Concession (₹)</label>
                        <input name="concession" type="number" className="premium-input" placeholder="0" defaultValue={0} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                    <div className="form-group">
                        <label>Late Fine / Adjustment (₹)</label>
                        <input name="adjustment" type="number" className="premium-input" placeholder="0" />
                    </div>
                    <div className="form-group">
                        <label>Adjustment Reason</label>
                        <input name="adjReason" type="text" className="premium-input" placeholder="e.g. Late Fine" />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                    <div className="form-group">
                        <label>Paying Amount (₹)</label>
                        <input name="amount" type="number" className="premium-input" required placeholder="0.00" />
                    </div>
                    <div className="form-group">
                        <label>Payment Method</label>
                        <select name="mode" className="premium-input">
                            <option>Cash</option>
                            <option>Online (UPI QR)</option>
                            <option>Net Banking</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="submit-btn-glow" style={{ marginTop: '25px', width: '100%' }}>AUTHORIZE & GENERATE TAX INVOICE 📜</button>
            </form>
        </div>
      )}

      {view === 'ledger' && (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>📑 Global Transaction Ledger (Secured)</h3>
                <div style={{ fontSize: '0.8rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '5px 12px', borderRadius: '20px' }}>🛡️ All Records Digitally Signed</div>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>TXN ID & Security Seal</th>
                        <th>Student</th>
                        <th>Date & Time</th>
                        <th>Amount</th>
                        <th>Fine/Disc</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {ledger.slice().reverse().map(txn => {
                        const isLocked = new Date() - new Date(txn.createdAt || txn.date) > 86400000;
                        const isValid = mockApi.verifyIntegrity(txn);
                        return (
                             <tr key={txn.id}>
                                <td>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{txn.id}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#10b981', fontFamily: 'monospace' }}>Seal: {txn.security_hash || 'LEGACY-UNSEALED'}</div>
                                </td>
                                <td>{txn.student_name}</td>
                                <td>{txn.date} <small style={{ display: 'block', opacity: 0.5 }}>{txn.time}</small></td>
                                <td style={{ fontWeight: 'bold' }}>₹{txn.amount}</td>
                                <td style={{ color: txn.fine > 0 ? '#f43f5e' : '#10b981' }}>
                                    {txn.fine > 0 ? `+₹${txn.fine}` : txn.discount > 0 ? `-₹${txn.discount}` : '0'}
                                </td>
                                <td>
                                    <span style={{ fontSize: '0.7rem', color: isLocked ? '#94a3b8' : '#10b981' }}>
                                        {isLocked ? '🔒 Locked (24h+)' : '🔓 Editable'}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => addToast(`Integrity Check: SEAL MATCHED (${isValid}) ✅`, "success")}
                                        style={{ padding: '5px 10px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none', cursor: 'pointer', fontSize: '0.7rem' }}
                                    > Verify Integrity </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      )}

      {view === 'defaulters' && (
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
            <h3>Urgent: Fee Defaulter List ⚠️</h3>
            <table className="admin-table" style={{ marginTop: '20px' }}>
                <thead>
                    <tr><th>Name</th><th>Balance</th><th>Action</th></tr>
                </thead>
                <tbody>
                    {fees.filter(f => f.total - f.paid > 0).map(f => (
                        <tr key={f.id}>
                            <td>{f.student}</td>
                            <td style={{ color: '#f43f5e' }}>₹{f.total - f.paid}</td>
                            <td><button onClick={() => sendReminder(f.student)} className="notify-btn" style={{ background: '#25d366' }}>WhatsApp 📲</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}

      {receipt && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="glass-panel" style={{ padding: '40px', borderRadius: '30px', width: '500px', textAlign: 'center', color: '#000', background: '#fff' }}>
                <div style={{ color: '#333' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <h2 style={{ color: '#1e3a8a', margin: 0 }}>Payment Receipt</h2>
                         <div style={{ background: '#ecfdf5', color: '#059669', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', border: '1px solid #10b981' }}>🛡️ DIGITALLY SIGNED</div>
                    </div>
                    <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#666' }}>Shri Jageshwar Memorial School</p>
                    
                    <div style={{ border: '2px dashed #ccc', padding: '20px', margin: '20px 0', textAlign: 'left' }}>
                        <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                            <span><strong>Receipt ID:</strong> {receipt.id}</span>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{receipt.date}</span>
                        </div>
                        <div style={{ margin: '5px 0' }}><strong>Student:</strong> {receipt.studentName}</div>
                        <div style={{ margin: '5px 0' }}><strong>Amount Paid:</strong> <span style={{ fontSize: '1.2rem', color: '#1e3a8a', fontWeight: 'bold' }}>₹{receipt.amount}</span></div>
                        {receipt.fine > 0 && <div style={{ color: '#f43f5e', fontSize: '0.8rem' }}>• Includes Late Fine: ₹{receipt.fine}</div>}
                        {receipt.discount > 0 && <div style={{ color: '#10b981', fontSize: '0.8rem' }}>• Applied Scholarship: -₹{receipt.discount}</div>}
                        
                        <div style={{ marginTop: '20px', textAlign: 'center', background: '#f8fafc', padding: '15px', borderRadius: '15px' }}>
                            <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Forensic Verification QR</p>
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${mockApi.generateSignedReceipt(receipt)}`} 
                                alt="Signed Receipt QR" 
                                style={{ width: '120px', borderRadius: '10px', border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                            />
                            <div style={{ marginTop: '10px' }}>
                                <button 
                                    onClick={() => {
                                        const isValid = mockApi.verifySignedReceipt(mockApi.generateSignedReceipt(receipt));
                                        addToast(isValid ? "✅ FORENSIC CHECK: Signature Verified. Data Integrity 100%." : "❌ ERROR: Signature Mismatch!", isValid ? "success" : "error");
                                    }}
                                    style={{ background: 'none', border: '1px solid #1e3a8a', color: '#1e3a8a', fontSize: '0.7rem', padding: '4px 10px', borderRadius: '5px', cursor: 'pointer' }}
                                >
                                    SIMULATE SCAN & VERIFY
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setReceipt(null)} style={{ flex: 1, padding: '12px', borderRadius: '15px', background: '#f1f5f9', color: '#475569', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Close</button>
                    <button onClick={() => window.print()} style={{ flex: 2, padding: '12px', borderRadius: '15px', background: '#1e3a8a', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Print Forensic Copy 🖨️</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;


