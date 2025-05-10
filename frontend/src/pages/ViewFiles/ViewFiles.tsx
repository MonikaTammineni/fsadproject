'use client';

import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AUTH_ENDPOINTS } from '../../utils/endpoints';
import PatientSelectorModal from '../../Components/PatientSelectorModal';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
interface FileItem {
    fileId: number;
    fileName: string;
    fileCode: string;
    category: string;
    uploadDate: string; // ISO
    url: string;
}

interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
const ViewFiles: React.FC = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchColumn, setSearchColumn] = useState<'fileName' | 'fileCode' | 'category'>(
        'fileName',
    );
    const [sortKey, setSortKey] = useState<keyof FileItem | ''>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const [isEditing, setIsEditing] = useState(false);
    const [editableFile, setEditableFile] = useState<FileItem | null>(null);

    /* ---------------------------------------------------------------- */
    /* Helpers                                                          */
    /* ---------------------------------------------------------------- */
    const fetchFiles = async (patientId: number) => {
        try {
            const res = await fetch(
                `${AUTH_ENDPOINTS.getPatientFileDetails}?token=${token}&patient_user_id=${patientId}`,
            );
            const data = await res.json();

            const raw = Array.isArray(data) ? data : data.body;
            if (!Array.isArray(raw)) {
                setFiles([]);
                toast.error('No files found');
                return;
            }

            const formatted = raw.map((f: any): FileItem => ({
                ...f,
                uploadDate: f.createdAt,
                url:
                    f.url ||
                    `${AUTH_ENDPOINTS.downloadFile}?token=${token}&fileId=${f.fileId}`,
            }));
            setFiles(formatted);
        } catch {
            toast.error('Error fetching files');
        }
    };

    const handlePatientSelect = () => {
        const patient = JSON.parse(localStorage.getItem('selectedPatient')!) as Patient;
        setSelectedPatient(patient);
        setIsModalOpen(false);
        fetchFiles(patient.id);
    };

    const filteredFiles = useMemo(() => {
        if (!searchTerm) return files;
        return files.filter((f) =>
            f[searchColumn].toString().toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [files, searchTerm, searchColumn]);

    const sortedFiles = useMemo(() => {
        const clone = [...filteredFiles];
        if (!sortKey) return clone;

        clone.sort((a, b) => {
            let valA: string | number = a[sortKey] ?? '';
            let valB: string | number = b[sortKey] ?? '';

            if (sortKey === 'uploadDate') {
                valA = new Date(valA).getTime();
                valB = new Date(valB).getTime();
                return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
            }

            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortOrder === 'asc' ? valA - valB : valB - valA;
            }

            valA = valA.toString().toLowerCase();
            valB = valB.toString().toLowerCase();
            return sortOrder === 'asc'
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        });

        return clone;
    }, [filteredFiles, sortKey, sortOrder]);

    /* ---------------------------------------------------------------- */
    /* Delete handler (changed)                                         */
    /* ---------------------------------------------------------------- */
    const handleDelete = async (): Promise<void> => {
        if (!selectedFile || !selectedPatient) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete file "${selectedFile.fileName}"?`,
        );
        if (!confirmed) return;

        try {
            /**   DELETE /s3/deleteFile/{fileId}?token=xyz               **/
            const res = await fetch(
                `${AUTH_ENDPOINTS.deleteFile}/${selectedFile.fileId}?token=${token}`,
                { method: 'DELETE' },
            );

            if (!res.ok) throw new Error(await res.text());

            toast.success('File deleted');
            setSelectedFile(null);
            fetchFiles(selectedPatient.id); // refresh list
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete file');
        }
    };

    /* ---------------------------------------------------------------- */
    /* Render                                                           */
    /* ---------------------------------------------------------------- */
    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full">
            {/* ---------------- Select Patient ---------------- */}
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white w-full">
                    Select Patient
                </h2>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
          <span>
            {selectedPatient ? (
                <>
                    Selected:&nbsp;
                    <strong>
                        {selectedPatient.firstName} {selectedPatient.lastName}
                    </strong>
                    ,&nbsp;Age:&nbsp;
                    <strong>
                        {Math.floor(
                            (Date.now() - new Date(selectedPatient.dateOfBirth).getTime()) /
                            (1000 * 60 * 60 * 24 * 365.25),
                        )}
                    </strong>
                </>
            ) : (
                <>No patient selected</>
            )}
          </span>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="ml-2 px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                    >
                        {selectedPatient ? 'Change' : 'Select Patient'}
                    </button>
                </div>

                {/* ---------------- Search controls ---------------- */}
                {selectedPatient && (
                    <div className="flex gap-2 w-full sm:w-auto">
                        <select
                            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            value={searchColumn}
                            onChange={(e) => setSearchColumn(e.target.value as any)}
                        >
                            <option value="fileName">File Name</option>
                            <option value="fileCode">File Code</option>
                            <option value="category">Category</option>
                        </select>

                        <input
                            type="text"
                            placeholder={`Search by ${searchColumn}`}
                            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSearchColumn('fileName');
                                setSortKey('');
                                setSortOrder('asc');
                            }}
                            className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                        >
                            Reset
                        </button>
                    </div>
                )}
            </div>

            {/* ---------------- Table ---------------- */}
            <div
                className="border border-gray-300 dark:border-gray-600 rounded overflow-y-auto"
                style={{ maxHeight: '60vh' }}
            >
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                    <tr>
                        {(['fileId', 'fileName', 'fileCode', 'category', 'uploadDate'] as Array<
                            keyof FileItem
                        >).map((col) => (
                            <th
                                key={col}
                                onClick={() => {
                                    setSortKey(col);
                                    setSortOrder(sortKey === col && sortOrder === 'asc' ? 'desc' : 'asc');
                                }}
                                className="p-2 text-left text-gray-800 dark:text-white cursor-pointer"
                            >
                                {col === 'uploadDate' ? 'Uploaded At' : col.replace(/([A-Z])/g, ' $1')}
                                {sortKey === col && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {selectedPatient &&
                        sortedFiles.map((f) => (
                            <tr
                                key={f.fileId}
                                onClick={() => setSelectedFile(f)}
                                onDoubleClick={() => {
                                    setEditableFile({ ...f });
                                    setIsEditing(true);
                                }}
                                className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    selectedFile?.fileId === f.fileId ? 'bg-blue-100 dark:bg-blue-800' : ''
                                }`}
                            >
                                <td className="p-2">{f.fileId}</td>

                                {/* -------- FileName -------- */}
                                <td className="p-2">
                                    {isEditing && editableFile?.fileId === f.fileId ? (
                                        <input
                                            className="w-full"
                                            value={editableFile.fileName}
                                            onChange={(e) =>
                                                setEditableFile({ ...editableFile, fileName: e.target.value })
                                            }
                                        />
                                    ) : (
                                        f.fileName
                                    )}
                                </td>

                                {/* -------- FileCode -------- */}
                                <td className="p-2">
                                    {isEditing && editableFile?.fileId === f.fileId ? (
                                        <input
                                            className="w-full"
                                            value={editableFile.fileCode}
                                            onChange={(e) =>
                                                setEditableFile({ ...editableFile, fileCode: e.target.value })
                                            }
                                        />
                                    ) : (
                                        f.fileCode
                                    )}
                                </td>

                                {/* -------- Category -------- */}
                                <td className="p-2">
                                    {isEditing && editableFile?.fileId === f.fileId ? (
                                        <input
                                            className="w-full"
                                            value={editableFile.category}
                                            onChange={(e) =>
                                                setEditableFile({ ...editableFile, category: e.target.value })
                                            }
                                        />
                                    ) : (
                                        f.category
                                    )}
                                </td>

                                {/* -------- Uploaded At -------- */}
                                <td className="p-2">
                                    {new Date(f.uploadDate).toLocaleString('en-IN')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ---------------- Action Buttons ---------------- */}
            {/* Download / Open / Delete */}
            {selectedPatient && selectedFile && !isEditing && (
                <div className="mt-4 flex justify-end gap-4">
                    <button
                        onClick={() => setSelectedFile(null)}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            const url = `${AUTH_ENDPOINTS.viewFile}?fileId=${selectedFile.fileId}&token=${token}&mode=attachment`;
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = selectedFile.fileName;
                            link.click();
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Download
                    </button>

                    <button
                        onClick={() => {
                            const url = `${AUTH_ENDPOINTS.viewFile}?fileId=${selectedFile.fileId}&token=${token}&mode=inline`;
                            window.open(url, '_blank');
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Open
                    </button>

                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            )}

            {/* ---------------- Edit Buttons ---------------- */}
            {isEditing && editableFile && (
                <div className="mt-4 flex justify-end gap-4">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={async () => {
                            try {
                                const res = await fetch(
                                    `${AUTH_ENDPOINTS.updateFile}?token=${token}&fileId=${editableFile.fileId}`,
                                    {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(editableFile),
                                    },
                                );
                                if (!res.ok) throw new Error();
                                toast.success('File updated');
                                setIsEditing(false);
                                fetchFiles(selectedPatient!.id);
                            } catch {
                                toast.error('Update failed');
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            )}

            {/* ---------------- Patient Selector Modal ---------------- */}
            <PatientSelectorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handlePatientSelect}
            />
        </div>
    );
};

export default ViewFiles;
