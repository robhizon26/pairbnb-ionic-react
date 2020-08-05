import React, { useEffect, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton } from '@ionic/react';
import './MapModal.css';
import { RouteComponentProps } from 'react-router';
import { Coordinates as mCoordinates } from '../../models/location.model';

interface MapModalProps extends RouteComponentProps { mapdata: any, onDismiss: any }
const MapModal: React.FC<MapModalProps> = ({ mapdata, onDismiss }) => {
  console.log('MapModal mapdata', mapdata)
  let center = { lat: 61.251838, lng: 73.393786 };
  let selectable = true;
  let closeButtonText = 'Cancel';
  let title = 'Pick Location';
  if (mapdata) {
    center = mapdata.center;
    selectable = mapdata.selectable;
    closeButtonText = mapdata.closeButtonText;
    title = mapdata.title;
  }

  let mapG: any = useRef();
  let clickListener: any;
  let googleMaps: any;
  useEffect(() => {
    getGoogleMaps()
      .then(pgoogleMaps => {
        googleMaps = pgoogleMaps;
        const mapEl: HTMLDivElement = mapG.current;
        const map = new googleMaps.Map(mapEl, {
          center: center,
          zoom: 16
        });
        mapEl.classList.add('visible');
        if (selectable) {
          clickListener = map.addListener('click', (event: any) => {
            const selectedCoords: mCoordinates = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            onDismiss(selectedCoords);
          });
        } else {
          const marker = new googleMaps.Marker({
            position: center,
            map: map,
            title: 'Picked Location'
          });
          console.log('pgoogleMaps marker', marker)
          marker.setMap(map);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [googleMaps]);


  const getGoogleMaps = () => {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + process.env.REACT_APP_googleMapsAPIKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available.');
        }
      };
    });
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="primary">
            <IonButton onClick={onDismiss}>{closeButtonText} </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="map" ref={mapG} ></div>
      </IonContent>
    </IonPage>
  );
};

export default MapModal;
