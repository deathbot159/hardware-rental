import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {IRentDevice, ISessionData, SessionType} from "@/@Types/SessionTypes";
import {useRouter} from "next/router";
import {checkToken} from "@/Helpers/Token";
import {useLoader} from "@/Context/LoaderProvider";
import API from "@/Helpers/API";


export const SessionContext = createContext<SessionType | null>(null);

export default function SessionProvider({children}: {children: ReactNode}){
    const {showLoader} = useLoader();
    const [session, setSession] = useState(
        {
            avatarLink: "/avatars/default.png",
            name: "Loading...",
            isAdmin: false,
            fetching: true
        } as ISessionData
    )
    const [rentDevices, setRentDevicesState] = useState([] as IRentDevice[]);

    const {push, pathname} = useRouter();

    useEffect(()=>{
        let token = localStorage.getItem("token");

        if(pathname == "/auth"){
            setSession({avatarLink: "/avatars/default.png", name:"Loading...", isAdmin: false, fetching: false});
            return;
        }

        if(token == null && pathname != "/auth"){
            showLoader(true);
            push("/auth");
            return;
        }

        if(pathname != "/auth"){
            checkToken(token!).then(async valid => {
                if (!valid) {
                    localStorage.removeItem("token");
                    push("/auth");
                } else {
                    let {success, data} = await API.getUserInfo();
                    if(success){
                        let {avatar, name, admin, rentDevices} = data!;
                        setSession({
                            avatarLink: `/avatars/${avatar == "" ? "default.png" : avatar}`,
                            name: name,
                            isAdmin: admin,
                            fetching: false
                        })
                        setRentDevicesState(rentDevices);
                        showLoader(false);
                    }else{
                        localStorage.removeItem("token");
                        await push("/auth");
                    }
                }
            }).catch(() => {
                localStorage.removeItem("token");
                push("/auth")
                return;
            })
        }
    }, [pathname]);

    const refreshRentDevices = async () => {
        let token = localStorage.getItem("token");
        if (token == null) {
            showLoader(true);
            push("/auth");
            return;
        }
        let valid = await checkToken(token!);
        if (!valid) {
            localStorage.removeItem("token");
            push("/auth");
            return;
        }
        let {success, data} = await API.getRentDevices();
        if(success){
            setRentDevicesState(data!);
        }else{
            localStorage.removeItem("token");
            push("/auth")
        }
    }

    const editSession = (sessionData: ISessionData) => {
        setSession(sessionData);
    }

    const setRentDevices = (rentDevices: IRentDevice[]) => {
        setRentDevicesState(rentDevices);
    }

    return(
        <SessionContext.Provider value={{sessionData: session, loadingRentDevices: false, rentDevices, refreshRentDevices, setRentDevices, editSession}}>
            {children}
        </SessionContext.Provider>
    )
}

export const useSession = () => {
    const context = useContext(SessionContext);
    if(!context)
        throw new Error("useSession must be used inside a `SessionProvider`.");
    return context;
}