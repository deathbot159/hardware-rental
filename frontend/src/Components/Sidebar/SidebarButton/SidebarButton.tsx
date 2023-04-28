import styles from "@/Styles/Components/Sidebar/SidebarButton.module.scss"
import ButtonStyles from "@/Styles/Components/Buttons.module.scss"
import Link from "next/link";
import {Button} from "react-bootstrap";
import {ReactNode} from "react";

type ButtonVariant = "blue" | "red";

export default function SidebarButton(props: {children: ReactNode, href: string, styles?: string, variant: ButtonVariant, clickHandler?: ()=>void}){

    return <>
        <Link href={props.href}>
            <Button className={`${ButtonStyles.sidebar_button} ${props.styles? props.styles: ""} ${props.variant == "blue"? ButtonStyles.blue: ButtonStyles.red}`} onClick={props.clickHandler}>
                {props.children}
            </Button>
        </Link>
    </>
}