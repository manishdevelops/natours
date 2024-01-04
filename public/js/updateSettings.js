const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
};

const updateData = async (name, email) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
            data: {
                name, email
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Data updated successfully!');
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

const userDataForm = document.querySelector('.form-user-data');
if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        updateData(name, email);
    });
}