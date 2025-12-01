// app/context/UserContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  PropsWithChildren,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { inherits } from "util";
import { Client } from "@/lib/interfaces/models.interface";
import SystemLoader from "@/lib/components/loader";
import { auth } from "@/lib/endpoints/auth";
import { UserInter } from "@/lib/endpoints/user.endpoint";



interface UserContextValue {
  user: UserInter | null;
  setUser: Dispatch<SetStateAction<UserInter | null>>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const TOKEN_KEY = process.env["NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY"]

export function UserProvider({ children }: PropsWithChildren) {

    const [user, setUser] = useState<UserInter | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const router = useRouter();
    const pathname = usePathname();


    useEffect(() => {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) {
            const next = encodeURIComponent(pathname || "/");
            router.replace(`/auth/login?next=${next}`);
            setIsCheckingAuth(false);
            return;
        }

        auth.token() 
            .then((data: UserInter) => {
                setUser(data);
            })
            .catch((error) => {
                router.replace(`/auth/login?message=auth-failed`);
            })
            .finally(() => {
                setIsCheckingAuth(false);
            });

    }, [pathname, router]);


    if (!user && isCheckingAuth) {

        return <SystemLoader/>; 

    }else if (user && !isCheckingAuth){
        
        return (
            <UserContext.Provider value={{ user, setUser }}>
                {children}
            </UserContext.Provider>
        );

    }else{

        return <SystemLoader/>; 

    }
}

export function useUser(): [UserInter | null, Dispatch<SetStateAction<UserInter | null>>] {
    
    const context = useContext(UserContext);
    
    if (!context) {
        throw new Error("useUser must be used inside a <UserProvider />");
    }

    return [context.user, context.setUser];
}
