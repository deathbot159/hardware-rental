import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useAlert} from "@/Context/AlertProvider";

type newDeviceData = {name: string, company: string, disabled: boolean, tryingToAdd: boolean}

export default function AddDeviceModal({showModal, setShowModal}:{showModal: boolean, setShowModal: any}){
    const [newDeviceData, setNewDeviceData] = useState({name: "", company: "", disabled: false, tryingToAdd: false} as newDeviceData)
    const {editAlert} = useAlert();

    const handleClose = ()=>{
        if(!newDeviceData.tryingToAdd) {
            setNewDeviceData({name: "", company: "", disabled: false, tryingToAdd: false});
            setShowModal(false);
        }
    }

    const toggleButtons = () => {
        setNewDeviceData(prev=>({...prev, tryingToAdd: !prev.tryingToAdd}));
    }

    const handleAdd = () => {
        if(!newDeviceData.tryingToAdd){
            toggleButtons();
            let {name, company, disabled} = newDeviceData;
            if(name == "" || company == ""){
                editAlert(true, "warning", "Please, provide name and company of device.");
                toggleButtons()
                return;
            }

            handleClose();
        }
    }

    const handleInput = (key: "name"|"company"|"disabled", value: string|boolean) => {
        let obj: any = {}
        obj[key] = value
        setNewDeviceData(prev=>({...prev, ...obj}))
    }

    return <Modal
        show={showModal}
        size="lg"
        centered
    >
        <Modal.Header>
            <Modal.Title>
                Add new device
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <InputGroup className={"mb-3"}>
                <InputGroup.Text>Company</InputGroup.Text>
                <Form.Control
                    placeholder="Company name"
                    aria-label="Company name"
                    onChange={ev=>handleInput("company", ev.target.value)}
                    required
                />
            </InputGroup>
            <InputGroup className={"mb-3"}>
                <InputGroup.Text>Name</InputGroup.Text>
                <Form.Control
                    placeholder="Device name"
                    aria-label="Device name"
                    onChange={ev=>handleInput("name", ev.target.value)}
                    required
                />
            </InputGroup>
            <InputGroup className={"mb-3"}>
                <InputGroup.Text>Disabled</InputGroup.Text>
                <InputGroup.Checkbox
                    aria-label="Checkbox disabled"
                    onChange={(ev: any)=>handleInput("disabled", !newDeviceData.disabled)}
                />
            </InputGroup>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={handleAdd} variant={"success"} disabled={newDeviceData.tryingToAdd}>Add</Button>
            <Button onClick={handleClose} variant={"danger"} disabled={newDeviceData.tryingToAdd}>Close</Button>
        </Modal.Footer>
    </Modal>
}