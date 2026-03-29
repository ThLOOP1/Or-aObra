"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Trash2, Pencil, Plus, Check, X, Upload, Package, Wrench, Info, Search as SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type ItemTipo = "material" | "mao_de_obra"

export interface BudgetItem {
  id: string
  ref: string
  description: string
  unit: string
  qty: number
  unitPrice: number
  tipo: ItemTipo
  sinapiCodigo?: string   // código-fonte SINAPI para reprecão automática no toggle
  aiGenerated?: boolean
}

interface Props {
  items: BudgetItem[]
  bdi: number
  encargos: number
  isDesonerado: boolean
  onSearch: () => void
  onAdd: () => void
  onImport: () => void
  onDelete: (id: string) => void
  onUpdate: (id: string, item: Partial<BudgetItem>) => void
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

/** Custo total de uma linha, com encargos aplicados se for MO */
function lineCost(item: BudgetItem, encargos: number): number {
  const base = item.qty * item.unitPrice
  if (item.tipo === "mao_de_obra") {
    return base * (1 + encargos / 100)
  }
  return base
}

function EditableCell({
  value,
  type = "text",
  onSave,
  className,
}: {
  value: string | number
  type?: "text" | "number"
  onSave: (v: string | number) => void
  className?: string
}) {
  const [editing, setEditing] = useState(false)
  const [local, setLocal] = useState(String(value))

  const commit = () => {
    onSave(type === "number" ? parseFloat(local) || 0 : local)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          autoFocus
          type={type}
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit()
            if (e.key === "Escape") setEditing(false)
          }}
          className="h-7 text-xs px-2 min-w-[50px] w-full"
        />
        <button onClick={commit} className="text-primary hover:text-primary/80" aria-label="Confirmar">
          <Check className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setEditing(false)} className="text-muted-foreground hover:text-foreground" aria-label="Cancelar">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <span
      className={cn("cursor-pointer hover:text-primary transition-colors group flex items-center gap-1", className)}
      onClick={() => {
        setLocal(String(value))
        setEditing(true)
      }}
      title="Clique para editar"
    >
      {value}
      <Pencil className="w-2.5 h-2.5 opacity-0 group-hover:opacity-50 shrink-0" />
    </span>
  )
}

