import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import '../../assets/styles/settingsPage.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import * as tf from '@tensorflow/tfjs';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';

const Settings = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedPatient, setEditedPatient] = useState(null);
    const [filename, setFilename] = useState("No file Uploaded");
    const [image, setImage] = useState(null);
    const [fileURL, setFileURL] = useState(""); // Store file URL

    const { user } = useAuth();
    const [diagnosisResults, setDiagnosisResults] = useState("");

 
    const [elevationLevel, setElevationLevel] = useState(1); // Default elevation level
 
    const CDNURL = 'https://nfxmgafcnppcpgbjkmyd.supabase.co/storage/v1/object/public/images/';

    useEffect(() => {
        fetchPatientDetails();
    }, []);

    const fetchPatientDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('Patients_Reg')
                .select('*');

            if (error) {
                throw error;
            }

            console.log('Fetched patient data:', data);
            setPatients(data);
        } catch (error) {
            console.error('Error fetching patient details:', error);
        }
    };

    const handlePatientChange = (event) => {
        const selectedId = parseInt(event.target.value);
        const patient = patients.find(p => p.id === selectedId);
        setSelectedPatient(patient);
        setEditedPatient({ ...patient });
        setEditMode(false);
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
        if (!editMode) {
            setEditedPatient({ ...selectedPatient });
        } else {
            setEditedPatient(null);
        }
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditedPatient(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdatePatient = async () => {
        try {
            const { data, error } = await supabase
                .from('Patients_Reg')
                .update({
                    Full_name: editedPatient.Full_name,
                    Age: editedPatient.Age,
                    Gender: editedPatient.Gender,
                    Address: editedPatient.Address,
                    Telephone_Number: editedPatient.Telephone_Number,
                    diagnosis: editedPatient.diagnosis,
                    imageUrl: fileURL // Include the image URL in update
                })
                .eq('id', editedPatient.id);

            if (error) {
                throw error;
            }

            const updatedPatients = patients.map(p => {
                if (p.id === editedPatient.id) {
                    return { ...p, ...editedPatient };
                }
                return p;
            });
            setPatients(updatedPatients);
            setSelectedPatient({ ...editedPatient });

            console.log('Patient updated successfully:', data);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    };

    const handleDeletePatient = async () => {
        try {
            const { error } = await supabase
                .from('Patients_Reg')
                .delete()
                .eq('id', selectedPatient.id);

            if (error) {
                throw error;
            }

            const filteredPatients = patients.filter(p => p.id !== selectedPatient.id);
            setPatients(filteredPatients);
            setSelectedPatient(null);
            setEditMode(false);

            console.log('Patient deleted successfully');
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    };

    const handleFileUpload = async (event) => {
        const selectedImage = event.target.files[0];
        console.log('Selected file:', selectedImage);

        if (!selectedImage) {
            console.error('No file selected.');
            return;
        }

        setFilename(selectedImage.name);
        setImage(selectedImage);

        try {
            const userId = user.id;  // Assuming user object has an id field
            const fileName = `${userId}/${uuidv4()}`;
            const { data, error } = await supabase.storage
                .from('images')
                .upload(fileName, selectedImage, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                throw error;
            }

            const imageUrl = `${CDNURL}${fileName}`;
            console.log('Image URL:', imageUrl);
            setFileURL(imageUrl);
            toast.success('File uploaded to Supabase successfully!');
        } catch (error) {
            console.error('Error uploading file to Supabase:', error);
            toast.error('Error uploading file to Supabase.');
        }
    };

    const handleFileCancel = () => {
        setFilename("No file Uploaded");
        setImage(null);
        document.querySelector("input[type='file']").value = null;
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:5000");
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await res.json();
                console.log(data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
        loadModel();
    }, []);

    const loadModel = async () => {
        try {
            const model = await tf.loadLayersModel('http://localhost:5000/model/model.json');
            window.model = model;
            console.log('Model loaded successfully');
        } catch (error) {
            console.error('Failed to load model', error);
        }
    };


    return (
        <div className="settings-card">
            <h2 className="settings-title">Manage Patients</h2>
            <div className="dropdown-container">
                <label htmlFor="patient-select">Select Patient:</label>
                <select id="patient-select" onChange={handlePatientChange}>
                    <option value="">Select a patient</option>
                    {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                            {patient.Full_name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedPatient && (
                <div className="patient-details">
                    <h3>{editMode ? 'Edit Patient Details' : 'Selected Patient Details'}</h3>
                    <form>
                        <label>
                            Full Name:
                            <input
                                type="text"
                                name="Full_name"
                                value={editMode ? editedPatient.Full_name : selectedPatient.Full_name}
                                onChange={handleEditChange}
                                className={editMode ? 'edit-mode' : ''}
                                readOnly={!editMode}
                            />
                        </label>
                        <label>
                            Age:
                            <input
                                type="text"
                                name="Age"
                                value={editMode ? editedPatient.Age : selectedPatient.Age}
                                onChange={handleEditChange}
                                className={editMode ? 'edit-mode' : ''}
                                readOnly={!editMode}
                            />
                        </label>
                        <label>
                            Gender:
                            <input
                                type="text"
                                name="Gender"
                                value={editMode ? editedPatient.Gender : selectedPatient.Gender}
                                onChange={handleEditChange}
                                className={editMode ? 'edit-mode' : ''}
                                readOnly={!editMode}
                            />
                        </label>
                        <label>
                            Address:
                            <input
                                type="text"
                                name="Address"
                                value={editMode ? editedPatient.Address : selectedPatient.Address}
                                onChange={handleEditChange}
                                className={editMode ? 'edit-mode' : ''}
                                readOnly={!editMode}
                            />
                        </label>
                        <label>
                            Phone Number:
                            <input
                                type="text"
                                name="Telephone_Number"
                                value={editMode ? editedPatient.Telephone_Number : selectedPatient.Telephone_Number}
                                onChange={handleEditChange}
                                className={editMode ? 'edit-mode' : ''}
                                readOnly={!editMode}
                            />
                        </label>
                        <label>
                            Tumor:
                            <input
                                type="text"
                                name="diagnosis"
                                value={editMode ? editedPatient.diagnosis : selectedPatient.diagnosis}
                                onChange={handleEditChange}
                                className={editMode ? 'edit-mode' : ''}
                                readOnly={!editMode}
                            />
                        </label>

                        <div className="file-upload-section">
                            <label>
                                Upload New Image:
                                <input type="file" name="file" onChange={handleFileUpload} />
                            </label>
                            <span className="filename">{filename}</span>
                            {image && (
                                <span className="cancel" onClick={handleFileCancel}>
                                    X
                                </span>
                            )}
                        </div>
                    </form>

                    <div className="button-container">
                        {!editMode ? (
                            <button className="edit-button" onClick={toggleEditMode}>
                                Edit
                            </button>
                        ) : (
                            <>
                                <button className="update-button" onClick={handleUpdatePatient}>
                                    Update
                                </button>
                                <button className="delete-button" onClick={handleDeletePatient}>
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
