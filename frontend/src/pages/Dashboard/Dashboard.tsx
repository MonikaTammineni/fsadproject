import React, { useEffect, useState, useRef } from 'react';
import {
    LogOut, Settings, Menu, User, LayoutDashboard, File, LogOutIcon, UserPlus, UsersRound, CalendarCheck, ChartGantt
} from 'lucide-react';
import classNames from 'classnames';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const navItemsForDoctors = [
    { label: 'Dashboard', icon: <LayoutDashboard />, path: '/dashboard' },
    //{ label: 'Reports', icon: <File />, path: '/reports' },
    { label: 'Upload Files', icon: <File />, path: '/dashboard/upload-files' },
    { label: 'View Files', icon: <File />, path: '/dashboard/view-files' },
];

const navItemsForPatients = [
    { label: 'Dashboard', icon: <LayoutDashboard />, path: '/dashboard' },
    { label: 'Reports',   icon: <File />,            path: '/dashboard/reports' },
];

const navItemsForAdmin = [
    { label: 'Dashboard', icon: <LayoutDashboard />, path: '/dashboard' },
    // { label: 'Reports', icon: <File />, path: '/reports' },
    // { label: 'Users', icon: <User />, path: '/users' },
    { label: 'Upload Files', icon: <File />, path: '/dashboard/upload-files' },
    { label: 'Patients', icon: <User />, path: '/dashboard/patients-list' },
    { label: 'View Files', icon: <File />, path: '/dashboard/view-files' },

    {label: 'Add Patient', icon: <UserPlus />, path: '/dashboard/add-patient' },
    { label: 'All Users', icon: <UsersRound />, path: '/dashboard/all-users' },
    { label: 'Appointments', icon: <CalendarCheck />, path: '/dashboard/appointments' },
    { label: 'Timeline', icon: <ChartGantt />, path: '/dashboard/timeline' },
]
const DashboardLayout: React.FC = () => {
    const navigate    = useNavigate();
    const location    = useLocation();
    const sidebarRef  = useRef<HTMLDivElement>(null);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const accountType = localStorage.getItem('accountType');
    const navItems =
        accountType === 'ADMIN'  ? navItemsForAdmin  :
            accountType === 'DOCTOR' ? navItemsForDoctors :
                navItemsForPatients;

    /* close on outside click */
    useEffect(() => {
        const handle = (e: MouseEvent) => {
            if (
                sidebarRef.current && !sidebarRef.current.contains(e.target as Node) &&
                !(document.querySelector('.account-dropdown')?.contains(e.target as Node))
            ) {
                setSidebarOpen(false);
                setUserMenuOpen(false);
            }
        };
        window.addEventListener('click', handle);
        return () => window.removeEventListener('click', handle);
    }, []);

    const logout = () => {
        localStorage.clear();
        navigate('/signin', { replace: true });
    };

    /* helper for active style */
    const isActive = (itemPath: string) =>
        itemPath === ''
            ? location.pathname === '/dashboard'
            : location.pathname === `/dashboard/${itemPath}`;

    return (
        <div className="flex">
            {/* ---------- sidebar ---------- */}
            <aside
                ref={sidebarRef}
                className={classNames(
                    'fixed z-50 h-screen bg-indigo-600 text-white flex flex-col justify-between transition-all duration-300',
                    sidebarOpen ? 'w-52' : 'w-12'
                )}
            >
                <div>
                    {/* brand + toggle */}
                    <div className="flex items-center justify-between px-4 py-4">
                        {sidebarOpen && <h2 className="text-xl font-bold">BackBone</h2>}
                        <Menu className="w-7 h-7 cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)} />
                    </div>

                    {/* nav list */}
                    <nav className={classNames('flex flex-col gap-2 mt-4',
                        sidebarOpen ? 'px-2 items-start' : 'items-center')}>
                        {navItems.map(({ label, icon, path }) => (
                            <div className="relative group w-full" key={label}>
                                <div
                                    onClick={() => {
                                        navigate(path);          // "reports" ➜ /dashboard/reports
                                        setSidebarOpen(false);
                                    }}
                                    className={classNames(
                                        'flex items-center p-2 rounded hover:bg-indigo-700 cursor-pointer transition',
                                        sidebarOpen ? 'space-x-4 justify-start w-full' : 'justify-center',
                                        isActive(path) && 'bg-indigo-800 font-semibold',
                                    )}
                                >
                                    {icon}
                                    {sidebarOpen && <span>{label}</span>}
                                </div>
                                {!sidebarOpen && (
                                    <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 text-xs bg-black text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                    {label}
                  </span>
                                )}
                            </div>
                        ))}

                        <div className="border-t border-white/30 my-2 w-full" />

                        {/* Account dropdown button */}
                        <div className="relative w-full">
                            <div
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className={classNames(
                                    'flex items-center p-2 rounded hover:bg-indigo-700 cursor-pointer transition',
                                    sidebarOpen ? 'space-x-4 w-full justify-start' : 'justify-center',
                                )}
                            >
                                <User className="w-6 h-6" />
                                {sidebarOpen && <span>{localStorage.getItem('firstName') || 'Account'}</span>}
                            </div>

                            {/* dropdown */}
                            {userMenuOpen && (
                                <div className="account-dropdown absolute left-full ml-2 bottom-0 w-48 bg-white text-black rounded-md shadow-lg py-2 z-50">
                                    <button
                                        onClick={() => navigate('account-settings')}
                                        className="flex w-full px-4 py-2 hover:bg-gray-100"
                                    >
                                        <Settings className="w-4 h-4 mr-2" /> Account Settings
                                    </button>
                                    <button
                                        onClick={logout}
                                        className="flex w-full px-4 py-2 hover:bg-gray-100"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* quick logout */}
                        <div
                            onClick={logout}
                            className={classNames(
                                'flex items-center p-2 rounded hover:bg-indigo-700 cursor-pointer transition',
                                sidebarOpen ? 'space-x-4 w-full justify-start' : 'justify-center',
                            )}
                        >
                            <LogOutIcon className="w-6 h-6" />
                            {sidebarOpen && <span>Logout</span>}
                        </div>
                    </nav>
                </div>
            </aside>

            {/* ---------- main ---------- */}
            <main
                className={classNames(
                    'p-8 w-full min-h-screen transition-all duration-300 bg-gray-100 dark:bg-gray-900 overflow-y-auto',
                    sidebarOpen ? 'ml-52' : 'ml-12'
                )}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;