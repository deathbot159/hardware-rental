import {createContext, ReactNode, useContext, useState} from "react";
import {LoaderType} from "@/@Types/LoaderTypes";

export const LoaderContext = createContext<LoaderType | null>(null);

export default function LoaderProvider({children}: {children: ReactNode}){
    const [visible, setVisibility] = useState(true);

    const showLoader = (visible: boolean) => {
        setVisibility(visible);
    }

    return (
        <LoaderContext.Provider value={{visible: visible, showLoader}}>
            {children}
        </LoaderContext.Provider>
    )
}

export const useLoader = () => {
    const context = useContext(LoaderContext);
    if(!context)
        throw new Error("useLoader must be used inside a `LoaderProvider`.");
    return context;
}