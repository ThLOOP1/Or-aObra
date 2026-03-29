"use client"

import { useState } from "react"
import {
  FileText,
  PlusSquare,
  Settings,
  HardHat,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { AppScreen } from "@/components/app-sidebar"

// Espelha exatamente a sidebar — Dashboard e Clientes ocultos para demo
const navItems: { icon: React.ElementType; label: string; screen: AppScreen }[] = [
  { icon: PlusSquare, label: "Nova Obra",       screen: "nova-obra"     },
  { icon: FileText,   label: "Meus Orçamentos", screen: "orcamentos"    },
  { icon: Settings,   label: "Configurações",   screen: "configuracoes" },
]

interface Props {
  activeScreen: AppScreen
  onNavigate: (screen: AppScreen) => void
}

export function MobileHeader({ activeScreen, onNavigate }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-sidebar text-sidebar-foreground border-b border-sidebar-border sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <HardHat className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <span className="text-sm font-bold text-sidebar-foreground">SmartBudget </span>
            <span className="text-xs font-semibold text-primary">CREA</span>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)}>
          <nav
            className="absolute top-0 left-0 bottom-0 w-64 bg-sidebar text-sidebar-foreground flex flex-col py-4 px-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-3 pb-4 mb-2 border-b border-sidebar-border">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">CS</span>
              </div>
              <div>
                <p className="text-sm font-medium">Eng. Carlos Silva</p>
                <p className="text-xs text-muted-foreground">CREA 12345/MA-D</p>
              </div>
            </div>

            <div className="flex-1 space-y-1">
              {navItems.map((item) => {
                const active = activeScreen === item.screen
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      onNavigate(item.screen)
                      setOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </span>
                    {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
                  </button>
                )
              })}
            </div>

            {/* LGPD — mobile footer */}
            <div className="mt-4 pt-3 border-t border-sidebar-border px-1 space-y-1.5">
              <div className="flex items-start gap-1.5">
                <ShieldCheck className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Dados em conformidade com a{" "}
                  <span className="font-semibold">LGPD — Lei 13.709/2018</span>.
                </p>
              </div>
              <p className="text-xs text-muted-foreground text-center">Hackathon CREA-MA · 2025</p>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
