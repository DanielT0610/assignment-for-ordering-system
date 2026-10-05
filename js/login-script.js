// Show the selected login form
function showLogin(userType) {
    document.querySelectorAll('.login-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${userType}-login`).classList.add('active');

    // Load saved credentials if they exist
    if (userType === 'patient') {
        const savedRoom = localStorage.getItem('savedPatientRoom');
        const savedPassword = localStorage.getItem('savedPatientPassword');
        if (savedRoom && savedPassword) {
            document.getElementById('patient-room').value = savedRoom;
            document.getElementById('patient-password').value = savedPassword;
            document.getElementById('patient-remember-me').checked = true;
        }
    } else if (userType === 'staff') {
        const savedUsername = localStorage.getItem('savedStaffUsername');
        const savedPassword = localStorage.getItem('savedStaffPassword');
        if (savedUsername && savedPassword) {
            document.getElementById('staff-username').value = savedUsername;
            document.getElementById('staff-password').value = savedPassword;
            document.getElementById('staff-remember-me').checked = true;
        }
    }
}

// Patient Login
function loginPatient() {
    const room = document.getElementById('patient-room').value;
    const password = document.getElementById('patient-password').value;
    const rememberMe = document.getElementById('patient-remember-me').checked;

    if (room && password) {
        if (rememberMe) {
            localStorage.setItem('savedPatientRoom', room);
            localStorage.setItem('savedPatientPassword', password);
        } else {
            localStorage.removeItem('savedPatientRoom');
            localStorage.removeItem('savedPatientPassword');
        }

        localStorage.setItem('patientRoom', room);
        window.location.href = 'patient-dashboard.html';
    } else {
        alert('Please enter your room number and password.');
    }
}

// Staff Login
function loginStaff() {
    const username = document.getElementById('staff-username').value;
    const password = document.getElementById('staff-password').value;
    const rememberMe = document.getElementById('staff-remember-me').checked;

    if (username && password) {
        if (rememberMe) {
            localStorage.setItem('savedStaffUsername', username);
            localStorage.setItem('savedStaffPassword', password);
        } else {
            localStorage.removeItem('savedStaffUsername');
            localStorage.removeItem('savedStaffPassword');
        }

        window.location.href = 'staff-dashboard.html';
    } else {
        alert('Please enter your credentials.');
    }
}

// Load translations on page load
window.onload = function () {
    changeLanguage();
};