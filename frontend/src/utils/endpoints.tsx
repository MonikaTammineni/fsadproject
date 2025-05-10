const BASE_URL = 'http://3.110.209.24:8080'

export const AUTH_ENDPOINTS = {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    uploadFile: `${BASE_URL}/s3/upload`,
    allPatients: `${BASE_URL}/auth/getAllPatients`,
    validToken: `${BASE_URL}/auth/isValidToken`,
    getPatientFileDetails: `${BASE_URL}/auth/getPatientFileDetails`,
    downloadFile: `${BASE_URL}/s3/downloadFile`,
    viewFile: `${BASE_URL}/s3/viewFile`,
    editUser: `${BASE_URL}/auth/editUser`,
    deleteFile: `${BASE_URL}/s3/deleteFile`,
    updateFile: `${BASE_URL}/s3/updateFile`,
    getAllUsers: `${BASE_URL}/auth/getAllUsers`,
    changePassword: `${BASE_URL}/auth/changePassword`,
    getAllDoctorsList: `${BASE_URL}/auth/getAllDoctorsList`,
    createAppointment: `${BASE_URL}/appointment/createAppointment`,
    getAllAppointments: `${BASE_URL}/appointment/getAllAppointments`,
    editAppointment: `${BASE_URL}/appointment/editAppointment`,
    deleteAppointment: `${BASE_URL}/appointment/deleteAppointment`,
    getPatientFiles: `${BASE_URL}/auth/getPatientFiles`,
};