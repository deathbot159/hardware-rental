import Head from "next/head";
import Layout from "@/Components/Layout";
import acpStyles from "@/Styles/Pages/acp.module.scss"
import ButtonStyles from "@/Styles/New/Buttons.module.scss"
import List from "@/Components/List";
import DeviceModal from "@/Components/ACP/DeviceModal";
import {useEffect, useState} from "react";
import {useSession} from "@/Context/SessionProvider";
import {checkToken} from "@/Helpers/Token";
import {useRouter} from "next/router";
import {useAlert} from "@/Context/AlertProvider";
import axios from "axios";
import {routes} from "@/Config";

export default function AdminControlPanel(){
    const {sessionData} = useSession();
    const {editAlert} = useAlert();
    const columnHead = [{key: "name", text: "Name & Company", sortable: true}, {key: "date", text:"Date", sortable: true}, {key: "availability", text: "Availability", sortable: true}, {key: "acpActions", text: "Actions"}];
    const [showModal, setShowModal] = useState(false);
    const [modalSettings, setModalSettings] = useState({deviceId: "", type: "add"} as {deviceId: string, type: "add"|"edit"});
    const {push} = useRouter();

    useEffect(()=>{
        let token = localStorage.getItem("token");
        checkToken(token!).then(valid=>{
            if(!valid){
                localStorage.removeItem("token");
                push("/auth")
                return
            }
            if(!sessionData.isAdmin){
                editAlert(true, "warning", "Invalid permissions.");
                push("/")
                return
            }
            axios.get(routes.currentUserInfo, {
                "headers": {"x-access-token": token}
            }).then(resp=>{
                let {admin}: {admin: boolean} = resp.data.data;
                if(!admin){
                    editAlert(true, "warning", "Invalid permissions.");
                    push("/")
                }
            }).catch(()=>{
                localStorage.removeItem("token");
                push("/auth")
            })
        }).catch(()=>{
            localStorage.removeItem("token");
            push("/auth")
        })
    }, [])


    const showEditModal = (devId: string) =>{
        setModalSettings({deviceId: devId, type: "edit"});
        setShowModal(true);
    }

    const showAddModal = () => {
        setModalSettings({deviceId: "", type: "add"});
        setShowModal(true);
    }

    return(
        <>
            {!sessionData.isAdmin|| <>
                <Head>
                    <title>Admin Control Panel - Hardware Rental</title>
                </Head>
                <Layout HeaderText={"Admin Control Panel"}>
                    <div className={acpStyles.controlBox}>
                        <button className={`${acpStyles.addButton} ${ButtonStyles.button} ${ButtonStyles.green}`} onClick={showAddModal}><i className={"fi fi-br-plus-small"}></i> Add device</button>
                    </div>
                    <List columnHeadData={columnHead} buttonClickHandler={[showEditModal]}/>
                    <DeviceModal showModal={showModal} setShowModal={setShowModal} modalType={modalSettings.type} setDeviceId={(id: string)=>setModalSettings(prev=>({...prev, deviceId: id}))} deviceId={modalSettings.deviceId}/>
                </Layout>
            </>}

        </>
    )
}