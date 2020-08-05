import React, { useState } from 'react';
import { IonLabel, IonSpinner, IonImg, IonButton, IonIcon, IonActionSheet, IonAlert, IonModal } from '@ionic/react';
import './LocationPicker.scss';
import { Coordinates as mCoordinates, PlaceLocation } from '../../models/location.model';
import { RouteComponentProps } from 'react-router';
import { map } from 'ionicons/icons';
import { Plugins, Capacitor } from '@capacitor/core';
import { getAddress } from '../../actions/place';
import MapModal from '../map-modal/MapModal';

interface LocationPickerProps extends RouteComponentProps { showPreview: Boolean, locationPick: any }

const LocationPicker: React.FC<LocationPickerProps> = (props ) => {
  const { showPreview, locationPick } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocationImage, setSelectedLocationImage] = useState('');

  const createPlace = async (lat: number, lng: number) => {
    const pickedLocation: PlaceLocation = {
      lat: lat,
      lng: lng,
      address: '',
      staticMapImageUrl: ''
    };
    setIsLoading(true);
    let addressData: any = { address: null, error: null };
    addressData = await getAddress(lat, lng);
    const { address, error } = addressData;
    setIsLoading(false);
    if (error) {
      setShowAlert(true);
    } else if (address) {
      pickedLocation.address = address;
      pickedLocation.staticMapImageUrl = getMapImage(pickedLocation.lat, pickedLocation.lng, 14);
      setSelectedLocationImage(pickedLocation.staticMapImageUrl);
      locationPick(pickedLocation);
    }
  }
 
  const getMapImage=(lat: number, lng: number, zoom: number)=> {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${process.env.REACT_APP_googleMapsAPIKey}`;
  }
 
  const locateUser = () => {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      setShowAlert(true);
      return;
    }
    setIsLoading(true);
    Plugins.Geolocation.getCurrentPosition()
      .then(geoPosition => {
        const coordinates: mCoordinates = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude
        };
        createPlace(coordinates.lat, coordinates.lng);
        setIsLoading(false); 
      })
      .catch(err => {
        setIsLoading(false); 
        setShowAlert(true);
      });
  }
   
  const onDismissModal = async (mapData: mCoordinates) => {
    setShowMapModal(false);
    setIsLoading(true);
    if (mapData) {
      createPlace(mapData.lat, mapData.lng);
      setIsLoading(false); 
    }
  }
     
  return (
    <>
      <div className="picker">
        {isLoading &&
          <IonSpinner color="primary" />
        }
        {!isLoading && selectedLocationImage && showPreview &&
          <IonImg role="button" class="location-image" onClick={()=>{setShowActionSheet(true)}} src={selectedLocationImage}></IonImg>
        }
        {!isLoading && (!selectedLocationImage || !showPreview) &&
          <IonButton color="primary" onClick={()=>{setShowActionSheet(true)}}>
            <IonIcon slot="start" icon={map}></IonIcon>
            <IonLabel>Select Location</IonLabel>
          </IonButton>
        }
      </div>
      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        cssClass='my-custom-class'
        header='Please Choose'
        buttons={[{
          text: 'Auto-Locate',
          handler: locateUser
        }, {
          text: 'Pick a Map',
          handler: ()=>{setShowMapModal(true)}
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }]}
      >
      </IonActionSheet>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Could not fetch location'}
        message={'Please use the map to pick a location!'}
        buttons={[
          {
            text: 'Okay'
          }
        ]}
      />
       <IonModal isOpen={showMapModal} cssClass='my-custom-class'>
          <MapModal {...props} mapdata={null} onDismiss={onDismissModal} />
        </IonModal>
    </>
  );
};

export default LocationPicker;
