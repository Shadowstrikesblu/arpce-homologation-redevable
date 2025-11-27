"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import Image from "next/image";

export default function ValidationScreen() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60).toString().padStart(2, "0");
    const seconds = (sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl p-4 border border-primary/30">
        <CardContent className="flex flex-col items-center text-center space-y-6">

          {/* Logo ARPCE */}
          <div className="w-28 h-28 relative">
            <Image
              src="/logo_arpce.png"
              alt="Logo ARPCE"
              fill
              className="object-contain"
            />
          </div>

          {/* Message d'attente */}
          <div>
            <h1 className="text-xl font-bold text-primary">
              Validation de votre compte en cours
            </h1>
            <p className="text-gray-700 mt-2">
              Veuillez patienter pendant que nous vérifions vos informations.
            </p>
          </div>

          {/* Durée */}
          <div className="flex items-center space-x-2 text-gray-800 text-lg font-semibold">
            <Clock className="text-primary" />
            <span>Temps écoulé : {formatTime(seconds)}</span>
          </div>

          {/* Bouton Support */}
          <Button
            className="w-full text-base py-6 rounded-xl bg-primary hover:bg-primary-dark"
            onClick={() => (window.location.href = "mailto:support@arpce.cg")}
          >
            Contactez le support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
