import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabase/client";
import '../../assets/styles/patients.css';

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
        <div>
            <main>
                {/* Patients Table */}
                <div>
                    <h2 className="patients-title">
                        List of Patients with Diagnosis
                    </h2>
                    <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative">
                        <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
                            <thead>
                                <tr className="text-left">
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 font-semibold text-sm uppercase">
                                        No.
                                    </th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 font-semibold text-sm uppercase">
                                        Full Name
                                    </th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 font-semibold text-sm uppercase">
                                        Age
                                    </th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 font-semibold text-sm uppercase">
                                        Gender
                                    </th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 font-semibold text-sm uppercase">
                                        Address
                                    </th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 font-semibold text-sm uppercase">
                                        Phone Number
                                    </th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600 border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 font-semibold text-sm uppercase">
                                        Diagnosis Results
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient, index) => (
                                    <tr key={patient.id} className="hover:bg-gray-100 focus-within:bg-gray-100 dark:hover:bg-gray-800 dark:focus-within:bg-gray-800">
                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 dark:border-gray-600">
                                            <div className="text-sm text-gray-900 dark:text-black">
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 dark:border-gray-600">
                                            <div className="text-sm font-medium text-gray-900 dark:text-black">
                                                {patient.Full_name}
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
                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 dark:border-gray-600">
                                            <div className="text-sm text-gray-900 dark:text-black">
                                                {patient.diagnosis}
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
