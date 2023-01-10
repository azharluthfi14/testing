import cr from 'classnames';
import * as countries from 'i18n-iso-countries';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../../';
import { languages } from '../../../api/config';
import { CustomInput,  UploadFile } from '../../../components';
import { isDateInFuture, randomSecureHex } from '../../../helpers';
import {
    alertPush,
    RootState,
    selectCurrentLanguage,
    selectMobileDeviceState,
    selectSendDocumentsSuccess,
    sendDocuments,
    User,
    selectUserInfo,
    ektpCreateFetch,
    selectEktp,
    userFetch,
    selectAlertState,
    AlertState,
} from '../../../modules';
import { IonContent, IonButton, IonTitle, IonToolbar,IonButtons,IonIcon,IonRefresher,IonRefresherContent,IonSpinner } from '@ionic/react';
import { checkmarkOutline,arrowBackOutline } from 'ionicons/icons';


interface ReduxProps {
    lang: string;
    success?: string;
    isMobileDevice: boolean;
    user: User;
    dataktp: any;
    alertState?: AlertState;
}

interface DispatchProps {
    sendDocuments: typeof sendDocuments;
    ektpCreateFetch: typeof ektpCreateFetch;
    userFetch: typeof userFetch;
    pushAlert: typeof alertPush;
}

interface DocumentsState {
    documentsType: string;
    issuedDate: string;
    issuedDateFocused: boolean;
    expireDate: string;
    expireDateFocused: boolean;
    uploadError: boolean;
    isLoading: boolean;
    idNumber: string;
    idNumberFocused: boolean;
    showFrame: boolean;
    fileFront: File[];
    fileBack: File[];
    fileSelfie: File[];
    frontFileSizeErrorMessage: string;
    backFileSizeErrorMessage: string;
    selfieFileSizeErrorMessage: string;
    step: string;
    imgUpload: any;
    fileKtp: File[];
    birthDate: string;
    placeBirth: string;
    name: string;
    address: string;
    district: string;
    city: string;
    province: string;
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps;

// tslint:disable:member-ordering
class DocumentsComponent extends React.Component<Props, DocumentsState> {
    public translate = (key: string, value?: string, min?: string) => this.props.intl.formatMessage({ id: key }, {value, min});

    public data = [
        this.translate('page.body.kyc.documents.select.passport'),
        this.translate('page.body.kyc.documents.select.identityCard'),
        this.translate('page.body.kyc.documents.select.driverLicense'),
    ];

    public state = {
        documentsType: '',
        issuedDate: '',
        issuedDateFocused: false,
        expireDate: '',
        expireDateFocused: false,
        idNumberFocused: false,
        uploadError: false,
        isLoading: false,
        fileFront: [],
        fileBack: [],
        fileSelfie: [],
        frontFileSizeErrorMessage: '',
        backFileSizeErrorMessage: '',
        selfieFileSizeErrorMessage: '',
        step: 'intro',
        imgUpload: '',
        fileKtp: [],
        idNumber: '',
        name: '',
        address: '',
        district: '',
        city: '',
        province: '',
        birthDate: '',
        placeBirth: '',
        showFrame: false,
    };

    public UNSAFE_componentWillReceiveProps(next: Props) {
        if (next.success && !this.props.success) {
            this.props.userFetch()
            this.props.history.push('/user/profile/verification');

        }

        if(this.props.alertState.alerts.length > 0) {
            this.setState({isLoading: false})
        }
        

        if(next.dataktp && this.state.step === 'camera'){
            const result = next.dataktp
            const status = result.status
            if(status === 'success') {
                const dt = next.dataktp.data
                this.setState({
                    step: 'profile',
                    idNumber: dt.nik,
                    name: dt.nama,
                    address: dt.kelurahan_desa,
                    district: dt.kecamatan,
                    city: dt.kabupaten_kota,
                    province: dt.provinsi,
                    birthDate: dt.tanggal_lahir,
                    placeBirth: dt.tempat_lahir,
                });
                this.setState({isLoading: false})
            } else {
                this.setState({uploadError: true})
                this.setState({isLoading: false})
            }       
        }
    }

