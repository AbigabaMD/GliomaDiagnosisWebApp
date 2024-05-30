// Import necessary React modules
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



// Main App component
const Faqs = () => {
    // State to manage the menu visibility
    const [isMenuOpen, setMenuOpen] = useState(false);

    // Function to toggle the menu visibility
    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    return (
        <div >
            <h1> Frequently asked Questions</h1>
            <br/>

            <p><p>QN:What is the Brain Tumor Detection System for Glioma Diagnosis?</p><br/>
            ANS:The Brain Tumor Detection system for Glioma Diagnosis is an advanced web-based software application designed to facilitate the early detection of gliomas, a type of brain tumor. It utilizes deep learning technology to analyze brain images uploaded by healthcare professionals through a user-friendly web interface.
                <br /> <br />
                <p style={{fontStyle:'bold'}}> QN:How does the system work?</p><br /> 
            ANS:The system employs a trained deep learning model to process and analyze uploaded brain images. This model has been extensively trained on a diverse dataset of glioma images to ensure accurate detection. Users receive comprehensive analysis reports based on the system's findings.
</p>
        </div>
    );
}

export default Faqs;
