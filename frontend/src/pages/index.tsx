import Head from "next/head";
import Layout from "@/Components/Layout";
import List from "@/Components/List";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import {routes} from "@/Config";
import DeviceDTO from "@/Helpers/DeviceDTO";
import {useSession} from "@/Context/SessionProvider";

export default function HardwareList(){
    let columnHead = [{key: "name", text: "Name & Company", sortable: true}, {key: "date", text:"Date", sortable: true}, {key: "availability", text: "Availability", sortable: true}, {key: "rentBtn", text: "Rent"}];

    let handleReturn = (elId: string) => {
        alert(elId);
    }

    return(
        <>
            <Head>
                <title>Hardware list - Hardware Rental</title>
            </Head>
            <Layout HeaderText={"Hardware list"}>
                <List columnHeadData={columnHead} buttonClickHandler={[handleReturn]}/>
            </Layout>
        </>
    )
}