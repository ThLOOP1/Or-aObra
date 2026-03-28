"use client"

import { useState } from "react"
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
import { Trash2, Pencil, Plus, Check, X, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BudgetItem {
  id: string
  ref: string
  description: string
  unit: string
  qty: number
  unitPrice: number
  aiGenerated?: boolean
}

interface Props {
  items: BudgetItem[]
  bdi: number
  onAdd: () => void
  onImport: () => void
  onDelete: (id: string) => void
  onUpdate: (id: string, item: Partial<BudgetItem>) => void
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
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
          className="h-7 text-xs px-2 min-w-0 w-full"
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

export function BudgetTable({ items, bdi, onAdd, onImport, onDelete, onUpdate }: Props) {
  const subtotal = items.reduce((acc, i) => acc + i.qty * i.unitPrice, 0)
  const bdiValue = subtotal * (bdi / 100)
  const total = subtotal + bdiValue

  return (
    <Card className="shadow-sm flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-base font-semibold">Itens Orçados</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={onImport}>
              <Upload className="w-3.5 h-3.5" />
              Importar Planilha / PDF
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={onAdd}>
              <Plus className="w-3.5 h-3.5" />
              Adicionar Item Manual
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
                <TableHead className="w-16 text-xs font-semibold text-center">Un.</TableHead>
                <TableHead className="w-16 text-xs font-semibold text-right">Qtd.</TableHead>
                <TableHead className="w-28 text-xs font-semibold text-right">Valor Unit.</TableHead>
                <TableHead className="w-28 text-xs font-semibold text-right">Total</TableHead>
                <TableHead className="w-16 text-xs font-semibold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-12">
                    Nenhum item adicionado. Use a IA ou adicione manualmente.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item, idx) => (
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
                    <span className="text-sm font-medium text-foreground">
                      {formatCurrency(item.qty * item.unitPrice)}
                    </span>
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
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary footer */}
        <div className="border-t bg-muted/30 px-6 py-4 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal dos Serviços</span>
            <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>BDI ({bdi}%)</span>
            <span className="font-medium text-foreground">+ {formatCurrency(bdiValue)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-base font-bold text-foreground">Valor Total da Obra</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
