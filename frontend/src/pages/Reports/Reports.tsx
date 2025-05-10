'use client';

import React, { useMemo, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AUTH_ENDPOINTS } from '../../utils/endpoints';

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


/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
const Reports: React.FC = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const [files, setFiles] = useState<FileItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchColumn, setSearchColumn] = useState<'fileName' | 'fileCode' | 'category'>(
        'fileName',
    );
    const [sortKey, setSortKey] = useState<keyof FileItem | ''>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


    /* ---------------------------------------------------------------- */
    /* Helpers                                                          */
    /* ---------------------------------------------------------------- */
    const fetchFiles = async () => {
        try {
            const res = await fetch(`${AUTH_ENDPOINTS.getPatientFiles}?token=${token}`);
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
                url: f.url || `${AUTH_ENDPOINTS.downloadFile}?token=${token}&fileId=${f.fileId}`,
            }));
            setFiles(formatted);
        } catch {
            toast.error('Error fetching files');
        }
    };

    useEffect(() => {
        fetchFiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
    /* Render                                                           */
    /* ---------------------------------------------------------------- */
    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white w-full">
                    Files &amp; Reports
                </h2>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                {/* ---------------- Search controls ---------------- */}
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
                        {sortedFiles.map((f) => (
                            <tr
                                key={f.fileId}
                                onClick={() => setSelectedFile(f)}
                                className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    selectedFile?.fileId === f.fileId ? 'bg-blue-100 dark:bg-blue-800' : ''
                                }`}
                            >
                                <td className="p-2">{f.fileId}</td>
                                <td className="p-2">{f.fileName}</td>
                                <td className="p-2">{f.fileCode}</td>
                                <td className="p-2">{f.category}</td>
                                <td className="p-2">{new Date(f.uploadDate).toLocaleString('en-IN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ---------------- Action Buttons ---------------- */}
            {/* Download / Open */}
            {selectedFile && (
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
                </div>
            )}

        </div>
    );
};

export default Reports;
