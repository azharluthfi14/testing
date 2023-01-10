import * as React from 'react';
import { useIntl } from 'react-intl';
import { CopyableTextField } from '../../components';
import { copy } from '../../helpers';

export const CreatedApiKeyModal = props => {
    const [apiKey, setApiKey] = React.useState({ kid: '', secret: '' });
    const intl = useIntl();

    React.useEffect(() => {
        if (props.apiKey) {
            setApiKey(props.apiKey);
        }
    }, [props.apiKey]);

    const renderModalBody = () => {
        return (
            <div className="cr-mobile-modal__body">
                <div onClick={() => copy('access-key-id')} className="mb-2">
                    <CopyableTextField
                        className="pg-copyable-text-field__input"
                        fieldId={'access-key-id'}
                        value={apiKey.kid || ''}
                        copyButtonText={intl.formatMessage({ id: 'page.body.profile.content.copyLink' })}
                        label={intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.access_key' })}
                    />
                </div>

                <div onClick={() => copy('secret-key-id')}>
                    <CopyableTextField
                        className="pg-copyable-text-field__input"
                        fieldId={'secret_key-id'}
                        value={apiKey.secret || ''}
                        copyButtonText={intl.formatMessage({ id: 'page.body.profile.content.copyLink' })}
                        label={intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.secret_key' })}
                    />
                </div>
                <div className="text-small"  style={{marginTop: '50px'}}>
                    <p>
                        {intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.secret_key_info' })}&nbsp;
                        {intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.secret_key_store' })}
                    </p>
                    <p>
                        {intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.note' })}&nbsp;
                        {intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.note_content' })}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div
        className="modal fade dialogbox"
        id="DialogIconedInfo"
        data-backdrop="static"
        tabIndex={-1}
        role="dialog"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        {intl.formatMessage({ id: 'page.mobile.createdApiKeyModal.title' })}
                        {renderModalBody()}
                    </div>
                    <div className="modal-footer">
                        <div className="btn-inline" onClick={props.closeCreatedApiKeyModal}>
                            <a className="btn" data-dismiss="modal">
                                CLOSE
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatedApiKeyModal;
