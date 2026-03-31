import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useAuth } from '../../context/AuthContext';
import './DocumentVault.css';

const DocumentVault = () => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        if (user?.id) {
            setDocuments(mockApi.getDocuments(user.id));
        }
    }, [user]);

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
