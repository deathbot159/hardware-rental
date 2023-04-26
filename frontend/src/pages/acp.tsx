import Head from "next/head";
import Layout from "@/Components/Layout";
import Header from "@/Components/Header";
import styles from "@/Styles/Content.module.scss"
import acpStyles from "@/Styles/Pages/acp.module.scss"
import ButtonStyles from "@/Styles/New/Buttons.module.scss"
import List from "@/Components/List";
import {Button} from "react-bootstrap";
import AddDeviceModal from "@/Components/ACP/AddDeviceModal";
import {useState} from "react";

export default function AdminControlPanel(){
    let columnHead = [{key: "name", text: "Name & Company", sortable: true}, {key: "date", text:"Date", sortable: true}, {key: "availability", text: "Availability", sortable: true}, {key: "acpActions", text: "Actions"}];
    let [showModal, setShowModal] = useState(false);

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
        </>
    )
}