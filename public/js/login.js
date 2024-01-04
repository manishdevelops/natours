// import axios from 'axios';

// export
const login = async (email, password) => {
    console.log("LOGIN");
    console.log(email, password);

    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if (res.data.status.trim() === 'success') {
            alert('Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');

            }, 1500);
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout',
        });

        if (res.data.status.trim() === 'success') location.reload(true);
        // res.clearCookie('jwt');
        // res.status(200).json({ status: 'success' });
    } catch (err) {
        showAlert('error', 'Error logging out! Try again.')
    }
}

const form = document.querySelector('.form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(email, password);
        login(email, password);
    });

}

const logOutBtn = document.querySelector('.nav__el--logout');
if (logOutBtn) {
    logOutBtn.addEventListener('click', logout);
}
