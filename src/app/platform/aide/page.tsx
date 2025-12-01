"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, MapPin, Phone, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"

type FAQItem = {
  id: string
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "Comment créer un compte ?",
    answer:
      "Rendez-vous dans la section Inscription, remplissez vos informations personnelles puis validez. Vous recevrez un email de confirmation.",
  },
  {
    id: "2",
    question: "Puis-je modifier mes informations personnelles ?",
    answer:
      "Oui, toutes vos informations sont modifiables depuis votre tableau de bord dans la section Profil.",
  },
  {
    id: "3",
    question: "Que faire en cas de problème de connexion ?",
    answer:
      "Vérifiez votre mot de passe puis utilisez l’option Mot de passe oublié si nécessaire. Si le problème persiste, contactez le support.",
  },
  {
    id: "4",
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Vos données sont cryptées et stockées de manière sécurisée conformément aux normes en vigueur.",
  },
  {
    id: "5",
    question: "Comment contacter l’assistance ?",
    answer:
      "Vous pouvez contacter notre support via le formulaire de contact ou par email 24h/24.",
  },
  {
    id: "6",
    question: "Puis-je supprimer mon compte ?",
    answer:
      "Oui, la suppression du compte est possible depuis les paramètres du profil.",
  },
   
]


const addresses = [
  {
    id: "1",
    title: "Siège social",
    address: "91 bis Avenue de l'Amitié, Centre ville Brazzaville",
    phone: "+242 05 510 7272",
    email: "contact@arpce.cg",
    lat: -4.2667,
    lon: 15.2833,
  },
]

function SupportForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setLoading(true);

    setTimeout(() => {
      console.log("Suggestion envoyée :", form);
      setLoading(false);
      alert("Merci pour votre suggestion !");
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-md rounded-xl p-6 space-y-6 border"
      id="contact"
    >
      <div className="text-center">
        <h2 className="text-lg font-semibold">Contactez-nous</h2>
        <p className="text-gray-600 text-sm">Besoin d'assistance ? Remplissez le formulaire ci-dessous.</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Nom complet</label>
        <Input name="name" placeholder="Votre nom" value={form.name} onChange={handleChange} />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
        <Input name="email" type="email" placeholder="email@example.com" value={form.email} onChange={handleChange} />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Sujet</label>
        <Input name="subject" placeholder="Sujet de votre message" value={form.subject} onChange={handleChange} />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Votre message</label>
        <Textarea name="message" placeholder="Expliquez-nous votre idée ou votre problème..." className="min-h-[140px]" value={form.message} onChange={handleChange} />
      </div>

      <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-secondary text-white  flex items-center gap-2" disabled={loading}>
        <Send className="h-4 w-4" />
        {loading ? "Envoi..." : "Envoyer"}
      </Button>
    </motion.div>
  );
}



export default function AidePage() {
  const [openId, setOpenId] = useState<string | null>(null)
  const addr = addresses[0]
  const centerLon = addr?.lon ?? 15.2833
  const centerLat = addr?.lat ?? -4.2667




  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  //  2 colonnes
  const mid = Math.ceil(faqData.length / 2)
  const left = faqData.slice(0, mid)
  const right = faqData.slice(mid)

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="max-w-5xl w-full space-y-6">
        
        {/* HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Centre d’aide</h1>
          <p className="text-gray-600 text-sm">Prise de contact & FAQ</p>
        </div>

        {/* 2 COLONNES */}


        <div className="max-w-5xl w-full mt-12" id="localization"> 
          <div className="bg-white shadow-md rounded-xl p-5 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-1">
                <h3 className="text-lg font-semibold text-gray-900">Adresse de l'entreprise</h3>
                <p className="text-gray-600 text-sm mt-2">Retrouvez-nous au siège social ou contactez-nous via les informations ci-dessous.</p>

                <div className="mt-4 text-sm text-gray-700">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="space-y-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{addr.title}</h4>
                        <p className="text-gray-600 text-sm">{addr.address}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                        <div className="flex items-center text-gray-700">
                          <Phone className="h-4 w-4 mr-2 text-[#af3338]" />
                          <a className="text-sm text-gray-700 hover:underline" href={`tel:${addr.phone.replace(/\s+/g, '')}`}>{addr.phone}</a>
                        </div>

                        <div className="flex items-center text-gray-700">
                          <Mail className="h-4 w-4 mr-2 text-[#af3338]" />
                          <a className="text-sm text-gray-700 hover:underline" href={`mailto:${addr.email}`}>{addr.email}</a>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button asChild variant="outline" size="sm">
                          <a href={`https://maps.app.goo.gl/f1WTZaXV7VJvS6xLA`} target="_blank" rel="noreferrer">Ouvrir dans Google Maps</a>
                        </Button>

                        <Button asChild variant="ghost" size="sm">
                          <a href={`https://www.google.com/maps/dir/?api=1&destination=${addr.lat},${addr.lon}`} target="_blank" rel="noreferrer">Itinéraire</a>
              
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 h-56 md:h-72 rounded overflow-hidden">
                <iframe
                  title="Adresse de l'entreprise"
                  className="w-full h-full border-0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4201.481372308743!2d15.270537075238312!3d-4.275554046200779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a3312c1e26947%3A0xa00866cabd906e04!2sAgence%20de%20R%C3%A9lation%20des%20Postes%20et%20des%20Communication%20Electroniques!5e1!3m2!1sfr!2scg!4v1764585086641!5m2!1sfr!2scg"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* COLONNE GAUCHE */}
          <div className="bg-white shadow-md rounded-xl p-5 divide-y">
            {left.map((item) => {
              const isOpen = openId === item.id

              return (
                <div key={item.id} className="py-3">
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="text-gray-800 font-medium text-sm">
                      {item.question}
                    </span>

                    {isOpen ? (
                      <ChevronDown className="text-gray-500 h-4 w-4" />
                    ) : (
                      <ChevronRight className="text-gray-500 h-4 w-4" />
                    )}
                  </button>

                  {isOpen && (
                    <p className="mt-2 text-gray-600 text-xs leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* COLONNE DROITE */}
          <div className="bg-white shadow-md rounded-xl p-5 divide-y">
            {right.map((item) => {
              const isOpen = openId === item.id

              return (
                <div key={item.id} className="py-3">
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="text-gray-800 font-medium text-sm">
                      {item.question}
                    </span>

                    {isOpen ? (
                      <ChevronDown className="text-gray-500 h-4 w-4" />
                    ) : (
                      <ChevronRight className="text-gray-500 h-4 w-4" />
                    )}
                  </button>

                  {isOpen && (
                    <p className="mt-2 text-gray-600 text-xs leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

        </div>

        <SupportForm />


      </div>
    </div>
  )
}

       



