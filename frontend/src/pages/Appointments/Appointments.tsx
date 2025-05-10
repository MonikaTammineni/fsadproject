
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AUTH_ENDPOINTS } from '../../utils/endpoints';
import PatientSelectorModal from '../../Components/PatientSelectorModal';
import ViewAppointments from "./ViewAppointsments.tsx";

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
}

// ----------------------------------
// Utility helpers
// ----------------------------------
const nextQuarterHour = (): string => {
  const now = new Date();
  now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0);
  return now.toTimeString().slice(0, 5);
};

// ----------------------------------
// Component
// ----------------------------------
const Appointments: React.FC = () => {
  enum Tab {
    Book = 'Book Appointment',
    View = 'View Appointments',
    Calendar = 'Calendar',
    Settings = 'Settings',
  }

  const [activeTab, setActiveTab] = useState<Tab>(Tab.Book);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [appointmentTime, setAppointmentTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const todayDate = new Date().toISOString().split('T')[0];

  // ------------------------------
  // Effect: fetch doctors + cached patient
  // ------------------------------
  useEffect(() => {
    const token = localStorage.getItem('token');

    (async () => {
      try {
        const res = await fetch(`${AUTH_ENDPOINTS.getAllDoctorsList}?token=${token}`, {
          method: 'POST',
        });
        const data = await res.json();
        setDoctors(data.body as Doctor[]);
      } catch (err) {
        toast.error('Failed to fetch doctors');
        console.error(err);
      }
    })();

    const cached = localStorage.getItem('selectedPatient');
    if (cached) setSelectedPatient(JSON.parse(cached));
  }, []);

  // ------------------------------
  // Patient selection from modal
  // ------------------------------
  const handlePatientSelect = () => {
    const patient = JSON.parse(localStorage.getItem('selectedPatient')!);
    setSelectedPatient(patient);
    toast.success(`Selected: ${patient.firstName} ${patient.lastName}`);
    setIsModalOpen(false);
  };

  // ------------------------------
  // Submit new appointment
  // ------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient || !doctorId || !appointmentDate || !appointmentTime) {
      toast.error('All fields are required');
      return;
    }

    // Disallow past‑times for today
    if (appointmentDate === todayDate && appointmentTime <= nextQuarterHour()) {
      toast.error('Please select a future time for today.');
      return;
    }

    const payload = {
      patientId: selectedPatient.id,
      doctorId: Number(doctorId),
      appointmentDate,
      appointmentTime,
      notes,
      status: 'SCHEDULED',
      createdByUserId: selectedPatient.id,
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${AUTH_ENDPOINTS.createAppointment}?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error((await res.json()).message);

      toast.success('Appointment booked!');
      // reset form
      setDoctorId('');
      setAppointmentDate('');
      setAppointmentTime('');
      setNotes('');
      setSelectedPatient(null);
    } catch (err: any) {
      toast.error(err.message ?? 'Error booking appointment');
    }
  };

  // -----------------------------------------------------
  // Render
  // -----------------------------------------------------
  return (
      <div className="flex flex-col">
        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-300 dark:border-gray-700 mb-4">
          {Object.values(Tab).map((t) => (
              <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                      '${activeTab === t ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600 dark:text-gray-300 hover:text-indigo-500"}'
                  }`}
              >
                {t}
              </button>
          ))}
        </div>

        {/* -------- Book -------- */}
        {activeTab === Tab.Book && (
            <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-center mb-6 dark:text-white">
                Book Appointment
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patient */}
                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Patient</label>
                    <div className="flex items-center gap-3">
                  <span className="flex-1 dark:text-white">
                    {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : 'No patient selected'}
                  </span>
                      <button
                          type="button"
                          onClick={() => setIsModalOpen(true)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Choose
                      </button>
                    </div>
                  </div>

                  {/* Doctor */}
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Doctor</label>
                    <select
                        className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white"
                        value={doctorId}
                        onChange={(e) => setDoctorId(e.target.value)}
                        required
                    >
                      <option value="">Select doctor</option>
                      {doctors.map((d) => (
                          <option key={d.id} value={d.id}>
                            Dr. {d.firstName} {d.lastName}
                          </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Date</label>
                  <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      min={todayDate}
                      className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white"
                      required
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Time</label>
                  <input
                      type="time"
                      step="900"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      min={appointmentDate === todayDate ? nextQuarterHour() : undefined}
                      className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white"
                      required
                  />
                </div>

                {/* Notes */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Notes</label>
                  <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Optional notes..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Submit */}
                <div className="col-span-2 flex justify-end mt-4">
                  <button
                      type="submit"
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Book Appointment
                  </button>
                </div>
              </form>
            </div>
        )}

        {/* -------- View -------- */}
        {activeTab === Tab.View && <ViewAppointments />}

        {/* -------- Coming Soon -------- */}
        {activeTab === Tab.Calendar && (
            <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold dark:text-white">Calendar View (Coming soon)</h2>
            </div>
        )}
        {activeTab === Tab.Settings && (
            <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold dark:text-white">Settings (Coming soon)</h2>
            </div>
        )}

        {/* Modal */}
        <PatientSelectorModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelect={handlePatientSelect}
        />
      </div>
  );
};

export default Appointments;
