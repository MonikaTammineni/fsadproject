import React, { useState, useEffect, useMemo } from 'react';
import { AUTH_ENDPOINTS } from '../../utils/endpoints';
import toast from 'react-hot-toast';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
    mobileNumber: string;
    email: string;
    dateOfBirth: string;
    address: string;
    // accountType: string;
    status: boolean;
    createdOn: string;
}

const columnOptions = [
    { label: 'First Name', value: 'firstName' },
    { label: 'Last Name', value: 'lastName' },
    { label: 'Gender', value: 'gender' },
    { label: 'Phone', value: 'mobileNumber' },
    { label: 'Email', value: 'email' },
    { label: 'Address', value: 'address' }
];

const AllUsers: React.FC = () => {
    const [patients, setPatients] = useState<User[]>([]);
    const [searchColumn, setSearchColumn] = useState('firstName');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<keyof User | ''>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const [editPatientId, setEditPatientId] = useState<number | null>(null);
    const [editedPatient, setEditedPatient] = useState<Partial<User>>({});

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        fetch(`${AUTH_ENDPOINTS.getAllUsers}?token=${token}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data.body)) {
                    setPatients(data.body);
                } else {
                    toast.error('Invalid user data format');
                }
            })
            .catch(err => toast.error(`Failed to fetch users: ${err.message}`));
    }, [token]);

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

    const handleSort = (key: keyof User) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full">
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-4">All Users List</h2>
            <div className="mb-4 flex gap-2 items-center justify-between">
                <div className="flex gap-2 w-full">
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
                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => {
                        setSearchTerm('');
                        setSearchColumn('firstName');
                        setSortKey('');
                        setSortOrder('asc');
                    }}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100"
                >
                    Reset
                </button>
            </div>

            <div className="border border-gray-300 dark:border-gray-600 rounded overflow-y-auto overflow-x-auto w-full" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                    <tr>
                        {['id', 'firstName', 'lastName', 'gender', 'mobileNumber', 'email', 'address', 'status', 'createdOn', 'dateOfBirth'].map((key) => (
                            <th
                                key={key}
                                className="p-2 text-left cursor-pointer text-gray-800 dark:text-white"
                                onClick={() => handleSort(key as keyof User)}
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)} {sortKey === key && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                        ))}
                        <th className="p-2 text-left text-gray-800 dark:text-white">Age</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedPatients.length === 0 ? (
                        <tr>
                            <td colSpan={12} className="text-center py-4 text-gray-500 dark:text-gray-400">No results found</td>
                        </tr>
                    ) : (
                        sortedPatients.map((p) => (
                            <tr
                                key={p.id}
                                className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                onDoubleClick={() => {
                                    setEditPatientId(p.id);
                                    setEditedPatient({ ...p });
                                }}
                            >
                                <td className="p-2 text-gray-900 dark:text-gray-100">{p.id}</td>
                                <td className="p-2 text-gray-900 dark:text-gray-100">
                                    {editPatientId === p.id ? (
                                        <input
                                            type="text"
                                            value={editedPatient.firstName ?? ''}
                                            onChange={(e) => setEditedPatient(prev => ({ ...prev, firstName: e.target.value }))}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    ) : (
                                        p.firstName
                                    )}
                                </td>
                                <td className="p-2 text-gray-900 dark:text-gray-100">
                                    {editPatientId === p.id ? (
                                        <input
                                            type="text"
                                            value={editedPatient.lastName ?? ''}
                                            onChange={(e) => setEditedPatient(prev => ({ ...prev, lastName: e.target.value }))}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    ) : (
                                        p.lastName
                                    )}
                                </td>
                                <td className="p-2 text-gray-900 dark:text-gray-100">
                                    {editPatientId === p.id ? (
                                        <select
                                            value={editedPatient.gender ?? ''}
                                            onChange={(e) => setEditedPatient(prev => ({ ...prev, gender: e.target.value }))}
                                            className="w-full px-2 py-1 border rounded"
                                        >
                                            <option value="">Select</option>
                                            <option value="MALE">MALE</option>
                                            <option value="FEMALE">FEMALE</option>
                                            <option value="OTHER">OTHER</option>
                                        </select>
                                    ) : (
                                        p.gender
                                    )}
                                </td>
                                <td className="p-2 text-gray-900 dark:text-gray-100">
                                    {editPatientId === p.id ? (
                                        <input
                                            type="text"
                                            value={editedPatient.mobileNumber ?? ''}
                                            onChange={(e) => setEditedPatient(prev => ({ ...prev, mobileNumber: e.target.value }))}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    ) : (
                                        p.mobileNumber
                                    )}
                                </td>
                                <td className="p-2 text-gray-900 dark:text-gray-100 max-w-[200px] truncate">
                                    {editPatientId === p.id ? (
                                        <input
                                            type="text"
                                            value={editedPatient.email ?? ''}
                                            onChange={(e) => setEditedPatient(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    ) : (
                                        p.email
                                    )}
                                </td>
                                <td className="p-2 text-gray-900 dark:text-gray-100">
                                    {editPatientId === p.id ? (
                                        <input
                                            type="text"
                                            value={editedPatient.address ?? ''}
                                            onChange={(e) => setEditedPatient(prev => ({ ...prev, address: e.target.value }))}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    ) : (
                                        p.address
                                    )}
                                </td>
                                {/*<td className="p-2 text-gray-900 dark:text-gray-100">{p.accountType}</td>*/}
                                <td className="p-2 text-gray-900 dark:text-gray-100">
                                    {editPatientId === p.id ? (
                                        <select
                                            value={editedPatient.status ? 'ACTIVE' : 'INACTIVE'}
                                            onChange={(e) => {
                                                const value = e.target.value === 'ACTIVE';
                                                setEditedPatient(prev => ({ ...prev, status: value }));
                                            }}
                                            className="w-full px-2 py-1 border rounded"
                                        >
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="INACTIVE">INACTIVE</option>
                                        </select>
                                    ) : (
                                        p.status ? 'Active' : 'Inactive'
                                    )}
                                </td>
                                <td className="p-2 text-gray-900 dark:text-gray-100">{new Date(p.createdOn).toLocaleString()}</td>
                                <td className="p-2 text-gray-900 dark:text-gray-100">
                                    {editPatientId === p.id ? (
                                        <input
                                            type="date"
                                            value={editedPatient.dateOfBirth ? new Date(editedPatient.dateOfBirth).toISOString().split('T')[0] : ''}
                                            onChange={(e) => {
                                                const selectedDate = new Date(e.target.value);
                                                const today = new Date();
                                                // Remove time from today for accurate date-only comparison
                                                today.setHours(0,0,0,0);
                                                if (selectedDate >= today) {
                                                    toast.error('Date of birth must be before today.');
                                                    return;
                                                }
                                                setEditedPatient(prev => ({ ...prev, dateOfBirth: e.target.value }));
                                            }}
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    ) : (
                                        new Date(p.dateOfBirth).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })
                                    )}
                                </td>
                                <td className="p-2 text-gray-900 dark:text-gray-100">
                                    {Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
            {editPatientId && (
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={() => {
                            fetch(`${AUTH_ENDPOINTS.editUser}?token=${token}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(editedPatient),
                            })
                                .then(res => res.text())
                                .then(msg => {
                                    toast.success(msg);
                                    setEditPatientId(null);
                                })
                                .catch(err => toast.error(`Update failed: ${err.message}`));
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => {
                            setEditPatientId(null);
                            setEditedPatient({});
                        }}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllUsers;