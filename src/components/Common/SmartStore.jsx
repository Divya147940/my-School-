import React, { useState } from 'react';
import './SmartStore.css';

const SmartStore = () => {
    const products = [
        { id: 1, name: 'Winter Blazer (Formal)', price: 1200, category: 'Uniform', image: '🧥' },
        { id: 2, name: 'Sports Jersey Set', price: 850, category: 'Uniform', image: '👕' },
        { id: 3, name: 'Grade 10 Textbook Set', price: 2400, category: 'Books', image: '📚' },
        { id: 4, name: 'Geometry Box Pro', price: 450, category: 'Stationery', image: '📐' },
        { id: 5, name: 'NSGI School Bag (Durable)', price: 1500, category: 'Accessories', image: '🎒' }
    ];

    const [cart, setCart] = useState([]);
    const [view, setView] = useState('shop'); // 'shop' or 'orders'

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const addToCart = (product) => {
        setCart([...cart, product]);
    };

    return (
        <div className="store-container">
            <header className="store-header">
                <h2>🛒 NSGI Smart Store</h2>
                <div className="cart-summary">
                    <span>Items: {cart.length}</span>
                    <span className="total-amount">₹{total}</span>
                    {cart.length > 0 && <button className="checkout-btn">Checkout</button>}
                </div>
            </header>

            <nav className="store-tabs">
                <button className={view === 'shop' ? 'active' : ''} onClick={() => setView('shop')}>Shop Catalog</button>
                <button className={view === 'orders' ? 'active' : ''} onClick={() => setView('orders')}>My Orders</button>
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
                    <p className="no-orders text-center">No orders placed yet. Orders will appear here after school verification.</p>
                </div>
            )}
        </div>
    );
};

export default SmartStore;
