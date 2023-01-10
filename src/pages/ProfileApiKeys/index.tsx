import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Pagination } from '../../components';
import { useApiKeysFetch } from '../../hooks';
import {
    apiKeyCreateFetch,
    ApiKeyDataInterface,
    apiKeyDeleteFetch,
    apiKeys2FAModal,
    apiKeyUpdateFetch,
    RootState,
    selectUserInfo,
} from '../../modules';
import {
    selectApiKeys,
    selectApiKeysFirstElemIndex,
    selectApiKeysLastElemIndex,
    selectApiKeysModal,
    selectApiKeysNextPageExists,
} from '../../modules/user/apiKeys/selectors';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButtons,IonIcon,IonRefresher,IonRefresherContent,IonSpinner } from '@ionic/react';
import { checkmarkOutline,arrowBackOutline,addCircleOutline } from 'ionicons/icons';
import {
    ApiKeysItem,
} from '../../components/Profile';

import {
    CreatedApiKeyModal,
    TwoFactorModal,
} from '../../components';

const ProfileApiKeys: React.FC = () => {
    const [itemToUpdate, setItemToUpdate] = React.useState<ApiKeyDataInterface | undefined>();
    const [currentPageIndex, setPageIndex] = React.useState(0);
    const [currentAction, setCurrentAction] = React.useState('');
    const [show2FAModal, setShow2FAModal] = React.useState(false);
    const [showCreatedApiKeyModal, setShowCreatedApiKeyModal] = React.useState(false);
    const dispatch = useDispatch();
    const intl = useIntl();
    const history = useHistory();
    const apiKeys = useSelector(selectApiKeys);
    const apiKeysModal= useSelector(selectApiKeysModal) || { action: '' };
    const user = useSelector(selectUserInfo);
    const firstElemIndex = useSelector((state: RootState) => selectApiKeysFirstElemIndex(state, 4));
    const lastElemIndex = useSelector((state: RootState) => selectApiKeysLastElemIndex(state, 4));
    const nextPageExists = useSelector(selectApiKeysNextPageExists);
    useApiKeysFetch(currentPageIndex, 4);

    const onClickPrevPage = () => {
        setPageIndex(currentPageIndex - 1);
    };

    const onClickNextPage = () => {
        setPageIndex(currentPageIndex + 1);
    };

    const handleCreateApiKey = (code2FA, shouldFetch) => {
        if (shouldFetch) {
            const payload = {
                totp_code: code2FA,
            };
            dispatch(apiKeyCreateFetch(payload));
        }
    };

    const handleUpdateApiKey = (code2FA, shouldFetch) => {
        if (shouldFetch && itemToUpdate) {
            const payload = {
                totp_code: code2FA,
                apiKey: {
                    ...itemToUpdate,
                    state: itemToUpdate.state === 'active' ? 'disabled' : 'active',
                },
            };
            dispatch(apiKeyUpdateFetch(payload));
        }
    };

    const handleDeleteApiKey = (code2FA, shouldFetch) => {
        if (shouldFetch && itemToUpdate) {
            const payload = {
                totp_code: code2FA,
                kid: itemToUpdate.kid,
            };
            dispatch(apiKeyDeleteFetch(payload));
        }
    };

    const handleTriggerAction = (code2FA, shouldFetch) => {
        switch (currentAction) {
            case 'create':
                handleCreateApiKey(code2FA, shouldFetch);
                break;
            case 'update':
                handleUpdateApiKey(code2FA, shouldFetch);
                break;
            case 'delete':
                handleDeleteApiKey(code2FA, shouldFetch);
                break;
            default:
                break;
        }

        setShow2FAModal(false);
        setItemToUpdate(undefined);
        setCurrentAction('');
    };

    const handleSetApiKeyProcess = (actionToSet, item?: ApiKeyDataInterface ) => {
        setShow2FAModal(!show2FAModal);
        switch (actionToSet) {
            case 'create':
                setCurrentAction('create');
                break;
            case 'update':
                setItemToUpdate(item);
                setCurrentAction('update');
                break;
            case 'delete':
                setItemToUpdate(item);
                setCurrentAction('delete');
                break;
            default:
                break;
        }
    };

    React.useEffect(() => {
        if (apiKeysModal.action === 'createSuccess' && !showCreatedApiKeyModal) {
            setShowCreatedApiKeyModal(true);
            dispatch(apiKeys2FAModal({ active: false }));
        }
    }, [dispatch, showCreatedApiKeyModal, apiKeysModal.action]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className='content'>
                    <IonButtons slot="start" onClick={()=>history.push('/user/profile')}>
                        <IonIcon slot="icon-only" icon={arrowBackOutline}></IonIcon>
                    </IonButtons>
                    <IonTitle className='ion-text-center title-wallet text-large bold'>API KEYS</IonTitle>
                    <IonButtons slot="end" onClick={() => handleSetApiKeyProcess('create')}>
                        {user.otp ? (
                            <IonIcon slot="icon-only" icon={addCircleOutline}></IonIcon>
                        ) : null}
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            {!user.otp && (
                <IonContent className='bg-body'>
                    <div className='mt-4'>
                        <div className="text-center empty-img">
                            <div>
                                <img src="/assets/images/padlock.png" alt="" className='no-data' />
                            </div>
                            <h5 className='mt-2 pb-0'>
                                Plese enable 2FA to create API Keys
                            </h5>
                        </div>
                    </div>
                </IonContent>
            )}
            {user.otp && apiKeys.length ? (
                <IonContent className='bg-body'>
                    <div className='content'>
                        {apiKeys.map((apiKey, index) => (
                            <ApiKeysItem
                                key={index}
                                index={index}
                                item={apiKey}
                                handleUpdateKey={item => handleSetApiKeyProcess('update', item)}
                                handleDeleteKey={item => handleSetApiKeyProcess('delete', item)}
                            />
                        ))}
                    </div>
                </IonContent>
            ) : 
                <IonContent className='bg-body'>
                    <div className="text-center mt-4">
                        <div>
                            <img src="/assets/images/no-data.png" alt="" className='no-data'/>
                        </div>
                        <div className="no-data">No API Key found</div>
                    </div>
                </IonContent>
            }
            <div className='bg-body'>
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    page={currentPageIndex}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={onClickPrevPage}
                    onClickNextPage={onClickNextPage}
                />
            </div>
            {showCreatedApiKeyModal && (
                <CreatedApiKeyModal
                    showModal={showCreatedApiKeyModal}
                    closeCreatedApiKeyModal={() => setShowCreatedApiKeyModal(false)}
                    apiKey={(apiKeysModal as any).apiKey}
                />
            )}
            <TwoFactorModal
                showModal={show2FAModal}
                handleToggle2FA={handleTriggerAction}
            />
        </IonPage>
    );
};

export default ProfileApiKeys;
