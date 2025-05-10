import { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function App() {
    const [section, setSection] = useState<'home' | 'about' | 'contact'>('home');
    const navigate = useNavigate();

    const renderSection = () => {
        switch (section) {
            case 'home':
                return (
                    <section className="text-center space-y-8">
                        <h2 className="text-5xl font-extrabold text-blue-800">Welcome to BackBone</h2>
                        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                            BackBone is your secure digital vault for health records. Upload, access, and manage
                            documents from hospitals, clinics, and doctors—all in one place.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                            <div className="bg-white shadow-lg p-6 rounded-xl">
                                <img src="https://cdn-icons-png.flaticon.com/512/483/483356.png" alt="Upload"
                                     className="w-12 mx-auto mb-3"/>
                                <h3 className="text-lg font-semibold">Secure File Storage</h3>
                                <p className="text-gray-600">Upload lab reports, prescriptions, scans, and visit notes.
                                    Your data is encrypted and safe.</p>
                            </div>
                            <div className="bg-white shadow-lg p-6 rounded-xl">
                                <img src="https://cdn-icons-png.flaticon.com/512/2936/2936881.png" alt="Doctor Upload"
                                     className="w-12 mx-auto mb-3"/>
                                <h3 className="text-lg font-semibold">Direct Doctor Uploads</h3>
                                <p className="text-gray-600">Doctors can upload files directly to your profile after a
                                    consultation—no manual transfer needed.</p>
                            </div>
                            <div className="bg-white shadow-lg p-6 rounded-xl">
                                <img src="https://cdn-icons-png.flaticon.com/512/4089/4089316.png" alt="Appointments"
                                     className="w-12 mx-auto mb-3"/>
                                <h3 className="text-lg font-semibold">Appointment Management</h3>
                                <p className="text-gray-600">Book appointments, view files and view schedules,integrated with your record system.</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-lg mt-12">
                            <h4 className="text-2xl font-bold text-blue-700 mb-4">User Testimonials</h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white p-4 rounded shadow">
                                    <p className="italic">"BackBone has transformed how I manage patient data. Quick
                                        access and zero paperwork!"</p>
                                    <span
                                        className="block text-right font-semibold text-blue-700 mt-2">- Dr. Anjali Rao</span>
                                </div>
                                <div className="bg-white p-4 rounded shadow">
                                    <p className="italic">"I love that I can share my health reports with any clinic in
                                        seconds. Absolute game changer!"</p>
                                    <span className="block text-right font-semibold text-blue-700 mt-2">- Ramesh Kumar, Patient</span>
                                </div>
                            </div>
                        </div>
            </section>

            )
                ;

            case 'about':
                return (
                    <section className="text-center space-y-8">
                        <h2 className="text-4xl font-bold text-blue-800">About BackBone</h2>
                        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                            BackBone is a cloud-based health record system designed for both patients and healthcare
                            professionals. We simplify medical data handling through secure uploads, easy sharing, and
                            digital appointment systems.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-6">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-semibold text-blue-600 mb-2">For Patients</h3>
                                <p>Maintain your complete medical history. Store all records securely and share them instantly with any doctor.</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-semibold text-blue-600 mb-2">For Doctors</h3>
                                <p>Upload patient notes, prescriptions, and reports directly into their accounts. Access previous consultations instantly.</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-semibold text-blue-600 mb-2">Hospital Integration</h3>
                                <p>Hospitals can manage appointments, assign doctors, and access patient histories to streamline medical workflows.</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-semibold text-blue-600 mb-2">Privacy First</h3>
                                <p>Only you and your authorized doctors can access your data. We comply with health data privacy laws and best practices.</p>
                            </div>
                        </div>
                    </section>
                );
            case 'contact':
                return (
                    <section className="space-y-10 text-center">
                        <h2 className="text-4xl font-extrabold text-blue-800">Get in Touch with BackBone</h2>
                        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                            Have questions, feedback, or need help? While we currently don’t support direct messaging from this page, you can always reach out using the information below. We’re happy to assist you.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <div className="bg-white shadow-md rounded-xl p-6 space-y-2 border-t-4 border-blue-600">
                                <h3 className="text-xl font-bold text-blue-700">📍 Address</h3>
                                <p className="text-gray-600">BackBone Health Pvt. Ltd.</p>
                                <p className="text-gray-600">123 MedTech Innovation Park</p>
                                <p className="text-gray-600">Hyderabad, Telangana, India</p>
                            </div>

                            <div className="bg-white shadow-md rounded-xl p-6 space-y-2 border-t-4 border-blue-600">
                                <h3 className="text-xl font-bold text-blue-700">📞 Call Us</h3>
                                <p className="text-gray-600">+91 98765 43210</p>
                                <p className="text-gray-600">Mon–Fri, 10:00 AM to 6:00 PM</p>
                            </div>

                            <div className="bg-white shadow-md rounded-xl p-6 space-y-2 border-t-4 border-blue-600">
                                <h3 className="text-xl font-bold text-blue-700">📧 Email Us</h3>
                                <p className="text-gray-600">support@backbonehealth.com</p>
                                <p className="text-gray-600">For general queries and support.</p>
                            </div>
                        </div>

                        <div className="max-w-4xl mx-auto mt-10">
                            <h4 className="text-2xl font-semibold text-blue-800 mb-4">Why Contact Us?</h4>
                            <ul className="list-disc list-inside text-left text-gray-700 text-lg space-y-2">
                                <li>📋 Questions about how to upload or manage your medical records</li>
                                <li>🩺 Issues with doctor file uploads or account access</li>
                                <li>📅 Help with booking or rescheduling appointments</li>
                                <li>🔐 Concerns regarding security or privacy of your data</li>
                                <li>💡 Suggestions or feedback to improve BackBone</li>
                            </ul>
                        </div>
                    </section>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <nav className="flex justify-between items-center bg-blue-700 text-white px-8 py-4 shadow-md">
                <h1 className="text-3xl font-bold tracking-wide">BackBone</h1>
                <div className="flex gap-6">
                    <button onClick={() => setSection('home')} className="hover:text-gray-300 transition">Home</button>
                    <button onClick={() => setSection('about')} className="hover:text-gray-300 transition">About</button>
                    <button onClick={() => setSection('contact')} className="hover:text-gray-300 transition">Contact</button>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/signin')} className="bg-white text-blue-700 font-semibold px-4 py-2 rounded hover:bg-blue-100 transition">Login</button>
                </div>
            </nav>
            <main className="p-10 max-w-7xl mx-auto">
                {renderSection()}
            </main>
        </div>
    );
}

export default App;
