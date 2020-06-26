import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51Gxs0KBC9MYyeWa3VzHV6RTOCSwacHUOTPXlkJu7DgqWc14yOhNbXBhWorhLzaYeKdsCUXBZd2jNa8q6uoFOETTZ002wvX9YBG');

 export const bookTour = async (tourId) => {
    try {
        const session = await axios(`http://localhost:8000/api/v1/bookings/checkout-session/${tourId}`);
        const {error} = await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (error) {
        showAlert('error', error);
    }

 }