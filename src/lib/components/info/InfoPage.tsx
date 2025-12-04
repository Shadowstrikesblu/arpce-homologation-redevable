// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { MapPin, Map, LocateFixed, Home } from "lucide-react"

// const cities = [
//   "Brazzaville",
//   "Pointe-Noire",
//   "Dolisie",
//   "Nkayi",
//   "Ouesso",
//   "Kintélé",
//   "Impfondo",
//   "Madingou",
//   "Gamboma",
//   "Sibiti",
//   "Kinkala",
//   "Mossendjo",
//   "Oyo",
//   "Owando",
// ]

// const arrondissementsData: Record<string, string[]> = {
//   Brazzaville: [
//     "Makélékélé",
//     "Bacongo",
//     "Poto-Poto",
//     "Moungali",
//     "Ouenze",
//     "Talangaï",
//     "Mfilou",
//     "Madibou",
//     "Djiri",
//   ],
//   "Pointe-Noire": [
//     "Lumumba",
//     "Mvoumvou",
//     "Tié-Tié",
//     "Loandjili",
//     "Mongo-Mpoukou",
//     "Ngoyo",  
//   ],
// }

// export default function InfoPage() {
//   const router = useRouter()

//   const [type, setType] = useState<"particulier" | "entreprise">("particulier")
//   const [city, setCity] = useState<string>("")
//   const [arrondissement, setArrondissement] = useState<string>("")
//   const [quartier, setQuartier] = useState<string>("")
//   const [rue, setRue] = useState<string>("")
//   const [errors, setErrors] = useState<Record<string, string>>({})

//   const arrondissements = city ? arrondissementsData[city] || [] : []

//   const validate = () => {
//     const newErrors: Record<string, string> = {}

//     if (!city) newErrors["city"] = "La ville est obligatoire"

//     if (city && arrondissements.length > 0 && !arrondissement) {
//       newErrors["arrondissement"] = "Sélectionnez un arrondissement"
//     }

//     if (city && arrondissements.length === 0 && !arrondissement.trim()) {
//       newErrors["arrondissement"] = "Veuillez indiquer l'arrondissement/zone"
//     }

//     if (!quartier.trim()) newErrors["quartier"] = "Le quartier est obligatoire"
//     if (!rue.trim()) newErrors["rue"] = "L'adresse (rue / numéro) est obligatoire"

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = () => {
//     if (!validate()) return

//     const payload = {
//       type,
//       city,
//       arrondissement,
//       quartier,
//       rue,
//     }

//     console.log("payload adresse", payload)

//     router.push("/dafc/validation")
//   }

//   const handleCityChange = (value: string) => {
//     setCity(value)
//     setArrondissement("")
//   }

//   return (
//     <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
//       <div className="w-full max-w-md">
//         <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">

//           {/* HEADER */}
//           <div className="text-center space-y-2">
//             <h1 className="text-3xl font-bold text-gray-900">Informations d’adresse</h1>
//             <p className="text-gray-600">Remplissez les informations de localisation</p>
//           </div>

//           {/* TYPE */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">Type de client *</label>
//             <div className="flex gap-3">
//               <Button
//                 variant={type === "entreprise" ? "default" : "outline"}
//                 className={`w-1/2 ${type === "entreprise" ? "bg-[#af3338] text-white" : ""}`}
//                 onClick={() => setType("entreprise")}
//               >
//                 Entreprise
//               </Button>

//               <Button
//                 variant={type === "particulier" ? "default" : "outline"}
//                 className={`w-1/2 ${type === "particulier" ? "bg-[#af3338] text-white" : ""}`}
//                 onClick={() => setType("particulier")}
//               >
//                 Particulier
//               </Button>
//             </div>
//           </div>

//           {/* VILLE */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">Ville *</label>
//             <div className="relative">
//               <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <select
//                 className="w-full border rounded-md pl-10 pr-3 py-2 text-gray-700 focus:ring-[#af3338] outline-none"
//                 value={city}
//                 onChange={(e) => handleCityChange(e.target.value)}
//               >
//                 <option value="">Sélectionner une ville</option>
//                 {cities.map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {errors["city"] && <p className="text-sm text-red-600">{errors["city"]}</p>}
//           </div>

//           {/* ARRONDISSEMENT */}
//           {city && (
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-700">Arrondissement *</label>

//               {arrondissements.length > 0 ? (
//                 <div className="relative">
//                   <Map className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <select
//                     className="w-full border rounded-md pl-10 pr-3 py-2 text-gray-700 focus:ring-[#af3338] outline-none"
//                     value={arrondissement}
//                     onChange={(e) => setArrondissement(e.target.value)}
//                   >
//                     <option value="">Sélectionner un arrondissement</option>
//                     {arrondissements.map((a) => (
//                       <option key={a} value={a}>
//                         {a}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               ) : (
//                 <div className="space-y-1">
//                   <div className="relative">
//                     <Map className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <Input
//                       value={arrondissement}
//                       onChange={(e) => setArrondissement(e.target.value)}
//                       placeholder="Indiquez l'arrondissement / la zone"
//                       className="pl-10"
//                     />
//                   </div>
//                   <p className="text-sm text-gray-500">
//                     Cette ville n'a pas d'arrondissements pré-enregistrés. Saisissez l'arrondissement ou la zone.
//                   </p>
//                 </div>
//               )}

//               {errors["arrondissement"] && <p className="text-sm text-red-600">{errors["arrondissement"]}</p>}
//             </div>
//           )}

//           {/* QUARTIER */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">Quartier *</label>
//             <div className="relative">
//               <LocateFixed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <Input
//                 value={quartier}
//                 onChange={(e) => setQuartier(e.target.value)}
//                 placeholder="Ex: OCH"
//                 className="pl-10"
//               />
//             </div>

//             {errors["quartier"] && <p className="text-sm text-red-600">{errors["quartier"]}</p>}
//           </div>

//           {/* RUE */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">Addresse *</label>
//             <div className="relative">
//               <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <Input
//                 value={rue}
//                 onChange={(e) => setRue(e.target.value)}
//                 placeholder="Ex: 10  Rue/Avenue Constant Balou "
//                 className="pl-10"
//               />
//             </div>

//             {errors["rue"] && <p className="text-sm text-red-600">{errors["rue"]}</p>}
//           </div>

//           {/* SUBMIT */}
//           <Button
//             className="w-full bg-linear-to-r from-[#af3338] to-[#c9454a] hover:from-[#8f2a2e] hover:to-[#b9353a] text-white font-medium py-6"
//             onClick={handleSubmit}
//           >
//             Suivant
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }
