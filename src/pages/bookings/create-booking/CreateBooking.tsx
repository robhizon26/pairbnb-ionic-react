import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonButtons,  IonButton, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonInput, IonSelect, IonSelectOption, IonDatetime } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { Place } from '../../../models/place.model';
import { close } from 'ionicons/icons';

interface CreateBookingProps extends RouteComponentProps { selectedPlace: Place, onDismiss: any, selectedMode: string }
const CreateBooking: React.FC<CreateBookingProps> = ({ selectedPlace, onDismiss, selectedMode }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestNumber, setGuestNumber] = useState('2');

  let startDate: string = '';
  let endDate: string = '';
  if (selectedMode == 'random') {
    const availableFrom = new Date(selectedPlace.availableFrom);
    const availableTo = new Date(selectedPlace.availableTo);
    startDate = new Date(
      availableFrom.getTime() +
      Math.random() *
      (availableTo.getTime() -
        7 * 24 * 60 * 60 * 1000 -
        availableFrom.getTime())
    ).toISOString();

    endDate = new Date(
      new Date(startDate).getTime() +
      Math.random() *
      (new Date(startDate).getTime() +
        6 * 24 * 60 * 60 * 1000 -
        new Date(startDate).getTime())
    ).toISOString();
  }
  const [selectedFromDate, setSelectedFromDate] = useState<string>(startDate);
  const [selectedToDate, setSelectedToDate] = useState<string>(endDate);

  const onBookPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEntryValid()) return;
    onDismiss({ firstName, lastName, guestNumber: +guestNumber, startDate: new Date(selectedFromDate), endDate: new Date(selectedToDate) });
  }

  const isEntryValid = () => {
    if (!datesValid()) return false;
    if (lastName.length == 0) return false;
    if (firstName.length == 0) return false;
    return true;
  }

  const datesValid = () => {
    const lstartDate = new Date(selectedFromDate);
    const lendDate = new Date(selectedToDate);
    return lendDate > lstartDate;
  }

  const onCancel = () => {
    onDismiss(null);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="primary">
            <IonButton onClick={onCancel}>  <IonIcon slot="icon-only" icon={close} /></IonButton>
          </IonButtons>
          <IonTitle>CreateBooking</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-text-center">
        <form onSubmit={onBookPlace}>
          <IonGrid>
            <IonRow>
              <IonCol size-sm="6" offset-sm="3">
                <IonItem>
                  <IonLabel position="floating">First Name</IonLabel>
                  <IonInput type="text" name="first-name" value={firstName} required clearInput
                    onIonChange={e => setFirstName(e.detail.value!)} ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size-sm="6" offset-sm="3">
                <IonItem>
                  <IonLabel position="floating">Last Name</IonLabel>
                  <IonInput type="text" name="last-name" value={lastName} required clearInput
                    onIonChange={e => setLastName(e.detail.value!)} ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size-sm="6" offset-sm="3">
                <IonItem>
                  <IonLabel position="floating">Number of Guests</IonLabel>
                  <IonSelect value={guestNumber} onIonChange={e => setGuestNumber(e.detail.value)}>
                    <IonSelectOption value="1">1</IonSelectOption>
                    <IonSelectOption value="2">2</IonSelectOption>
                    <IonSelectOption value="3">3</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size-sm="6" offset-sm="3">
                <IonItem>
                  <IonLabel position="floating">From</IonLabel>
                  <IonDatetime
                    displayFormat="MMM DD YYYY"
                    pickerFormat="YY MMM DD"
                    min={selectedPlace.availableFrom.toISOString()}
                    max={selectedPlace.availableTo.toISOString()}
                    name="dateFrom"
                    value={selectedFromDate} onIonChange={e => setSelectedFromDate(e.detail.value!)}
                  ></IonDatetime>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size-sm="6" offset-sm="3"  >
                <IonItem>
                  <IonLabel position="floating">To</IonLabel>
                  <IonDatetime
                    displayFormat="MMM DD YYYY"
                    pickerFormat="YY MMM DD"
                    min={selectedFromDate}
                    max={selectedPlace.availableTo.toISOString()}
                    name="dateTo"
                    value={selectedToDate} onIonChange={e => setSelectedToDate(e.detail.value!)}
                  ></IonDatetime>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size-sm="6" offset-sm="3">
                <IonButton color="primary" type="submit"  expand="block" disabled={!isEntryValid()}
                >Book!</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default CreateBooking;
