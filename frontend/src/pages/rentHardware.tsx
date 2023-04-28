import Head from "next/head";
import Layout from "@/Components/Layout/Layout";
import List from "@/Components/List/List";

export default function RentHardware(){
    let columnHead = [{key: "name", text: "Name & Company", sortable: true}, {key: "date", text:"Date", sortable: true}, {key: "returnBtn", text: "Return"}];

    return(
        <>
            <Head>
                <title>Rent hardware - Hardware Rental</title>
            </Head>
            <Layout HeaderText={"Rent hardware"}>
                <List columnHeadData={columnHead}/>
            </Layout>
        </>
    )
}