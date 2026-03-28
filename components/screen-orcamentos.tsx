"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Download, Pencil, Copy, Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"

type StatusType = "Aprovado" | "Enviado" | "Rascunho" | "Recusado"

interface Orcamento {
  id: string
  obra: string
  cliente: string
  data: string
  valor: number
  status: StatusType
}

const ORCAMENTOS: Orcamento[] = [
  { id: "#104", obra: "Reforma Escola Vovó Vitorina", cliente: "Pref. de São Luís", data: "22/03/2025", valor: 112253.52, status: "Aprovado" },
  { id: "#103", obra: "Ampliação UBS Cohab", cliente: "Secretaria de Saúde MA", data: "18/03/2025", valor: 87540.00, status: "Enviado" },
  { id: "#102", obra: "Recuperação Estrada Vicinal km 12", cliente: "SINFRA-MA", data: "10/03/2025", valor: 348920.00, status: "Aprovado" },
  { id: "#101", obra: "Rede de Drenagem Pluvial Bairro Cohatrac", cliente: "CAEMA", data: "04/03/2025", valor: 48320.00, status: "Aprovado" },
  { id: "#100", obra: "Reforma Banheiro Apto 302 – Bloco B", cliente: "Maria Oliveira", data: "01/03/2025", valor: 9870.75, status: "Rascunho" },
  { id: "#099", obra: "Construção Muro de Contenção Vila Embratel", cliente: "Cond. Vila Embratel", data: "22/02/2025", valor: 67800.00, status: "Recusado" },
  { id: "#098", obra: "Pavimentação Rua das Palmeiras", cliente: "Pref. de Imperatriz", data: "15/02/2025", valor: 195300.00, status: "Aprovado" },
  { id: "#097", obra: "Instalações Hidráulicas IFMA Bacabal", cliente: "IFMA", data: "08/02/2025", valor: 53640.00, status: "Enviado" },
]

const statusStyle: Record<StatusType, string> = {
  Aprovado: "bg-primary/10 text-primary border-primary/30",
  Enviado: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Rascunho: "bg-muted text-muted-foreground border-border",
  Recusado: "bg-red-100 text-red-700 border-red-300",
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

interface Props {
  onNewOrcamento: () => void
}

export function ScreenOrcamentos({ onNewOrcamento }: Props) {
  const [search, setSearch] = useState("")

  const filtered = ORCAMENTOS.filter(
    (o) =>
      o.obra.toLowerCase().includes(search.toLowerCase()) ||
      o.cliente.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-foreground">Meus Orçamentos</h2>
          <p className="text-sm text-muted-foreground">Gerencie todas as suas propostas e orçamentos.</p>
        </div>
        <Button size="sm" className="gap-1.5 text-sm h-9" onClick={onNewOrcamento}>
          <Plus className="w-4 h-4" />
          Novo Orçamento
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 pt-4 px-5">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente ou obra..."
              className="pl-9 h-8 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-xs font-semibold w-16">ID</TableHead>
                  <TableHead className="text-xs font-semibold">Obra / Descrição</TableHead>
                  <TableHead className="text-xs font-semibold">Cliente</TableHead>
                  <TableHead className="text-xs font-semibold w-28">Data</TableHead>
                  <TableHead className="text-xs font-semibold text-right w-36">Valor Total</TableHead>
                  <TableHead className="text-xs font-semibold w-24 text-center">Status</TableHead>
                  <TableHead className="text-xs font-semibold w-28 text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-12">
                      Nenhum orçamento encontrado.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((o, idx) => (
                  <TableRow
                    key={o.id}
                    className={cn(idx % 2 === 0 ? "bg-background" : "bg-muted/20", "hover:bg-accent/30")}
                  >
                    <TableCell className="py-3 text-xs font-mono text-muted-foreground">{o.id}</TableCell>
                    <TableCell className="py-3 text-sm font-medium text-foreground max-w-[240px] truncate">{o.obra}</TableCell>
                    <TableCell className="py-3 text-sm text-muted-foreground">{o.cliente}</TableCell>
                    <TableCell className="py-3 text-sm text-muted-foreground font-mono">{o.data}</TableCell>
                    <TableCell className="py-3 text-sm font-mono font-semibold text-right">{formatCurrency(o.valor)}</TableCell>
                    <TableCell className="py-3 text-center">
                      <Badge variant="outline" className={cn("text-xs font-medium", statusStyle[o.status])}>
                        {o.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center justify-center gap-2.5">
                        <button className="text-muted-foreground hover:text-primary transition-colors" title="Visualizar">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="text-muted-foreground hover:text-primary transition-colors" title="Baixar PDF">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button className="text-muted-foreground hover:text-primary transition-colors" title="Editar">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button className="text-muted-foreground hover:text-primary transition-colors" title="Duplicar">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="px-5 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
            {filtered.length} registro{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
