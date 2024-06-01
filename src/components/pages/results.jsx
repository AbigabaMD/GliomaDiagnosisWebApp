import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '../../supabase/client'; // Ensure this path is correct

const Results = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [patients, setPatients] = useState([]);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const CDNURL = 'https://nfxmgafcnppcpgbjkmyd.supabase.co/storage/v1/object/public/images/';

    const fetchPatientDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('Patients_Reg')
                .select('*');

            if (error) {
                throw error;
            }

            console.log('Fetched patient data:', data);

            const patientsWithImages = await Promise.all(data.map(async (patient) => {
                if (patient.imageUrl) {
                    try {
                        const { data: imageData, error: urlError } = await supabase
                            .storage
                            .from('images')
                            .getPublicUrl(patient.imageUrl);

                        if (urlError) {
                            throw urlError;
                        }

                        console.log('Generated public URL:', imageData.publicUrl);

                        // Update patient.imageUrl with correct URL
                        patient.imageUrl = imageData.publicUrl;
                    } catch (error) {
                        console.error('Error getting public URL:', error);
                    }
                }
                return patient;
            }));

            console.log('Patients with image URLs:', patientsWithImages);

            setPatients(patientsWithImages);
        } catch (error) {
            console.error('Error fetching patient details:', error);
        }
    };

    useEffect(() => {
        fetchPatientDetails();
    }, []);

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
        <div className="app bg-gray-100 min-h-screen p-4">
            <div className="menu-button fixed top-4 right-4">
                <button
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                    onClick={toggleMenu}
                >
                    <FontAwesomeIcon icon={faDownload} size="2x" />
                </button>
            </div>

            {isMenuOpen && (
                <div className="menu-content fixed top-16 right-4 bg-white shadow-lg rounded-lg p-4">
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                        onClick={downloadPDF}
                    >
                        Download as PDF
                    </button>
                </div>
            )}

            <div id="results-content" className="results-content mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.map((patient, index) => (
                    <div
                        key={index}
                        className="patient-data bg-white shadow-md rounded-lg p-4"
                    >
                        <h2 className="text-lg font-semibold mb-2">Patient Details</h2>
                        <p><strong>Full Name:</strong> {patient.Full_name}</p>
                        <p><strong>Age:</strong> {patient.Age}</p>
                        <p><strong>Gender:</strong> {patient.Gender}</p>
                        <p><strong>Address:</strong> {patient.Address}</p>
                        <p><strong>Phone Number:</strong> {patient.Telephone_Number}</p>
                        <p><strong>Diagnosis:</strong> {patient.diagnosis}</p>
                        {patient.imageUrl && (
                            <img src={patient.imageUrl} alt="Uploaded Patient" className="patient-image mt-4 mb-2 rounded-lg" style={{ maxWidth: '100%' }} />
                        )}
                        <hr className="my-4" />
                        <div className="flex justify-end">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">View Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Results;
