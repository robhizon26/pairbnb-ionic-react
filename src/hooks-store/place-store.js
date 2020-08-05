import axios from 'axios';
import {Place} from '../models/place.model';

export const placeActions = {
    FETCH_PLACES: async (state, token) => {
        let places = [];
        const res = await axios.get(`${process.env.REACT_APP_firebaseURL}/offered-places.json?auth=${token}`);
        if (res) {
            const resData = res.data;
            for (const key in resData) {
                if (resData.hasOwnProperty(key)) {
                    places.push(
                        new Place(
                            key,
                            resData[key].title,
                            resData[key].description,
                            resData[key].imageUrl,
                            resData[key].price,
                            new Date(resData[key].availableFrom),
                            new Date(resData[key].availableTo),
                            resData[key].userId,
                            resData[key].location
                        )
                    );
                }
            }
        }
        console.log("FETCH_PLACES", places);
        return { items: { places } };
    }
};
