import React, { useState } from 'react';
import '../../assets/styles/FAQs.css';

const Faqs = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    return (
        <div className="faq-container">
            <h1 className='FAQS-title'> Frequently Asked Questions (FAQs)</h1>
            <div className='textAttributes'>
                <p>
                    <strong>QN: 1. What is Glioma and why is early detection important?</strong><br /><br />
                    <strong>Answer:</strong> Glioma is a type of tumor that occurs in the brain and spinal cord. Early detection of Glioma is crucial as it allows for timely intervention, which can significantly improve treatment outcomes and increase the chances of survival. Early detection can help in managing symptoms and slowing the progression of the disease.
                </p>
            </div>
            <div className='textAttributes'>
                <p>
                    <strong>QN: 2. How does the Glioma detection system work?</strong><br /><br />
                    <strong>Answer:</strong> Our system utilizes advanced imaging techniques combined with artificial intelligence (AI) algorithms to analyze brain scans. By processing MRI and CT images, our system can identify and classify Gliomas with high accuracy. The AI algorithms are trained on a vast dataset of brain images, allowing them to detect even subtle signs of tumors that might be missed by the human eye.
                </p>
            </div>
            <div className='textAttributes'>
                <p>
                    <strong>QN 3: Can the system differentiate between different types of brain tumors?</strong><br /><br />
                    <strong>Answer:</strong> Yes, our system is designed to differentiate between various types of brain tumors, including specifically Glioma, Meningioma, and pituitary tumor.
                </p>
            </div>
            <div className='textAttributes'>
                <p>
                    <strong>QN 4. How does the system ensure patient data privacy and security?</strong><br /><br />
                    <strong>Answer:</strong> Patient data privacy and security are our top priorities. Our system complies with all relevant data protection regulations, including HIPAA (Health Insurance Portability and Accountability Act). It uses advanced encryption methods to secure data at rest and in transit, ensuring that patient information is protected at all times. Additionally, no patient is able to view details and diagnosis results of another patient.
                </p>
            </div>
        </div>
    );
}

export default Faqs;
