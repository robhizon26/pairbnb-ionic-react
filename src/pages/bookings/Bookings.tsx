import React, { useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol, IonSpinner, IonList, IonItem, IonAvatar, IonImg, IonItemSliding, IonItemOptions, IonItemOption, IonIcon } from '@ionic/react';
import { Booking } from '../../models/booking.model';
import { trash } from 'ionicons/icons';
import { useAuthStore, useBookingStore } from '../../hooks-store/store';
import { authGuard } from '../../components/auth/AuthGuard';

const Bookings: React.FC = (() => {
  const [bookingState, dispatch]: any = useBookingStore();
  const authState: any = useAuthStore()[0];
  const { items: { bookings } } = bookingState;
  const { auth: { token, userId } } = authState;
  console.log('Bookings', bookings, authState);

  let loadedBookings: Booking[] = [];
  let isLoading = false;

  useEffect(() => {
    dispatch("FETCH_BOOKINGS", { userId, token });
  }, [])

  if (!bookings) {
    isLoading = true;
  } else {
    isLoading = false;
    loadedBookings = [...bookings];
  }

  const onCancelBooking = (bookingId: string) => {
    console.log('Bookings onCancelBooking')
    dispatch("CANCEL_BOOKING", { bookingId, token });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Your Bookings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            {isLoading &&
              <IonCol size-md="6" offset-md="3" class="ion-text-center">
                <IonSpinner color="primary" />
              </IonCol>
            }
            {!isLoading && loadedBookings.length <= 0 &&
              <IonCol size-md="6" offset-md="3" class="ion-text-center">
                <p>No bookings found!</p>
              </IonCol>
            }
            {!isLoading && loadedBookings.length > 0 &&
              <IonCol size-md="6" offset-md="3" class="ion-text-center">
                <IonList >
                  {loadedBookings.map((booking: Booking) => (
                    <IonItemSliding key={booking.id}>
                      <IonItem   >
                        <IonAvatar slot="start">
                          <IonImg src={booking.placeImage}></IonImg>
                        </IonAvatar>
                        <IonLabel>
                          <h5>{booking.placeTitle}</h5>
                          <p>Guests: {booking.guestNumber}</p>
                        </IonLabel>
                      </IonItem >
                      <IonItemOptions color="danger">
                        <IonItemOption onClick={() => onCancelBooking(booking.id)}>
                          <IonIcon slot="icon-only" icon={trash} />
                        </IonItemOption>
                      </IonItemOptions>
                    </IonItemSliding>
                  ))
                  }
                </IonList>
              </IonCol>
            }
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
});

export default authGuard(Bookings);
