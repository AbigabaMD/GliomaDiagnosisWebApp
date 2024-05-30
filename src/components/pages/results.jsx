// Import necessary React modules
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons'; // Added the download icon
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Main Results component
const Results = ({ diagnosisResults }) => {
    // State to manage the menu visibility
    const [isMenuOpen, setMenuOpen] = useState(false);

    // Function to toggle the menu visibility
    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    // Function to download results as PDF
    const downloadPDF = () => {
        const input = document.getElementById('results-content');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgWidth = 210;
                const pageHeight = 297;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save('diagnosis_results.pdf');
            });
    };

    return (
        <div className="app">
            {/* Menu button */}
            <div className="menu-button" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faDownload} size="2x" />
            </div>

            {/* Menu content */}
            {isMenuOpen && (
                <div className="menu-content">
                    <button onClick={downloadPDF}>Download as PDF</button>
                </div>
            )}

            {/* Results content */}
            <div id="results-content" className="results-content">
                <h1>Diagnosis Results</h1>
                {/* Display diagnosis results */}
                <p>{diagnosisResults}</p>
            </div>
        </div>
    );
};

export default Results;
