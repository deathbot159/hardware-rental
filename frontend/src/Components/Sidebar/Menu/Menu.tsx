import {ReactNode} from "react";
import styles from "@/Components/Sidebar/Menu/Menu.module.scss"

export default function Menu({children}: {children: ReactNode}){
    return <>
        <div className={styles.sidebar__menu}>
            {children}
        </div>
    </>
}