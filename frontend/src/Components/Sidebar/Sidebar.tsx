import styles from "@/Components/Sidebar/Sidebar.module.scss"
import ButtonStyles from "@/Styles/Components/Buttons.module.scss"
import {Button} from "react-bootstrap";
import {useRouter} from "next/router";
import User from "@/Components/Sidebar/User/User";
import Menu from "@/Components/Sidebar/Menu/Menu";
import SidebarButton from "@/Components/Sidebar/SidebarButton/SidebarButton";
import {useState} from "react";
import {useSession} from "@/Context/SessionProvider";

export default function Sidebar(){
    const {sessionData} = useSession();
    const [expandClass, setExpandClass] = useState("fi fi-bs-angle-down");
    const {pathname, push} = useRouter();

    const handleLogoff = async ()=>{
        localStorage.removeItem("token");
        window.location.replace("/auth")
    }

    return(
        <>
            <div className={styles.topbar}>
                <Button
                    variant={"outline-info"}
                    onClick={(ev)=>{
                        let el = document.getElementsByClassName(styles.sidebar)[0];
                        if(el.hasAttribute("visible")) {
                            el.removeAttribute("visible");
                            setExpandClass("fi fi-bs-angle-down");
                        }else {
                            el.setAttribute("visible", "");
                            setExpandClass("fi fi-bs-angle-up");
                        }
                    }}>
                    <i className={expandClass}></i>
                </Button>
            </div>
            <div className={styles.sidebar}>
                <div className={styles.top}>
                    <User avatar={sessionData.avatarLink} name={sessionData.name}/>
                    <Menu>
                        <SidebarButton href={"/"} styles={pathname == "/"? ButtonStyles.active:""} variant={"blue"}><i className={"fi fi-rs-laptop"}></i>&nbsp;&nbsp; Hardware list</SidebarButton>
                        <SidebarButton href={"/rentHardware"} styles={pathname == "/rentHardware"? ButtonStyles.active:""} variant={"blue"}><i className={"fi fi-rr-clock-five"}></i>&nbsp;&nbsp; Rent hardware</SidebarButton>
                        {!sessionData.isAdmin || <SidebarButton href={"/acp"} styles={pathname == "/acp"? ButtonStyles.active:""} variant={"red"}><i className={"fi fi-rr-wrench-simple"}></i>&nbsp;&nbsp; Admin CP</SidebarButton>}
                    </Menu>
                </div>
                <div className={styles.footer}>
                    <SidebarButton href={""} variant={"red"} clickHandler={handleLogoff}><i className={"fi fi-ss-sign-out-alt"}></i>&nbsp;&nbsp; Logout</SidebarButton>
                </div>
            </div>
        </>
    )
}