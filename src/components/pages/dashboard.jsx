import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import * as tf from '@tensorflow/tfjs';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'react-modal';
import { supabase } from "../../supabase/client";
import '../../assets/styles/modal.css';

const CDNURL = 'https://nfxmgafcnppcpgbjkmyd.supabase.co/storage/v1/object/public/images/';

const Dashboard = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { user } = useAuth();
    const [diagnosisResults, setDiagnosisResults] = useState("");
    const [filename, setFilename] = useState("No file Uploaded");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [fileURL, setFileURL] = useState("");
    const [patientDetails, setPatientDetails] = useState({
        fullName: "",
        age: "",
        gender: "",
        phoneNumber: "",
        address: ""
    });

    useEffect(() => {
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
            setDiagnosisResults(res.data.message);
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

        const allowedExtensions = /(\.jpg|\.jpeg|\.dicom|\.png)$/i;
        if (!allowedExtensions.exec(selectedImage.name)) {
            toast.error("Invalid file type. Only .jpg, .jpeg, .dicom, and .png files are allowed.");
            return;
        }

        setFilename(selectedImage.name);
        setImage(selectedImage);
        setImagePreview(URL.createObjectURL(selectedImage));

        // Check if the modal is already open before opening it
        if (!modalIsOpen) {
            setModalIsOpen(true);
        }

        try {
            const userId = user.id;
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

        } catch (error) {
            console.error('Error uploading file to Supabase:', error);
            toast.error('Error uploading file to Supabase.');
        }
    };

    const handleFileCancel = () => {
        setFilename("No file Uploaded");
        setImage(null);
        setImagePreview(null);
        setModalIsOpen(false);
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
                setDiagnosisResults(diagnosis);

                // Call savePatientDetails after setting diagnosisResults
                await savePatientDetails({
                    fullName: patientDetails.fullName,
                    age: patientDetails.age,
                    gender: patientDetails.gender,
                    address: patientDetails.address,
                    phoneNumber: patientDetails.phoneNumber,
                    diagnosis: diagnosis,
                    imageUrl: fileURL
                });

                setModalIsOpen(false); // Close modal after diagnosis and saving
            };
        };
        reader.readAsDataURL(image);
    };

    const savePatientDetails = async ({ fullName, age, gender, address, phoneNumber, diagnosis, imageUrl }) => {
        try {
            // Automatically assign user_id
            const userId = user.id;

            // Save patient details to Supabase
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
                        imageUrl: imageUrl,
                        user_id: userId // Associate patient details with the authenticated user
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

            <form onSubmit={handleSubmit} className='form'>
                <h1 className="formTitle">Patient's Details</h1>
                <div className="patient-details-section">
                    <label>
                        Full Name<span className="required">*</span>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter patient's full name"
                            value={patientDetails.fullName}
                            onChange={handleInputChange}
                            required
                            className="common"
                        />
                    </label>
                    <label>
                        Age<span className="required">*</span>
                        <input
                            type="number"
                            name="age"
                            placeholder="Enter patient's age"
                            value={patientDetails.age}
                            onChange={handleInputChange}
                            required
                            className="common"
                        />
                    </label>
                    <label>
                        Gender<span className="required">*</span>
                        <select
                            name="gender"
                            value={patientDetails.gender}
                            onChange={handleInputChange}
                            required
                            className="common"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </label>
                    <label>
                        Address<span className="required">*</span>
                        <input
                            type="text"
                            name="address"
                            placeholder="Enter patient's address"
                            value={patientDetails.address}
                            onChange={handleInputChange}
                            required
                            className="common"
                        />
                    </label>
                    <label className="patientLabel">
                        Telephone Number:
                        <PhoneInput
                            country={'ug'}
                            value={patientDetails.phoneNumber}
                            onChange={handlePhoneChange}
                            containerStyle={{
                                width: '100%',
                                marginBottom: 10,
                                backgroundColor: '#f5f5f5',
                            }}
                            inputStyle={{ width: '100%', height: 40, backgroundColor: '#fff' }}
                        />
                    </label>
                </div>

                <div className="file-upload-section">
                    <label>
                        Upload Brain Scan
                        <input type="file" name="file" accept=".jpg,.jpeg,.dicom,.png" onChange={handleFileUpload} required />
                    </label>
                    <span className="filename">{filename}</span>
                    {image && (
                        <span className="cancelIcon" onClick={handleFileCancel}>
                            X
                        </span>
                    )}
                </div>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    contentLabel="Image Preview"
                    className="modal"
                    overlay className="overlay"
                >
                    <div className="modal-content">
                        {imagePreview && <img src={imagePreview} alt="Image Preview" className="image-preview" />}
                        <button className="diagnose-button" type="button" onClick={handleDiagnose}>
                            Diagnose
                        </button>
                        <button className="cancel" onClick={() => setModalIsOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </Modal>
            </form>
        </div>
    );
};

export default Dashboard;
