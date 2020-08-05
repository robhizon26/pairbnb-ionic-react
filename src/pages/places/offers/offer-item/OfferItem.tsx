import React from 'react';
import { IonLabel, IonItem, IonThumbnail, IonImg, IonIcon, IonText } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { Place } from '../../../../models/place.model';
import './OfferItem.scss';
import { calendar } from 'ionicons/icons';

interface OfferItemProps extends RouteComponentProps { offer: Place }

const OfferItem: React.FC<OfferItemProps> = ({ offer }) => {
  return (
    <IonItem>
      <IonThumbnail slot="start" >
        <IonImg src={offer.imageUrl}></IonImg>
      </IonThumbnail>
      <IonLabel>
        <h1>{offer.title}</h1>
        <h3>${offer.price} / night</h3>
        <div className="offer-details">
          <IonIcon color="primary" icon={calendar} />
          <IonText color="tertiary" class="space-left">  {offer.availableFrom.toLocaleDateString()} </IonText>
          <span className="space-left">to</span>
          <IonIcon color="primary" icon={calendar} />
          <IonText color="tertiary" class="space-left">  {offer.availableTo.toLocaleDateString()} </IonText>
        </div>
      </IonLabel>
    </IonItem>
  );
};

export default OfferItem;
