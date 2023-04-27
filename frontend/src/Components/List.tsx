import styles from "@/Styles/Components/List.module.scss"
import listStyles from "@/Styles/Components/List.module.scss"
import ButtonStyles from "@/Styles/New/Buttons.module.scss"
import moment from "moment/moment";
import {useState} from "react";
import {ButtonGroup, DropdownButton} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";
import {useDeviceData} from "@/Context/DeviceDataProvider";
import {DeviceState} from "@/Helpers/DeviceState";
import {useSession} from "@/Context/SessionProvider";
import {useRouter} from "next/router";
import axios from "axios";
import {routes} from "@/Config";
import {useAlert} from "@/Context/AlertProvider";

type Sorting = {sortByKey: string, sortOrder: "asc"|"desc"}

export default function List({columnHeadData, buttonClickHandler}: {columnHeadData: {key:string, text:string, sortable?: boolean}[], buttonClickHandler: ((elId: string)=>void)[]}){
    const {rentDevices, setRentDevices, refreshRentDevices} = useSession();
    const {devices, setDevices, loadingDevices, refreshData} = useDeviceData();
    const {editAlert} = useAlert();
    const [sortingBy, setSortingBy] = useState({sortByKey: columnHeadData.filter(d=>d.sortable)[0].key, sortOrder: "asc"} as Sorting);
    const {pathname, push} = useRouter();

    const handleSorting = (key: string)=> {
        if(sortingBy.sortByKey == key)
            setSortingBy(prev=>({...prev, sortOrder: prev.sortOrder=="asc"?"desc":"asc"}));
        else {
            setSortingBy({sortByKey: key, sortOrder: "asc"});
        }
        if(pathname == "/rentHardware"){
            setRentDevices(rentDevices.sort((a,b)=>{
                let deviceA = devices.find(d=>d.id==a.deviceId) as any;
                deviceA = deviceA?deviceA:{}
                let deviceB = devices.find(d=>d.id==b.deviceId) as any;
                deviceB = deviceB?deviceB:{}
                if(sortingBy.sortOrder == "asc")
                    return (deviceA[sortingBy.sortByKey] < deviceB[sortingBy.sortByKey])? -1: 1;
                else
                    return (deviceA[sortingBy.sortByKey] > deviceB[sortingBy.sortByKey])? -1 : 1 ;
            }))
        }else
            setDevices(devices.sort((a:any,b:any)=>{
                if(sortingBy.sortOrder == "asc"){
                    return (a[sortingBy.sortByKey] > b[sortingBy.sortByKey])?-1:1;
                }else{
                    return (a[sortingBy.sortByKey] < b[sortingBy.sortByKey])?-1:1;
                }
            }))
    }

    const handleRent = (devId: string) => {
        axios.post(routes.rentDevice(devId), {} ,{
            "headers": {"x-access-token": localStorage.getItem("token")}
        }).then(resp=>{
            if(resp.status == 200){
                refreshData();
                editAlert(true, "success", `Successfully rent device ${devices.find(d=>d.id==devId)!.name}.`);
            }else{
                if(resp.data.status == 2){
                    editAlert(true, "danger", "Invalid/deprecated token. Please, log in again.");
                    localStorage.removeItem("token");
                    push("/auth")
                }else{
                    editAlert(true, "danger", "Cannot rent device.");
                }
            }
        }).catch(e=>{
            localStorage.removeItem("token")
            push("/auth")
        })
    }

    const handleReturn = (devId: string) => {
        axios.delete(routes.returnDevice(devId), {
            headers: {"x-access-token": localStorage.getItem("token")}
        }).then(resp=>{
            if(resp.status == 200){
                refreshData();
                refreshRentDevices();
                editAlert(true, "success", `Successfully returned device ${devices.find(d=>d.id==devId)!.name}.`);
            }else{
                if(resp.data.status == 2){
                    editAlert(true, "danger", "Invalid/deprecated token. Please, log in again.");
                    localStorage.removeItem("token");
                    push("/auth")
                }else{
                    editAlert(true, "danger", "Cannot rent device.");
                }
            }
        }).catch(e=>{
            localStorage.removeItem("token");
            push("/auth")
        })
    }

    const handleRemove = (devId: string) => {
        axios.delete(routes.removeDevice(devId), {
            "headers": {"x-access-token": localStorage.getItem("token")}
        }).then(resp=>{
            editAlert(true, "success", `Removed device ${devices.find(d=>d.id==devId)!.name}.`);
            refreshData();
        }).catch(e=>{
            if(e.response) {
                if (e.response.data.status == 2) {
                    localStorage.removeItem("token");
                    editAlert(true, "danger", "Invalid token. Please, log in again.");
                    push("/auth");
                    return;
                }
                if (e.response.data.status == 4) {
                    editAlert(true, "warning", "Invalid permissions.");
                    push("/");
                    return;
                }
                if (e.response.data.status == 6) {
                    editAlert(true, "danger", "Try again ;)");
                    return;
                }
                if (e.response.data.status == -1) {
                    editAlert(true, "danger", e.response.data.message);
                    return;
                }
            }else
                editAlert(true, "danger", "Cannot remove device. API error.");
        })
    }

    const handleEdit = (devId: string, data: any,  sendToRepair: boolean = false) => {
        let device = devices.find(d=>d.id==devId)!;
        axios.put(routes.editRoute(devId), sendToRepair?{
            "state": device.state == DeviceState.InRepair? DeviceState._: DeviceState.InRepair
        }: {}, {
            "headers": {"x-access-token": localStorage.getItem("token")}
        }).then(resp=>{
            editAlert(true, "success", `${!sendToRepair?"Edited device":"Device"} ${device.name}${sendToRepair?` ${device.state==DeviceState._?"was sent to":"came back from"} repair`:""}.`);
            refreshData();
        }).catch(e=>{
            if(e.response) {
                if (e.response.data.status == 2) {
                    localStorage.removeItem("token");
                    editAlert(true, "danger", "Invalid token. Please, log in again.");
                    push("/auth");
                    return;
                }
                if (e.response.data.status == 4) {
                    editAlert(true, "warning", "Invalid permissions.");
                    push("/");
                    return;
                }
                if(e.response.data.status == 5){
                    editAlert(true, "danger", "Invalid request body.");
                    return;
                }
                if (e.response.data.status == 6) {
                    editAlert(true, "danger", "Try again ;)");
                    return;
                }
                if (e.response.data.status == -1) {
                    editAlert(true, "danger", e.response.data.message);
                    return;
                }
            }else
                editAlert(true, "danger", "Cannot edit device. API error.");
        })
    }

    return <>
        <table className={styles.list}>
            <thead>
                <tr>
                    {columnHeadData.map(el=>
                        <th key={el.key} onClick={()=>handleSorting(el.key)}>{
                            el.key=="empty"? "":
                            <>{el.text} {!el.sortable ||
                                <i className={sortingBy.sortByKey != el.key?
                                    "fi fi-ss-sort":
                                    sortingBy.sortOrder == "asc"? "fi fi-rr-sort-amount-up": "fi fi-rr-sort-amount-down"
                                }></i>
                            }
                            </>
                        }</th>
                    )}
                </tr>
            </thead>
            <tbody>
            {
                pathname == "/rentHardware"?
                    rentDevices.length==0&&devices.length==0||
                    rentDevices.map((rentDevice)=>
                        <tr key={rentDevice.deviceId}>{
                            columnHeadData.map(({key})=>
                                <td key={key}>{
                                    [devices.find(d=>d.id==rentDevice.deviceId) as any].map(d=>
                                        Object.keys(d?d:{}).find(k=>k == key)?
                                            key == "date" ? moment(rentDevice.date).format("DD-MM-YYYY"):
                                            d[key]
                                        :key == "returnBtn"?
                                            <button
                                                className={`${ButtonStyles.button} ${ButtonStyles.green}`}
                                                onClick={()=>handleReturn(d.id)}>
                                                Return
                                            </button>:
                                        "<invalid key>"
                                    )
                                }</td>
                            )
                        }</tr>
                    )
                :devices.length==0||
                devices.map((deviceData:any) =>
                    <tr key={deviceData.id}>{
                        columnHeadData.map(({key})=>
                            <td key={key}>{
                                Object.keys(deviceData).find(k=>k == key)?
                                    key == "date" ? moment(deviceData[key]).format("DD-MM-YYYY"):
                                    key == "availability" ?
                                        deviceData[key] == DeviceState._? <span>{"• Available"}</span>:
                                        deviceData[key] == DeviceState.Rent? <span className={listStyles.red}>{"• Rent"}</span>:
                                        deviceData[key] == DeviceState.InRepair? <span className={listStyles.orange}>{"• In repair"}</span>:
                                        deviceData[key] == DeviceState.Disabled? <span className={listStyles.gray}>{"• Disabled"}</span>:
                                        deviceData[key] == DeviceState.NotAvilable? <span className={listStyles.gray}>{"• Not available"}</span>:
                                        deviceData[key]:
                                    deviceData[key]
                                :
                                key == "rentBtn"?
                                    <button
                                        className={`${ButtonStyles.button} ${deviceData.availability==0 ? ButtonStyles.green: `${ButtonStyles.gray} ${ButtonStyles.blocked}`}`}
                                        onClick={()=>deviceData.availability==0? handleRent(deviceData.id):""}>
                                        Rent
                                    </button>:
                                key == "acpActions"?
                                    <DropdownButton as={ButtonGroup} title={"Actions"}>
                                        <DropdownItem eventKey={1} onClick={()=>buttonClickHandler[0](deviceData.id)}>📄 Edit device</DropdownItem>
                                        <DropdownItem eventKey={2} onClick={()=>handleEdit(deviceData.id, {}, true)}>🔧 {deviceData.state == DeviceState.InRepair?"Make avilable.":"Send to repair"}</DropdownItem>
                                        <DropdownItem eventKey={3} onClick={()=>handleRemove(deviceData.id)}>❌ Remove device</DropdownItem>
                                    </DropdownButton> :
                                    "<invalid key>"
                            }</td>
                        )
                    }</tr>
                )
            }
            </tbody>
        </table>
        {
            devices.length == 0? <div className={styles.loading}>{loadingDevices?<i className={"fi fi-rs-rotate-right"}></i>:"No devices found."}</div>:
                pathname=="/rentHardware" && rentDevices.length == 0?<div className={styles.loading}>No devices found.</div>: ""
        }
    </>
}