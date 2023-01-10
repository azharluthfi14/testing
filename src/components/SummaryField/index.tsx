import * as React from 'react';

export interface SummaryFieldProps {
    /**
     * Additional class name for styling. By default element receives `cr-input` class
     * @default empty
     */
    className?: string;
    /**
     * The string to use as the label for the SummaryField.
     */
    message: string;
    /**
     * Content will be displayed instead of amount and currency, if it is necessary
     */
    content: JSX.Element;
}

/**
 * Component to display currency amount with specific label.
 */
export const SummaryFieldComponent: React.FC<SummaryFieldProps> = ({ message, className, content }) => {
    return (
        <div className='separate'>
            <span className="cr-summary-field-message pl-0">{message}</span>
            <span className="cr-summary-field-content pl-0">{content}</span>
        </div>
    );
};

export const SummaryField = React.memo(SummaryFieldComponent);
