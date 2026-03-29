"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BudgetItem } from "./budget-table"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (item: BudgetItem) => void
  lastIndex: number
  editItem: BudgetItem | null
}

export function NewCustomItemModal({ open, onOpenChange, onSave, lastIndex, editItem }: Props) {
  const [description, setDescription] = useState("")
  const [unit, setUnit] = useState("un")
  const [tipo, setTipo] = useState<"material" | "mao_de_obra">("material")
  const [price, setPrice] = useState("")

  // Populate fields when editing
  useEffect(() => {
    if (editItem) {
      setDescription(editItem.description)
      setUnit(editItem.unit)
      setTipo(editItem.tipo)
      setPrice(editItem.unitPrice.toString())
    } else {
      setDescription("")
      setUnit("un")
      setTipo("material")
      setPrice("")
    }
  }, [editItem, open])

  const handleSave = () => {
    if (!description || !price) return

    const newId = editItem ? editItem.id : Math.random().toString(36).slice(2, 9)
    const code = editItem ? editItem.ref : `PRP-${(lastIndex + 1).toString().padStart(3, "0")}`

    const newItem: BudgetItem = {
      id: newId,
      ref: code,
      description,
      unit,
      qty: 1,
      unitPrice: Number(price),
      tipo,
      aiGenerated: false,
      personalItem: true
    }

    onSave(newItem)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editItem ? "Editar Insumo" : "Novo Insumo Próprio"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="desc">Descrição do Insumo</Label>
            <Input
              id="desc"
              placeholder="Ex: Piso Porcelanato 60x60 Extra"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="unit">Unidade</Label>
              <Select value={unit} onValueChange={(v) => setUnit(v)}>
                <SelectTrigger id="unit" className="w-full">
                  <SelectValue placeholder="un, h, m²..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="un">un (Unidade)</SelectItem>
                  <SelectItem value="cx">cx (Caixa)</SelectItem>
                  <SelectItem value="h">h (Hora)</SelectItem>
                  <SelectItem value="m">m (Metro)</SelectItem>
                  <SelectItem value="m2">m² (Metro Quadrado)</SelectItem>
                  <SelectItem value="m3">m³ (Metro Cúbico)</SelectItem>
                  <SelectItem value="kg">kg (Quilograma)</SelectItem>
                  <SelectItem value="dia">dia (Dia)</SelectItem>
                  <SelectItem value="t">t (Tonelada)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={tipo} onValueChange={(v: any) => setTipo(v)}>
                <SelectTrigger id="tipo" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="mao_de_obra">Mão de Obra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Custo Unitário (R$)</Label>
            <Input
              id="price"
              type="number"
              placeholder="0,00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!description || !price}>
            {editItem ? "Salvar Alterações" : "Salvar no Banco"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