    public render() {
        const { isMobileDevice } = this.props;
        const {
            fileSelfie,
            idNumber,
            idNumberFocused,
            step,
            fileKtp,
            imgUpload,
            uploadError,
            name,
            address,
            district,
            city,
            province,
            birthDate,
            isLoading,
            placeBirth
        }: DocumentsState = this.state;

        /* tslint:disable */
        languages.map((l: string) => countries.registerLocale(require(`i18n-iso-countries/langs/${l}.json`)));
        /* tslint:enable */

        const idNumberFocusedClass = cr('mb-1');
        
        return (
            <IonContent className='bg-body'>
                <div className='content'>
                    {this.state.step === 'intro' && (
                        <React.Fragment>
                            <UploadFile
                                isMobileDevice={isMobileDevice}
                                showFrame={this.state.showFrame}
                                setShowFrame={(e)=>this.setShowFrame(e)}
                                id="fileKtp"
                                title={this.translate('page.body.kyc.documents.uploadFile.front.title')}
                                label={this.translate('page.body.kyc.documents.uploadFile.front.label')}
                                buttonText={this.translate('page.body.kyc.documents.uploadFile.front.button')}
                                sizesText={this.translate('page.body.kyc.documents.uploadFile.front.sizes')}
                                formatsText={this.translate('page.body.kyc.documents.uploadFile.front.formats')}
                                handleUploadScan={uploadEvent => this.handleUploadScan(uploadEvent, 'ktp')}
                                exampleImagePath={imgUpload}
                                uploadedFile={fileKtp[0] && (fileKtp[0] as File).name}
                            />
                        </React.Fragment>
                    )}
                {this.state.step === 'camera' && (
                    <React.Fragment>
                        <div className='p-3'>
                            <div className='btn-back-light' onClick = {() => window.history.back()}>
                                <IonIcon icon={arrowBackOutline}/>
                            </div>
                            <h2 className='mt-2'>{this.translate('page.body.kyc.documents.uploadFile.front.title')}</h2>
                            <div className="section text-main mb-2 text-center" style={{marginTop: '75px'}}>
                                <h4>{this.translate('page.body.kyc.documents.uploadFile.front.label')}</h4>
                                {step === 'camera' ? (
                                    <div className='mb-3 p-2 pt-3'>
                                        <div className='image-sample'>
                                            <img src={imgUpload} alt="file-ktp" />
                                        </div>
                                    </div>
                                ) : (
                                    <img src="/assets/images/card.png" alt="card" />
                                )}
                                {this.state.uploadError && (
                                    <div className="alert alert-danger mb-1" role="alert">
                                        Upload Error, Please take a picture again
                                    </div>
                                )}
                                <div className='link font-weight-bold' onClick={()=>this.setState({step: 'intro',uploadError: false})}>
                                    Take Picture Again
                                </div>
                            </div>
                            
                            <div className='form-button-group'>
                                <IonButton
                                    expand="block"
                                    disabled={uploadError || isLoading}
                                    onClick={()=>this.goToProfile()}
                                    className="btn-koinku"
                                    color="primary"
                                    type="button"
                                >
                                    {this.state.isLoading ? (
                                        <span>
                                            <IonSpinner name="bubbles"></IonSpinner>
                                        </span>
                                    ):(
                                        <span className='ml-2'>Continue</span>
                                    )}
                                </IonButton>
                            </div>
                        </div>
                    </React.Fragment>
                )}

                {this.state.step === 'profile' && (
                    <div className='pt-3'>
                        <h3 className='text-center'>Identity Data</h3>
                        <div className='identity-data'>
                            <div className="pl-2 pr-2 form-profile">
                                <div className={idNumberFocusedClass}>
                                    <CustomInput
                                        type="string"
                                        label={this.translate('page.body.kyc.documents.idNumber')}
                                        labelVisible={true}
                                        defaultLabel={''}
                                        readOnly={true}
                                        placeholder={this.translate('page.body.kyc.documents.idNumber.placeholder')}
                                        inputValue={idNumber}
                                    />
                                </div>

                                <div className={idNumberFocusedClass}>
                                    <CustomInput
                                        type="string"
                                        label='Your Name'
                                        labelVisible={true}
                                        defaultLabel={''}
                                        placeholder='Input Your Name'
                                        inputValue={name}
                                        handleChangeInput={this.handleChangeName}
                                        handleFocusInput={this.handleFieldFocus('name')}
                                    />
                                </div>

                                <div className={idNumberFocusedClass}>
                                    <CustomInput
                                        type="string"
                                        label='Address'
                                        labelVisible={true}
                                        defaultLabel={''}
                                        placeholder='Input Your Address'
                                        inputValue={address}
                                        handleChangeInput={this.handleChangeAddress}
                                        handleFocusInput={this.handleFieldFocus('address')}
                                    />
                                </div>

                                <div className={idNumberFocusedClass}>
                                    <CustomInput
                                        type="string"
                                        label='District'
                                        labelVisible={true}
                                        defaultLabel={''}
                                        placeholder='Input your district'
                                        inputValue={district}
                                        handleChangeInput={this.handleChangedistrict}
                                        handleFocusInput={this.handleFieldFocus('district')}
                                    />
                                </div>

                                <div className={idNumberFocusedClass}>
                                    <CustomInput
                                        type="string"
                                        label='City'
                                        labelVisible={true}
                                        defaultLabel={''}
                                        placeholder='Input Your City'
                                        inputValue={city}
                                        handleChangeInput={this.handleChangecity}
                                        handleFocusInput={this.handleFieldFocus('city')}
                                    />
                                </div>

                                <div className={idNumberFocusedClass}>
                                    <CustomInput
                                        type="string"
                                        label='Province'
                                        labelVisible={true}
                                        defaultLabel={''}
                                        placeholder='Input Your Province'
                                        inputValue={province}
                                        handleChangeInput={this.handleChangeprovince}
                                        handleFocusInput={this.handleFieldFocus('province')}
                                    />
                                </div>

                                
                                <div className={idNumberFocusedClass}>
                                    <CustomInput
                                        type="string"
                                        label='Place of Birth'
                                        labelVisible={true}
                                        defaultLabel={''}
                                        placeholder='Input your place of birth'
                                        inputValue={placeBirth}
                                        handleChangeInput={this.handleChangePlaceBirth}
                                        handleFocusInput={this.handleFieldFocus('placeBirth')}
                                    />
                                </div>

                                <div className={idNumberFocusedClass}>
                                    <CustomInput
                                        type="string"
                                        label='Birth date'
                                        labelVisible={true}
                                        defaultLabel={''}
                                        placeholder='Input your birth date'
                                        inputValue={birthDate}
                                        handleChangeInput={this.handleChangeBirthDate}
                                        handleFocusInput={this.handleFieldFocus('birthDate')}
                                    />
                                </div>
                            </div>

                            <div className='form-button-group'>
                                <IonButton
                                    expand="block"
                                    disabled={this.checkIdentity()}
                                    onClick={() => this.setState({step: 'liveness'})}
                                    className="btn-koinku"
                                    color="primary"
                                    type="button"
                                >
                                    Next Step
                                </IonButton>
                            </div>                        
                        </div>
                    </div>
                    )}

                    {this.state.step === 'liveness' && (
                        <React.Fragment>
                            <UploadFile
                                    setShowFrame={(e)=>this.setShowFrame(e)}
                                    isMobileDevice={isMobileDevice}
                                    showFrame={this.state.showFrame}
                                    id="fileSelfie"
                                    title={this.translate('page.body.kyc.documents.uploadFile.selfie.title')}
                                    label={this.translate('page.body.kyc.documents.uploadFile.selfie.label')}
                                    buttonText={this.translate('page.body.kyc.documents.uploadFile.selfie.button')}
                                    sizesText={this.translate('page.body.kyc.documents.uploadFile.selfie.sizes')}
                                    formatsText={this.translate('page.body.kyc.documents.uploadFile.selfie.formats')}
                                    handleUploadScan={uploadEvent => this.handleUploadScan(uploadEvent, 'selfie')}
                                    uploadedFile={fileSelfie[0] && (fileSelfie[0] as File).name}
                                />
                        </React.Fragment>
                    )}

                    {this.state.step === 'camera-liveness' && (
                        <React.Fragment>
                            <div className='p-3'>
                                <div className='btn-back-light' onClick = {() => window.history.back()}>
                                    <IonIcon icon={arrowBackOutline}/>
                                </div>
                                <h2 className='mt-2'>{this.translate('page.body.kyc.documents.uploadFile.selfie.title')}</h2>
                                <div className="section text-main mb-2 text-center" style={{marginTop: '75px'}}>
                                    <h4>{this.translate('page.body.kyc.documents.uploadFile.selfie.label')}</h4>
                                    {step === 'camera-liveness' ? (
                                        <div className='mb-3 p-2 pt-3'>
                                            <div className='image-sample'>
                                                <img src={imgUpload} alt="file-ktp" />
                                            </div>
                                        </div>
                                    ) : (
                                        <img src="/assets/images/card.png" alt="card" />
                                    )}
                                    {this.state.uploadError && (
                                        <div className="alert alert-danger mb-1" role="alert">
                                            Upload Error, Please take a picture again
                                        </div>
                                    )}
                                    <div className='link font-weight-bold' onClick={()=>this.setState({step: 'liveness',uploadError: false})}>
                                        Take Picture Again
                                    </div>
                                </div>
                                
                                <div className='form-button-group'>
                                    <IonButton
                                        expand="block"
                                        disabled={uploadError}
                                        onClick={()=>this.submitData()}
                                        className="btn-koinku"
                                        color="primary"
                                        type="button"
                                    >
                                        {this.state.isLoading ? (
                                            <span>
                                                <IonSpinner name="bubbles"></IonSpinner>
                                            </span>
                                        ):(
                                            <span className='ml-2'>Submit Data</span>
                                        )}
                                    </IonButton>
                                </div>
                            </div>
                        </React.Fragment>
                    )}
                        
                    {this.state.step === 'send' && (
                        <div>camera</div>
                    )}


                </div>
            </IonContent>
        );
    }

