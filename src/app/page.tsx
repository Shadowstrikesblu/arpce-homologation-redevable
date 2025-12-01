"use client"
import SystemLoader from "@/lib/components/loader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Index(){

    const router = useRouter()

    useEffect(()=>{
        router.push("/platform")  
    }, [])

    return <SystemLoader/>
}