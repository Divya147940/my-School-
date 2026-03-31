import React from 'react';
import './PrivacyPolicy.css'; // Reusing the same styling for consistency

const UserDataDeletion = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>User Data Deletion Policy</h1>
        <p className="last-updated">Last Updated: March 17, 2026</p>
        
        <section>
          <h2>1. Overview</h2>
          <p>
            We value your privacy and provide transparency on how you can request the deletion of your personal data collected through our website.
          </p>
        </section>

        <section>
          <h2>2. How to Request Deletion</h2>
          <p>
            If you wish to have your personal information (such as data submitted via admission or contact forms) removed from our records, please contact us via one of the following methods:
          </p>
          <ul>
            <li><strong>Email</strong>: Send a request to [Your School Email] with the subject line "Data Deletion Request".</li>
            <li><strong>Physical Request</strong>: Visit the school office at Laxman Ganj, Tiloi, Amethi.</li>
          </ul>
        </section>

        <section>
          <h2>3. Information Required</h2>
          <p>
            To verify your identity, we may ask for the following details:
          </p>
          <ul>
            <li>Full Name used in the submission.</li>
            <li>Email address or Phone number provided.</li>
            <li>Type of form submitted (Admission, Contact, etc.).</li>
          </ul>
        </section>

        <section>
          <h2>4. Processing Time</h2>
          <p>
            Upon receiving a valid request, we will process the deletion within 30 business days and provide a confirmation once completed.
          </p>
        </section>

        <section>
          <h2>5. Exceptions</h2>
          <p>
            Please note that we may retain certain data as required by law or for legitimate institutional purposes (e.g., academic records for enrolled students).
          </p>
        </section>
      </div>
    </div>
  );
};

export default UserDataDeletion;
