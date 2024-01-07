const stripe = Stripe('pk_test_51OVsm3SFciT31UIQSY91CXczQu4wIqfhPjmiVxkshcB6FvVEBO6qyALNG4lL2M85dEY8xg88kRji9uzz1PHPXMQG00pVXyZPCH');

const alertHide = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};

const alertShow = (type, msg) => {
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(alertShow, 5000);
};

const bookTour = async tourId => {
    try {
        // 1)Get checkout session from API
        const session = await axios(
            `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
        );
        console.log(session)

        // 2) Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });

    } catch (err) {
        console.log(err);
        alertShow('error', err);
    }
}

const bookBtn = document.getElementById('book-tour');
if (bookBtn) {
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing....';
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    });
}