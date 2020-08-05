import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,  IonButtons,  IonBackButton, IonLoading, IonAlert, IonSpinner, IonGrid, IonRow, IonCol, IonImg, IonButton, IonActionSheet, IonModal } from '@ionic/react';
import { RouteComponentProps } from 'react-router';

import './PlaceDetail.scss';
import { useAuthStore, useBookingStore } from '../../../../hooks-store/store';
import { Place } from '../../../../models/place.model';
import { getPlaceById } from '../../../../actions/place';
import CreateBooking from '../../../bookings/create-booking/CreateBooking';
import { addBooking } from '../../../../actions/booking';
import MapModal from '../../../../components/map-modal/MapModal';
interface PlaceDetailProps extends RouteComponentProps { }

const PlaceDetail: React.FC<PlaceDetailProps> =  ((props: any) => {
  console.log('PlaceDetail');
  const dispatchBooking: any = useBookingStore(false)[1];
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showBookingAlert, setShowBookingAlert] = useState(false);
  const [showDateActionSheet, setShowDateActionSheet] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedDateMode, setSelectedDateMode] = useState('select');
  const [mapProps, setMapProps] = useState<any>();

  const [mplace, setMPlace] = useState<Place>();
  const [isBookable, setIsBookable] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');

  const authState: any = useAuthStore()[0];
  const { auth: { token, userId } } = authState;
  const { placeId } = props.match.params;

  const onInitialize = async () => {
    let placeData: any = { place: null, error: null };
    placeData = await getPlaceById(placeId, token)
    const { place, error } = placeData;
    setIsLoading(false);
    if (error) {
      setShowAlert(true);
    } else if (place) {
      setIsBookable(place.userId !== userId);
      setHeaderTitle(`${place.title}, $${place.price}/night`);
      setMPlace(place);
    }
  }

  useEffect(() => {
    onInitialize();
  }, []);

  if (!placeId || !userId) {
    props.history.goBack();
    return null;
  }

  const openBookingModal = (mode: 'select' | 'random') => {
    console.log('PlaceDetail openBookingModal')
    setSelectedDateMode(mode);
    setShowCreateModal(true);
  }

  const onShowFullMap = () => {
    console.log('PlaceDetail onShowFullMap')
    setMapProps({
      center: {
        lat: mplace && mplace.location.lat,
        lng: mplace && mplace.location.lng
      },
      selectable: false,
      closeButtonText: 'Close',
      title: mplace && mplace.location.address
    });
    setShowMapModal(true);
  }

  const onDismissModal = async (bookingData: any) => {
    console.log('PlaceDetail onDismissModal')
    setShowCreateModal(false);
    if (bookingData) {
      setIsBooking(true);
      let addBookingData: any = { response: null, error: null };
      addBookingData = await addBooking(mplace, bookingData, userId, token)
      const { response, error } = addBookingData;
      setIsBooking(false);
      if (response)
      {
        dispatchBooking("FETCH_BOOKINGS", {userId, token});
      }
      if (error) {
        setShowBookingAlert(true);
      }
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/places/discover" />
          </IonButtons>
          {isLoading && <IonTitle>Loading...</IonTitle>}
          {!isLoading && <IonTitle>{headerTitle}</IonTitle>}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {isLoading &&
          <IonContent class="ion-text-center">
            <IonSpinner color="primary" />
          </IonContent>
        }
        {!isLoading && mplace &&
          <IonGrid class="ion-no-padding" >
            <IonRow>
              <IonCol size-sm="6" offset-sm="3" class="ion-no-padding" >
                <IonImg src={mplace.imageUrl}></IonImg>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size-sm="6" offset-sm="3" class="ion-text-center ion-padding" >
                <p>{mplace.description}</p>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size-sm="6" offset-sm="3" class="ion-text-center ion-padding" >
                <p>{mplace.location.address}</p>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size-sm="6" offset-sm="3" class="ion-no-padding" >
                <IonImg role="button" class="location-image" onClick={onShowFullMap} src={mplace.location.staticMapImageUrl}></IonImg>
              </IonCol>
            </IonRow>
            {isBookable &&
              <IonRow>
                <IonCol size-sm="6" offset-sm="3" class="ion-text-center" >
                  <IonButton color="primary" class="ion-margin" onClick={() => setShowDateActionSheet(true)}   >Book</IonButton>
                </IonCol>
              </IonRow>
            }
          </IonGrid>
        }
        <IonLoading
          isOpen={isLoading}
          onDidDismiss={() => setIsLoading(false)}
          message={'Logging in...'}
        />
        <IonLoading
          isOpen={isBooking}
          onDidDismiss={() => setIsBooking(false)}
          message={'Booking place...'}
        />
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'An error ocurred!'}
          message={'Could not load place.'}
          buttons={[
            {
              text: 'Okay',
              handler: () => {
                props.history.push('/places/discover');
              }
            }
          ]}
        />
        <IonAlert
          isOpen={showBookingAlert}
          onDidDismiss={() => setShowBookingAlert(false)}
          header={'An error ocurred!'}
          message={'Could not book place.'}
          buttons={[
            {
              text: 'Okay'
            }
          ]}
        />
        <IonActionSheet
          isOpen={showDateActionSheet}
          onDidDismiss={() => setShowDateActionSheet(false)}
          cssClass='my-custom-class'
          header='Choose an Action'
          buttons={[{
            text: 'Select Date',
            handler: () => {
              openBookingModal('select');
            }
          }, {
            text: 'Random Date',
            handler: () => {
              openBookingModal('random');
            }
          }, {
            text: 'Cancel',
            role: 'cancel'
          }]}
        >
        </IonActionSheet>
        <IonModal isOpen={showCreateModal} cssClass='my-custom-class'>
          <CreateBooking {...props} selectedPlace={mplace} selectedMode={selectedDateMode} onDismiss={onDismissModal} />
        </IonModal>
        <IonModal isOpen={showMapModal} cssClass='my-custom-class'>
          <MapModal {...props} mapdata={mapProps} onDismiss={() => setShowMapModal(false)} />
        </IonModal>
      </IonContent>
    </IonPage>
  );
});

export default PlaceDetail;
