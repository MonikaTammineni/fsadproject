import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogTitle } from '@headlessui/react';
import { AUTH_ENDPOINTS } from '../utils/endpoints';
import toast from 'react-hot-toast';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  mobileNumber: string;
  email: string;
  dateOfBirth: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

const columnOptions = [
  { label: 'First Name', value: 'firstName' },
  { label: 'Last Name', value: 'lastName' },
  { label: 'Gender', value: 'gender' },
  { label: 'Phone', value: 'mobileNumber' },
  { label: 'Email', value: 'email' },
];

const PatientSelectorModal: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchColumn, setSearchColumn] = useState('firstName');
  const [searchTerm, setSearchTerm] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const [sortKey, setSortKey] = useState<keyof Patient | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (!isOpen) return;
    fetch(`${AUTH_ENDPOINTS.allPatients}?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.body)) {
          setPatients(data.body);
        } else {
          toast.error('Invalid patient data format');
        }
      })
      .catch(err => toast.error(`Failed to fetch patients: ${err.message}`));
  }, [isOpen, token]);

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients;
    return patients.filter((p) =>
      (p as any)[searchColumn]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, searchColumn, patients]);

  const sortedPatients = useMemo(() => {
    const sorted = [...filteredPatients];
    if (sortKey) {
      sorted.sort((a, b) => {
        const valA = (a[sortKey] ?? '').toString().toLowerCase();
        const valB = (b[sortKey] ?? '').toString().toLowerCase();
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return sorted;
  }, [filteredPatients, sortKey, sortOrder]);

  const handleReset = () => {
    setSearchTerm('');
    setSearchColumn('firstName');
    setSelectedPatient(null);
    setSortKey('');
    setSortOrder('asc');
  };

  const handleNext = () => {
    if (selectedPatient) {
      localStorage.setItem('selectedPatient', JSON.stringify(selectedPatient));
      onSelect(String(selectedPatient.id));
      onClose();
    }
  };

  const handleSort = (key: keyof Patient) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 backdrop-blur-sm transition-opacity duration-300" />
      <Dialog.Panel className="relative w-full h-full sm:w-[95vw] sm:h-[95vh] md:w-[80vw] md:h-[80vh] bg-white dark:bg-gray-900 z-50 p-4 sm:p-6 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 hover:bg-red-500 hover:text-white text-gray-600 dark:text-gray-300 shadow-lg"
          aria-label="Close"
        >
          ✕
        </button>

        <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
          Select a Patient
        </DialogTitle>

        {/* Selected Patient Info & Search Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {selectedPatient ? (
              <span>
                Selected: <strong>{selectedPatient.firstName} {selectedPatient.lastName}</strong>, Age: <strong>
                {Math.floor((Date.now() - new Date(selectedPatient.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))}
              </strong>
              </span>
            ) : (
              <span className="italic">No patient selected</span>
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={searchColumn}
              onChange={(e) => setSearchColumn(e.target.value)}
            >
              {columnOptions.map((col) => (
                <option key={col.value} value={col.value}>
                  {col.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder={`Search by ${searchColumn}`}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleReset}
              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
            >
              Reset Search
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-300 dark:border-gray-600 rounded overflow-y-auto" style={{ maxHeight: 'calc(100vh - 350px)' }}>
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
              <tr>
                <th className="p-2 text-left cursor-pointer text-gray-800 dark:text-white" onClick={() => handleSort('id')}>
                  ID {sortKey === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-2 text-left cursor-pointer text-gray-800 dark:text-white" onClick={() => handleSort('firstName')}>
                  First Name {sortKey === 'firstName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-2 text-left cursor-pointer text-gray-800 dark:text-white" onClick={() => handleSort('lastName')}>
                  Last Name {sortKey === 'lastName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-2 text-left cursor-pointer text-gray-800 dark:text-white" onClick={() => handleSort('gender')}>
                  Gender {sortKey === 'gender' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-2 text-left cursor-pointer text-gray-800 dark:text-white" onClick={() => handleSort('mobileNumber')}>
                  Phone {sortKey === 'mobileNumber' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-2 text-left cursor-pointer text-gray-800 dark:text-white" onClick={() => handleSort('email')}>
                  Email {sortKey === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-2 text-left text-gray-800 dark:text-white">
                  Age
                </th>
                <th className="p-2 text-left cursor-pointer text-gray-800 dark:text-white" onClick={() => handleSort('dateOfBirth')}>
                  DOB {sortKey === 'dateOfBirth' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No results found
                  </td>
                </tr>
              ) : (
                sortedPatients.map((p) => (
                  <tr
                    key={p.id}
                    className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedPatient?.id === p.id ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
                    onClick={() => setSelectedPatient(p)}
                  >
                    <td className="p-2 text-gray-900 dark:text-gray-100">{p.id}</td>
                    <td className="p-2 text-gray-900 dark:text-gray-100">{p.firstName}</td>
                    <td className="p-2 text-gray-900 dark:text-gray-100">{p.lastName}</td>
                    <td className="p-2 text-gray-900 dark:text-gray-100">{p.gender}</td>
                    <td className="p-2 text-gray-900 dark:text-gray-100">{p.mobileNumber}</td>
                    <td className="p-2 text-gray-900 dark:text-gray-100 max-w-[200px] truncate">{p.email}</td>
                    <td className="p-2 text-gray-900 dark:text-gray-100">
                      {Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))}
                    </td>
                    <td className="p-2 text-gray-900 dark:text-gray-100">{new Date(p.dateOfBirth).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-sm text-red-700 dark:text-red-100"
            >
              Close
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm text-gray-900 dark:text-gray-100"
            >
              Reset
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-sm disabled:opacity-50"
              disabled={!selectedPatient}
            >
              Next
            </button>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default PatientSelectorModal;
