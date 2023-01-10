import * as React from 'react';
import { OrderBook,OrderComponent } from '../../../containers';
import { 
    IonContent, IonFooter, 
} from '@ionic/react';
import './order.css'

const CreateOrderComponent = props => {   
    return (
        <React.Fragment>
            <div className='h-divider'></div>
            <IonContent className="order-container bg-body">
                <OrderBook forceLarge={true} />
            </IonContent>
            <IonFooter>
                <div className='order-small'></div>
                <div className='h-divider'></div>
                <div className='create-order'>
                    <OrderComponent defaultTabIndex={props.currentOrderTypeIndex}/>
                </div>
            </IonFooter>
        </React.Fragment>
    );
};

export const CreateOrder = React.memo(CreateOrderComponent);
