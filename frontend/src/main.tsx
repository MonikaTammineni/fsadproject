import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.tsx';
import SignIn from './pages/SignIn/SignIn.tsx';
import Register from "./pages/Register/Register.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import UploadFiles from "./pages/UploadFiles/UploadFiles.tsx";
import PatientsList from "./pages/PatientsList/PatientsList.tsx";
import ViewFiles from "./pages/ViewFiles/ViewFiles.tsx";
import AddPatient from "./pages/AddPatient/AddPatient.tsx";
import AllUsers from './pages/All Users/AllUsers.tsx';
import AccountSettings from "./pages/AccountSettings/AccountSettings.tsx";
import Appointments from "./pages/Appointments/Appointments.tsx";
import Timeline from "./pages/Timeline/Timeline.tsx";
import Reports from "./pages/Reports/Reports.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Toaster position="bottom-right" reverseOrder={false} />
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/register" element={<Register />} /> {/* Add this */}
                <Route path="/dashboard" element={<Dashboard />}>
                    <Route index element={<div>Welcome to your Dashboard</div>} />
                    <Route path="upload-files" element={<UploadFiles />} />
                    <Route path="patients-list" element={<PatientsList/>} />
                    <Route path="view-files" element={<ViewFiles />} />
                    <Route path="add-patient" element={<AddPatient />} />
                    <Route path="all-users" element={<AllUsers/>} />
                    <Route path="account-settings" element={<AccountSettings />} />
                    <Route path="reports" element={<Reports/>} />
                    {/* Add more dashboard routes here */}
                    {/* Add more nested dashboard routes here */}
                    <Route path="appointments" element={<Appointments/>} />
                    <Route path="timeline" element={<Timeline/>} />
                </Route>

            </Routes>
        </BrowserRouter>
    </StrictMode>
);