"use client"

import {
  FileText,
  PlusSquare,
  Settings,
  HardHat,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type AppScreen = "dashboard" | "orcamentos" | "nova-obra" | "clientes" | "configuracoes"

// Dashboard e Clientes ocultados para a demo do Hackathon — foco no fluxo principal
const navItems: { icon: React.ElementType; label: string; screen: AppScreen }[] = [
  { icon: PlusSquare, label: "Nova Obra",       screen: "nova-obra"     },
  { icon: FileText,   label: "Meus Orçamentos", screen: "orcamentos"    },
  { icon: Settings,   label: "Configurações",   screen: "configuracoes" },
]

interface Props {
  activeScreen: AppScreen
  onNavigate: (screen: AppScreen) => void
}

export function AppSidebar({ activeScreen, onNavigate }: Props) {
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-sidebar text-sidebar-foreground min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
          <HardHat className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-sidebar-foreground tracking-tight">SmartBudget</p>
          <p className="text-xs text-primary font-semibold tracking-widest uppercase">CREA-MA</p>
        </div>
      </div>

      {/* Engineer info */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-sidebar-accent">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">CS</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Eng. Carlos Silva</p>
            <p className="text-xs text-muted-foreground truncate">Eng. Civil · CREA 12345/MA-D</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Navegação principal">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3 pb-2">Menu</p>
        {navItems.map((item) => {
          const active = activeScreen === item.screen
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.screen)}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group text-left",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <span className="flex items-center gap-3">
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            </button>
          )
        })}
      </nav>

      {/* Footer — LGPD obrigatório */}
      <div className="px-4 py-4 border-t border-sidebar-border space-y-2">
        <div className="flex items-start gap-1.5">
          <ShieldCheck className="w-3 h-3 text-primary shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Ambiente seguro. Dados processados em conformidade com a{" "}
            <span className="font-semibold text-foreground/70">LGPD — Lei 13.709/2018</span>.
          </p>
        </div>
        <p className="text-xs text-muted-foreground text-center">Hackathon CREA-MA · 2025</p>
      </div>
    </aside>
  )
}