    private submitData = () => {
        this.setState({isLoading: true})
        this.sendDocuments()
    };  
    
    
    private goToProfile = () => {
        const {fileKtp} = this.state;
        const identificator = randomSecureHex(32);
        const data = this.createFormData('ktp', fileKtp, identificator)
        this.setState({isLoading: true})
        this.props.ektpCreateFetch(data);       
    };


    private handleFieldFocus = (field: string) => {
        return () => {
            switch (field) {
                case 'issuedDate':
                    this.setState({
                        issuedDateFocused: !this.state.issuedDateFocused,
                    });
                    break;
                case 'expireDate':
                    this.setState({
                        expireDateFocused: !this.state.expireDateFocused,
                    });
                    break;
                case 'idNumber':
                    this.setState({
                        idNumberFocused: !this.state.idNumberFocused,
                    });
                    break;
                default:
                    break;
            }
        };
    };

    private setShowFrame = (value: boolean) => {
        this.setState({
            showFrame: !this.state.showFrame,
        });
    };    
    
    private handleChangeAddress = (value: string) => {
        this.setState({
            address: value,
        });
    };
    private handleChangeName = (value: string) => {
        this.setState({
            name: value,
        });
    }; 
    private handleChangedistrict = (value: string) => {
        this.setState({
            district: value,
        });
    };
    private handleChangecity = (value: string) => {
        this.setState({
            city: value,
        });
    };
    private handleChangeprovince = (value: string) => {
        this.setState({
            province: value,
        });
    };
    private handleChangePlaceBirth = (value: string) => {
        this.setState({
            placeBirth: value,
        });
    };

