import axiosClient from "../utils/axiosBase";

export interface UserInter {
  message: string;
  userId: string;
  email: string;
  raisonSociale: string;
  codeClient: string;
  registreCommerce: string | null;
  contactNom: string;
  contactTelephone: string;
  contactFonction: string | null;
  adresse: string | null;
  bp: string | null;
  ville: string | null;
  pays: string | null;
  isVerified: boolean;

}

export const UserEndpoit = {

    update_user : async (input : UserInter)=>{
    
        const {data} = await axiosClient.patch("/api/clients/profile", input)
    
        return data
    
    }

}