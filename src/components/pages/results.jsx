import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../supabase/client';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import '../../assets/styles/results.css';

const Results = ({ onNewRecordAdded }) => {
    const { user } = useAuth();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, [user]);

    const fetchResults = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('Patients_Reg')
                .select('id, Full_name, Age, Gender, Address, Telephone_Number, diagnosis')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            setResults(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching results:', error.message);
            setLoading(false);
        }
    };

    const generatePDF = async (patient) => {
        try {
            console.log('Generating PDF for:', patient.Full_name, 'Diagnosis:', patient.diagnosis);

            // Check for 'glioma_tumor' in the diagnosis
            if (patient.diagnosis.toLowerCase().trim().includes('glioma_tumor')) {
                const gliomaInfo = await fetchGliomaInfo(patient.id);
                patient.gliomaInfo = gliomaInfo;
                console.log('Glioma info fetched:', gliomaInfo);
            }

            const MyDocument = () => (
                <Document>
                    <Page style={styles.page}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Diagnosis Results</Text>
                        </View>
                        <View style={styles.body}>
                            <View style={styles.result}>
                                <Text style={styles.name}>{patient.Full_name}'s Diagnosis</Text>
                                <Text style={styles.info}><Text style={styles.label}>Age:</Text> {patient.Age}</Text>
                                <Text style={styles.info}><Text style={styles.label}>Gender:</Text> {patient.Gender}</Text>
                                <Text style={styles.info}><Text style={styles.label}>Address:</Text> {patient.Address}</Text>
                                <Text style={styles.info}><Text style={styles.label}>Telephone Number:</Text> {patient.Telephone_Number}</Text>
                                <Text style={styles.info}><Text style={styles.label}>Diagnosis:</Text> {patient.diagnosis}</Text>
                                <View style={styles.preliminaryDiagnosis}>
                                    <Text style={styles.preliminaryDiagnosisTitle}>Preliminary Diagnosis:</Text>
                                    <Text style={styles.info}>
                                        The preliminary diagnosis suggests that the presence of significant findings consistent with a possible brain tumor, necessitates further consultation with a neurologist or neurosurgeon at a specialized hospital nearby. Sharing these diagnostic insights with the consulting physician will provide valuable guidance for subsequent diagnostic and treatment strategies, such as advanced imaging studies or biopsy procedures. This collaborative approach is crucial to ensure a comprehensive assessment and to develop an individualized management plan aimed at achieving the best possible clinical outcomes for the patient.
                                    </Text>
                                </View>
                                {patient.diagnosis.toLowerCase().trim().includes('glioma_tumor') && patient.gliomaInfo && (
                                    <View style={styles.gliomaInfo}>
                                        <Text style={styles.sectionTitle}>Glioma Information:</Text>
                                        <Text style={styles.info}><Text style={styles.label}>Type:</Text> {patient.gliomaInfo.type}</Text>
                                        <Text style={styles.info}><Text style={styles.label}>Stage:</Text> {patient.gliomaInfo.stage}</Text>
                                        <Text style={styles.info}><Text style={styles.label}>Treatment Plan:</Text> {patient.gliomaInfo.treatmentPlan}</Text>
                                        <Text style={styles.sectionTitle}>Treatment Plan for Glioma Brain Tumor:</Text>
                                        <Text style={styles.info}><Text style={styles.label}>Surgery:</Text> To remove as much of the tumor as possible while preserving neurological function.</Text>
                                        <Text style={styles.info}><Text style={styles.label}>Radiation Therapy:</Text> To kill remaining cancer cells and shrink the tumor.</Text>
                                        <Text style={styles.info}><Text style={styles.label}>Chemotherapy:</Text> To kill or slow the growth of cancer cells.</Text>
                                        <Text style={styles.info}><Text style={styles.label}>Targeted Therapy:</Text> To target specific genes, proteins, or the tissue environment that contributes to cancer growth.</Text>
                                        <Text style={styles.info}><Text style={styles.label}>Immunotherapy:</Text> To boost the body's immune system to fight the cancer.</Text>
                                        <Text style={styles.info}><Text style={styles.label}>Tumor Treating Fields (TTF):</Text> To use electric fields to disrupt the division of cancer cells.</Text>
                                        <Text style={styles.info}><Text style={styles.label}>Supportive (Palliative) Care:</Text> To manage symptoms and improve quality of life.</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Generated by the Glioma Detection System</Text>
                        </View>
                    </Page>
                </Document>
            );

            const pdfBlob = await pdf(<MyDocument />).toBlob();
            downloadReport(pdfBlob);
        } catch (error) {
            console.error('Error generating report:', error.message);
        }
    };

    const fetchGliomaInfo = async (patientId) => {
        try {
            const response = await axios.get(`https://api.gemini.com/glioma-info`, {
                params: {
                    patientId: patientId,
                },
                headers: {
                    'Authorization': `Bearer YOUR_GEMINI_API_KEY`,
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching glioma information:', error.message);
            return null;
        }
    };

    const downloadReport = (pdfBlob) => {
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, '_blank');
    };

    return (
        <div className="results-container">
            {loading ? (
                <p>Loading...</p>
            ) : (
                results.map((result) => (
                    <div key={result.id} className="result-list">
                        <h3><strong>Full Name:</strong> {result.Full_name}</h3>
                        <p><strong>Age:</strong> {result.Age}</p>
                        <p><strong>Gender:</strong> {result.Gender}</p>
                        <p><strong>Address:</strong> {result.Address}</p>
                        <p><strong>Telephone Number:</strong> {result.Telephone_Number}</p>
                        <p><strong>Diagnosis:</strong> {result.diagnosis}</p>
                        <div className='space'>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                onClick={() => generatePDF(result)}
                            >
                                Get Full Report
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

// Styles for PDF document
const styles = StyleSheet.create({
    page: {
        padding: 35,
        fontFamily: 'Helvetica',
    },
    header: {
        borderBottom: '2px solid #000',
        marginBottom: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        color: '#364f7c',
        fontWeight: 'bold',
    },
    body: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    result: {
        marginBottom: 20,
        padding: 10,
        border: '1px solid #ddd',
        borderRadius: 8,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#364f7c',
    },
    info: {
        fontSize: 14,
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
    },
    preliminaryDiagnosis: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    preliminaryDiagnosisTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#c94d3f',
    },
    gliomaInfo: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#c94d3f',
    },
    footer: {
        borderTop: '2px solid #000',
        marginTop: 20,
        paddingTop: 10,
        textAlign: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#666',
    },
});

export default Results;
