"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Database, Trash2, Package, Wrench, Pencil } from "lucide-react"
import { NewCustomItemModal } from "@/components/orcamento/new-custom-item-modal"
import { BudgetItem } from "@/components/orcamento/budget-table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const STORAGE_KEY = "orcapro_banco_proprio"

export function ScreenMeuBanco() {
  const [items, setItems] = useState<BudgetItem[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)

  // Carregar dados no mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error("Erro ao carregar banco próprio", e)
      }
    }
  }, [])

  // Salvar no localstorage quando mudar
  const saveToStorage = (newItems: BudgetItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems))
    setItems(newItems)
  }

  const handleSaveItem = (item: BudgetItem) => {
    if (editingItem) {
      const updated = items.map((i) => (i.id === item.id ? item : i))
      saveToStorage(updated)
      toast.success("Insumo atualizado!")
    } else {
      const updated = [...items, item]
      saveToStorage(updated)
      toast.success("Insumo cadastrado!")
    }
  }

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id)
    saveToStorage(updated)
    toast.info("Insumo removido da base própria.")
  }

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Meu Banco de Preços</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas cotações locais e composições próprias para uso nos orçamentos.
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingItem(null)
            setModalOpen(true)
          }} 
          className="gap-2 shadow-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Novo Insumo
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/20">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Acervo Técnico Próprio</CardTitle>
          </div>
          <CardDescription>
            {items.length} item{items.length !== 1 ? "s" : ""} cadastrado{items.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[100px]">Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-center">Tipo</TableHead>
                <TableHead className="text-center w-[80px]">Un.</TableHead>
                <TableHead className="text-right">Custo Unitário</TableHead>
                <TableHead className="text-center w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground py-10">
                      <div className="p-4 rounded-full bg-muted/50 border-2 border-dashed border-muted-foreground/20">
                        <Database className="w-10 h-10 opacity-20" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-lg text-foreground/80">Seu banco está vazio</p>
                        <p className="text-sm">Clique em "Novo Insumo" para começar a sua base local.</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/10">
                    <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                      {item.ref}
                    </TableCell>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {item.tipo === "material" ? (
                          <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-200">
                            <Package className="w-3 h-3" />
                            MAT
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 bg-amber-50 text-amber-700 border-amber-200">
                            <Wrench className="w-3 h-3" />
                            MO
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs lowercase">
                      {item.unit}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingItem(item)
                            setModalOpen(true)
                          }}
                          className="text-muted-foreground hover:text-primary transition-colors h-8 w-8"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NewCustomItemModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSaveItem}
        lastIndex={items.length}
        editItem={editingItem}
      />
    </div>
  )
}
