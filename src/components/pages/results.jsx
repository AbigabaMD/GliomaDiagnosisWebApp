import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '../../supabase/client'; // Ensure this path is correct
import '../../assets/styles/home.css';

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

    const downloadPDF = (patient) => {
        const doc = new jsPDF();
        const margin = 20;
        const lineHeight = 10;

        doc.setFontSize(12);

        // Title
        doc.setFontSize(16);
        doc.text('Glioma Diagnosis Report', margin, lineHeight);
        doc.setFontSize(12);

        // Patient Information
        doc.text(`Full Name: ${patient.Full_name}`, margin, lineHeight * 3);
        doc.text(`Age: ${patient.Age}`, margin, lineHeight * 4);
        doc.text(`Gender: ${patient.Gender}`, margin, lineHeight * 5);
        doc.text(`Address: ${patient.Address}`, margin, lineHeight * 6);
        doc.text(`Phone Number: ${patient.Telephone_Number}`, margin, lineHeight * 7);

        // Diagnosis Details
        doc.text('Diagnosis Details:', margin, lineHeight * 9);
        doc.text(`Diagnosis Date: ${patient.diagnosisDate}`, margin, lineHeight * 10);
        doc.text(`Glioma Type: ${patient.gliomaType}`, margin, lineHeight * 11);
        doc.text(`Tumor Location: ${patient.tumorLocation}`, margin, lineHeight * 12);
        doc.text(`Tumor Size: ${patient.tumorSize}`, margin, lineHeight * 13);
        doc.text('Imaging Results:', margin, lineHeight * 14);
        doc.text(`${patient.imagingResults}`, margin, lineHeight * 15, { maxWidth: 180 });

        // Symptoms
        doc.text('Symptoms:', margin, lineHeight * 17);
        doc.text(`${patient.symptoms}`, margin, lineHeight * 18, { maxWidth: 180 });

        // Pathology Report
        doc.text('Pathology Report:', margin, lineHeight * 20);
        doc.text(`Biopsy Results: ${patient.biopsyResults}`, margin, lineHeight * 21);
        doc.text(`Histopathological Findings: ${patient.histopathologicalFindings}`, margin, lineHeight * 22);
        doc.text(`Molecular Markers: ${patient.molecularMarkers}`, margin, lineHeight * 23);

        // Treatment Plan
        doc.text('Treatment Plan:', margin, lineHeight * 25);
        doc.text(`Surgery: ${patient.surgeryDetails}`, margin, lineHeight * 26);
        doc.text(`Radiation Therapy: ${patient.radiationTherapy}`, margin, lineHeight * 27);
        doc.text(`Chemotherapy: ${patient.chemotherapy}`, margin, lineHeight * 28);
        doc.text(`Targeted Therapy: ${patient.targetedTherapy}`, margin, lineHeight * 29);

        // Follow-Up and Monitoring
        doc.text('Follow-Up and Monitoring:', margin, lineHeight * 31);
        doc.text(`Follow-Up Schedule: ${patient.followUpSchedule}`, margin, lineHeight * 32);
        doc.text(`Monitoring Plan: ${patient.monitoringPlan}`, margin, lineHeight * 33);
        doc.text(`Rehabilitation Services: ${patient.rehabilitationServices}`, margin, lineHeight * 34);

        // Medications
        doc.text('Medications:', margin, lineHeight * 36);
        doc.text(`Current Medications: ${patient.currentMedications}`, margin, lineHeight * 37);

        // Supportive Care
        doc.text('Supportive Care:', margin, lineHeight * 39);
        doc.text(`Pain Management: ${patient.painManagement}`, margin, lineHeight * 40);
        doc.text(`Nutritional Support: ${patient.nutritionalSupport}`, margin, lineHeight * 41);
        doc.text(`Psychological Support: ${patient.psychologicalSupport}`, margin, lineHeight * 42);

        // Prognosis and Outcomes
        doc.text('Prognosis and Outcomes:', margin, lineHeight * 44);
        doc.text(`Prognosis: ${patient.prognosis}`, margin, lineHeight * 45);
        doc.text(`Expected Outcomes: ${patient.expectedOutcomes}`, margin, lineHeight * 46);

        // Patient Education
        doc.text('Patient Education:', margin, lineHeight * 48);
        doc.text(`Information on Glioma: ${patient.educationInfo}`, margin, lineHeight * 49, { maxWidth: 180 });
        doc.text(`Tips for Managing Symptoms: ${patient.managementTips}`, margin, lineHeight * 50, { maxWidth: 180 });
        doc.text(`Additional Resources: ${patient.additionalResources}`, margin, lineHeight * 51, { maxWidth: 180 });

        // Patient Image
        if (patient.imageUrl) {
            html2canvas(document.querySelector(`#patient-image-${patient.id}`)).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                doc.addImage(imgData, 'PNG', margin, lineHeight * 53, 150, 75);
                doc.save('diagnosis_results.pdf');
            });
        } else {
            doc.save('diagnosis_results.pdf');
        }
    };

    return (
        <div className="app bg-gray-100 min-h-screen p-4">
           
          

            <div id="results-content" >
                {patients.map((patient, index) => (
                    <div
                        key={index}
                        className="patient-data bg-white shadow-md rounded-lg p-4" style={{ marginBottom: '20px' }}
                    >
                        <h2 className="text-lg font-semibold mb-2">Diagnosis Results</h2>
                        <p><strong>Full Name:</strong> {patient.Full_name}</p>
                        <p><strong>Age:</strong> {patient.Age}</p>
                        <p><strong>Gender:</strong> {patient.Gender}</p>
                        <p><strong>Address:</strong> {patient.Address}</p>
                        <p><strong>Phone Number:</strong> {patient.Telephone_Number}</p>
                        <p><strong>Diagnosis:</strong> {patient.diagnosis}</p>
                        {patient.imageUrl && (
                            <img id={`patient-image-${patient.id}`} src={patient.imageUrl} alt="Uploaded Patient" className="patient-image mt-4 mb-2 rounded-lg" style={{ maxWidth: '100%' }} />
                        )}
                        <hr className="my-4" />
                        <div className="flex justify-end">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                onClick={() => downloadPDF(patient)}
                            >
                                Get Full Report
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Results;