    private handleChangeBirthDate = (value: string) => {
        this.setState({
            birthDate: value,
        });
    };

    private handleUploadScan = (uploadEvent, id) => {         
        this.getBase64(uploadEvent);       
        if(uploadEvent.target){
            const allFiles: File[] = uploadEvent.target.files;
            const maxDocsCount = 1;
            const additionalFileList = Array.from(allFiles).length > maxDocsCount ?  Array.from(allFiles).slice(0, maxDocsCount) : Array.from(allFiles);
            if(id === 'ktp')this.setState({ fileKtp: additionalFileList });
            if(id === 'selfie')this.setState({ fileSelfie: additionalFileList });
        }else{
            uploadEvent.lastModifiedDate = new Date();
            const file = new File([uploadEvent], id.toUpperCase() + '-' + this.props.user.uid)           
            var dt = new DataTransfer();
            dt.items.add(file);
            var file_list = dt.files;
            const additionalFileList = Array.from(file_list)
            if(id === 'ktp')this.setState({ fileKtp: additionalFileList });
            if(id === 'selfie')this.setState({ fileSelfie: additionalFileList });
        }
        if(id === 'ktp')this.setState({step: 'camera'}) 
        if(id === 'selfie')this.setState({step: 'camera-liveness'})     
    };

    private getBase64 = (e) => {
        let reader = new FileReader()       
        if(e.target){
            reader.readAsDataURL(e.target.files[0])
        }else{
            reader.readAsDataURL(e)
        }
        reader.onload = () => {
            this.setState({
                imgUpload: reader.result
            })
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        }
    }

