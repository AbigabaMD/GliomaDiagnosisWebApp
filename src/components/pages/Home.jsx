import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";

import '../../assets/styles/home.css';
import '../../assets/styles/homePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faUserInjured, faPoll, faQuestion, faCog,  } from '@fortawesome/free-solid-svg-icons';
import Users from './users';
import Patients from './patients';
import Results from './results';
import Faqs from './faqs';
import Settings from './settings';
import Dashboard from './dashboard';
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { Button } from "react-bootstrap";

const Home = () => {
    const { user, auth, signOut } = useAuth();
    const [data, setData] = useState("");
    const [val, setVal] = useState("Upload image to predict");
    const [filename, setFilename] = useState("No file Uploaded");
    const [isMenuOpen, setMenuOpen] = useState(true);
    const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');

    useEffect(() => {
        fetch("http://localhost:5000")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setData(data.message);
            });
    }, []);

    const [file, setFile] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:5000/upload", formData);
            console.log(res.data.message);
            setVal(res.data.message);
            alert("File uploaded successfully");
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setFilename(file.name);
    };

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const handleMenuClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const { error } = await signOut();
            console.log(error);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div >
            <header className="dashboard-header">
                <h1 className="titledash">GLIOMA BTDS</h1>
                <div className="menu-icon" onClick={toggleMenu}>
                    ☰ {/* You can replace this with your menu icon */}
                </div>
                <div className='DoctorLogout'>
                    {auth && (
                        <Nav.Link onClick={handleLogout}>
                            LogOut
                        </Nav.Link>
                    )}
                </div>
            </header>
            {/* Left Side Menu */}
            <nav className={`menu ${isMenuOpen ? 'open' : ''}`}>
                <ul>
                    <li onClick={() => handleMenuClick('dashboard')} className={selectedMenuItem === 'dashboard' ? 'selected' : ''}>
                        <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
                    </li>
                    {/* <li onClick={() => handleMenuClick('users')} className={selectedMenuItem === 'users' ? 'selected' : ''}>
                        <FontAwesomeIcon icon={faUsers} /> Users
                    </li> */}
                    <li onClick={() => handleMenuClick('patients')} className={selectedMenuItem === 'patients' ? 'selected' : ''}>
                        <FontAwesomeIcon icon={faUserInjured} /> Patients
                    </li>
                    <li onClick={() => handleMenuClick('results')} className={selectedMenuItem === 'results' ? 'selected' : ''}>
                        <FontAwesomeIcon icon={faPoll} /> Results
                    </li>
                    <li onClick={() => handleMenuClick('faqs')} className={selectedMenuItem === 'faqs' ? 'selected' : ''}>
                        <FontAwesomeIcon icon={faQuestion} /> FAQs
                    </li>
                    <li onClick={() => handleMenuClick('settings')} className={selectedMenuItem === 'settings' ? 'selected' : ''}>
                        <FontAwesomeIcon icon={faCog} /> Settings
                    </li>
                    {/* Add more menu items as needed */}
                </ul>
            </nav>
        <div className="content">
            {/* Main Content */}
                <main className="main-content">
                {/* Conditionally render the selected menu item or a default message */}
                {selectedMenuItem === 'dashboard' && <Dashboard />}
                {selectedMenuItem === 'users' && <Users />}
                {selectedMenuItem === 'patients' && <Patients />}
                {selectedMenuItem === 'results' && <Results />}
                {selectedMenuItem === 'faqs' && <Faqs />}
                {selectedMenuItem === 'settings' && <Settings />}
                {selectedMenuItem !== 'dashboard' && !['users', 'patients', 'results', 'faqs', 'settings'].includes(selectedMenuItem) && (
                    <div className="default-message">Select a menu item to view content</div>
                )}
            </main></div>
        </div>
    );
}

export default Home;
