import styles from "@/Components/Loader/Loader.module.scss"
import {useLoader} from "@/Context/LoaderProvider";

export default function Loader(){
    const {visible} = useLoader();
    return <div className={`${styles.loader} ${!visible? styles.hide: ""}`}>&quot;&quot;</div>
}