import React, { useState, useEffect } from 'react';
import { AUTH_ENDPOINTS } from '../../utils/endpoints';
import toast from 'react-hot-toast';
import './UploadFiles.css';
import PatientSelectorModal from '../../Components/PatientSelectorModal';


const UploadFiles: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState('');
    const [patientUserId, setPatientUserId] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const stored = localStorage.getItem('selectedPatient');
        if (stored) {
            const parsed = JSON.parse(stored);
            setSelectedPatient(parsed);
            setPatientUserId(parsed.id.toString());
        }
    }, []);

    const handlePatientSelect = (id: string) => {
        const patient = JSON.parse(localStorage.getItem('selectedPatient')!);
        setPatientUserId(id);
        setSelectedPatient(patient);
        toast.success(`Selected: ${patient.firstName} ${patient.lastName}`);
        setIsModalOpen(false);
    };

    const calculateAge = (dob: string | null) => {
        if (!dob) return null;
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !category || !patientUserId || !token) {
            toast.error('Please fill all fields and select a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const url = `${AUTH_ENDPOINTS.uploadFile}?category=${encodeURIComponent(category)}&patient_user_id=${encodeURIComponent(patientUserId)}&token=${encodeURIComponent(token)}`;
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                toast.success('File uploaded successfully');
                setFile(null);
                setCategory('');
                setPatientUserId('');
                setSelectedPatient(null);
            } else {
                const data = await response.json();
                toast.error(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('An error occurred during upload');
        }
    };

    const displayInfo = selectedPatient
        ? `${selectedPatient.firstName} ${selectedPatient.lastName}, ${calculateAge(selectedPatient.dateOfBirth) ?? '--'}${selectedPatient.gender?.[0] ?? ''}`
        : 'No patient selected';

    return (
        <div className="flex justify-center items-center w-full h-full">
            <form
                onSubmit={handleUpload}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 space-y-6 w-full max-w-lg"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Upload File</h2>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                    >
                        <option value="" disabled>Select a category</option>
                        <option value="Report">Report</option>
                        <option value="Prescription">Prescription</option>
                        <option value="Lab Diagnostics">Lab Diagnostics</option>
                        <option value="Bill">Bill</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                        Patient
                    </label>
                    <div className="flex items-center justify-between gap-4">
                        <div className="text-sm text-gray-800 dark:text-white">{displayInfo}</div>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition"
                        >
                            Choose
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                        File
                    </label>
                    <input
                        type="file"
                        accept="*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition transform hover:scale-105 active:scale-95"
                >
                    Upload
                </button>
            </form>

            <PatientSelectorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handlePatientSelect}
            />
        </div>
    );
};

export default UploadFiles;