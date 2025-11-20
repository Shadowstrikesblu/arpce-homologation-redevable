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

<<<<<<< HEAD
        const {data} = await axiosClient.post("/api/auth/register", {...input})
=======
        const {data} = await axiosClient.post("/api/auth/register", input)
>>>>>>> 229e06e31439cc338b7d7c16f7695825836f0428

        return data 
    }
}