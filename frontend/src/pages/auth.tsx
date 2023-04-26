import Head from 'next/head'
import alertStyle from "@/Styles/Components/Alert.module.scss"
import styles from '@/Styles/Pages/Login.module.scss'
import {Alert, Button, Container, Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Loader from "@/Components/Loader";
import {checkToken} from "@/Helpers/Token";
import axios from "axios";
import {routes} from "@/Config";
import crypto from "crypto";
import {useAlert} from "@/Context/AlertProvider";

interface Credentials {
    email: string,
    password: string,
    isValid: boolean,
    isLoggingIn: boolean
}

export default function Auth() {
    const {alertOptions, editAlert, changeAlertVisibility} = useAlert();
    const [credentials, setCredentials] = useState({email: "", password:"", isValid: true, isLoggingIn: false} as Credentials);
    const [buttonText, setButtonText] = useState("Login");
    const {push} = useRouter();

    let login = ()=>{
        setCredentials(prev=>({...prev, isLoggingIn: true}));
        setButtonText("Logging in...")
        axios.post(routes.authorize, {
            "email": credentials.email,
            "password": crypto.createHash("sha512").update(credentials.password, "utf-8").digest('hex')
        }).then(resp=>{
            if(resp.status == 200 && resp.data.status == 0){
                localStorage.setItem("token", resp.data.data.token);
                push("/");
            }
        }).catch(e=>{
            setCredentials(prev=>({...prev, isLoggingIn: false}));
            setButtonText("Login");
            editAlert(true, "danger" ,"Invalid email or password provided.");
        })
    }

    let checkEmail = (email: string) => {
        return email == "" || !!email.match(/^[a-zA-Z0-9._%+-]+@qarbon\.it$/);
    }

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token != null) {
            setButtonText("Checking token...");
            setCredentials(prev=>({...prev, isLoggingIn: true}))
            checkToken(token).then(valid=>{
                if(valid) push("/")
                else {
                    localStorage.removeItem("token");
                    setButtonText("Login");
                    editAlert(true, "warning" ,"Your session is expired. Please, log in.");
                }
            })
        }
    }, [])

    return (
        <>
            <Head>
                <title>Login - Hardware Rental</title>
            </Head>
            <Container fluid className={`${styles.login__box} vh-100 d-flex gap-5 flex-column align-items-center justify-content-center`}>
                <h1>Welcome back 👋</h1>
                <Form.Group controlId={"formEmail"}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control className={`${!credentials.isValid?styles.invalid_input:""} rounded-`} disabled={credentials.isLoggingIn} type={"email"}
                                  onChange={(ev)=>
                                      setCredentials((prev)=>({...prev, email: ev.target.value, isValid: checkEmail(ev.target.value)}))
                                  }/>
                    <Form.Label className={`${styles.info_label} ${!credentials.isValid?styles.invalid_label:""}`}><i className={"fi fi-rs-exclamation"}></i> Invalid email provided.</Form.Label>
                </Form.Group>
                <Form.Group controlId={"formPassword"}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type={"password"} disabled={credentials.isLoggingIn} onKeyDown={(ev)=>{if(ev.key=="Enter")login();}} onChange={(ev)=>
                        setCredentials((prev)=>({...prev, password: ev.target.value}))
                    } />
                </Form.Group>
                <Button type={"submit"} variant={credentials.isLoggingIn? "warning": "primary"} disabled={credentials.isLoggingIn} onClick={login}>
                    {buttonText}
                </Button>
                <Alert className={alertStyle.alert} show={alertOptions.show} variant={alertOptions.variant} onClose={() => changeAlertVisibility(false)} dismissible>{alertOptions.text}</Alert>
            </Container>
        </>
    )
}
