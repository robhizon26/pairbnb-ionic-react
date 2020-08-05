import axios from 'axios';
import { Place } from '../models/place.model';

export const uploadImage = async (image: File | Blob, token: string) => {
  let error, imageRes: any;
  const uploadData = new FormData();
  uploadData.append('image', image);
  await axios.post<{ imageUrl: string; imagePath: string }>(`${process.env.REACT_APP_fbStoreImageURL}`, uploadData,
      { headers: { Authorization: 'Bearer ' + token } })
    .then((uploadRes: any) => imageRes = uploadRes.data)
    .catch(err => error = err);
  return { imageRes, error };
}

export const getPlaceById = async (id: string, token: string) => {
  let error, place: any;
  await axios.get(`${process.env.REACT_APP_firebaseURL}/offered-places/${id}.json?auth=${token}`)
    .then(res => {
      const placeData = res.data;
      if (placeData) {
        place = new Place(
          id,
          placeData.title,
          placeData.description,
          placeData.imageUrl,
          placeData.price,
          new Date(placeData.availableFrom),
          new Date(placeData.availableTo),
          placeData.userId,
          placeData.location
        );
      }

    })
    .catch(err => {
      error = err;
    });
  return { place, error };
}

export const updatePlace = async (updatedOffer: Place, token: string) => {
  let error, response: any;
  await axios.put(`${process.env.REACT_APP_firebaseURL}/offered-places/${updatedOffer.id}.json?auth=${token}`, { ...updatedOffer, id: null })
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

export const addPlace = async (newPlace: Place, token: string) => {
  let error, response: any;
  await axios.post(`${process.env.REACT_APP_firebaseURL}/offered-places.json?auth=${token}`, { ...newPlace, id: null })
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

export const getAddress = async (lat: number, lng: number) => {
  let error, address: any;
  await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_googleMapsAPIKey}`)
    .then(res => {
      const geoData = res.data;
      if (!geoData || !geoData.results || geoData.results.length === 0) error = 'any';
      address = geoData.results[0].formatted_address;
    })
    .catch(err => {
      error = err;
    });
  return { address, error };
}
