import React, { useRef, useState } from 'react';
import { IonLabel, IonImg, IonButton, IonIcon } from '@ionic/react';
import './ImagePicker.scss';
import { RouteComponentProps } from 'react-router';
import { camera } from 'ionicons/icons';
import {
  Plugins,
  Capacitor,
  CameraSource,
  CameraResultType
} from '@capacitor/core';

interface ImagePickerProps extends RouteComponentProps { showPreview: Boolean, imagePick: any }

const ImagePicker: React.FC<ImagePickerProps> = (props) => {
  const { showPreview, imagePick } = props;
  let filePickerRef: any = useRef();
  const [selectedImage, setSelectedImage] = useState<string | undefined>();

  const onPickImage = async () => {
    if (!Capacitor.isPluginAvailable('Camera')) {
      filePickerRef.current.click();
      return;
    }
    const info = await Plugins.Device.getInfo()
    if (info.platform == 'web') {
      filePickerRef.current.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      // height: 320,
      width: 300,
      resultType: CameraResultType.Base64,
    })
      .then(image => {
        setSelectedImage('data:image/jpeg;base64,' + image.base64String);
        imagePick(image.base64String);
      })
      .catch(error => {
        filePickerRef.current.click();
        return false;
      });
  }

  const onFileChosen = (event: Event | any) => {
    const pickedFile = event.target.files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onloadend = () => {
      const dataUrl = fr.result?.toString();
      setSelectedImage(dataUrl);
      imagePick(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }

  return (
    <div className="picker">
      {showPreview && !!selectedImage &&
        <IonImg role="button" class="image" onClick={onPickImage} src={selectedImage}></IonImg>
      }
      {(!selectedImage || !showPreview) &&
          <IonButton color="primary" onClick={onPickImage}>
            <IonIcon slot="start" icon={camera}></IonIcon>
            <IonLabel>Take Picture</IonLabel>
          </IonButton>
      }
      <input type="file" accept="image/jpeg" ref={filePickerRef} onChange={onFileChosen} />
    </div>
  );
};

export default ImagePicker;
