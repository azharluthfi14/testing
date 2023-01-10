import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { captchaId, captchaType } from '../../api/config';
import { GeetestCaptcha } from '../../containers';
import { useSetShouldGeetestReset } from '../../hooks';
import {
    GeetestCaptchaResponse,
    selectShouldGeetestReset,
    setGeetestCaptchaSuccess,
    setRecaptchaSuccess,
} from '../../modules';

export const CaptchaComponent = props => {
    const dispatch = useDispatch();
    const shouldGeetestReset = useSelector(selectShouldGeetestReset);
    const geetestCaptchaRef = React.useRef(null);
    useSetShouldGeetestReset(props.error, props.success, geetestCaptchaRef);

    const handleGeetestCaptchaChange = (value?: GeetestCaptchaResponse) => {
        dispatch(setGeetestCaptchaSuccess({ captcha_response: value }));
    };

    const renderCaptcha = () => {
        switch (captchaType()) {
            case 'geetest':
                return (
                    <div className="pg-captcha--geetest">
                        <GeetestCaptcha
                            innerRef={geetestCaptchaRef}
                            shouldCaptchaReset={shouldGeetestReset}
                            onSuccess={handleGeetestCaptchaChange}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return renderCaptcha();
};

export const Captcha = React.memo(CaptchaComponent);
