import Image from "next/image";
import {SignUp} from "@clerk/nextjs";

export default function RegisterPage(){
    return(
        <main className="flex flex-col items-center p-5 gap-10 animate-fade-in">
            <Image src={'/assets/logo.svg'} alt={'logo'}
                   width={100}
                   height={100}/>

            <div className={"mt-3 w-full max-w-md"}>
                <SignUp routing="path" path="/register" />
            </div>
        </main>
    )
}
