"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUserById, updateUser, deleteUser, logout, UpdateClientData } from "@/lib/services/user.service";
import { Client } from "@/lib/interfaces/models.interface";
import { Trash2, User as UserIcon, Mail, Phone, MapPin, Building2, Save, X, Edit2, Settings } from "lucide-react";
import {useUser } from "@/context/userContext";
import SystemLoader from "@/lib/components/loader";
import { UserEndpoit, UserInter } from "@/lib/endpoints/user.endpoint";
import { useToast } from "@/context/toastModal";
import { TextRessource } from "@/lib/ressources/alert.ressource";

export default function ProfilPage() {

  
  const router = useRouter();
  const [user, setUser] = useUser();

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UserInter>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const toast = useToast()
  useEffect(() => {


    const fetchUser = async () => {

      try {
        
        if(!user) throw Error();

        setFormData(user);
        setError(null);

      } catch (err) {

        setError(err instanceof Error ? err.message : "Erreur lors du chargement du profil");
        console.error("Erreur:", err);

      } finally {

        setLoading(false);

      }
    };

    fetchUser();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {

    try {
      
      if(!formData) return toast.warning(TextRessource.profil.edit.formData_empty.desc, TextRessource.profil.edit.formData_empty.title)

      await UserEndpoit.update_user(formData)
      setUser(formData)
      return;

    } catch (error) {
      toast.error(TextRessource.profil.edit.failed.desc, TextRessource.profil.edit.failed.title)
    }

  };

  const handleDelete = async () => {

  };


  if (loading) {
    return <SystemLoader/>
  }

  if(!user) return router.back()

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Header avec couleur primaire */}
      <div className="bg-linear-to-r from-[#af3338] to-[#c9454a] text-white shadow-lg rounded-b-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center shadow-xl">
                <UserIcon className="h-16 w-16 text-white" />
              </div>
              
              {editing && (
                <button className="absolute bottom-0 right-0 bg-[#8ba755] hover:bg-[#7a9648] text-white rounded-full p-2 shadow-lg border-2 border-white">
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Informations principales */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{user.raisonSociale || "Profil"}</h1>
              <p className="text-white/90 text-lg mb-1">{`Code: ${user.userId}`}</p>
              {user.registreCommerce && (
                <p className="text-white/80 text-sm">RC: {user.registreCommerce}</p>
              )}
            </div>

            {/* Bouton Modifier/Paramètres en haut à droite */}
            {!editing && (
              <div className="flex gap-3">
                <Button
                  onClick={() => setEditing(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12">
        {/* Messages d'alerte */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg shadow-md">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-[#8ba755] text-green-700 p-4 rounded-r-lg shadow-md">
            <p className="font-medium">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale - Informations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte Informations de l'entreprise */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-[#af3338]" />
                  Informations
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Raison sociale</label>
                    {editing ? (
                      <input
                        type="text"
                        name="raisonSociale"
                        value={formData?.raisonSociale || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#af3338] focus:border-[#af3338] transition-all"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{user.raisonSociale || "—"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Registre de commerce</label>
                    {editing ? (
                      <input
                        type="text"
                        name="registreCommerce"
                        value={formData?.registreCommerce || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#af3338] focus:border-[#af3338] transition-all"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{user.registreCommerce || "—"}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                    <Mail className="h-4 w-4 mr-2 text-[#af3338]" />
                    Email
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData?.email || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#af3338] focus:border-[#af3338] transition-all"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{user.email || "—"}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-[#af3338]" />
                    Adresse
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="adresse"
                      value={formData?.adresse || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#af3338] focus:border-[#af3338] transition-all"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{user.adresse || "—"}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Boîte postale</label>
                    {editing ? (
                      <input
                        type="text"
                        name="bp"
                        value={formData?.bp || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#af3338] focus:border-[#af3338] transition-all"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{user.bp || "—"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Ville</label>
                    {editing ? (
                      <input
                        type="text"
                        name="ville"
                        value={formData?.ville || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#af3338] focus:border-[#af3338] transition-all"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{user.ville || "—"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Pays</label>
                    {editing ? (
                      <input
                        type="text"
                        name="pays"
                        value={formData?.pays || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#af3338] focus:border-[#af3338] transition-all"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{user.pays || "—"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Contact */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-[#8ba755]" />
                Contact
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Nom du contact</label>
                  {editing ? (
                    <input
                      type="text"
                      name="contactNom"
                      value={formData?.contactNom || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8ba755] focus:border-[#8ba755] transition-all"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{user.contactNom || "—"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Fonction</label>
                  {editing ? (
                    <input
                      type="text"
                      name="contactFonction"
                      value={formData?.contactFonction || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8ba755] focus:border-[#8ba755] transition-all"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{user.contactFonction || "—"}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                    <Phone className="h-4 w-4 mr-2 text-[#8ba755]" />
                    Téléphone
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      name="contactTelephone"
                      value={formData?.contactTelephone || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8ba755] focus:border-[#8ba755] transition-all"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{user.contactTelephone || "—"}</p>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-6">
            {/* Carte Actions */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-gray-600" />
                Actions
              </h2>

              {editing ? (
                <div className="space-y-3">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-[#8ba755] hover:bg-[#7a9648] text-white font-semibold py-6 text-base shadow-md"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                  </Button>
                  <Button
                    onClick={() => {
                      setEditing(false);
                      setFormData(user);
                    }}
                    variant="outline"
                    className="w-full border-2 border-gray-300 hover:bg-gray-50 font-semibold py-6 text-base"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Annuler
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                 
                  <Button
                    onClick={() => setShowDeleteDialog(true)}
                    variant="destructive"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-6 text-base shadow-md"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Supprimer le compte
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Confirmer la suppression</DialogTitle>
            <DialogDescription className="text-gray-600 pt-2">
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront définitivement supprimées.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
