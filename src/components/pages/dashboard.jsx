import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../../assets/styles/home.css';
import * as tf from '@tensorflow/tfjs';

import { supabase } from "../../supabase/client";

const Dashboard = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const { user } = useAuth();
    const [diagnosisResults, setDiagnosisResults] = useState("");
    const [filename, setFilename] = useState("No file Uploaded");
    const [file, setFile] = useState(null);
    const [patientDetails, setPatientDetails] = useState({
        fullName: "",
        age: "",
        gender: "",
        phoneNumber: "",
        address: ""
    });

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
        } catch (error) {
            console.error('Failed to load model', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPatientDetails({
            ...patientDetails,
            [name]: value
        });
    };

    const handlePhoneChange = (value) => {
        setPatientDetails({
            ...patientDetails,
            phoneNumber: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:5000/upload", formData);
            console.log(res.data.message);
            setDiagnosisResults(res.data.message); // Set diagnosis results
            toast.success("File uploaded successfully", {});
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Error uploading file", {});
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setFilename(file.name);
        setFile(file);
    };

    const handleFileCancel = () => {
        setFilename("No file Uploaded");
        setFile(null);
        document.querySelector("input[type='file']").value = null;
    };

    const handleDiagnose = async () => {
        if (!file) {
            alert("Please upload an image to diagnose");
            return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = async () => {
                const image = tf.browser.fromPixels(img);
                const resizedImage = tf.image.resizeBilinear(image, [224, 224]);
                const normalizedImage = resizedImage.div(tf.scalar(255));
                const input = normalizedImage.expandDims(0);
                const prediction = window.model.predict(input);
                const probabilities = prediction.dataSync();
                const maxProbabilityIndex = probabilities.indexOf(Math.max(...probabilities));
                const labels = ["glioma_tumor", "no_tumor", "meningioma_tumor", "pituitary_tumor"];
                const diagnosis = labels[maxProbabilityIndex];
                setDiagnosisResults(`Diagnosis: ${diagnosis}`); // Set diagnosis results
                toast.success(`Results have been uploaded, check the results section`, {});

                // Save patient details to Supabase
                savePatientDetails({
                    fullName: patientDetails.fullName,
                    age: patientDetails.age,
                    gender: patientDetails.gender,
                    phoneNumber: patientDetails.phoneNumber,
                    diagnosis: diagnosis
                });
            };
        };
        reader.readAsDataURL(file);
    };

    const savePatientDetails = async (details) => {
        const { fullName, age, gender, phoneNumber, diagnosis } = details;

        try {
            const { data, error } = await supabase
                .from('Patients_Details')
                .insert([
                    { Full_name: fullName, Age: age, Gender: gender, Telephone_Number: phoneNumber, diagnosis }
                        
                ], {
                    headers: {
                        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                        'Content-Type': 'application/json'
                    }
                }).authorize('https://nfxmgafcnppcpgbjkmyd.supabase.co');

            if (data) {
                console.log('Patient details saved:', data);
                toast.success('Patient details saved successfully!');
            }
        } catch (error) {
            console.error('Error saving patient details:', error);
            toast.error('Error saving patient details.');
        }
    };

    return (
        <div className="app">
            <ToastContainer />
            <h3 className='title'>Patient's Details</h3>

            <form onSubmit={handleSubmit}>
                <div className="patient-details-section">
                    <label>
                        Full Name:
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter patient's full name"
                            value={patientDetails.fullName}
                            onChange={handleInputChange}
                            required
                            className="common-input-field"
                        />
                    </label>
                    <label>
                        Age:
                        <input
                            type="number"
                            name="age"
                            placeholder="Enter patient's age"
                            value={patientDetails.age}
                            onChange={handleInputChange}
                            required
                            className="common-input-field"
                        />
                    </label>
                    <label>
                        Gender:
                        <select
                            name="gender"
                            value={patientDetails.gender}
                            onChange={handleInputChange}
                            required
                            className="common-input-field"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </label>
                    <label>
                        Address:
                        <input
                            type="text"
                            name="address"
                            placeholder="Enter patient's address"
                            value={patientDetails.address}
                            onChange={handleInputChange}
                            required
                            className="common-input-field"
                        />
                    </label>
                    <label>
                        Telephone Number:
                        <PhoneInput
                            country={'ug'}
                            value={patientDetails.phoneNumber}
                            onChange={handlePhoneChange}
                            containerStyle={{
                                width: 300,
                                marginBottom: 10,
                                backgroundColor: '#f5f5f5',
                            }}
                            inputStyle={{ width: 300, height: 40, backgroundColor: '#fff' }}
                        />
                    </label>
                </div>

                <div className="file-upload-section">
                    <label>
                        <input type="file" name="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                </div>
                <span className="file">{filename}</span>
                {file && (
                    <span className="cancel" onClick={handleFileCancel}>
                        X
                    </span>
                )}
                <div className='diagnose'>
                    <button className="diagnose-button" type="button" onClick={handleDiagnose}>
                        Diagnose
                    </button>
                </div>
            </form>

            {diagnosisResults && (
                <div className="diagnosis-section">
                    <p>{diagnosisResults}</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