    private checkIdentity = () => {
        const {
            idNumber,
            name,
            address,
            district,
            city,
            province,
            birthDate,
            placeBirth
        }= this.state;
        return idNumber.length>10 && name.length>4 && address.length>5 && district.length>4 &&  city.length>3 && province.length>3 && birthDate.length>5 && placeBirth.length>3 ? false : true
    };

    private handleValidateInput = (field: string, value: string): boolean => {
        switch (field) {
            case 'issuedDate':
                return !isDateInFuture(value);
            case 'expireDate':
                return isDateInFuture(value);
            case 'idNumber':
                const cityRegex = new RegExp(`^[a-zA-Z0-9]{1,255}$`);

                return Boolean(value.match(cityRegex));
            default:
                return true;
        }
    };

    private sendDocuments = () => {
        const identificator = randomSecureHex(32);
        this.props.sendDocuments(this.createFormSubmitData(identificator));
    };


    private createFormSubmitData = (identificator: string) => {
        const { 
        birthDate, idNumber,name,address,district,city,province,fileKtp,fileSelfie,placeBirth
        }: DocumentsState = this.state;

        const request = new FormData();

        request.append('birthDate', birthDate);
        request.append('idNumber', idNumber);
        request.append('name', name);
        request.append('address', address);
        request.append('district', district);
        request.append('city', city);
        request.append('province', province);
        request.append('country', 'ID');
        request.append('place_of_birth', placeBirth);
        request.append('selfie_image', fileSelfie[0]);
        request.append('identity_image', fileKtp[0]);
        request.append('identificator', identificator);
        return request;
    };

    private createFormData = (docCategory: string, upload: File[], identificator: string) => {
        const request = new FormData();
        request.append('upload', upload[0]);
        request.append('identificator', identificator);
        return request;
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    lang: selectCurrentLanguage(state),
    isMobileDevice: selectMobileDeviceState(state),
    dataktp: selectEktp(state),
    user: selectUserInfo(state),
    success: selectSendDocumentsSuccess(state),
    alertState: selectAlertState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    pushAlert: (payload) => dispatch(alertPush(payload)),
    sendDocuments: (payload) => dispatch(sendDocuments(payload)),
    ektpCreateFetch: payload => dispatch(ektpCreateFetch(payload)),
    userFetch: () => dispatch(userFetch()),
});

export const Documents = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(DocumentsComponent) as any; // tslint:disable-line
