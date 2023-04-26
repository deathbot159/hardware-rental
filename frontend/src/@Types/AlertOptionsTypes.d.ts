
export type AlertVariants = "success"|"danger"|"warning";

export interface IAlert {
    show: boolean,
    variant: AlertVariants,
    text: string
}

export type AlertOptionsType = {
    alertOptions: IAlert,
    editAlert: (visibility: boolean, variant: AlertVariants, text: string)=>void;
    changeAlertVisibility: (visibility: boolean)=>void;
    changeAlertVariant: (variant: AlertVariants)=>void;
    changeAlertText: (text: string)=>void;
};