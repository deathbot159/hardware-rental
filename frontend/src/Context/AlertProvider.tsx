import {createContext, ReactNode, useContext, useState} from "react";
import {AlertOptionsType, AlertVariants, IAlert} from "@/@Types/AlertOptionsTypes";

export const AlertContext = createContext<AlertOptionsType | null>(null);

export default function AlertProvider({children}: {children: ReactNode}){
    const [alertOptions, setAlertOptions] = useState(
        {
            show: false,
            variant: "danger",
            text: ""
        } as IAlert
    );

    const changeAlertVisibility = (visibility: boolean) => {
        setAlertOptions(prev=>({...prev, show: visibility}));
    };

    const changeAlertVariant = (variant: AlertVariants) => {
        setAlertOptions(prev=>({...prev, variant: variant}));
    }

    const changeAlertText = (text: string) => {
        setAlertOptions(prev=>({...prev, text: text}));
    }

    const editAlert = (visibility: boolean, variant: AlertVariants, text: string) => {
        setAlertOptions(prev=>({...prev, show: visibility, variant: variant, text: text}));
    }

    return(
        <AlertContext.Provider value={{alertOptions: alertOptions, editAlert, changeAlertVisibility, changeAlertVariant, changeAlertText}}>
            {children}
        </AlertContext.Provider>
    );
}

export const useAlert = ()=>{
    const context = useContext(AlertContext);
    if(!context)
        throw new Error("useApplication must be used inside a `ApplicationProvider`.");
    return context;
}