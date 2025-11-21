"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { auth } from "@/lib/endpoints/auth";
import { useRouter } from "next/navigation";

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter()
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {

      const otpValue = otp.join("");
      if (otpValue.length !== 6) {
        setError("Veuillez saisir les 6 digits du code");
        setLoading(false);
        return;
      }
      console.log(otpValue)
      await auth.otp(parseInt(otpValue))

      router.push("/platform")
      
    } catch (err: any) {
      setError("Erreur lors de la vérification du code");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Passer au champ suivant si un digit est saisi
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (error) setError(null);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Revenir au champ précédent si Backspace et champ vide
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split('').forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(5, pastedData.length - 1)]?.focus();
    }
  };

  const resendCode = () => {
    if (countdown === 0) {
      setCountdown(30);
      setError(null);
      // TODO: Appel API pour renvoyer le code
      console.log("Demande de renvoi du code OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo_arpce.png"
                alt="Logo ARPCE"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Vérification</h1>
            <p className="text-gray-600">Entrez le code à 6 digits envoyé par email</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700 text-center block">
                Code de vérification
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#af3338] focus:border-transparent"
                    required
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-linear-to-r from-[#af3338] to-[#c9454a] hover:from-[#8f2a2e] hover:to-[#b9353a] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Vérification en cours..." : "Vérifier le code"}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Vous n'avez pas reçu le code ?{" "}
                <button
                  type="button"
                  onClick={resendCode}
                  disabled={countdown > 0}
                  className={`font-medium transition-colors ${
                    countdown > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#af3338] hover:text-[#8f2a2e]"
                  }`}
                >
                  Renvoyer {countdown > 0 && `(${countdown}s)`}
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6">
          <p className="text-center text-xs text-gray-400">
            © 2024 Portail d'homologation. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}