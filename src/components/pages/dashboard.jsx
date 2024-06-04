import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../../assets/styles/home.css';
import * as tf from '@tensorflow/tfjs';
import { v4 as uuidv4 } from 'uuid';
import '../../assets/styles/patientReg.css';
import { supabase } from "../../supabase/client";

const Dashboard = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const { user } = useAuth();
    const [diagnosisResults, setDiagnosisResults] = useState("");
    const [filename, setFilename] = useState("No file Uploaded");
    const [image, setImage] = useState(null);
    const [fileURL, setFileURL] = useState(""); // Store file URL
    const [patientDetails, setPatientDetails] = useState({
        fullName: "",
        age: "",
        gender: "",
        phoneNumber: "",
        address: ""
    });

    const CDNURL = 'https://nfxmgafcnppcpgbjkmyd.supabase.co/storage/v1/object/public/images/';

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
        formData.append("file", image);

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

    const handleDiagnose = async () => {
        if (!image) {
            alert("Please upload an image to diagnose");
            return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = async () => {
                const imageTensor = tf.browser.fromPixels(img);
                const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
                const normalizedImage = resizedImage.div(tf.scalar(255));
                const input = normalizedImage.expandDims(0);
                const prediction = window.model.predict(input);
                const probabilities = prediction.dataSync();
                const maxProbabilityIndex = probabilities.indexOf(Math.max(...probabilities));
                const labels = ["glioma_tumor", "no_tumor", "meningioma_tumor", "pituitary_tumor"];
                const diagnosis = labels[maxProbabilityIndex];
                setDiagnosisResults(`Diagnosis: ${diagnosis}`); // Set diagnosis results
                toast.success(`Results have been uploaded, check the results section`, {});

                console.log('Saving patient details to Supabase', {
                    fullName: patientDetails.fullName,
                    age: patientDetails.age,
                    gender: patientDetails.gender,
                    address: patientDetails.address,
                    phoneNumber: patientDetails.phoneNumber,
                    diagnosis: diagnosis,
                    imageUrl: fileURL // Include the image URL
                });

                // Save patient details to Supabase
                await savePatientDetails({
                    fullName: patientDetails.fullName,
                    age: patientDetails.age,
                    gender: patientDetails.gender,
                    address: patientDetails.address,
                    phoneNumber: patientDetails.phoneNumber,
                    diagnosis: diagnosis,
                    imageUrl: fileURL // Include the image URL
                });
            };
        };
        reader.readAsDataURL(image);
    };

   const savePatientDetails = async (details) => {
    const { fullName, age, gender, address, phoneNumber, diagnosis, imageUrl } = details;

    try {
        const { data, error } = await supabase
            .from('Patients_Reg')
            .insert([
                { 
                    Full_name: fullName, 
                    Age: age, 
                    Gender: gender, 
                    Address: address, 
                    Telephone_Number: phoneNumber, 
                    diagnosis: diagnosis, 
                    imageUrl: imageUrl // Pass imageUrl as a string
                }
            ]);

        if (error) {
            throw error;
        }

        console.log('Patient details saved:', data);
        toast.success('Patient details saved successfully!');
    } catch (error) {
        console.error('Error saving patient details:', error);
        toast.error('Error saving patient details.');
    }
};

    return (
        <div>
            <ToastContainer />
           

            <form onSubmit={handleSubmit} className='form' >
                <h1 className="formTitle">Patient's Details</h1>
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
                    <label className="patientLabel">
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
                    <label className="patientLabel">
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
                    <label className="patientLabel">
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
                    <label className="patientLabel">
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

                <div className="mb-3 w-full" style={{paddingTop:'20px'}}>
                    <label
                        htmlFor="formFile"
                        className="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
                    >
                        Input Brain Scan
                    </label>
                    <div className="flex items-center">
                        <input
                            className="relative flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out overflow-hidden rounded-none border-0 border-solid border-inherit bg-neutral-100 px-3 text-neutral-700 transition duration-150 ease-in-out border-inline-end-width:1px margin-inline-end:0.75rem hover:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:focus:border-primary"
                            type="file"
                            id="formFile"
                            onChange={handleFileUpload}
                        />
                        {image && (
                            <span className="cancel cursor-pointer ml-2" onClick={handleFileCancel}>
                                X
                            </span>
                        )}
                    </div>
                </div>

                <div className='diagnosePart'>
                    <button className="middle none center mr-4 rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 
                    transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] 
                    focus:shadow-none active:opacity-[0.85] active:shadow-none 
                    disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        data-ripple-light="true" type="button" onClick={handleDiagnose}>
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