import { useState, useEffect, useCallback } from "react";

let globalAuthState = {};
let authListeners = [];
let authActions = {};

export const useAuthStore = (shouldListen = true) => {
  const setState = useState(globalAuthState)[1];

  const dispatch = useCallback(async (actionIdentifier, payload) => {
    const newState = await authActions[actionIdentifier](globalAuthState, payload);
    globalAuthState = { ...globalAuthState, ...newState };
    for (const listener of authListeners) {
      listener(globalAuthState);
    }
  }, []);
  useEffect(() => {
    if (shouldListen) {
      authListeners.push(setState);
    }

    return () => {
      if (shouldListen) {
        authListeners = authListeners.filter((li) => li !== setState);
      }
    };
  }, [setState, shouldListen]);

  return [globalAuthState, dispatch];
};

export const initAuthStore = (userActions, initialState) => {
  if (initialState) {
    globalAuthState = { ...globalAuthState, ...initialState };
  }
  authActions = { ...authActions, ...userActions };
};


let globalPlaceState = {};
let placeListeners = [];
let placeActions = {};

export const usePlaceStore = (shouldListen = true) => {
  const setState = useState(globalPlaceState)[1];

  const dispatch = useCallback(async (actionIdentifier, payload) => {
    const newState = await placeActions[actionIdentifier](globalPlaceState, payload);
    globalPlaceState = { ...globalPlaceState, ...newState };
    for (const listener of placeListeners) {
      listener(globalPlaceState);
    }
  }, []);
  useEffect(() => {
    if (shouldListen) {
      placeListeners.push(setState);
    }

    return () => {
      if (shouldListen) {
        placeListeners = placeListeners.filter((li) => li !== setState);
      }
    };
  }, [setState, shouldListen]);

  return [globalPlaceState, dispatch];
};

export const initPlaceStore = (userActions, initialState) => {
  if (initialState) {
    globalPlaceState = { ...globalPlaceState, ...initialState };
  }
  placeActions = { ...placeActions, ...userActions };
};

let globalBookingState = {};
let bookingListeners = [];
let bookingActions = {};

export const useBookingStore = (shouldListen = true) => {
  const setState = useState(globalBookingState)[1];

  const dispatch = useCallback(async (actionIdentifier, payload) => {
    const newState = await bookingActions[actionIdentifier](globalBookingState, payload);
    globalBookingState = { ...globalBookingState, ...newState };
    for (const listener of bookingListeners) {
      listener(globalBookingState);
    }
  }, []);
  useEffect(() => {
    if (shouldListen) {
      bookingListeners.push(setState);
    }

    return () => {
      if (shouldListen) {
        bookingListeners = bookingListeners.filter((li) => li !== setState);
      }
    };
  }, [setState, shouldListen]);

  return [globalBookingState, dispatch];
};

export const initBookingStore = (userActions, initialState) => {
  if (initialState) {
    globalBookingState = { ...globalBookingState, ...initialState };
  }
  bookingActions = { ...bookingActions, ...userActions };
};

 