import {createContext, ReactNode, useContext, useState} from "react";
import {ILoader, LoaderType} from "@/@Types/LoaderTypes";

export const LoaderContext = createContext<LoaderType | null>(null);

export default function LoaderProvider({children}: {children: ReactNode}){
    const [options, setOptions] = useState(
        {
            visible: true
        } as ILoader
    )

    const showLoader = (visible: boolean) => {
        setOptions(prev=>({...prev, visible: visible}));
    }

    return (
        <LoaderContext.Provider value={{loaderSettings: options, showLoader}}>
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