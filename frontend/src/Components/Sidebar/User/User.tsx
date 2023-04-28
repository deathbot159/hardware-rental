import styles from "@/Components/Sidebar/User/User.module.scss";
import Image from "next/image";


export default function User(props: {avatar: string, name: string}){
    return <>
        <div className={styles.sidebar__user}>
            <Image src={props.avatar} alt={"Avatar"} className={"rounded"} width={48} height={48}/>
            <p>{props.name}</p>
        </div>
    </>
}