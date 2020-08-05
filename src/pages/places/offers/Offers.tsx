import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonButton, IonIcon, IonCol, IonSpinner, IonList, IonItemSliding, IonItemOptions, IonItemOption, IonItem, IonAvatar, IonImg, IonLabel } from '@ionic/react';
import { add, create } from 'ionicons/icons';
import { authGuard } from '../../../components/auth/AuthGuard';
import { Place } from '../../../models/place.model';
import { usePlaceStore, useAuthStore } from '../../../hooks-store/store';
import OfferItem from './offer-item/OfferItem';
import { RouteComponentProps } from 'react-router';

interface OffersProps extends RouteComponentProps { }

const Offers: React.FC<OffersProps> = (props) => {
  const placeState: any = usePlaceStore()[0];
  const authState: any = useAuthStore()[0];
  const { items: { places } } = placeState;
  const { auth: { token, userId } } = authState;

  let isLoading = false;
  let offers: Place[] = [];

  if (!places) {
    isLoading = true;
  } else {
    isLoading = false;
    offers = [...places];
    console.log('offers', offers)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>My Offers</IonTitle>
          <IonButtons slot="primary">
            <IonButton routerLink="/places/offers/new">
              <IonIcon slot="icon-only" icon={add}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonCol size="12" size-sm="8" offset-sm="2" class="ion-text-center">
          {isLoading &&
            <IonSpinner color="primary" />
          }
          {!isLoading && offers.length <= 0 &&
            <div >
              <p>No offers found! Please create one first!</p>
              <IonButton color="primary" routerLink="/places/offers/new" >Offer New Place</IonButton>
            </div>
          }
          {!isLoading && offers.length > 0 &&
            <IonList >
              {offers.map((offer: Place) => (
                <IonItemSliding key={offer.id}>
                  <OfferItem {...props} offer={offer}></OfferItem>
                  <IonItemOptions side="end">
                    <IonItemOption color="secondary" routerLink={"/places/offers/edit/" + offer.id}>
                      <IonIcon slot="icon-only" icon={create} />
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))
              }
            </IonList>
          }
        </IonCol>
      </IonContent>
    </IonPage>
  );
}

export default authGuard(Offers);
