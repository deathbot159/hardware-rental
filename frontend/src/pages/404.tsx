import {useRouter} from "next/router";
import {useEffect} from "react";


export default function Custom404(){
    const {push} = useRouter()
    useEffect(()=>{push("/auth")},[push])
    return <></>
}