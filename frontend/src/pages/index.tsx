import Head from "next/head";
import Layout from "@/Components/Layout/Layout";
import List from "@/Components/List/List";

export default function HardwareList(){
    const columnHead = [{key: "name", text: "Name & Company", sortable: true}, {key: "date", text:"Date", sortable: true}, {key: "availability", text: "Availability", sortable: true}, {key: "rentBtn", text: "Rent"}];

    return(
        <>
            <Head>
                <title>Hardware list - Hardware Rental</title>
            </Head>
            <Layout HeaderText={"Hardware list"}>
                <List columnHeadData={columnHead}/>
            </Layout>
        </>
    )
}