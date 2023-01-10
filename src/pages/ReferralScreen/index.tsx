import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Pagination } from '../../components';
import { useDispatch } from 'react-redux';
import { copy,localeDate } from '../../helpers';
import { useUserReferralFetch } from '../../hooks';
import { useHistory } from 'react-router';
import {
    RootState,
    selectUserReferral,
    selectUserReferralCurrentPage,
    selectUserReferralFirstElemIndex,
    selectUserReferralLastElemIndex,
    selectUserReferralNextPageExists,
    alertPush,
    selectUserInfo
} from '../../modules';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButtons,IonIcon,IonRefresher,IonRefresherContent,IonSpinner } from '@ionic/react';
import { checkmarkOutline,arrowBackOutline } from 'ionicons/icons';

const DEFAULT_LIMIT = 10;

const ReferralScreen: React.FC = () => {
    const [currentPage, setCurrentPage] = React.useState(0);
    const intl = useIntl();
    const page = useSelector(selectUserReferralCurrentPage);
    const userReferral = useSelector(selectUserReferral);
    const firstElemIndex = useSelector((state: RootState) => selectUserReferralFirstElemIndex(state, DEFAULT_LIMIT));
    const lastElemIndex = useSelector((state: RootState) => selectUserReferralLastElemIndex(state, DEFAULT_LIMIT));
    const nextPageExists = useSelector((state: RootState) => selectUserReferralNextPageExists(state, DEFAULT_LIMIT));
    const user = useSelector(selectUserInfo);
    const dispatch = useDispatch();
    const history = useHistory();

    useUserReferralFetch({page: currentPage, limit: DEFAULT_LIMIT});

    const onClickPrevPage = () => {
        setCurrentPage(Number(page) - 1);
    };
    const onClickNextPage = () => {
        setCurrentPage(Number(page) + 1);
    };

    const handleCopyText = () => {
        copy('referral-link');
        dispatch(alertPush({ message: ['page.mobile.profileLinks.link.referral.success'], type: 'success' }));
    };

    const data = userReferral.data ? userReferral.data : []
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start" onClick={()=>history.push('/user/profile')}>
                        <IonIcon slot="icon-only" icon={arrowBackOutline} className="ml-1"></IonIcon>
                    </IonButtons>
                    <IonTitle className='ion-text-center title-wallet text-large bold'>My Referral</IonTitle>
                    <IonButtons slot="end"></IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className='bg-body'>
                <div className='content mt-2 text-large'>
                    <h5>Invite your friend and earn 50% commission on their exchange trasaction, Copy link bellow and share referral link to your friend</h5>
                    <div className="separate referral-link pt-1 pb-4" onClick={handleCopyText}>
                        <input
                            type="text"
                            id="referral-link"
                            className='no-box text-extra-small'
                            value={`${window.document.location.origin}/signup?refid=${user.uid}`}
                            readOnly={true}
                        />
                        <span className="copylink link text-extra-small">{intl.formatMessage({id: 'page.mobile.profileLinks.link.referral'})}</span>
                    </div>
                    <div className="divider-dashboard" />
                    <div className="profile-stats pt-2 pb-2">
                        <a href="#" className="item">
                            <strong>{userReferral.total || 0}</strong>Total Referral
                        </a>
                        <a href="#" className="item">
                            <strong>{userReferral.month || 0}</strong>This Month
                        </a>
                        <a href="#" className="item">
                            <strong>{userReferral.year || 0}</strong>This Year
                        </a>
                        <a href="#" className="item">
                            <strong>0</strong>Commission
                        </a>
                    </div>
                    <div className="divider-dashboard" />
                    <div>
                        <h3 className='p-0 pt-2'>Referral List</h3>
                        <div className='list-referral'>
                            {data.length ? (
                                data.map((item, index) => (
                                    <div className='separate pl-3 pr-3 pb-1 pt-1 border-bottom'>
                                        <div>
                                            <div>{item.username}</div>
                                            <div>{item.email}</div>
                                        </div>
                                        <div>
                                            <div className={user.state === 'active' ? 'text-primary' : 'text-warning'}>{user.state.toUpperCase()}</div>
                                            <div>{localeDate(user.created_at,'onlyDate')}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className='text-center mt-4'>
                                    <div>
                                        <img src="/assets/images/no-data.png" className="no-data" alt="" />
                                    </div>
                                    <span className="no-data">{intl.formatMessage({id: 'page.noDataToShow'})}</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </IonContent>
            <div className='bg-body'>
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    page={currentPage}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={onClickPrevPage}
                    onClickNextPage={onClickNextPage}
                />
            </div>
        </IonPage>
    );
};

export default ReferralScreen;
