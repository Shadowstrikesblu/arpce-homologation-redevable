// components/dashboard/DashboardHeader.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from '@/components/ui/button'
import { Plus, UserCircle2, ChevronDown, User2, LogOut, HelpCircle, LifeBuoy, ArrowLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { pathsUtils } from '../utils/path.util'
import { logout } from "@/lib/services/user.service"
import { getResourceFromPath, translateRessource } from "../utils/actifPath.utils"
import { useUser } from "@/context/userContext"
import Image from "next/image";
import { useAlert } from "../hooks/useAlert"
import { TextRessource } from "../ressources/alert.ressource"

export function DashboardHeader() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const pathname = usePathname()
  const [last, setLast] = useState<string | null>(null)
  const [user] = useUser()
  const alert = useAlert()

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", onClickOutside)
    }

    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [menuOpen])

  const handleLogout = async () => {

    setMenuOpen(false)
    alert.confirm(
      TextRessource.header.logout.title, 
      TextRessource.header.logout.desc,
      ()=>{}, // onconfirm
      ()=>{
        localStorage.removeItem(process.env["NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY"])
      }, // onDeny
      "warning",
      "Rester",
      "Se deconnecter",
    )
  }

  useEffect(()=>{
    const text = getResourceFromPath(pathname)
    if(text) setLast(text)

    return;
    
  }, [pathname])

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-linear-to-r from-[#af3338] to-[#c9454a] text-white shadow-lg">
      <div className="max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex justify-start items-center gap-5">
            {last !== "platform" && <Button 
              onClick={()=>router.back()}
              className="bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 transition-colors"
            >
                <ArrowLeft/>
            </Button>}
            <Image
              src="/logo_arpce.png"
              alt="Logo ARPCE"
              width={70}
              height={70}
              className="object-contain rounded-xl"
              priority
            />
            <div>
              <h1 className="text-3xl font-bold items-center gap-2">
                {last && translateRessource(last)}
              </h1>
              <span className="text-lg font-medium text-white/80 leading-none">
                {user?.contactNom}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
              {last === "projects" &&
                <Button
                  onClick={()=>router.push(pathsUtils.request_form)}
                  className="bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">{"Nouveau dossier"}</span>
                </Button>
              }
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 transition-colors"
              >
                <UserCircle2 className='w-8 h-8' />
                <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white py-2 shadow-xl ring-1 ring-black/5 text-gray-700">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      router.push(pathsUtils.profil)
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <User2 className="h-4 w-4 text-[#af3338]" />
                    Profil
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      router.push("/support")
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <LifeBuoy className="h-4 w-4 text-[#8ba755]" />
                    Support
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      router.push("/aide")
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <HelpCircle className="h-4 w-4 text-[#af3338]" />
                    Aide
                  </button>
                  <div className="h-px bg-gray-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}