"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

type ToastOptions = {
  id?: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number; // ms
};

type ToastInternal = ToastOptions & { id: string };

type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
  success: (description: string, title?: string) => void;
  error: (description: string, title?: string) => void;
  warning: (description: string, title?: string) => void;
  info: (description: string, title?: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DEFAULT_DURATION = 3000;

let idCounter = 0;
const createId = () => `toast-${Date.now()}-${idCounter++}`;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastInternal[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (options: ToastOptions) => {
      const id = options.id ?? createId();
      const toast: ToastInternal = {
        id,
        title: options.title,
        description: options.description,
        type: options.type ?? "info",
        duration: options.duration ?? DEFAULT_DURATION,
      };

      setToasts((prev) => [...prev, toast]);
    },
    []
  );

  const success = useCallback(
    (description: string, title = "Succès") =>
      showToast({ type: "success", description, title }),
    [showToast]
  );

  const error = useCallback(
    (description: string, title = "Erreur") =>
      showToast({ type: "error", description, title }),
    [showToast]
  );

  const warning = useCallback(
    (description: string, title = "Attention") =>
      showToast({ type: "warning", description, title }),
    [showToast]
  );

  const info = useCallback(
    (description: string, title = "Information") =>
      showToast({ type: "info", description, title }),
    [showToast]
  );

  const value: ToastContextValue = {
    showToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Container top-center */}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[9999] flex justify-center">
        <div className="relative flex w-full max-w-xl flex-col items-center">
          <AnimatePresence initial={false}>
            {toasts.map((toast, index) => (
              <ToastItem
                key={toast.id}
                toast={toast}
                index={index}
                total={toasts.length}
                onClose={removeToast}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
}

type ToastItemProps = {
  toast: ToastInternal;
  index: number;
  total: number;
  onClose: (id: string) => void;
};

function ToastItem({ toast, index, total, onClose }: ToastItemProps) {
  const { id, type = "info", title, description, duration } = toast;

  React.useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration ?? DEFAULT_DURATION);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const Icon = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  }[type];

  const baseBg =
    type === "success"
      ? "bg-emerald-950/90 border-emerald-800 text-emerald-50"
      : type === "error"
      ? "bg-red-950/90 border-red-800 text-red-50"
      : type === "warning"
      ? "bg-amber-950/80 border-amber-800 text-amber-50"
      : "bg-slate-950/90 border-slate-800 text-slate-50";

  const bgIcon =
    type === "success"
      ? "text-emerald-400"
      : type === "error"
      ? "text-red-400"
      : type === "warning"
      ? "text-amber-400"
      : "text-slate-400";

  // Entassement : les plus anciens au-dessus, les récents derrière
  const zIndex = total - index;
  const offset = index * 10;

  return (
    <motion.div
      layout
      initial={{ y: -20, opacity: 0, scale: 0.9 }}
      animate={{ y: offset, opacity: 1, scale: 1 }}
      exit={{ y: -20, opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 350, damping: 24 }}
      style={{ zIndex }}
      className={cn(
        "pointer-events-auto w-full",
        index > 0 && "-mt-4" // légère superposition
      )}
    >
      <Card
        className={cn(
          "shadow-2xl",
          "rounded-2xl border px-4 py-3",
          baseBg
        )}
      >
        <CardContent className="flex items-start gap-3 p-0">
          <div className={cn("mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-black/20", bgIcon)}>
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex-1">
            {title && (
              <div className="text-base font-semibold leading-snug">
                {title}
              </div>
            )}
            {description && (
              <p className="mt-1 text-sm leading-snug text-slate-200/90">
                {description}
              </p>
            )}
          </div>

          <button
            onClick={() => onClose(id)}
            className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/20 text-xs text-slate-200 hover:bg-black/40"
          >
            ×
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
