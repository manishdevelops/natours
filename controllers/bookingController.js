const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    //1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);
    const tourPrice = tour.price * 100 * 83.19;

    //2) Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: 'inr',
                    unit_amount: tourPrice,
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                    },
                },
            }
        ]

    });

    //3) Create session as response
    res.status(200).json({
        status: 'success',
        session
    });
});


// Within the Stripe docs, they provide us with 3 test card numbers that we can use:
// To test successful payments use: 4242 4242 4242 4242
// To test declined payments use: 4000 0000 0000 0002
// To test authorised payments (EU) use:  4000 0000 0000 3220