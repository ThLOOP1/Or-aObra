"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SlidersHorizontal, Info } from "lucide-react"

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
          <div className="grid gap-1.5">
            <Label htmlFor="bdi" className="text-sm font-medium flex items-center gap-1">
              BDI Estimado (%)
              <span title="Benefícios e Despesas Indiretas — índice que cobre despesas administrativas, tributos e lucro.">
                <Info className="w-3 h-3 text-muted-foreground cursor-help" />
              </span>
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
          <div className="grid gap-1.5">
            <Label htmlFor="encargos" className="text-sm font-medium flex items-center gap-1">
              Encargos Sociais (%)
              <span title="Percentual de encargos trabalhistas e previdenciários sobre a mão de obra.">
                <Info className="w-3 h-3 text-muted-foreground cursor-help" />
              </span>
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
          O BDI e os encargos serão aplicados automaticamente sobre o subtotal dos serviços.
        </p>
      </CardContent>
    </Card>
  )
}