/* ── Badge seletor de tipo (Material / Mão de Obra) ── */
function TipoBadge({
  tipo,
  onChange,
}: {
  tipo: ItemTipo
  onChange: (t: ItemTipo) => void
}) {
  const isMaterial = tipo === "material"

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onChange(isMaterial ? "mao_de_obra" : "material")}
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border transition-colors cursor-pointer select-none shrink-0",
              isMaterial
                ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
            )}
            aria-label={`Tipo: ${isMaterial ? "Material" : "Mão de Obra"}. Clique para alternar.`}
          >
            {isMaterial ? (
              <>
                <Package className="w-2.5 h-2.5" />
                MAT
              </>
            ) : (
              <>
                <Wrench className="w-2.5 h-2.5" />
                MO
              </>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-[200px]">
          <p className="font-semibold">{isMaterial ? "Material" : "Mão de Obra"}</p>
          <p className="text-muted-foreground mt-0.5">
            {isMaterial
              ? "Materiais não sofrem incidência de encargos sociais."
              : "Encargos sociais serão aplicados sobre este item."}
          </p>
          <p className="text-muted-foreground mt-0.5 italic">Clique para alternar.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function BudgetTable({ items, bdi, encargos, isDesonerado, onSearch, onAdd, onImport, onDelete, onUpdate }: Props) {
  // ── Cálculos separados por tipo ──
  const materiaisRaw = items
    .filter((i) => i.tipo === "material")
    .reduce((acc, i) => acc + i.qty * i.unitPrice, 0)

  const moRaw = items
    .filter((i) => i.tipo === "mao_de_obra")
    .reduce((acc, i) => acc + i.qty * i.unitPrice, 0)

  const encargosValue = moRaw * (encargos / 100)
  const moComEncargos = moRaw + encargosValue

  const custoDiretoTotal = materiaisRaw + moComEncargos
  const bdiValue = custoDiretoTotal * (bdi / 100)
  const precoVendaFinal = custoDiretoTotal + bdiValue

  // Contadores para o header
  const countMat = items.filter((i) => i.tipo === "material").length
  const countMo = items.filter((i) => i.tipo === "mao_de_obra").length

  const [baseAtivaLbl, setBaseAtivaLbl] = useState("SINAPI")
  
  useEffect(() => {
    const savedBase = localStorage.getItem("orcapro_base_ativa") || "sinapi"
    if (savedBase === "caema") setBaseAtivaLbl("CAEMA")
    else if (savedBase === "sicro") setBaseAtivaLbl("SICRO")
    else setBaseAtivaLbl("SINAPI")
  }, [])

  return (
    <Card className="shadow-sm flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-semibold">Itens Orçados</CardTitle>
            {items.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200 gap-1">
                  <Package className="w-2.5 h-2.5" />
                  {countMat} Mat
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200 gap-1">
                  <Wrench className="w-2.5 h-2.5" />
                  {countMo} MO
                </Badge>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" className="gap-1.5 text-xs h-8 bg-primary/90 hover:bg-primary" onClick={onSearch}>
              <SearchIcon className="w-3.5 h-3.5" />
              Buscar ({baseAtivaLbl})
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={onImport}>
              <Upload className="w-3.5 h-3.5" />
              Importar
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={onAdd}>
              <Plus className="w-3.5 h-3.5" />
              Manual
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-28 text-xs font-semibold">Ref. / SINAPI</TableHead>
                <TableHead className="text-xs font-semibold">Descrição do Serviço / Material</TableHead>
                <TableHead className="w-20 text-xs font-semibold text-center">Tipo</TableHead>
                <TableHead className="w-20 text-xs font-semibold text-center">Un.</TableHead>
                <TableHead className="w-24 text-xs font-semibold text-right">Qtd.</TableHead>
                <TableHead className="w-32 text-xs font-semibold text-right">Valor Unit.</TableHead>
                <TableHead className="w-32 text-xs font-semibold text-right">Total</TableHead>
                <TableHead className="w-16 text-xs font-semibold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-12">
                    Nenhum item adicionado. Use a IA ou adicione manualmente.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item, idx) => {
                const totalLinha = lineCost(item, encargos)
                return (
                  <TableRow key={item.id} className={cn(idx % 2 === 0 ? "bg-background" : "bg-muted/20", "hover:bg-accent/30")}>
                    <TableCell className="py-2 align-middle">
                      <div className="flex items-center gap-1.5">
                        <EditableCell
                          value={item.ref}
                          onSave={(v) => onUpdate(item.id, { ref: String(v) })}
                          className="text-xs font-mono text-muted-foreground"
                        />
                        {item.aiGenerated && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0 border-primary/40 text-primary bg-primary/5 h-4 leading-none shrink-0">
                            IA
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 align-middle">
                      <EditableCell
                        value={item.description}
                        onSave={(v) => onUpdate(item.id, { description: String(v) })}
                        className="text-sm"
                      />
                    </TableCell>
                    <TableCell className="py-2 align-middle text-center">
                      <TipoBadge
                        tipo={item.tipo}
                        onChange={(t) => onUpdate(item.id, { tipo: t })}
                      />
                    </TableCell>
                    <TableCell className="py-2 align-middle text-center">
                      <EditableCell
                        value={item.unit}
                        onSave={(v) => onUpdate(item.id, { unit: String(v) })}
                        className="text-xs text-center justify-center"
                      />
                    </TableCell>
                    <TableCell className="py-2 align-middle text-right">
                      <EditableCell
                        value={item.qty}
                        type="number"
                        onSave={(v) => onUpdate(item.id, { qty: Number(v) })}
                        className="text-sm justify-end"
                      />
                    </TableCell>
                    <TableCell className="py-2 align-middle text-right">
                      <EditableCell
                        value={item.unitPrice}
                        type="number"
                        onSave={(v) => onUpdate(item.id, { unitPrice: Number(v) })}
                        className="text-sm justify-end"
                      />
                    </TableCell>
                    <TableCell className="py-2 align-middle text-right">
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={cn(
                              "text-sm font-medium cursor-default",
                              item.tipo === "mao_de_obra" ? "text-amber-700" : "text-foreground"
                            )}>
                              {formatCurrency(totalLinha)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="text-xs max-w-[260px] space-y-1">
                            <p>Base: {formatCurrency(item.qty * item.unitPrice)}</p>
                            {item.tipo === "mao_de_obra" && (
                              <p className="text-amber-600">
                                + Encargos ({encargos}%): {formatCurrency(item.qty * item.unitPrice * (encargos / 100))}
                              </p>
                            )}
                            <p className="font-semibold">Total: {formatCurrency(totalLinha)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="py-2 align-middle text-center">
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={`Remover ${item.description}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* ── Summary footer com cálculo real ── */}
        <div className="border-t bg-muted/30 px-6 py-4 space-y-2">
          {/* Materiais */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Package className="w-3 h-3 text-blue-600" />
              Subtotal Materiais
            </span>
            <span className="font-medium text-foreground">{formatCurrency(materiaisRaw)}</span>
          </div>

          {/* Mão de obra (base) */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Wrench className="w-3 h-3 text-amber-600" />
              Subtotal Mão de Obra (base)
            </span>
            <span className="font-medium text-foreground">{formatCurrency(moRaw)}</span>
          </div>

          {/* Encargos sociais */}
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1.5 text-amber-700">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1 cursor-help">
                      <Info className="w-3 h-3" />
                      Encargos Sociais ({encargos}%)
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs max-w-[240px]">
                    <p>Percentual de encargos trabalhistas e previdenciários aplicados <strong>somente</strong> sobre a mão de obra.</p>
                    <p className="mt-1 font-mono">{formatCurrency(moRaw)} × {encargos}% = {formatCurrency(encargosValue)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className="font-medium text-amber-700">+ {formatCurrency(encargosValue)}</span>
          </div>

          {/* Separador: Custo Direto */}
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1">
              Custo Direto Total
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs max-w-[260px]">
                    <p>Materiais + Mão de Obra com Encargos</p>
                    <p className="font-mono mt-1">{formatCurrency(materiaisRaw)} + {formatCurrency(moComEncargos)} = {formatCurrency(custoDiretoTotal)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className="text-sm font-semibold text-foreground">{formatCurrency(custoDiretoTotal)}</span>
          </div>

          {/* BDI */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              BDI ({bdi}%)
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs max-w-[260px]">
                    <p>Benefícios e Despesas Indiretas aplicados sobre o Custo Direto Total.</p>
                    <p className="font-mono mt-1">{formatCurrency(custoDiretoTotal)} × {bdi}% = {formatCurrency(bdiValue)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className="font-medium text-foreground">+ {formatCurrency(bdiValue)}</span>
          </div>

          {/* Total final */}
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-base font-bold text-foreground">Preço de Venda Final</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(precoVendaFinal)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
