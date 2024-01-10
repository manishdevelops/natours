const hideAlrt = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};

const shwAlert = (type, msg) => {
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlrt, 5000);
};

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
            shwAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        shwAlert('error', err.response.data.message);

    }
};

const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout',
        });

        if (res.data.status.trim() === 'success') {
            if (location.pathname === '/me') {
                location.assign('/');
            } else {
                location.reload(true);
            }
        }
    } catch (err) {
        shwAlert('error', 'Error logging out! Try again.');
    }
}

const form = document.querySelector('.form--login');
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
