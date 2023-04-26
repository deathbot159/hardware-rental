import {Button, Form, InputGroup, Modal} from "react-bootstrap";


export default function AddDeviceModal({showModal, setShowModal}:{showModal: boolean, setShowModal: any}){

    let handleClose = ()=>{
        setShowModal(false);
    }

    let handleAdd = () => {
        setShowModal(false);
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
            <InputGroup className="mb-3">
                <InputGroup.Text>Name & Company</InputGroup.Text>
                <Form.Control
                    placeholder="Device name"
                    aria-label="Device name"
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text>Date</InputGroup.Text>
                <Form.Control
                    type={"date"}
                    placeholder="deviceAddDate"
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Checkbox aria-label="Checkbox disabled" />
                <Form.Control readOnly placeholder={"Disable device"} aria-label="Disable device" />
            </InputGroup>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={handleAdd} variant={"success"}>Add</Button>
            <Button onClick={handleClose} variant={"danger"}>Close</Button>
        </Modal.Footer>
    </Modal>
}