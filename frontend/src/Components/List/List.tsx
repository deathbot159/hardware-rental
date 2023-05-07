import styles from "@/Components/List/List.module.scss"
import listStyles from "@/Components/List/List.module.scss"
import ButtonStyles from "@/Styles/Components/Buttons.module.scss"
import moment from "moment/moment";
import {useState} from "react";
import {ButtonGroup, DropdownButton} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";
import {useDeviceData} from "@/Context/DeviceDataProvider";
import {DeviceState} from "@/Helpers/DeviceState";
import {useSession} from "@/Context/SessionProvider";
import {useRouter} from "next/router";
import {useAlert} from "@/Context/AlertProvider";
import API from "@/Helpers/API";

type Sorting = {sortByKey: string, sortOrder: "asc"|"desc"}

export default function List({columnHeadData, buttonClickHandler}: {columnHeadData: {key:string, text:string, sortable?: boolean}[], buttonClickHandler?: ((elId: string)=>void)[]}){
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

    const handleRent = async (devId: string) => {
        const {success, message} = await API.rentDevice(devId);
        if (!success && message) {
            if (message.includes("Invalid")) {
                editAlert(true, "danger", message);
                localStorage.removeItem("token");
                push("auth");
            } else {
                editAlert(true, "danger", message);
            }
            return;
        }
        refreshData();
        editAlert(true, "success", `Successfully rent device ${devices.find(d => d.id == devId)!.name}.`);
    }

    const handleReturn = async (devId: string) => {
        const {success, message} = await API.returnDevice(devId);
        if (!success && message) {
            if (message.includes("Invalid")) {
                editAlert(true, "danger", message);
                localStorage.removeItem("token");
                push("/auth")
            } else {
                editAlert(true, "danger", message);
            }
            return;
        }
        refreshData();
        refreshRentDevices();
        editAlert(true, "success", `Successfully returned device ${devices.find(d => d.id == devId)!.name}.`);
    }

    const handleRemove = async (devId: string) => {
        const {success, message} = await API.removeDevice(devId);
        if (!success && message) {
            if (message.includes("Invalid token")) {
                localStorage.removeItem("token");
                editAlert(true, "danger", message);
                push("/auth");
            } else if (message?.includes("Invalid permissions")) {
                editAlert(true, "warning", "Invalid permissions.");
                push("/");
            } else {
                editAlert(true, "danger", message);
            }
            return;
        }
        editAlert(true, "success", `Removed device ${devices.find(d => d.id == devId)!.name}.`);
        refreshData();
    }

    const handleSendToRepair = async (devId: string) => {
        const device = devices.find(d => d.id == devId)!;
        const {success, message} = await API.sendDeviceToRepair(devId, device.state);
        if (!success && message) {
            if (message.includes("Invalid token")) {
                localStorage.removeItem("token");
                editAlert(true, "danger", message);
                push("/auth");
            } else if (message?.includes("Invalid permissions")) {
                editAlert(true, "warning", "Invalid permissions.");
                push("/");
            } else
                editAlert(true, "danger", message);
            return;
        }
        editAlert(true, "success", `Device ${device.name} ${device.state == DeviceState._ ? "was sent to" : "came back from"} repair.`);
        refreshData();
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
                                        <DropdownItem eventKey={1} onClick={()=>buttonClickHandler![0](deviceData.id)}>📄 Edit device</DropdownItem>
                                        <DropdownItem eventKey={2} onClick={()=>handleSendToRepair(deviceData.id)}>🔧 {deviceData.state == DeviceState.InRepair?"Make avilable.":"Send to repair"}</DropdownItem>
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