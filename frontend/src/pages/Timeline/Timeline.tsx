import React, { useRef, useMemo } from 'react';

const dummyData = [
    {
        date: '2025-01-01',
        visit: 'New Year Checkup',
        vitals: { temperature: '98.6°F', bp: '120/80', heartRate: '72 bpm' },
        diagnosis: [{ problem: 'Flu', severity: 'Mild' }],
        labTests: [{ name: 'Blood Sugar', result: 'Normal' }],
        prescriptions: [{ medicine: 'Paracetamol', dosage: '500mg twice daily' }],
    },
    {
        date: '2025-02-14',
        visit: 'Valentine Health Check',
        vitals: { temperature: '98.7°F', bp: '118/79', heartRate: '70 bpm' },
        diagnosis: [{ problem: 'Allergy', severity: 'Moderate' }],
        labTests: [{ name: 'Allergy Test', result: 'Positive' }],
        prescriptions: [{ medicine: 'Antihistamine', dosage: '10mg once daily' }],
    },
    {
        date: '2025-03-10',
        visit: 'Dental Appointment',
        vitals: { temperature: '98.4°F', bp: '115/75', heartRate: '68 bpm' },
        diagnosis: [{ problem: 'Cavity', severity: 'Severe' }],
        labTests: [{ name: 'X-Ray', result: 'Cavity detected' }],
        prescriptions: [{ medicine: 'Painkiller', dosage: '50mg as needed' }],
    },
    {
        date: '2025-04-22',
        visit: 'Routine Blood Work',
        vitals: { temperature: '98.5°F', bp: '119/78', heartRate: '71 bpm' },
        diagnosis: [{ problem: 'Anemia', severity: 'Mild' }],
        labTests: [{ name: 'CBC', result: 'Low Hemoglobin' }],
        prescriptions: [{ medicine: 'Iron Supplement', dosage: '325mg daily' }],
    },
    {
        date: '2025-05-05',
        visit: 'Eye Test',
        vitals: { temperature: '98.6°F', bp: '121/81', heartRate: '69 bpm' },
        diagnosis: [{ problem: 'Myopia', severity: 'Moderate' }],
        labTests: [{ name: 'Vision Test', result: '20/40' }],
        prescriptions: [{ medicine: 'Eyeglasses', dosage: 'N/A' }],
    },
];

export default function Timeline() {
    const sectionRefs = useMemo(() => {
        const refs: { [key: string]: React.RefObject<HTMLDivElement | null> } = {};
        dummyData.forEach(item => {
            refs[item.date] = React.createRef<HTMLDivElement>();
        });
        return refs;
    }, []);
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (date: string) => {
        const ref = sectionRefs[date];
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div ref={containerRef} className="flex overflow-hidden m-0 p-0">
            <div className="flex flex-col items-center gap-4 p-4 w-20 transition-all duration-300 menu-open:ml-[120px]">
                {dummyData.map(item => {
                    const [year, month, day] = item.date.split('-');
                    return (
                        <div
                            key={item.date}
                            className="w-14 h-14 flex flex-col items-center justify-center rounded bg-white shadow text-xs text-gray-700 shrink-0 cursor-pointer hover:bg-gray-200"
                            onClick={() => scrollToSection(item.date)}
                        >
                            <div className="font-bold text-base text-blue-700">{day}</div>
                            <div className="font-semibold text-sm text-blue-700">{monthNames[+month - 1]}</div>
                            <div className="text-[10px] text-gray-500">{year}</div>
                        </div>
                    );
                })}
            </div>
            <div className="w-full overflow-y-auto p-6 space-y-12">
                {dummyData.map(item => {
                    const [year, month, day] = item.date.split('-');
                    return (
                        <div key={item.date} ref={sectionRefs[item.date]} className="flex gap-4 items-start">
                            <div
                                className="w-14 h-14 flex flex-col items-center justify-center rounded bg-white shadow text-xs text-gray-700 shrink-0 cursor-pointer hover:bg-gray-200"
                                onClick={() => scrollToSection(item.date)}
                            >
                                <div className="font-bold text-base text-blue-700">{day}</div>
                                <div className="font-semibold text-sm text-blue-700">{monthNames[+month - 1]}</div>
                                <div className="text-[10px] text-gray-500">{year}</div>
                            </div>
                            <div className="relative p-6 border rounded shadow-sm bg-white space-y-4 w-full">
                                <h3 className="text-xl font-semibold">{item.date}</h3>
                                <p className="text-gray-600">{item.visit}</p>

                                <div>
                                    <h4 className="font-semibold">Vitals</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-700">
                                        <li>Temperature: {item.vitals.temperature}</li>
                                        <li>BP: {item.vitals.bp}</li>
                                        <li>Heart Rate: {item.vitals.heartRate}</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold">Diagnosis</h4>
                                    <table className="w-full text-sm border border-gray-300 dark:border-gray-600">
                                        <thead className="bg-gray-100 dark:bg-gray-800">
                                            <tr>
                                                <th className="p-2 text-left text-gray-800 dark:text-white border">Problem</th>
                                                <th className="p-2 text-left text-gray-800 dark:text-white border">Severity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.diagnosis.map((d, i) => (
                                                <tr key={i}>
                                                    <td className="p-2 text-gray-900 dark:text-gray-100 border">{d.problem}</td>
                                                    <td className="p-2 text-gray-900 dark:text-gray-100 border">{d.severity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div>
                                    <h4 className="font-semibold">Lab Tests</h4>
                                    <table className="w-full text-sm border border-gray-300 dark:border-gray-600">
                                        <thead className="bg-gray-100 dark:bg-gray-800">
                                            <tr>
                                                <th className="p-2 text-left text-gray-800 dark:text-white border">Test</th>
                                                <th className="p-2 text-left text-gray-800 dark:text-white border">Result</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.labTests.map((test, i) => (
                                                <tr key={i}>
                                                    <td className="p-2 text-gray-900 dark:text-gray-100 border">{test.name}</td>
                                                    <td className="p-2 text-gray-900 dark:text-gray-100 border">{test.result}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div>
                                    <h4 className="font-semibold">Prescriptions</h4>
                                    <table className="w-full text-sm border border-gray-300 dark:border-gray-600">
                                        <thead className="bg-gray-100 dark:bg-gray-800">
                                            <tr>
                                                <th className="p-2 text-left text-gray-800 dark:text-white border">Medicine</th>
                                                <th className="p-2 text-left text-gray-800 dark:text-white border">Dosage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.prescriptions.map((p, i) => (
                                                <tr key={i}>
                                                    <td className="p-2 text-gray-900 dark:text-gray-100 border">{p.medicine}</td>
                                                    <td className="p-2 text-gray-900 dark:text-gray-100 border">{p.dosage}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
// When a date is clicked on the left, the corresponding visit section on the right will scroll into view smoothly.