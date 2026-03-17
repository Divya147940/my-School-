import React from 'react';

const Library = () => {
  const books = [
    { id: 1, title: 'Higher Engineering Mathematics', author: 'B.S. Grewal', status: 'Available', shelf: 'A-1' },
    { id: 2, title: 'Concept of Physics', author: 'H.C. Verma', status: 'Issued', borrower: 'Aman Gupta', returnDate: '2026-03-22' },
    { id: 3, title: 'Organic Chemistry', author: 'Morrison Boyd', status: 'Available', shelf: 'B-4' },
  ];

  return (
    <div className="library-module">
      <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '15px 20px' }}>Book Title</th>
              <th style={{ padding: '15px 20px' }}>Author</th>
              <th style={{ padding: '15px 20px' }}>Status</th>
              <th style={{ padding: '15px 20px' }}>Location/Borrower</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 20px' }}>{book.title}</td>
                <td style={{ padding: '15px 20px' }}>{book.author}</td>
                <td style={{ padding: '15px 20px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '10px', 
                    fontSize: '0.8rem', 
                    background: book.status === 'Available' ? '#10b98120' : '#f59e0b20', 
                    color: book.status === 'Available' ? '#10b981' : '#f59e0b' 
                  }}>
                    {book.status}
                  </span>
                </td>
                <td style={{ padding: '15px 20px', fontSize: '0.9rem', color: '#94a3b8' }}>
                  {book.status === 'Available' ? `Shelf: ${book.shelf}` : `${book.borrower} (Return: ${book.returnDate})`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Library;
