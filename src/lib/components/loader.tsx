import { LoaderCircle } from "lucide-react";

export default function SystemLoader(){

    return (
        <div className="min-h-screen justify-center items-center flex">
            <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
        </div>
    )
}