import Head from 'next/head'
import alertStyle from "@/Styles/Components/Alert.module.scss"
import styles from '@/Styles/Pages/Auth.module.scss'
import {Alert, Button, Container, Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {checkToken} from "@/Helpers/Token";
import {useAlert} from "@/Context/AlertProvider";
import API from "@/Helpers/API";

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

    let login = async () => {
        setCredentials(prev => ({...prev, isLoggingIn: true}));
        setButtonText("Logging in...")
        let {success, message, data} = await API.authorize(credentials.email, credentials.password);
        if(success){
            localStorage.setItem("token", data!);
            push("/");
        }else{
            setCredentials(prev=>({...prev, isLoggingIn: false}));
            setButtonText("Login");
            editAlert(true, "danger" , message||"Error.");
        }
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
