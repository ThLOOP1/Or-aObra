"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SlidersHorizontal, HelpCircle } from "lucide-react"

interface Props {
  bdi: number
  encargos: number
  onChange: (field: string, value: number) => void
}

export function CostSettingsCard({ bdi, encargos, onChange }: Props) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          Configurações de Custo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* BDI */}
          <div className="grid gap-1.5">
            <Label htmlFor="bdi" className="text-sm font-medium flex items-center gap-1.5">
              BDI Estimado (%)
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help flex items-center" aria-label="Saiba mais sobre BDI">
                      <HelpCircle className="w-3.5 h-3.5 text-primary/70 hover:text-primary transition-colors" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="text-xs max-w-[270px] space-y-1.5 p-3"
                  >
                    <p className="font-bold text-sm">BDI — Bonificação e Despesas Indiretas</p>
                    <p className="text-muted-foreground leading-relaxed">
                      Percentual aplicado sobre o Custo Direto Total que cobre:{" "}
                      <strong>despesas administrativas</strong>, <strong>tributos</strong> (ISS, PIS,
                      COFINS) e <strong>margem de lucro</strong> do profissional.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong>Sugestão SINAPI:</strong> 20% a 30% para obras civis.
                    </p>
                    <p className="text-muted-foreground text-[10px] italic">
                      Base legal: Acórdão TCU 2.622/2013.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="relative">
              <Input
                id="bdi"
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={bdi}
                onChange={(e) => onChange("bdi", parseFloat(e.target.value) || 0)}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
            </div>
          </div>

          {/* Encargos Sociais */}
          <div className="grid gap-1.5">
            <Label htmlFor="encargos" className="text-sm font-medium flex items-center gap-1.5">
              Encargos Sociais (%)
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help flex items-center" aria-label="Saiba mais sobre Encargos Sociais">
                      <HelpCircle className="w-3.5 h-3.5 text-primary/70 hover:text-primary transition-colors" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="text-xs max-w-[280px] space-y-1.5 p-3"
                  >
                    <p className="font-bold text-sm">Encargos Sociais</p>
                    <p className="text-muted-foreground leading-relaxed">
                      Custos trabalhistas obrigatórios incidentes sobre a mão de obra:{" "}
                      <strong>FGTS, INSS patronal, férias, 13º salário</strong> e outros encargos
                      previdenciários e trabalhistas.
                    </p>
                    <p className="font-semibold text-primary/80">
                      ⚠ Aplica-se SOMENTE aos itens classificados como Mão de Obra (MO).
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Valor típico SINAPI: <strong>70% a 120%</strong> dependendo do regime
                      (Desonerado ou Não Desonerado).
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="relative">
              <Input
                id="encargos"
                type="number"
                min={0}
                max={200}
                step={0.5}
                value={encargos}
                onChange={(e) => onChange("encargos", parseFloat(e.target.value) || 0)}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          O BDI incide sobre o <strong>Custo Direto Total</strong> (materiais + mão de obra c/ encargos).
          Encargos Sociais incidem <strong>apenas sobre Mão de Obra</strong>.
        </p>
      </CardContent>
    </Card>
  )
}
