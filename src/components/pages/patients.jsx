import React from 'react';
import '../../assets/styles/landingPage.css';

// Card component (unchanged)
const Card = ({ color, title, section1, section2, section3 }) => {
    return (
        <div className="card block rounded-lg bg-white text-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
            <h2>{title}</h2>
            <div className="card-section border-b-2 border-neutral-100 px-6 py-3 dark:border-neutral-600 dark:text-neutral-50">
                {section1}
            </div>
            <div className="card-section p-2">
                <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                    {title}
                </h5>
                <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
                    {section2}
                </p>
            </div>
            <div className="card-section border-t-2 border-neutral-100 px-6 py-3 dark:border-neutral-600 dark:text-neutral-50">
                {section3}
            </div>
        </div>
    );
};

// Main App component with improved card layout
const Patients = () => {
    return (
        <div className="landing">
            <main>
                {/* Three Card Boards in a single row */}
                <div className="card-container flex justify-between">
                    <Card
                        color="lightblue"
                        title="Glioma Positive Cases"
                        section1="3"
                        section2="Some additional details" // Update with actual content
                        section3="More Info"
                    />
                    <Card
                        color="lightgreen"
                        title="Patient Results"
                        section1="15"
                        section2="Some other information" // Update with actual content
                        section3="More Info"
                    />
                    <Card
                        color="lightpink"
                        title="Patient Registrations"
                        section1="20"
                        section2="Some statistics" // Update with actual content
                        section3="More Info"
                    />
                </div>

                {/* Video Section */}
                <div className="video-section">
                    {/* Add your online video here */}
                    {/* <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/rJwEphsNVH8"
                        title="Online Video"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe> */}
                </div>
            </main>
        </div>
    );
};

export default Patients;
