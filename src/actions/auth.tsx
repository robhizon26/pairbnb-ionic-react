import axios from 'axios';
import { Plugins } from '@capacitor/core';

import { getErrorMessage } from './utils';
import { User } from '../models/user.model';

let activeLogoutTimer: any;
export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    localId: string;
    expiresIn: string;
    registered?: boolean;
}

export const signup = (email: string, password: string) => {
    const url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${process.env.REACT_APP_firebaseAPIKey}`;
    return loginOrsignUp(email, password, url);
}

export const login = (email: string, password: string) => {
    const url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${process.env.REACT_APP_firebaseAPIKey}`;
    return loginOrsignUp(email, password, url);
}

export const autoLogin = async () => {
    const storedData = await Plugins.Storage.get({ key: 'authData' });
    console.log('storedData', storedData);
    if (!storedData || !storedData.value) return null;
    console.log('autoLogin 2')
    const parsedData = JSON.parse(storedData.value) as {
        token: string;
        tokenExpirationDate: string;
        userId: string;
        email: string;
    };
    const expirationTime = new Date(parsedData.tokenExpirationDate);
    if (expirationTime <= new Date()) {
        return null;
    }
    const user = new User(
        parsedData.userId,
        parsedData.email,
        parsedData.token,
        expirationTime
    );
    autoLogout(user.tokenDuration);
    return user;
}

const loginOrsignUp = async (email: string, password: string, url: string) => {
    let error, data;
    await axios.post<AuthResponseData>(url,
        { email: email, password: password, returnSecureToken: true })
        .then(function (response) {
            setUserData(response.data);
            data = response.data;
        })
        .catch(err => {
            error = getErrorMessage(err);
        });
    return { data, error };
}

const setUserData = (userData: AuthResponseData) => {
    const expirationTime = new Date(
        new Date().getTime() + +userData.expiresIn * 1000
    );
    const user = new User(
        userData.localId,
        userData.email,
        userData.idToken,
        expirationTime
    );
    autoLogout(user.tokenDuration);
    storeAuthData(
        userData.localId,
        userData.idToken,
        expirationTime.toISOString(),
        userData.email
    );
}

const autoLogout = (duration: number) => {
    if (activeLogoutTimer) {
        clearTimeout(activeLogoutTimer);
    }
    activeLogoutTimer = setTimeout(() => {
        logout();
    }, duration);
}


const storeAuthData = (
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
) => {
    const data = JSON.stringify({
        userId: userId,
        token: token,
        tokenExpirationDate: tokenExpirationDate,
        email: email
    });
    Plugins.Storage.set({ key: 'authData', value: data });
}

export const logout = () => {
    console.log('logout')
    if (activeLogoutTimer) {
        clearTimeout(activeLogoutTimer);
    }
    Plugins.Storage.remove({ key: 'authData' });
}