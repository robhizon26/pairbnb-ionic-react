import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuToggle, IonItem, IonLabel, IonIcon  } from '@ionic/react';
import { business, checkboxOutline, exitOutline } from 'ionicons/icons';
import { useAuthStore } from "../hooks-store/store";
import { logout } from '../actions/auth';

export const Menu: React.FC  = ( ) => {
    const dispatch: any = useAuthStore(false)[1];
    const llogout = () => {
        logout();
        dispatch("USER_LOGGED_OUT");
    }
    return (
        <IonMenu contentId="menuContent">
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>PairBnB</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonMenuToggle auto-hide="false" >
                    <IonItem lines="none" routerLink="/places/discover" >
                        <IonIcon slot="start" icon={business}></IonIcon>
                        <IonLabel>Discover Places</IonLabel>
                    </IonItem>
                    <IonItem lines="none" routerLink="/bookings">
                        <IonIcon slot="start" icon={checkboxOutline}></IonIcon>
                        <IonLabel>Your Bookings</IonLabel>
                    </IonItem>
                    <IonItem lines="none" routerLink="/auth">
                        <IonIcon slot="start" icon={exitOutline}></IonIcon>
                        <IonLabel>Logout</IonLabel>
                    </IonItem>
                </IonMenuToggle>
            </IonContent>
        </IonMenu>
    )
};