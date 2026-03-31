import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Common/Toaster';
import './SmartStore.css';

const SmartStore = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const products = [
        { id: 1, name: 'Winter Blazer (Formal)', price: 1200, category: 'Uniform', image: '🧥' },
        { id: 2, name: 'Sports Jersey Set', price: 850, category: 'Uniform', image: '👕' },
        { id: 3, name: 'Grade 10 Textbook Set', price: 2400, category: 'Books', image: '📚' },
        { id: 4, name: 'Geometry Box Pro', price: 450, category: 'Stationery', image: '📐' },
        { id: 5, name: 'NSGI School Bag (Durable)', price: 1500, category: 'Accessories', image: '🎒' }
    ];

    const [cart, setCart] = useState([]);
    const [view, setView] = useState('shop'); // 'shop' or 'orders'
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        if (view === 'orders') {
            const allOrders = mockApi.getOrders();
            setOrderHistory(allOrders.filter(o => o.studentId === user?.id));
        }
    }, [view, user]);

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const addToCart = (product) => {
        setCart([...cart, product]);
        addToast(`${product.name} added to cart`, 'info');
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;
        
        const order = {
            studentId: user?.id,
            studentName: user?.name,
            items: cart,
            total: total,
            status: 'Pending Verification'
        };

        mockApi.recordOrder(order);
        setCart([]);
        addToast("Order placed! Please submit payment at the school office.", "success");
        setView('orders');
    };

    return (
        <div className="store-container">
            <header className="store-header">
                <h2>🛒 NSGI Smart Store</h2>
                <div className="cart-summary">
                    <span>Items: {cart.length}</span>
                    <span className="total-amount">₹{total}</span>
                    {cart.length > 0 && <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>}
                </div>
            </header>

            <nav className="store-tabs">
                <button className={view === 'shop' ? 'active' : ''} onClick={() => setView('shop')}>Shop Catalog</button>
                <button className={view === 'orders' ? 'active' : ''} onClick={() => setView('orders')}>My Orders {orderHistory.length > 0 && `(${orderHistory.length})`}</button>
            </nav>

            {view === 'shop' ? (
                <div className="product-grid">
                    {products.map(p => (
                        <div className="product-card" key={p.id}>
                            <div className="product-img">{p.image}</div>
                            <div className="product-details">
                                <span className="p-cat">{p.category}</span>
                                <h4>{p.name}</h4>
                                <div className="p-bottom">
                                    <span className="p-price">₹{p.price}</span>
                                    <button onClick={() => addToCart(p)}>Add</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="orders-list">
                    {orderHistory.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {orderHistory.slice().reverse().map(order => (
                                <div key={order.id} className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ fontWeight: '800', color: 'var(--accent-blue)' }}>{order.id}</span>
                                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{new Date(order.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem' }}>
                                        {order.items.map(i => i.name).join(', ')}
                                    </div>
                                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '900' }}>₹{order.total}</span>
                                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid #f59e0b50' }}>{order.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-orders text-center">No orders placed yet. Orders will appear here after school verification.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SmartStore;
