import React, { useState, useEffect } from 'react';

const ParentFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      // Using studentId=1 for demo purposes
      const response = await fetch('http://localhost:5001/api/fees/1');
      const data = await response.json();
      setFees(data);
    } catch (err) {
      console.error('Error fetching fees:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (feeId, amount) => {
    const res = await loadRazorpay();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    // Create order on backend
    const orderRes = await fetch('http://localhost:5001/api/fees/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feeId, amount }),
    });
    const orderData = await orderRes.json();

    const options = {
      key: "rzp_test_v7X4vUfExnL9uX", // Test Key
      amount: orderData.amount,
      currency: orderData.currency,
      name: "My School",
      description: `Monthly Fee Payment`,
      order_id: orderData.id,
      handler: async (response) => {
        const verifyRes = await fetch('http://localhost:5001/api/fees/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            feeId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.status === 'success') {
          alert('Payment Successful!');
          fetchFees();
        } else {
          alert('Payment verification failed!');
        }
      },
      prefill: {
        name: "Aman Gupta",
        email: "aman@example.com",
        contact: "9876543210",
      },
      theme: { color: "#3b82f6" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if (loading) return <div>Loading fees...</div>;

  const unpaidFee = fees.find(f => f.status === 'Unpaid');

  return (
    <div className="parent-fees">
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h3 style={{ marginTop: 0 }}>Fee History</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                <th style={{ padding: '15px 10px' }}>Month</th>
                <th style={{ padding: '15px 10px' }}>Amount</th>
                <th style={{ padding: '15px 10px' }}>Status</th>
                <th style={{ padding: '15px 10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {fees.map(fee => (
                <tr key={fee.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '15px 10px' }}>{fee.month} {fee.year}</td>
                  <td style={{ padding: '15px 10px' }}>₹{fee.amount}</td>
                  <td style={{ padding: '15px 10px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '10px', 
                      background: fee.status === 'Paid' ? '#10b98120' : '#ef444420', 
                      color: fee.status === 'Paid' ? '#10b981' : '#ef4444', 
                      fontSize: '0.8rem' 
                    }}>
                      {fee.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    {fee.status === 'Unpaid' ? (
                      <button 
                        onClick={() => handlePayment(fee.id, fee.amount)}
                        style={{ background: '#3b82f6', border: 'none', color: '#fff', padding: '6px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}
                      >
                        Pay Now
                      </button>
                    ) : (
                      <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.9rem' }}>⬇ Receipt</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          {!unpaidFee ? (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✅</div>
              <h3>All Dues Cleared</h3>
              <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Thank you! Your ward's school fees are up to date for this session.</p>
            </>
          ) : (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💰</div>
              <h3>Pending Dues</h3>
              <p style={{ color: '#94a3b8', marginBottom: '20px' }}>You have pending fees for {unpaidFee.month} {unpaidFee.year}.</p>
              <button 
                onClick={() => handlePayment(unpaidFee.id, unpaidFee.amount)}
                style={{ padding: '12px 30px', borderRadius: '12px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Pay ₹{unpaidFee.amount} Now
              </button>
            </>
          )}
          <button style={{ marginTop: '15px', padding: '10px 20px', background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>View Full Statement</button>
        </div>
      </div>
    </div>
  );
};

export default ParentFees;
