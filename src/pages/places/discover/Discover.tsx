import React, { useState, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonButtons,
  IonMenuButton, IonSegment, IonSegmentButton, IonRow, IonGrid, IonCol, IonSpinner, IonCard,
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg, IonCardContent, IonButton, IonItem, IonList, IonThumbnail
} from '@ionic/react';
import { authGuard } from '../../../components/auth/AuthGuard';
import { usePlaceStore, useAuthStore } from '../../../hooks-store/store';
import { Place } from '../../../models/place.model';
import { RouteComponentProps } from 'react-router';

interface DiscoverProps extends RouteComponentProps {  }
const Discover: React.FC<DiscoverProps> = ((props) => {
  const [placeState, dispatch]: any = usePlaceStore();
  const authState: any = useAuthStore()[0];
  const { items: { places } } = placeState;
  const { auth: { token, userId } } = authState;
  console.log('Discover props', props);

  let isLoading = false;
  let loadedPlaces: Place[];
  let listedLoadedPlaces: Place[] = [];
  let relevantPlaces: Place[] = [];

  useEffect(() => {
    dispatch("FETCH_PLACES", token);
  }, []);
 

  const [segment, setSegment] = useState<'all' | 'bookable'>('all');

  if (!places) {
    isLoading = true;
  } else {
    isLoading = false;
    loadedPlaces = places;
    if (segment === 'all') {
      relevantPlaces = [...loadedPlaces];
    } else {
      relevantPlaces = loadedPlaces.filter(place => place.userId !== userId);
    }
    listedLoadedPlaces = relevantPlaces.slice(1);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Discover Places</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding" >
        <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as any)}>
          <IonSegmentButton value="all">All Places</IonSegmentButton>
          <IonSegmentButton value="bookable">Bookable Places</IonSegmentButton>
        </IonSegment>
        {isLoading &&
          <IonGrid>
            <IonRow>
              <IonCol size="12" size-sm="8" offset-sm="2" class="ion-text-center">
                <IonSpinner color="primary" />
              </IonCol>
            </IonRow>
          </IonGrid>
        }
        {!isLoading && relevantPlaces.length <= 0 &&
          <IonGrid>
            <IonRow>
              <IonCol size="12" size-sm="8" offset-sm="2" class="ion-text-center">
                <p>There are no bookable places right now, please come back later!</p>
              </IonCol>
            </IonRow>
          </IonGrid>
        }
        {!isLoading && relevantPlaces.length > 0 &&
          <IonGrid>
            <IonRow>
              <IonCol size="12" size-sm="8" offset-sm="2" class="ion-text-center">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>{relevantPlaces[0].title}</IonCardTitle>
                    <IonCardSubtitle>${relevantPlaces[0].price} / night</IonCardSubtitle>
                  </IonCardHeader>
                  <IonImg src={relevantPlaces[0].imageUrl}></IonImg>
                  <IonCardContent> <p>{relevantPlaces[0].description}</p></IonCardContent>
                  <div>
                    <IonButton fill="clear" color="primary" routerLink={"/places/discover/" + relevantPlaces[0].id}>More</IonButton>
                  </div>
                </IonCard>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12" size-sm="8" offset-sm="2" class="ion-text-center">
                <IonList >
                  {listedLoadedPlaces.map(place => (
                    <IonItem key={place.id} routerLink={"/places/discover/" + place.id}>
                      <IonThumbnail slot="start" >
                        <IonImg src={place.imageUrl}></IonImg>
                      </IonThumbnail>
                      <IonLabel>
                        <h2>{place.title}</h2>
                        <h3>${place.price} / night</h3>
                        <p>{place.description}</p>
                      </IonLabel>
                    </IonItem >
                  ))}
                </IonList>
              </IonCol>
            </IonRow>
          </IonGrid>
        }
      </IonContent>
    </IonPage>
  );
});

export default authGuard(Discover);
