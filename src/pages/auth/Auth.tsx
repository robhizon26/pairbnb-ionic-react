import React, { useState, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonGrid, IonRow, IonCol, IonList,
  IonItem, IonInput, IonButton, IonLoading, IonAlert
} from '@ionic/react';
import * as EmailValidator from 'email-validator';

import { signup, login, logout } from '../../actions/auth';
import { RouteComponentProps } from 'react-router';
import { useAuthStore } from '../../hooks-store/store';

interface AuthProps extends RouteComponentProps { }

const Auth: React.FC<AuthProps> = ((props) => {
  console.log('Auth props', props);
  const dispatch: any = useAuthStore(false)[1];
  const [email, setEmail] = useState({ value: '', touched: false });
  const [password, setPassword] = useState({ value: '', touched: false });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Error occured.');

  const isValidEmail = () => EmailValidator.validate(email.value);
  const isValidPassword = () => password.value.length >= 6;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail() || !isValidPassword()) return;
    authenticate(email.value, password.value);
  }

  useEffect(() => {
    logout();
    dispatch("USER_LOGGED_OUT");
    dispatch("UNMOUNT");
  }, []);

  const authenticate = async (email: string, password: string) => {
    setIsLoading(true);
    let auth: any = { data: null, error: null };
    if (isLoginMode) {
      auth = await login(email, password);
    } else {
      auth = await signup(email, password);
    }
    const { data, error } = auth;
    setIsLoading(false);
    if (error) {
      let errorMessage = error;
      if (error === 'EMAIL_EXISTS') {
        errorMessage = 'This email address exists already!';
      } else if (error === 'EMAIL_NOT_FOUND') {
        errorMessage = 'E-Mail address could not be found.';
      } else if (error === 'INVALID_PASSWORD') {
        errorMessage = 'This password is not correct.';
      } else if (error.indexOf('TOO_MANY_ATTEMPTS_TRY_LATER') > -1) {
        errorMessage = 'Too many unsuccessful login attempts. Please try again later.';
      }
      setErrorMessage(errorMessage);
      setShowAlert(true);
    } else if (data) {
      await dispatch("USER_AUTHENTICATED", data);
      props.history.push('/places/discover');
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{isLoginMode ? 'Login' : 'SignUp'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <form onSubmit={onSubmit}>
          <IonGrid>
            <IonRow>
              <IonCol size-sm="6" offset-sm="3">
                <IonList>
                  <IonItem>
                    <IonLabel position="floating">E-Mail</IonLabel>
                    <IonInput type="email" name="email" value={email.value} required clearInput
                      onIonChange={e => setEmail({ value: e.detail.value!, touched: true })} ></IonInput>
                  </IonItem>
                  {email.touched && !EmailValidator.validate(email.value) &&
                    <IonItem>
                      <IonLabel>Should be a valid email address.</IonLabel>
                    </IonItem>
                  }
                  <IonItem>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput type="password" name="password" value={password.value} required clearInput minlength={6}
                      onIonChange={e => setPassword({ value: e.detail.value!, touched: true })} ></IonInput>
                  </IonItem>
                  {password.touched && password.value.length < 6 &&
                    <IonItem>
                      <IonLabel>Should at least be 6 characters long.</IonLabel>
                    </IonItem>
                  }
                </IonList>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size-sm="6" offset-sm="3">
                <IonButton color="primary"
                  type="button"
                  fill="clear"
                  expand="block" onClick={() => setIsLoginMode(!isLoginMode)}
                >Switch to {isLoginMode ? 'Signup' : 'Login'}</IonButton>
                <IonButton color="primary"
                  type="submit"
                  expand="block" disabled={!isValidEmail() || !isValidPassword()}
                >   {isLoginMode ? 'Login' : 'Signup'}</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </form>
        <IonLoading
          isOpen={isLoading}
          onDidDismiss={() => setIsLoading(false)}
          message={'Logging in...'}
        />
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Authentication failed'}
          message={errorMessage}
          buttons={['Okay']}
        />
      </IonContent>
    </IonPage>
  );
});

export default Auth;
