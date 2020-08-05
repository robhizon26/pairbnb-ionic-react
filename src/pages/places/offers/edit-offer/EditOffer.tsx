import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonButtons, IonBackButton, IonButton, IonIcon, IonSpinner, IonGrid, IonRow, IonCol, IonItem, IonInput, IonAlert, IonTextarea, IonLoading } from '@ionic/react';
import { checkmark } from 'ionicons/icons';
import { useAuthStore, usePlaceStore } from '../../../../hooks-store/store';
import { getPlaceById, updatePlace } from '../../../../actions/place';
import { RouteComponentProps } from 'react-router';
import { Place } from '../../../../models/place.model';

interface EditOfferProps extends RouteComponentProps { }

const EditOffer: React.FC<EditOfferProps> = (props: any) => {
  const dispatchPlace: any = usePlaceStore(false)[1];
  const [showAlert, setShowAlert] = useState(false);
  const [showUpdatingAlert, setShowUpdatingAlert] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  console.log('EditOffer props', props);
  const authState: any = useAuthStore()[0];
  const [offer, setOffer] = useState<Place>();
  const { auth: { token, userId } } = authState;
  const { offerId } = props.match.params;

  let isLoading = false;

  const onInitialize = async () => {
    // console.log('onInitialize ')
    let placeData: any = { place: null, error: null };
    placeData = await getPlaceById(offerId, token)
    const { place, error } = placeData;
    isLoading = false;
    if (error) {
      setShowAlert(true);
    } else if (place) {
      // console.log('onInitialize place', place)
      setOffer(place);
    }
  }
  
  useEffect(() => {
    isLoading = true;
    onInitialize();
  }, []);

  if (!offerId || !userId) {
    props.history.goBack();
    return null;
  }

  const isEntryValid = () => {
    if (!offer?.description) return false
    if (!offer?.title) return false
    if (offer.description.length < 1 || offer.description.length > 180) return false;
    if (offer.title.trim().length < 1 || offer.title.length > 50) return false;
    return true;
  }

  const setLOffer = (obj: any) => {
    setOffer(obj);
  }

  const onUpdateOffer = async () => {
    console.log('onUpdateOffer offer', offer)
    if (offer) {
      setIsUpdating(true);
      let updateOfferData: any = { response: null, error: null };
      updateOfferData = await updatePlace(offer, token)
      const { response, error } = updateOfferData;
      setIsUpdating(false);
      if (response)
      {
        await dispatchPlace("FETCH_PLACES", token);
        props.history.push('/places/offers');
        // props.history.goBack();
      }
      if (error) {
        setShowUpdatingAlert(true);
      }
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/places/offers" />
          </IonButtons>
          <IonTitle>Edit Offer</IonTitle>
          <IonButtons slot="primary">
            <IonButton onClick={() => onUpdateOffer()} disabled={!isEntryValid()}>
              <IonIcon slot="icon-only" icon={checkmark}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        {isLoading &&
          <IonContent class="ion-text-center">
            <IonSpinner color="primary" />
          </IonContent>
        }
        {!isLoading &&
          <form  >
            <IonGrid>
              <IonRow>
                <IonCol size-sm="6" offset-sm="3">
                  <IonItem>
                    <IonLabel position="floating">Title</IonLabel>
                    <IonInput type="text" name="title" value={offer?.title} required
                      // onIonChange={e => { tempOffer = { ...tempOffer, ...{ title: e.detail.value! } } }}
                      onIonChange={e => setLOffer({ ...offer, ...{ title: e.detail.value! } })} >
                    </IonInput>

                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size-sm="6" offset-sm="3">
                  <IonItem>
                    <IonLabel position="floating">Short Description</IonLabel>
                    <IonTextarea rows={3} name="description" value={offer?.description} required
                      onIonChange={e => setLOffer({ ...offer, ...{ description: e.detail.value! } })} ></IonTextarea>
                  </IonItem>
                </IonCol>
              </IonRow>
              {offer?.description && (offer.description.length < 1 || offer.description.length > 180) &&
                <IonRow>
                  <IonCol size-sm="6" offset-sm="3">
                    <IonItem>
                      <p>Description must be between 1 and 180 characters.</p>
                    </IonItem>
                  </IonCol>
                </IonRow>
              }
            </IonGrid>
          </form>}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'An error ocurred!'}
          message={'Place could not be fetched. Please try again later.'}
          buttons={[
            {
              text: 'Okay',
              handler: () => {
                props.history.push('/places/offers');
              }
            }
          ]}
        />
         <IonAlert
          isOpen={showUpdatingAlert}
          onDidDismiss={() => setShowUpdatingAlert(false)}
          header={'An error ocurred!'}
          message={'Could not update offer.'}
          buttons={[
            {
              text: 'Okay'
            }
          ]}
        />
         <IonLoading
          isOpen={isUpdating}
          onDidDismiss={() => setIsUpdating(false)}
          message={'Updating place...'}
        />
      </IonContent>
    </IonPage>
  );
};

export default EditOffer;
