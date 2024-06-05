import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faUserInjured, faPoll, faQuestion, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import Users from './users';
import Patients from './patients';
import Results from './results';
import Faqs from './faqs';
import Settings from './settings';
import Dashboard from './dashboard';

import './landingPage.css';
import { Navbar } from 'react-bootstrap';

const LandingPage = () => {
    const [isMenuOpen, setMenuOpen] = useState(true); // Initialize with 'true' to have the menu open by default
    const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard'); // Initialize with 'dashboard'

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const handleMenuClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
    };

    return (
        <div className="app">
            {/* Dashboard Header */}
            <header className="dashboard-header">
                <h3>GLIOMA BTDS</h3>
                <div className="menu-icon" onClick={toggleMenu}>
                    ☰ {/* You can replace this with your menu icon */}
                </div>
                <div className='DoctorLogout'>
                    <div className='logout'>
                        <FontAwesomeIcon icon={faSignOutAlt} className='IconsOnTopRightCorner' /> Logout
                    </div>
                </div>
            </header>

            {/* Left Side Menu */}
            <nav className={`menu ${isMenuOpen ? 'open' : ''}`}>
                <ul>
                    <li onClick={() => handleMenuClick('dashboard')} className={selectedMenuItem === 'dashboard' ? 'selected' : ''}>
                        <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
                    </li>
                    <li onClick={() => handleMenuClick('users')} className={selectedMenuItem === 'users' ? 'selected' : ''}>
                        <FontAwesomeIcon icon={faUsers} /> Users
                    </li>
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
                </ul>
            </nav>

            {/* Main Content */}
            <main className="main-content">
                {selectedMenuItem === 'dashboard' && <Dashboard />}
                {selectedMenuItem === 'users' && <Users />}
                {selectedMenuItem === 'patients' && <Patients />}
                {selectedMenuItem === 'results' && <Results />}
                {selectedMenuItem === 'faqs' && <Faqs />}
                {selectedMenuItem === 'settings' && <Settings />}
                {selectedMenuItem !== 'dashboard' && !['users', 'patients', 'results', 'faqs', 'settings'].includes(selectedMenuItem) && (
                    <div className="default-message">Select a menu item to view content</div>
                )}
            </main>
        </div>
    );
}

export default LandingPage;
