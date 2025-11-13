import { DashboardHeader } from "@/lib/components/dashboardHeader";

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){


    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardHeader />
        
        <div className="my-[2vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
            {children}
        </div>

      </div>
    )

} 