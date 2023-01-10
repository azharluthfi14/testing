import * as React from 'react';
import { useHistory } from 'react-router';
// import { Button } from 'react-bootstrap';
// import { IonIcon } from 'react-ion-icon';
import { Camera, CameraResultType,CameraSource,CameraDirection } from '@capacitor/camera';
import { Buffer } from "buffer";
import { 
    IonIcon,
    IonButton,
    IonSpinner,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';


const width = 1920
export const UploadFile = props => {
    const history = useHistory();
    const openCamera = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            width: 2000,
            height: 1500,
            webUseInput: false,
            correctOrientation: true,
            direction: props.id === 'fileKtp' ? CameraDirection.Rear : CameraDirection.Front
        });        
        const response = await fetch(image.webPath!);
        const blob = await response.blob();
        props.handleUploadScan(blob)
    }


    return (
        <React.Fragment>
            <div className='p-2 mt-4'>
                <div className='btn-back-light' onClick = {() => history.goBack()}>
                    <IonIcon icon={arrowBackOutline}/>
                </div>
                <h2 className='mt-2'>{props.title}</h2>
                <div className="section text-main mb-2 text-center" style={{marginTop: '75px'}}>
                    <h4>{props.label}</h4>
                    <div className='mb-3 p-2 pt-3'>
                        {props.exampleImagePath && (
                            <div className='image-sample'>
                                <img src={props.exampleImagePath} alt={`${props.label} example`} />
                            </div>
                        )}
                        {!props.exampleImagePath && (
                            <img src={props.id === 'fileSelfie' ? '/assets/images/face.png' : '/assets/images/card.png'} alt="card"  style={{width: '250px'}}/>
                        )}
                    </div>
                </div>
                <div className='form-button-group'>
                    <IonButton
                        expand="block"
                        type="button"
                        onClick={openCamera}
                        className="btn-koinku"
                        color="primary"
                    >
                        Take Picture
                    </IonButton>
                </div>
            </div>
        </React.Fragment>
    );
};

export default UploadFile;
