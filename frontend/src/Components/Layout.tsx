import alertStyles from "@/Styles/Components/Alert.module.scss"
import styles from "@/Styles/Pages/Layout.module.scss"
import {Alert, Col, Container, Row} from "react-bootstrap";
import Sidebar from "@/Components/Sidebar";
import {ReactNode} from "react";
import Header from "@/Components/Header";
import Loader from "@/Components/Loader";
import {useAlert} from "@/Context/AlertProvider";
import {useLoader} from "@/Context/LoaderProvider";
import DeviceDataProvider from "@/Context/DeviceDataProvider";


export default function Layout({children, HeaderText}: {children?: ReactNode, HeaderText: string}){
    const {loaderSettings} = useLoader();
    const {alertOptions, changeAlertVisibility} = useAlert();


    return(
        <DeviceDataProvider>
            <Loader visible={loaderSettings.visible}>&quot;&quot;</Loader>
            <Container fluid className={styles.dashboard}>
                <Row>
                    <Col className={styles.leftCol} lg={2}>
                        <Sidebar/>
                    </Col>
                    <Col className={styles.rightCol}>
                        <Header>{HeaderText}</Header>
                        <div className={styles.content}>
                            {children}
                        </div>
                    </Col>
                </Row>
            </Container>
            <Alert className={alertStyles.alert} show={alertOptions.show} variant={alertOptions.variant} onClose={() => changeAlertVisibility(false)} dismissible>{alertOptions.text}</Alert>
        </DeviceDataProvider>
    )


}