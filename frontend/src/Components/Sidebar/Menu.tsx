import {ReactNode} from "react";
import styles from "@/Styles/Components/Sidebar/Menu.module.scss"

export default function Menu({children}: {children: ReactNode}){
    return <>
        <div className={styles.sidebar__menu}>
            {children}
        </div>
    </>
}