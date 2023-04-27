import Head from "next/head";
import Layout from "@/Components/Layout";
import acpStyles from "@/Styles/Pages/acp.module.scss"
import ButtonStyles from "@/Styles/New/Buttons.module.scss"
import List from "@/Components/List";
import AddDeviceModal from "@/Components/ACP/AddDeviceModal";
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
            }).catch(e=>{
                localStorage.removeItem("token");
                push("/auth")
            })
        }).catch(e=>{
            localStorage.removeItem("token");
            push("/auth")
        })
    }, [])

    let handleShow = ()=>{
        setShowModal(true);
    }

    let handleEdit = (devId: string) =>{
        alert(`Edit: ${devId}`);
    }
    let handleSendToRepair = (devId: string) =>{
        alert(`STR: ${devId}`);
    }
    let handleRemove = (devId: string) =>{
        alert(`Remove: ${devId}`);
    }

    return(
        <>
            {!sessionData.isAdmin|| <>
                <Head>
                    <title>Admin Control Panel - Hardware Rental</title>
                </Head>
                <Layout HeaderText={"Admin Control Panel"}>
                    <div className={acpStyles.controlBox}>
                        <button className={`${ButtonStyles.button} ${ButtonStyles.green}`} onClick={handleShow}>➕ Add device</button>
                    </div>
                    <List columnHeadData={columnHead} buttonClickHandler={[handleEdit, handleSendToRepair, handleRemove]}/>
                    <AddDeviceModal showModal={showModal} setShowModal={setShowModal}/>
                </Layout>
            </>}

        </>
    )
}