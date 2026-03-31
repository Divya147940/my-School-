import React from 'react';
import './PrivacyPolicy.css'; // Reusing the same styling for consistency

const TermsConditions = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>Terms & Conditions</h1>
        <p className="last-updated">Last Updated: March 17, 2026</p>
        
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the website of Shri Jageshwar Memorial Educational Institute, you agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using our services.
          </p>
        </section>

        <section>
          <h2>2. Use of Content</h2>
          <p>
            All content on this website, including text, images, logos, and academic resources, is the property of the Institute and is protected by copyright laws. You may not reproduce or distribute this content without prior written permission.
          </p>
        </section>

        <section>
          <h2>3. Admission Process</h2>
          <p>
            Submission of an admission form does not guarantee admission. The final decision rests with the school administration based on eligibility criteria and available slots.
          </p>
        </section>

        <section>
          <h2>4. User Conduct</h2>
          <p>
            Users are prohibited from using the website for any unlawful purposes or in a way that could damage, disable, or impair our services.
          </p>
        </section>

        <section>
          <h2>5. Limitation of Liability</h2>
          <p>
            While we strive for accuracy, the Institute is not liable for any errors or omissions in the content provided on the website. Use of any information is at your own risk.
          </p>
        </section>

        <section>
          <h2>6. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of India.
          </p>
        </section>

        <section>
          <h2>7. Updates to Terms</h2>
          <p>
            We reserve the right to update these Terms and Conditions at any time. Changes will be effective immediately upon posting.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;
