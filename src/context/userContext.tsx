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

export interface User {
    userId : string;
    email : string;
    raisonSociale : string;
    contactNom : string;
}

interface UserContextValue {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const TOKEN_KEY = process.env["NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY"]

export function UserProvider({ children }: PropsWithChildren) {

    const [user, setUser] = useState<User | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {

    if (typeof window === "undefined") return;

    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
        // pas de token -> redirection vers login avec la page suivante en query
        const next = encodeURIComponent(pathname || "/");
        router.replace(`/auth/login?next=${next}`);
        return;
    }

    auth.token() 
    .then((data)=>{
        setUser({
            ...data
        })
    }).catch((error)=>{
        router.replace(`/auth/login?message=auth-failed`);
    })
    
    // const next = encodeURIComponent(pathname || "/");
    // router.replace(`/auth/login?next=${next}`);
    // return;

    setIsCheckingAuth(false);

    }, [router, pathname, user]);


    if (isCheckingAuth) {
        return <SystemLoader/>; 
    }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser(): [User | null, Dispatch<SetStateAction<User | null>>] {
    const context = useContext(UserContext);
    if (!context) {
    throw new Error("useUser must be used inside a <UserProvider />");
    }
    return [context.user, context.setUser];
}
