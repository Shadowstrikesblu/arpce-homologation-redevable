import axiosClient from "../utils/axiosBase";

export interface loginInt {

    email : string;
    password : string;
} 

export interface RegisterInt {

    raisonSociale: string;
    email: string;
    password: string;
    contactNom: string;
    contactTelephone: string;
} 

export const auth = {

    login : async (input : loginInt)=>{
        const {data} = await axiosClient.post("/api/auth/login", input)

        return data 
    },

    register : async (input : RegisterInt)=>{

        const {data} = await axiosClient.post("/api/auth/register", input)

        return data 
    },



    otp : async (code : number)=>{

        const {data} = await axiosClient.post("/api/auth/confirm-account", {code})

        return data 
    },    
    
    token : async ()=>{

        const {data} = await axiosClient.post("/api/auth/connect-by-token")

        return data 
    }
}

