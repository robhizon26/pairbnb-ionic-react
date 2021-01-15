import axios from 'axios';
import { Booking } from '../models/booking.model';
import { Place } from '../models/place.model';

export const addBooking = async (place: Place|any, bookingData: any, userId: string, token: string) => {
    let error, response: any;
    let newBooking: Booking = new Booking(
        Math.random().toString(),
        place.id,
        userId,
        place.title,
        place.imageUrl,
        bookingData.firstName,
        bookingData.lastName,
        bookingData.guestNumber,
        bookingData.startDate,
        bookingData.endDate
    );
    await axios.post(`${process.env.REACT_APP_firebaseURL}/bookings.json?auth=${token}`, { ...newBooking, id: null })
        .then(res => {
            if (res) {
                response = res;
            }
        })
        .catch(err => {
            error = err;
        });
    return { response, error };
}