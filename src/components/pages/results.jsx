import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '../../supabase/client'; // Ensure this path is correct
import '../../assets/styles/results.css';

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

            // Transform data to include formatted diagnosisDate
            const patientsWithFormattedDate = data.map(patient => ({
                ...patient,
                diagnosisDate: new Date(patient.diagnosisDate).toLocaleDateString()
            }));

            setPatients(patientsWithFormattedDate);
        } catch (error) {
            console.error('Error fetching patient details:', error);
        }
    };

    useEffect(() => {
        fetchPatientDetails();
    }, []);

    const downloadPDF = async (patient) => {
        const doc = new jsPDF();
        const margin = 20;
        const lineHeight = 10;
        doc.setDrawColor(0, 0, 255); // Blue color
        doc.setFontSize(12);

        // Title
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 255); // Blue color
        doc.setFont('helvetica', 'bold');
        doc.text('Glioma Diagnosis Report', margin, lineHeight);
        doc.setLineWidth(0.5);
        doc.line(margin, lineHeight + 1, margin + 105, lineHeight + 1); // Underline under the title
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Reset color

        // Patient Information
        doc.setTextColor(0, 0, 255); // Blue color
        doc.setFont('helvetica', 'bold');
        doc.text('Patient Details:', margin, lineHeight * 3);
        doc.setTextColor(0, 0, 0); // Reset color

        doc.setFont('helvetica', 'normal');
        doc.text(`Full Name: ${patient.Full_name}`, margin, lineHeight * 4);
        doc.text(`Age: ${patient.Age}`, margin, lineHeight * 5);
        doc.text(`Gender: ${patient.Gender}`, margin, lineHeight * 6);
        doc.text(`Address: ${patient.Address}`, margin, lineHeight * 7);
        doc.text(`Phone Number: ${patient.Telephone_Number}`, margin, lineHeight * 8);

        // Diagnosis Details
        doc.setTextColor(0, 0, 255); // Blue color
        doc.setFont('helvetica', 'bold');
        doc.text('Diagnosis Details:', margin, lineHeight * 10);
        doc.setTextColor(0, 0, 0); // Reset color
        doc.setFont('helvetica', 'normal');
        doc.text(`Diagnosis Date: ${new Date().toLocaleDateString()}`, margin, lineHeight * 11);
        doc.text(`Tumor: ${patient.diagnosis}`, margin, lineHeight * 12);

        // Treatment Plan
        if (patient.diagnosis === 'glioma_tumor') {
            doc.setTextColor(0, 0, 255); // Blue color
            doc.setFont('helvetica', 'bold');
            doc.text('Treatment Plan for Glioma Brain Tumor Patient:', margin, lineHeight * 14);
            doc.setTextColor(0, 0, 0); // Reset color
            doc.setFont('helvetica', 'bold');

            doc.text('Surgery:', margin, lineHeight * 15);
            doc.setTextColor(0, 0, 0); // Reset color
            doc.setFont('helvetica', 'normal');
            doc.text('- Type of Surgery: Craniotomy with partial tumor resection.', margin, lineHeight * 16);
            doc.text('- Complications: Risk of bleeding, infection, and neurological deficits.', margin, lineHeight * 17);

            doc.setFont('helvetica', 'bold');
            doc.text('Radiation Therapy:', margin, lineHeight * 19);
            doc.setTextColor(0, 0, 0); // Reset color
            doc.setFont('helvetica', 'normal');
            doc.text('- Type of Radiation: External beam radiation therapy (EBRT).', margin, lineHeight * 20);
            doc.text('- Dose and Fractionation: Total dose of 60 Gy in 30 fractions.', margin, lineHeight * 21);
            doc.text('- Targeted Area: Whole brain.', margin, lineHeight * 22);
            doc.text('- Side Effects: Fatigue, hair loss, and potential cognitive changes.', margin, lineHeight * 23);

            doc.setFont('helvetica', 'bold');
            doc.text('Chemotherapy:', margin, lineHeight * 25);
            doc.setTextColor(0, 0, 0); // Reset color
            doc.setFont('helvetica', 'normal');
            doc.text('- Chemotherapy Drugs: Temozolomide (Temodar).', margin, lineHeight * 26);
            doc.text('- Schedule: Daily for 5 days every 28 days.', margin, lineHeight * 27);
            doc.text('- Side Effects: Nausea, fatigue, and increased risk of infection.', margin, lineHeight * 28);
            doc.text('- Monitoring: Regular blood tests and imaging scans to monitor treatment response.', margin, lineHeight * 29);

            doc.setFont('helvetica', 'bold');
            doc.text('Follow-Up and Monitoring:', margin, lineHeight * 31);
            doc.setTextColor(0, 0, 0); // Reset color
            doc.setFont('helvetica', 'normal');
            doc.text('- MRI every 3 months to assess tumor response and recurrence.', margin, lineHeight * 32);
            doc.text('- Neurological assessment at each follow-up visit.', margin, lineHeight * 33);
            doc.text('- Supportive care for managing symptoms and side effects.', margin, lineHeight * 34);

            doc.setTextColor(0, 0, 255); // Blue color
            doc.setFont('helvetica', 'bold');
            doc.text('Patient Education:', margin, lineHeight * 36);
            doc.setTextColor(0, 0, 0); // Reset color
            doc.setFont('helvetica', 'normal');
            doc.text('- Provide information on managing symptoms, including pain management and nutritional support.', margin, lineHeight * 37);
            doc.text('- Resources for psychological support and counseling.', margin, lineHeight * 38);

            doc.setTextColor(0, 0, 0); // Reset color
            doc.text('This treatment plan will be tailored to the patient\'s specific condition and may be adjusted based on treatment response and side effects.', margin, lineHeight * 40);
        } else {
            doc.setTextColor(0, 0, 255); // Blue color
            doc.setFont('helvetica', 'bold');
            doc.text('Treatment Plan:', margin, lineHeight * 14);
            doc.setTextColor(0, 0, 0); // Reset color
            doc.setFont('helvetica', 'normal');
            doc.text(`Surgery: ${patient.surgeryDetails ? patient.surgeryDetails : 'Not needed'}`, margin, lineHeight * 15);
            doc.text(`Radiation Therapy: ${patient.radiationTherapy ? patient.radiationTherapy : 'Not needed'}`, margin, lineHeight * 16);
            doc.text(`Chemotherapy: ${patient.chemotherapy ? patient.chemotherapy : 'Not needed'}`, margin, lineHeight * 17);

            doc.setFont('helvetica', 'bold');
            doc.text('Follow-Up and Monitoring:', margin, lineHeight * 19);
            doc.setTextColor(0, 0, 0); // Reset color
            doc.setFont('helvetica', 'normal');
            doc.text(`Follow-Up Schedule: ${patient.followUpSchedule ? patient.followUpSchedule : 'Not needed'}`, margin, lineHeight * 20);
            doc.text(`Monitoring Plan: ${patient.monitoringPlan ? patient.monitoringPlan : 'Not needed'}`, margin, lineHeight * 21);

            doc.setFont('helvetica', 'bold');
            doc.text('Patient Education:', margin, lineHeight * 23);
            doc.setTextColor(0, 0, 0); // Reset color
            doc.setFont('helvetica', 'normal');
            doc.text(`Information on Glioma: ${patient.educationInfo}`, margin, lineHeight * 24, { maxWidth: 180 });
            doc.text(`Tips for Managing Symptoms: ${patient.managementTips}`, margin, lineHeight * 25, { maxWidth: 180 });
            doc.text(`Additional Resources: ${patient.additionalResources}`, margin, lineHeight * 26, { maxWidth: 180 });
        }

        // Replace spaces and commas in patient's full name with underscores for filename
        const fullNameForFilename = patient.Full_name.replace(/[\s,]/g, '_');
        const filename = `diagnosis_results_${fullNameForFilename}.pdf`;

        doc.save(filename);
    };


    return (
        <div className='results-card'>
        

            <div className="textAttributes">
                {patients.map((patient, index) => (
                    <div
                        key={index}
                       
                    >
                        <h2 className="results-title">Patient Details</h2>
                        <p><strong>Full Name:</strong> {patient.Full_name}</p>
                        <p><strong>Age:</strong> {patient.Age}</p>
                        <p><strong>Gender:</strong> {patient.Gender}</p>
                        <p><strong>Address:</strong> {patient.Address}</p>
                        <p><strong>Phone Number:</strong> {patient.Telephone_Number}</p>
                        <p><strong>Diagnosis Date:</strong> {new Date().toLocaleDateString()}</p>
                        <p><strong> Tumor: </strong> {patient.diagnosis}</p>
                      

                        <hr className="my-3" />
                        <div>
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
