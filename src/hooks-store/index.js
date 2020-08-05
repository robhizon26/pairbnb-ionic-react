import { initAuthStore, initPlaceStore, initBookingStore } from "./store";
import { commonActions } from "./common-store";
import { authActions } from "./auth-store";
import { placeActions } from "./place-store";
import { bookingActions } from "./booking-store";
 
const initialState = {
  items: {},
  errors: [],
  auth: { userIsAuthenticated: null, userId: null, token: null }
};

export const configureHookStore = () => {
  initAuthStore({ ...commonActions, ...authActions }, initialState);
  initPlaceStore({ ...commonActions, ...placeActions }, initialState);
  initBookingStore({ ...commonActions, ...bookingActions }, initialState);
}

