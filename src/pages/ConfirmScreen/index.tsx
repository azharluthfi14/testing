import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { kycSteps } from '../../api';
import { Documents, Phone } from '../../containers';
import { getVerificationStep, setDocumentTitle } from '../../helpers';
import { IonPage } from '@ionic/react';
import {
    Label,
    labelFetch,
    RootState,
    selectLabelData,
    selectSidebarState,
    toggleSidebar,
} from '../../modules';

interface ReduxProps {
    isSidebarOpen: boolean;
    labels: Label[];
}

interface DispatchProps {
    labelFetch: typeof labelFetch;
    toggleSidebar: typeof toggleSidebar;
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps;

class ConfirmScreen extends React.Component<Props> {
    public componentDidMount() {
        const { labels, isSidebarOpen } = this.props;
        setDocumentTitle('Confirm');
        this.props.labelFetch();

        if (labels.length) {
            this.handleCheckUserLabels(labels);
        }

        isSidebarOpen && this.props.toggleSidebar(false);
    }

    public componentDidUpdate(prevProps: Props) {
        const { labels } = this.props;

        if (labels.length && JSON.stringify(labels) !== JSON.stringify(prevProps.labels)) {
            this.handleCheckUserLabels(labels);
        }
    }

    public renderVerificationStep = (step: string) => {
        switch (step) {
            case 'phone':    return <Phone />;
            case 'document': return <Documents />;
            default: return '';
        }
    };

    public render() {
        const step = this.handleGetVerificationStep();
        return (
            <IonPage>
                {this.renderVerificationStep(step)}
            </IonPage>
        );
    }

    public translate = (id: string) => this.props.intl.formatMessage({ id });

    private handleGetVerificationStep = (): string => {
        const { labels } = this.props;

        return getVerificationStep(labels);
    };

    private handleCheckUserLabels = (labels: Label[]) => {
        const pendingLabelExists = Boolean(labels.find(label => kycSteps().includes(label.key) && ['pending', 'drafted', 'submitted'].includes(label.value) && label.scope === 'private'));
        const passedSteps = kycSteps().filter((step: string) => labels.find(label => step === label.key && label.value === 'verified' && label.scope === 'private'));

        if (pendingLabelExists || (kycSteps().length === passedSteps.length)) {
            this.props.history.push('/user/profile');
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    isSidebarOpen: selectSidebarState(state),
    labels: selectLabelData(state),
});

const mapDispatchToProps = dispatch => ({
    labelFetch: () => dispatch(labelFetch()),
    toggleSidebar: (payload) => dispatch(toggleSidebar(payload)),
});

export default compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(ConfirmScreen) as any; // tslint:disable-line
