import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useAlert} from "@/Context/AlertProvider";
import {routes} from "@/Config";
import axios from "axios";
import {useDeviceData} from "@/Context/DeviceDataProvider";
import {useRouter} from "next/router";
import {DeviceState} from "@/Helpers/DeviceState";

type deviceData = {name: string, company: string, state: boolean, tryingToExecute: boolean}

export default function DeviceModal({showModal, setShowModal, modalType, setDeviceId, deviceId}:{showModal: boolean, setShowModal: any, modalType:"add"|"edit", setDeviceId: any, deviceId?: string}){
    const {devices, refreshData} = useDeviceData();
    const [deviceData, setDeviceData] = useState({name: "", company: "", state: false, tryingToExecute: false} as deviceData)
    const {editAlert} = useAlert();
    const {push} = useRouter();

    useEffect(()=>{
        if(deviceId != "") {
            let device = devices.find(d => d.id == deviceId)!;
            setDeviceData({
                name: device.name,
                company: device.company,
                state: device.state == DeviceState.Disabled,
                tryingToExecute: false
            });
        }
    }, [deviceId])

    const handleClose = ()=>{
        if(!deviceData.tryingToExecute) {
            modalType=="add"||setDeviceId("");
            setDeviceData({name: "", company: "", state: false, tryingToExecute: false});
            setShowModal(false);
        }
    }

    const toggleButtons = () => {
        setDeviceData(prev=>({...prev, tryingToExecute: !prev.tryingToExecute}));
    }

    const handleAdd = () => {
        if (deviceData.tryingToExecute) return;
        toggleButtons();
        let {name, company, state} = deviceData;
        if (name == "" || company == "") {
            editAlert(true, "warning", "Please, provide name and company of device.");
            toggleButtons()
            return;
        }
        axios.post(routes.addDevice, {
            "name": name,
            "company": company,
            "disabled": state
        }, {
            "headers": {"x-access-token": localStorage.getItem("token")},
        }).then(() => {
            refreshData();
            editAlert(true, "success", `Successfully added device ${company} ${name}`);
        }).catch(e => {
            if (e.response) {
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
                if (e.response.data.status == 5) {
                    editAlert(true, "danger", "Try again ;)");
                    return;
                }
                if (e.response.data.status == -1) {
                    editAlert(true, "danger", "Unknown error.");
                    return;
                }
            } else
                editAlert(true, "danger", "Cannot add device. API error.");
        })
        handleClose();
    }

    const handleEdit = (devId: string) =>{
        if (deviceData.tryingToExecute) return;
        toggleButtons();
        let originalData = devices.find(d=>d.id==devId)!;
        let {name, company, state} = deviceData;
        if (name == "" || company == "") {
            editAlert(true, "warning", "Please, provide name and company of device.");
            toggleButtons()
            return;
        }
        axios.put(routes.editDevice(devId), {
            "name": name == originalData.name?name.replace(originalData.company+" ", ""):name,
            "company": company,
            "state": state?DeviceState.Disabled:DeviceState._
        }, {
            "headers": {"x-access-token": localStorage.getItem("token")},
        }).then(() => {
            refreshData();
            editAlert(true, "success", `Successfully edited device ${originalData.name}`);
        }).catch(e => {
            if (e.response) {
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
            } else
                editAlert(true, "danger", "Cannot edit device. API error.");
        })
        handleClose();
    }

    const handleInput = (key: "name"|"company"|"state", value: string|boolean) => {
        let obj: any = {}
        obj[key] = value
        setDeviceData(prev=>({...prev, ...obj}))
    }

    return <Modal
        show={showModal}
        size="lg"
        centered
    >
        <Modal.Header>
            <Modal.Title>
                {modalType == "add"? "Add new device" : "Edit device"}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <InputGroup className={"mb-3"}>
                <InputGroup.Text>Company</InputGroup.Text>
                <Form.Control
                    placeholder="Company name"
                    aria-label="Company name"
                    defaultValue={modalType=="add"?"":deviceData.company}
                    onChange={ev=>handleInput("company", ev.target.value)}
                    required
                />
            </InputGroup>
            <InputGroup className={"mb-3"}>
                <InputGroup.Text>Name</InputGroup.Text>
                <Form.Control
                    placeholder="Device name"
                    aria-label="Device name"
                    defaultValue={modalType=="add"?"":deviceData.name.replace(deviceData.company+" ", "")}
                    onChange={ev=>handleInput("name", ev.target.value)}
                    required
                />
            </InputGroup>
            <InputGroup className={"mb-3"}>
                <InputGroup.Text>Disabled</InputGroup.Text>
                <InputGroup.Checkbox
                    aria-label="Disable checkbox"
                    checked={modalType=="add"?false:deviceData.state}
                    onChange={()=>handleInput("state", !deviceData.state)}
                />
            </InputGroup>
        </Modal.Body>
        <Modal.Footer>
            {modalType == "add"?
                <Button onClick={handleAdd} variant={"success"} disabled={deviceData.tryingToExecute}>Add</Button>:
                <Button onClick={()=>handleEdit(deviceId!)} variant={"warning"} disabled={deviceData.tryingToExecute}>Edit</Button>
            }
            <Button onClick={handleClose} variant={"danger"} disabled={deviceData.tryingToExecute}>Close</Button>
        </Modal.Footer>
    </Modal>
}