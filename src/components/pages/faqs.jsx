// Import necessary React modules
import React, { useState } from 'react';

// Main App component
const Faqs = () => {
    // State to manage the menu visibility
    const [isMenuOpen, setMenuOpen] = useState(false);

    // Function to toggle the menu visibility
    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            <h1 className="heading"> Frequently asked Questions (FAQS)</h1>
            <div className="block rounded-lg bg-white p-6 shadow-[0_2px_25px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700" style={{ width: '150%' }}>
                <p>
                    <strong>QN: What is the Brain Tumor Detection System for Glioma Diagnosis?</strong><br /><br />
                    ANS: The Brain Tumor Detection system for Glioma Diagnosis is an advanced web-based software application designed to facilitate the early detection of gliomas, a type of brain tumor. It utilizes deep learning technology to analyze brain images uploaded by healthcare professionals, patients through a user-friendly web interface.
                </p>
            </div>
            <br /> <br />
            <div className="block rounded-lg bg-white p-6 shadow-[0_2px_25px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700" style={{ width: '150%' }}>
                <p>
                    <strong>QN: How does the system work?</strong><br /><br />
                    ANS: The system employs a trained deep learning model to process and analyze uploaded brain images. This model has been extensively trained on a diverse dataset of glioma images to ensure accurate detection. Users receive comprehensive analysis reports based on the system's findings.
                </p>
            </div><br />
            <div className="block rounded-lg bg-white p-6 shadow-[0_2px_25px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700" style={{ width: '150%' }}>
                <p>
                    <strong>QN:Who can use the system?</strong><br /><br />
                    ANS:Patients, healthcare professionals, including radiologists, neurologists, and oncologists, are the primary users of the system. They rely on it for accurate and timely glioma detection to aid in diagnosis and treatment planning.

                </p>
            </div>
            <br /> <br />
            <div className="block rounded-lg bg-white p-6 shadow-[0_2px_25px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700" style={{ width: '150%' }}>
                <p>
                    <strong>QN:Is the system easy to use?
                    </strong><br /><br />
                    ANS:Yes, the system features an intuitive web interface that makes it easy for healthcare professionals and patients to upload brain images and access analysis reports. It is designed for user-friendliness and seamless integration into existing clinical workflows.

                </p>
            </div> <br /> <br />
            <div className="block rounded-lg bg-white p-6 shadow-[0_2px_25px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700" style={{ width: '150%' }}>
                <p>
                    <strong>QN:How accurate is the system in detecting gliomas?

                    </strong><br /><br />
                    ANS:The system boasts high accuracy in glioma detection, thanks to its trained deep learning model and rigorous validation processes. Clinical studies have demonstrated its effectiveness in accurately identifying gliomas from brain images.


                </p>
            </div><br />
            <div className="block rounded-lg bg-white p-6 shadow-[0_2px_25px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700" style={{ width: '150%' }}>
                <p>
                    <strong>QN:Can the system be integrated into existing healthcare IT infrastructure?


                    </strong><br /><br />
                    ANS:Yes, the system is designed to integrate seamlessly with existing Picture Archiving and Communication Systems (PACS) or Electronic Health Record (EHR) systems commonly used in healthcare settings.



                </p>
            </div>
        </div>
    );
}

export default Faqs;