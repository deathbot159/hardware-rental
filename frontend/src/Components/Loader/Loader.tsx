import styles from "@/Components/Loader/Loader.module.scss"
import {ReactNode} from "react";

export default function Loader({children, visible}: {children: ReactNode, visible: boolean}){
    return <div className={`${styles.loader} ${!visible? styles.hide: ""}`}>{children}</div>
}