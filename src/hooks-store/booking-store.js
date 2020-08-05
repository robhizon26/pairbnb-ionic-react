import axios from 'axios';
import { Booking } from '../models/booking.model';

export const bookingActions = {
    FETCH_BOOKINGS: async (state, {userId, token}) => {
        let bookings = [];
        const res = await axios.get(`${process.env.REACT_APP_firebaseURL}/bookings.json?orderBy="userId"&equalTo="${userId}"&auth=${token}`);
        if (res) {
            console.log("FETCH_BOOKINGS res", res);
            const resData = res.data;
            for (const key in resData) {
                if (resData.hasOwnProperty(key)) {
                    bookings.push(
                        new Booking(
                            key,
                            resData[key].placeId,
                            resData[key].userId,
                            resData[key].placeTitle,
                            resData[key].placeImage,
                            resData[key].firstName,
                            resData[key].lastName,
                            resData[key].guestNumber,
                            new Date(resData[key].bookedFrom),
                            new Date(resData[key].bookedTo)
                        )
                    );
                }
            }
        }
        console.log("FETCH_BOOKINGS", bookings);
        return { items: { bookings } };
    },
    CANCEL_BOOKING: async (state, {bookingId, token}) => {
        let bookings = [...state.items.bookings];
        const res = await axios.delete(`${process.env.REACT_APP_firebaseURL}/bookings/${bookingId}.json?auth=${token}`);
        if (res) {
            bookings = bookings.filter(booking => booking.id !== bookingId);
        }
        console.log('CANCEL_BOOKING', bookings);
        return { items: { bookings } };
    }
};
