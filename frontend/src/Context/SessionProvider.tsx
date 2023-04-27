import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {IRentDevice, ISessionData, SessionType} from "@/@Types/SessionTypes";
import {useRouter} from "next/router";
import {checkToken} from "@/Helpers/Token";
import axios from "axios";
import {routes} from "@/Config";
import {useLoader} from "@/Context/LoaderProvider";


export const SessionContext = createContext<SessionType | null>(null);

export default function SessionProvider({children}: {children: ReactNode}){
    const {showLoader} = useLoader();
    const [session, setSession] = useState(
        {
            avatarLink: "/avatars/default.png",
            name: "Loading...",
            isAdmin: false
        } as ISessionData
    )
    const [rentDevices, setRentDevicesState] = useState([] as IRentDevice[]);

    const {push, pathname} = useRouter();

    useEffect(()=>{
        let token = localStorage.getItem("token");
        if(pathname == "/auth"){
            setSession({avatarLink: "/avatars/default.png", name:"Loading...", isAdmin: false});
        }else {
            if(token == null) {
                showLoader(true);
                push("/auth");
            }
            checkToken(token!).then(valid => {
                if (!valid) {
                    localStorage.removeItem("token");
                    push("/auth");
                } else {
                    axios.get(routes.currentUserInfo, {
                        headers: {"x-access-token": localStorage.getItem("token")}
                    }).then(resp => {
                        if (resp.status == 200) {
                            let {avatar, name, admin, rentDevices} = resp.data.data;
                            setSession(prevState => ({
                                ...prevState,
                                token: token!,
                                avatarLink: `/avatars/${avatar == "" ? "default.png" : avatar}`,
                                name: name,
                                isAdmin: admin
                            }))
                            setRentDevicesState(rentDevices);
                        }
                    }).catch(e => {
                        localStorage.removeItem("token");
                        push("/auth");
                    })

                    showLoader(false);
                }
            }).catch(e => {
                localStorage.removeItem("token");
                push("/auth")
            })
        }
    }, [pathname]);

    const refreshRentDevices = ()=>{
        let token = localStorage.getItem("token");
        if(token == null) {
            showLoader(true);
            push("/auth");
            return;
        }
        checkToken(token!).then(valid=>{
            if (!valid) {
                localStorage.removeItem("token");
                push("/auth");
                return;
            }
            axios.get(routes.rentDevices, {
                "headers": {"x-access-token": token}
            }).then(resp=>{
                if(resp.status == 200){
                    let {data} = resp.data;
                    setRentDevicesState(data);
                }else{
                    localStorage.removeItem("token");
                    push("/auth")
                }
            })
        }).catch(e=>{
            localStorage.removeItem("token");
            push("/auth")
        })
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