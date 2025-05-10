// -------------------------------------------------------------
// ViewAppointments.tsx — list + inline-edit + delete appointments
// -------------------------------------------------------------

import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AUTH_ENDPOINTS } from '../../utils/endpoints';

// ---------- Types ----------
export interface Appointment {
  appointmentId: number;
  patientFirstName: string;
  patientLastName: string;
  doctorFirstName: string;
  doctorLastName: string;
  doctorId: number;
  appointmentDate: string;   // YYYY-MM-DD
  appointmentTime: string;   // HH:MM
  status: string;
  notes: string;
}

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
}

// ---------- Component ----------
const ViewAppointments: React.FC = () => {
  /* --- state --- */
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors,      setDoctors]      = useState<Doctor[]>([]);
  const [selected,     setSelected]     = useState<Appointment | null>(null);
  const [editing,      setEditing]      = useState<Appointment | null>(null);

  const [searchField, setSearchField]   =
      useState<keyof Appointment>('patientFirstName');
  const [searchQuery, setSearchQuery]   = useState('');
  const [sortKey,     setSortKey]       = useState<keyof Appointment | ''>('');
  const [sortOrder,   setSortOrder]     = useState<'asc' | 'desc'>('asc');

  /* --- initial fetch --- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    // Use the token if needed
    console.log(token); // or setToken(token)

    // appointments
    fetch(`${AUTH_ENDPOINTS.getAllAppointments}?token=${token}`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(setAppointments)
        .catch(() => toast.error('Failed to load appointments'));

    // doctors
    fetch(`${AUTH_ENDPOINTS.getAllDoctorsList}?token=${token}`, { method: 'POST' })
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(d => setDoctors(Array.isArray(d) ? d : d.body))
        .catch(() => toast.error('Failed to load doctors'));
  }, []);

  /* --- derived lists --- */
  const filtered = useMemo(() => {
    if (!searchQuery) return appointments;
    return appointments.filter(a =>
        a[searchField].toString().toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [appointments, searchQuery, searchField]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey].toString().toLowerCase();
      const bv = b[sortKey].toString().toLowerCase();
      return sortOrder === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sortKey, sortOrder]);

  /* --- helpers --- */
  const toggleSort = (k: keyof Appointment) => {
    setSortKey(k);
    setSortOrder(prev => (sortKey === k && prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleSave = async () => {
    if (!editing) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${AUTH_ENDPOINTS.editAppointment}?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error();
      const upd: Appointment = await res.json();
      setAppointments(prev =>
          prev.map(a => (a.appointmentId === upd.appointmentId ? upd : a)),
      );
      setEditing(null);
      toast.success('Appointment updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;

    const ok = window.confirm(
        `Delete appointment #${selected.appointmentId}?`
    );
    if (!ok) return;

    const token = localStorage.getItem('token');
    const url =
        `${AUTH_ENDPOINTS.deleteAppointment}` +
        `?token=${encodeURIComponent(token ?? '')}` +
        `&appointmentId=${selected.appointmentId}`;

    try {
      const res = await fetch(url, { method: 'POST' });   // <-- body must stay empty

      if (!res.ok) throw new Error(await res.text());     // will surface 400 msg

      // remove row locally so we don't need a refetch
      setAppointments(prev =>
          prev.filter(a => a.appointmentId !== selected.appointmentId)
      );
      setSelected(null);
      toast.success('Appointment deleted');
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };



  /* --- render --- */
  return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4 dark:text-white">
          Appointments
        </h2>

        {/* search */}
        <div className="flex gap-2 mb-4 items-center">
          <select
              value={searchField}
              onChange={e =>
                  setSearchField(e.target.value as keyof Appointment)
              }
              className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
          >
            <option value="patientFirstName">First Name</option>
            <option value="patientLastName">Last Name</option>
            <option value="doctorFirstName">Doctor</option>
          </select>
          <input
              className="border px-3 py-1 rounded w-64 dark:bg-gray-800 dark:text-white"
              placeholder="Search…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* table */}
        <div className="overflow-y-auto border rounded" style={{ maxHeight: '65vh' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800">
            <tr>
              {(['appointmentId', 'patientFirstName', 'doctorFirstName',
                'appointmentDate', 'appointmentTime', 'status', 'notes'] as const).map(k => (
                  <th
                      key={k}
                      onClick={() => toggleSort(k)}
                      className="p-2 cursor-pointer text-left dark:text-white"
                  >
                    {k.replace(/([A-Z])/g, ' $1')
                        .replace(/^./, s => s.toUpperCase())}{' '}
                    {sortKey === k && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
              ))}
            </tr>
            </thead>
            <tbody>
            {sorted.map(a => (
                <tr
                    key={a.appointmentId}
                    onClick={() => setSelected(a)}
                    className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selected?.appointmentId === a.appointmentId
                            ? 'bg-blue-100 dark:bg-blue-900'
                            : ''
                    }`}
                >
                  <td className="p-2">{a.appointmentId}</td>
                  <td className="p-2">
                    {a.patientFirstName} {a.patientLastName}
                  </td>
                  {/* doctor editable */}
                  <td className="p-2">
                    {editing?.appointmentId === a.appointmentId ? (
                        <select
                            value={editing.doctorId}
                            onChange={e =>
                                setEditing({ ...editing, doctorId: Number(e.target.value) })
                            }
                            className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
                        >
                          {doctors.map(d => (
                              <option key={d.id} value={d.id}>
                                Dr. {d.firstName} {d.lastName}
                              </option>
                          ))}
                        </select>
                    ) : (
                        <span onDoubleClick={() => setEditing(a)}>
                      Dr. {a.doctorFirstName} {a.doctorLastName}
                    </span>
                    )}
                  </td>
                  {/* date editable */}
                  <td className="p-2">
                    {editing?.appointmentId === a.appointmentId ? (
                        <input
                            type="date"
                            value={editing.appointmentDate}
                            onChange={e =>
                                setEditing({ ...editing, appointmentDate: e.target.value })
                            }
                            className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
                        />
                    ) : (
                        <span onDoubleClick={() => setEditing(a)}>
                      {a.appointmentDate}
                    </span>
                    )}
                  </td>
                  {/* time editable */}
                  <td className="p-2">
                    {editing?.appointmentId === a.appointmentId ? (
                        <input
                            type="time"
                            value={editing.appointmentTime}
                            onChange={e =>
                                setEditing({ ...editing, appointmentTime: e.target.value })
                            }
                            className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
                        />
                    ) : (
                        <span onDoubleClick={() => setEditing(a)}>
                      {a.appointmentTime}
                    </span>
                    )}
                  </td>
                  {/* status editable */}
                  <td className="p-2">
                    {editing?.appointmentId === a.appointmentId ? (
                        <select
                            value={editing.status}
                            onChange={e =>
                                setEditing({ ...editing, status: e.target.value })
                            }
                            className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
                        >
                          {[
                            'SCHEDULED', 'LAB_TESTS', 'NO_SHOW',
                            'CHECKED_IN', 'COMPLETED', 'CANCELLED',
                          ].map(s => <option key={s}>{s}</option>)}
                        </select>
                    ) : (
                        <span onDoubleClick={() => setEditing(a)}>{a.status}</span>
                    )}
                  </td>
                  {/* notes editable */}
                  <td className="p-2">
                    {editing?.appointmentId === a.appointmentId ? (
                        <input
                            type="text"
                            value={editing.notes}
                            onChange={e =>
                                setEditing({ ...editing, notes: e.target.value })
                            }
                            className="border px-2 py-1 rounded w-full dark:bg-gray-800 dark:text-white"
                        />
                    ) : (
                        <span onDoubleClick={() => setEditing(a)}>{a.notes}</span>
                    )}
                  </td>
                </tr>
            ))}
            {sorted.length === 0 && (
                <tr>
                  <td
                      colSpan={7}
                      className="text-center py-4 text-gray-500 dark:text-gray-400"
                  >
                    No appointments found.
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>

        {/* action bar */}
        <div className="pt-2 flex justify-end gap-2">
          <button
              disabled={!selected}
              onClick={handleDelete}
              className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>

          {editing && (
              <>
                <button
                    onClick={() => setEditing(null)}
                    className="px-4 py-1 rounded bg-gray-500 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Save
                </button>
              </>
          )}
        </div>
      </div>
  );
};

export default ViewAppointments;
