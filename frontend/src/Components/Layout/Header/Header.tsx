import {ReactNode} from "react";
import styles from "@/Components/Layout/Header/Header.module.scss"

export default function Header({children}: {children: ReactNode}){
    return <>
        <div className={styles.content__header}>
            <p>{children}</p>
        </div>
    </>;
}