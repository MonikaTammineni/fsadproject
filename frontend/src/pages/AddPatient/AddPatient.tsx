import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { AUTH_ENDPOINTS } from "../../utils/endpoints.tsx";

const genders = ['MALE', 'FEMALE', 'OTHER'];

const AddPatient: React.FC = () => {
    const [isSecondStep, setIsSecondStep] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipcode: '',
        gender: '',
        dateOfBirth: '',
        mobileNumber: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Helper to calculate age from date of birth
    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const validateStep = (): boolean => {
        const phoneRegex = /^[0-9]{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
        const zipRegex = /^[0-9]{6}$/;
        const newErrors: { [key: string]: string } = {};

        if (!formData.firstName) newErrors.firstName = 'Required';
        if (!formData.lastName) newErrors.lastName = 'Required';
        if (!formData.addressLine1) newErrors.addressLine1 = 'Required';
        if (!formData.city) newErrors.city = 'Required';
        if (!formData.state) newErrors.state = 'Required';
        // Enhanced zipcode validation
        if (!zipRegex.test(formData.zipcode)) {
            newErrors.zipcode = '6 digit zipcode required';
        }
        if (!formData.gender) newErrors.gender = 'Required';
        // Enhanced dateOfBirth validation
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Required';
        } else if (new Date(formData.dateOfBirth) >= new Date()) {
            newErrors.dateOfBirth = 'Must be before today';
        }
        if (!phoneRegex.test(formData.mobileNumber)) newErrors.mobileNumber = '10 digit number required';
        if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!passwordRegex.test(formData.password)) newErrors.password = 'Min 6 chars, letters & numbers';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!validateStep()) {
            toast.error('Please fix the errors before submitting.');
            return;
        }

        const { addressLine1, addressLine2, city, state, zipcode, ...rest } = formData;
        const address = `${addressLine1}${addressLine2 ? `, ${addressLine2}` : ''}, ${city}, ${state} - ${zipcode}`;
        const payload = {
            ...rest,
            address,
            mobileNumber: formData.mobileNumber,
            accountType: 'PATIENT',
            status: true,
        };

        try {
            const res = await fetch(`${AUTH_ENDPOINTS.register}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success('Patient registered!');
                // Instead of navigating away, keep user on step 2 and show success toast.
                setIsEditing(false);
                setIsSecondStep(true);
            } else {
                const errorData = await res.json();
                toast.error(`Registration failed: ${errorData?.message || 'Something went wrong'}`);
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error('Network error');
        }
    };

    // Function to reset the form for registering another patient
    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipcode: '',
            gender: '',
            dateOfBirth: '',
            mobileNumber: '',
            email: '',
            password: ''
        });
        setIsSecondStep(false);
        setIsEditing(true);
        setErrors({});
    };

    return (
        <div className="flex flex-col">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg  flex flex-col" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-4">Add Patient</h2>

                <div className="w-full" >
                    <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <h2 className="text-2xl font-semibold text-left text-gray-800 col-span-2">Step {isSecondStep ? 2 : 1} of 2</h2>

                {!isSecondStep ? (
                            <>
                                {['firstName', 'lastName', 'dateOfBirth', 'mobileNumber', 'email', 'password'].map((field) => (
                                    <div key={field} className="col-span-1 w-full">
                                        <label className="block text-sm font-semibold text-gray-600 capitalize">
                                            {field.replace(/([A-Z])/g, ' $1')}
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        {field === 'mobileNumber' ? (
                                            <div className="flex items-center">
                                                <span className="inline-flex items-center px-3 h-[48px] border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm rounded-l-lg">
                                                    +91
                                                </span>
                                                <input
                                                    type="text"
                                                    name="mobileNumber"
                                                    value={formData.mobileNumber}
                                                    onChange={handleChange}
                                                    disabled={isSecondStep && !isEditing}
                                                    className={`h-[48px] w-full p-3 border border-gray-300 rounded-r-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition text-sm sm:text-base ${isSecondStep && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                                />
                                            </div>
                                        ) : field === 'dateOfBirth' ? (
                                            <>
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleChange}
                                                    disabled={isSecondStep && !isEditing}
                                                    className={`mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition text-sm sm:text-base ${isSecondStep && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                                />
                                                {formData.dateOfBirth && (
                                                    <p className="text-sm text-gray-600 mt-1">Age: {calculateAge(formData.dateOfBirth)} years</p>
                                                )}
                                            </>
                                        ) : (
                                            <input
                                                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                                                name={field}
                                                value={formData[field as keyof typeof formData]}
                                                onChange={handleChange}
                                                disabled={isSecondStep && !isEditing}
                                                className={`mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition text-sm sm:text-base ${isSecondStep && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            />
                                        )}
                                        {errors[field] && <p className="text-sm text-red-600">{errors[field]}</p>}
                                    </div>
                                ))}

                                <div className="col-span-1 w-full">
                                    <label className="block text-sm font-semibold text-gray-600">Address Line 1<span className="text-red-500 ml-1">*</span></label>
                                    <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} disabled={isSecondStep && !isEditing} className={`mt-1 w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base ${isSecondStep && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                                    {errors.addressLine1 && <p className="text-sm text-red-600">{errors.addressLine1}</p>}
                                </div>
                                <div className="col-span-1 w-full">
                                    <label className="block text-sm font-semibold text-gray-600">Address Line 2</label>
                                    <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} disabled={isSecondStep && !isEditing} className={`mt-1 w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base ${isSecondStep && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                                </div>
                                <div className="col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-gray-600">City/Town<span className="text-red-500 ml-1">*</span></label>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} disabled={isSecondStep && !isEditing} className={`mt-1 w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base ${isSecondStep && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                                        {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-gray-600">State<span className="text-red-500 ml-1">*</span></label>
                                        <input type="text" name="state" value={formData.state} onChange={handleChange} disabled={isSecondStep && !isEditing} className={`mt-1 w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base ${isSecondStep && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                                        {errors.state && <p className="text-sm text-red-600">{errors.state}</p>}
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-gray-600">Zipcode<span className="text-red-500 ml-1">*</span></label>
                                        <input type="text" name="zipcode" value={formData.zipcode} onChange={handleChange} disabled={isSecondStep && !isEditing} className={`mt-1 w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base ${isSecondStep && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                                        {errors.zipcode && <p className="text-sm text-red-600">{errors.zipcode}</p>}
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-gray-600">Gender<span className="text-red-500 ml-1">*</span></label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            disabled={isSecondStep && !isEditing}
                                            className={`mt-1 w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base ${isSecondStep && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        >
                                            <option value="">Select Gender</option>
                                            {genders.map((g) => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                        </select>
                                        {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {['firstName', 'lastName', 'dateOfBirth', 'mobileNumber', 'email', 'password'].map((field) => (
                                    <div key={field} className="col-span-1 w-full">
                                        <label className="block text-sm font-semibold text-gray-600 capitalize">
                                            {field.replace(/([A-Z])/g, ' $1')}
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        {field === 'mobileNumber' ? (
                                            <div className="flex items-center">
                                                <span className="inline-flex items-center px-3 h-[48px] border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm rounded-l-lg">
                                                    +91
                                                </span>
                                                <input
                                                    type="text"
                                                    name="mobileNumber"
                                                    value={formData.mobileNumber}
                                                    onChange={handleChange}
                                                    disabled={true}
                                                    className={`h-[48px] w-full p-3 border border-gray-300 rounded-r-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition text-sm sm:text-base bg-gray-100 cursor-not-allowed`}
                                                />
                                            </div>
                                        ) : field === 'dateOfBirth' ? (
                                            <>
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleChange}
                                                    disabled={true}
                                                    className={`mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition text-sm sm:text-base bg-gray-100 cursor-not-allowed`}
                                                />
                                                {formData.dateOfBirth && (
                                                    <p className="text-sm text-gray-600 mt-1">Age: {calculateAge(formData.dateOfBirth)} years</p>
                                                )}
                                            </>
                                        ) : (
                                            <input
                                                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                                                name={field}
                                                value={formData[field as keyof typeof formData]}
                                                onChange={handleChange}
                                                disabled={true}
                                                className={`mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition text-sm sm:text-base bg-gray-100 cursor-not-allowed`}
                                            />
                                        )}
                                    </div>
                                ))}
                                <div className="col-span-1 w-full">
                                    <label className="block text-sm font-semibold text-gray-600">Address Line 1<span className="text-red-500 ml-1">*</span></label>
                                    <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} disabled={true} className="mt-1 w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base bg-gray-100 cursor-not-allowed" />
                                </div>
                                <div className="col-span-1 w-full">
                                    <label className="block text-sm font-semibold text-gray-600">Address Line 2</label>
                                    <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} disabled={true} className="mt-1 w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base bg-gray-100 cursor-not-allowed" />
                                </div>
                                <div className="col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-gray-600">City/Town<span className="text-red-500 ml-1">*</span></label>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} disabled={true} className="mt-1 w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base bg-gray-100 cursor-not-allowed" />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-gray-600">State<span className="text-red-500 ml-1">*</span></label>
                                        <input type="text" name="state" value={formData.state} onChange={handleChange} disabled={true} className="mt-1 w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base bg-gray-100 cursor-not-allowed" />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-gray-600">Zipcode<span className="text-red-500 ml-1">*</span></label>
                                        <input type="text" name="zipcode" value={formData.zipcode} onChange={handleChange} disabled={true} className="mt-1 w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base bg-gray-100 cursor-not-allowed" />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-gray-600">Gender<span className="text-red-500 ml-1">*</span></label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            disabled={true}
                                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base bg-gray-100 cursor-not-allowed"
                                        >
                                            <option value="">Select Gender</option>
                                            {genders.map((g) => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
            {/* Buttons below the white container */}
            {isSecondStep && (
                <div className="flex justify-between mt-6 px-6">
                    <button
                        type="button"
                        onClick={() => {
                            setIsSecondStep(false);
                            setIsEditing(true);
                        }}
                        className="px-6 py-3 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Back
                    </button>
                    {isEditing ? (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                            Confirm & Register
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-3 text-white rounded-lg bg-green-600 hover:bg-green-700 shadow-md"
                        >
                            Register Another Patient
                        </button>
                    )}
                </div>
            )}

            {!isSecondStep && (
                <div className="flex justify-end mt-6 px-6">
                    <button
                        type="button"
                        onClick={() => {
                            if (validateStep()) {
                                setIsSecondStep(true);
                                setIsEditing(true);
                            } else {
                                toast.error('Please fix the errors before proceeding.');
                            }
                        }}
                        className={`px-6 py-3 text-white rounded-lg font-semibold shadow-lg transition ${
                            Object.keys(errors).length === 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddPatient;