import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabase/client";

const Patients = () => {
    const [patients, setPatients] = useState([]);

    const fetchPatientDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('Patients_Reg')
                .select('*'); // Ensure all necessary columns are selected

            if (error) {
                throw error;
            }

            console.log('Fetched patient data:', data);

            setPatients(data);
        } catch (error) {
            console.error('Error fetching patient details:', error);
        }
    };

    useEffect(() => {
        fetchPatientDetails();
    }, []);

  

    return (
        <div >
            <main>
                {/* Patients Table */}
                <div>
                    <h2>
                        Patients List
                    </h2>
                    <div>
                        <table >
                            <thead>
                                <tr className="text-left">
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 font-semibold text-sm lowercase">
                                        Full Name
                                    </th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 font-semibold text-sm lowercase">
                                        Age
                                    </th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 font-semibold text-sm lowercase">
                                        Gender
                                    </th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 font-semibold text-sm lowercase">
                                        Address
                                    </th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 font-semibold text-sm lowercase">
                                        Phone Number
                                    </th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient) => (
                                    <tr key={patient.id} >
                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-black">
                                                        {patient.Full_name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 dark:border-gray-600">
                                            <div className="text-sm text-gray-900 dark:text-black">
                                                {patient.Age}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 dark:border-gray-600">
                                            <div className="text-sm text-gray-900 dark:text-black">
                                                {patient.Gender}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 dark:border-gray-600">
                                            <div className="text-sm text-gray-900 dark:text-black">
                                                {patient.Address}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 dark:border-gray-600">
                                            <div className="text-sm text-gray-900 dark:text-black">
                                                {patient.Telephone_Number}
                                            </div>
                                        </td>
                                       
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Patients;
