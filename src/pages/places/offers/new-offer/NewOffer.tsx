import React, { useState, useEffect } from 'react';
import { RouteComponentProps, withRouter, useLocation } from 'react-router';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonBackButton, IonButtons, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonInput, IonTextarea, IonDatetime, IonLoading, IonAlert } from '@ionic/react';
import { checkmark } from 'ionicons/icons';
import { useAuthStore, usePlaceStore } from '../../../../hooks-store/store';
import { Place } from '../../../../models/place.model';
import LocationPicker from '../../../../components/pickers/LocationPicker';
import ImagePicker from '../../../../components/pickers/ImagePicker';
import { PlaceLocation } from '../../../../models/location.model';
import { uploadImage, addPlace } from '../../../../actions/place';

interface NewOfferProps extends RouteComponentProps { }

const NewOffer: React.FC<NewOfferProps> = (props) => {
  const { history } = props;
  console.log('NewOffer');
  const dispatchPlace: any = usePlaceStore(false)[1];
  const [newPlace, setNewPlace] = useState<Place>();
  const [imageFile, setImageFile] = useState<File | Blob>();
  const [isCreatingPlace, setIsCreatingPlace] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showCreatingAlert, setShowCreatingAlert] = useState(false);
  const [showUploadingAlert, setShowUploadingAlert] = useState(false);
  const authState: any = useAuthStore()[0];
  const { auth: { token, userId } } = authState;

  let isLoading = false;
  useEffect(() => {
    isLoading = true;
  }, []);

  if (!userId) {
    history.goBack();
    return null;
  }

  const onCreateOffer = async () => {
    if (!isEntryValid()) {
      return;
    }
    setIsUploadingImage(true);
    let imageData: any = { imageRes: null, error: null };
    imageData = await uploadImage(imageFile!, token);
    const { imageRes, error } = imageData;
    setIsUploadingImage(false);
    if (imageRes) {
      setIsCreatingPlace(true);
      const place: Place = { ...newPlace! };
      place.imageUrl = imageRes.imageUrl;
      place.id = Math.random().toString();
      place.userId = userId;

      let placeData: any = { response: null, error: null };
      placeData = await addPlace(place, token)
      const { response, error } = placeData;
      setIsCreatingPlace(false);
      if (response) {
        await dispatchPlace("FETCH_PLACES", token);
        props.history.push('/places/offers');
      }
      if (error) {
        setShowCreatingAlert(true);
      }
    }
    if (error) {
      setShowUploadingAlert(true);
    }
  }

  const isEntryValid = () => {
    if (!newPlace?.title) return false;
    if (!newPlace?.description) return false;
    if (!newPlace?.price) return false;
    if (!newPlace?.availableFrom) return false;
    if (!newPlace?.availableTo) return false;
    if (!newPlace?.location) return false;
    if (newPlace.description.length < 1 || newPlace.description.length > 180) return false;
    if (newPlace.title.trim().length < 1 || newPlace.title.length > 50) return false;
    if (newPlace.price <= 0) return false;
    if (!imageFile) return false;
    return true;
  }

  const setLNewPlace = (obj: any) => {
    setNewPlace(obj);
  }
  const onLocationPicked = (location: PlaceLocation) => {
    setLNewPlace({ ...newPlace, ...{ location } });
  }

  const onImagePicked = (imageData: string | File) => {
    let imageFile: File;
    if (typeof imageData === 'string') {
      try {
        let blob = base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
        imageFile = new File([blob], ".jpg", { type: "image/jpeg" })
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    setImageFile(imageFile);
  }

  const getAvailableFromDate = () => {
    return newPlace?.availableFrom ? newPlace.availableFrom.toString() : null;
  }

  const getAvailableToDate = () => {
    return newPlace?.availableTo ? newPlace.availableTo.toString() : null;
  }

  const base64toBlob = (base64Data: any, contentType: any) => {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = window.atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/places/offers" />
          </IonButtons>
          <IonTitle>New Offer</IonTitle>
          <IonButtons slot="primary">
            <IonButton onClick={() => onCreateOffer()} disabled={!isEntryValid()}>
              <IonIcon slot="icon-only" icon={checkmark}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding ion-text-center">
        <form  >
          <IonGrid>
            <IonRow>
              <IonCol size-sm="6" offset-sm="3">
                <IonItem>
                  <IonLabel position="floating">Title</IonLabel>
                  <IonInput type="text" name="title" value={newPlace?.title} required
                    onIonChange={e => setLNewPlace({ ...newPlace, ...{ title: e.detail.value! } })} >
                  </IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size-sm="6" offset-sm="3">
                <IonItem>
                  <IonLabel position="floating">Short Description</IonLabel>
                  <IonTextarea rows={3} name="description" value={newPlace?.description} required
                    onIonChange={e => setLNewPlace({ ...newPlace, ...{ description: e.detail.value! } })} ></IonTextarea>
                </IonItem>
              </IonCol>
            </IonRow>
            {newPlace?.description && (newPlace.description.length < 1 || newPlace.description.length > 180) &&
              <IonRow>
                <IonCol size-sm="6" offset-sm="3">
                  <IonItem>
                    <p>Description must be between 1 and 180 characters.</p>
                  </IonItem>
                </IonCol>
              </IonRow>
            }
            <IonRow>
              <IonCol size-sm="6" offset-sm="3">
                <IonItem>
                  <IonLabel position="floating">Price</IonLabel>
                  <IonInput type="number" name="price" value={newPlace?.price} required
                    onIonChange={e => setLNewPlace({ ...newPlace, ...{ price: e.detail.value! } })} >
                  </IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size-sm="3" offset-sm="3">
                <IonItem>
                  <IonLabel position="floating">Available from</IonLabel>
                  <IonDatetime
                    displayFormat="MMM DD YYYY"
                    pickerFormat="YY MMM DD"
                    min="2019-01-01"
                    max="2025-12-31"
                    name="dateFrom"
                    value={getAvailableFromDate()} onIonChange={e => setLNewPlace({ ...newPlace, ...{ availableFrom: e.detail.value! } })}
                  ></IonDatetime>
                </IonItem>
              </IonCol>
              <IonCol size-sm="3"  >
                <IonItem>
                  <IonLabel position="floating">Available to</IonLabel>
                  <IonDatetime
                    displayFormat="MMM DD YYYY"
                    pickerFormat="YY MMM DD"
                    min="2019-01-02"
                    max="2025-12-31"
                    name="dateTo"
                    value={getAvailableToDate()} onIonChange={e => setLNewPlace({ ...newPlace, ...{ availableTo: e.detail.value! } })}
                  ></IonDatetime>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size-sm="6" offset-sm="3">
                <LocationPicker {...props} showPreview={!!newPlace?.location} locationPick={onLocationPicked} />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size-sm="6" offset-sm="3">
                <ImagePicker {...props} showPreview={!!imageFile} imagePick={onImagePicked} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </form>
        <IonLoading
          isOpen={isCreatingPlace}
          onDidDismiss={() => setIsCreatingPlace(false)}
          message={'Creating place...'}
        />
        <IonLoading
          isOpen={isUploadingImage}
          onDidDismiss={() => setIsUploadingImage(false)}
          message={'Uploading image...'}
        />
        <IonAlert
          isOpen={showUploadingAlert}
          onDidDismiss={() => setShowUploadingAlert(false)}
          header={'An error ocurred!'}
          message={'Could not upload image.'}
          buttons={[
            {
              text: 'Okay'
            }
          ]}
        />
        <IonAlert
          isOpen={showCreatingAlert}
          onDidDismiss={() => setShowCreatingAlert(false)}
          header={'An error ocurred!'}
          message={'Could not create place.'}
          buttons={[
            {
              text: 'Okay'
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default NewOffer;
