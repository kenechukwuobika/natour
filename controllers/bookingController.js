const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const handlerFactory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');


exports.getAllBookings = handlerFactory.getAll(Booking);
exports.createBooking = handlerFactory.createOne(Booking);
exports.getBooking = handlerFactory.getOne(Booking);
exports.updateBooking = handlerFactory.updateOne(Booking);
exports.deleteBooking = handlerFactory.deleteOne(Booking);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&price=${tour.price}&user=${req.user.id}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [{
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: ['https://www.natours.dev/img/tours/tour-2-cover.jpg'],
            amount: tour.price * 100,
            currency: 'USD',
            quantity: 1
        }]
    });

    res.status(200).json({
        status: 'success',
        session
    })
    
    next();
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    const {tour, price, user} = req.query;
    if(!tour && !user && !price) return next();
    await Booking.create({ tour, user, price });
    res.redirect( req.originalUrl.split('?')[0])
})