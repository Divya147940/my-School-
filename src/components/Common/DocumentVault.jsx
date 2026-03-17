import React from 'react';
import './DocumentVault.css';

const DocumentVault = () => {
    const documents = [
        { id: 1, name: 'Academic Report Card - Term 1', type: 'PDF', date: 'Dec 2025', size: '1.2 MB' },
        { id: 2, name: 'Character Certificate', type: 'PDF', date: 'Jan 2026', size: '0.8 MB' },
        { id: 3, name: 'Fee Clearance Certificate', type: 'PDF', date: 'Feb 2026', size: '0.4 MB' },
        { id: 4, name: 'School Admission Form', type: 'PDF', date: 'April 2025', size: '2.5 MB' }
    ];

    const handleDownload = (name) => {
        alert(`Starting download for: ${name}\n\nThis is a simulation. Actual PDF files will be downloaded in the production environment.`);
    };

    return (
        <div className="vault-container">
            <header className="vault-header">
                <div>
                    <h2>📂 Digital Document Vault</h2>
                    <p>Access and download all your official school documents securely.</p>
                </div>
                <div className="vault-stats">
                    Total Files: {documents.length}
                </div>
            </header>

            <div className="doc-list">
                {documents.map(doc => (
                    <div className="doc-item" key={doc.id}>
                        <div className="doc-icon">📑</div>
                        <div className="doc-details">
                            <h4>{doc.name}</h4>
                            <p>{doc.date} • {doc.size}</p>
                        </div>
                        <div className="doc-actions">
                            <button className="view-btn">View</button>
                            <button className="dl-btn" onClick={() => handleDownload(doc.name)}>Download</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="vault-footer">
                <p>💡 Documents are verified and uploaded by the Registrar's Office.</p>
            </div>
        </div>
    );
};

export default DocumentVault;
