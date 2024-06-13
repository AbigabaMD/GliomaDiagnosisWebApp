import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabase/client";
import { useAuth } from "../../context/AuthProvider";
import '../../assets/styles/patients.css';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const { user } = useAuth(); // Get the current user

    const fetchPatientDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('Patients_Reg')
                .select('*')
                .eq('user_id', user.id); // Filter by user ID

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
        if (user) {
            fetchPatientDetails();
        }
    }, [user]);

    return (
        <div className="patients-container mx-auto p-8">
            <h2 className="patients-title text-center text-2xl font-bold text-blue-900 mb-6">
                List of Patients with Diagnosis
            </h2>
            <div className="shadow overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 overflow-y-scroll">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                No.
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Full Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Age
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gender
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Address
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone Number
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Diagnosis Results
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {patients.slice(0, 6).map((patient, index) => (
                            <tr key={patient.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {patient.Full_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {patient.Age}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {patient.Gender}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {patient.Address}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {patient.Telephone_Number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {patient.diagnosis}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Patients;
