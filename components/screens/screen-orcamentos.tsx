"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
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
import { Eye, Download, Pencil, Copy, Plus, Search, RefreshCw, CloudOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase, type OrcamentoDB } from "@/lib/supabase"

// ─── Helpers ──────────────────────────────────────────────────────────────────

type StatusType = "Aprovado" | "Enviado" | "Rascunho" | "Recusado" | "Salvo"

const statusStyle: Record<string, string> = {
  Aprovado: "bg-primary/10 text-primary border-primary/30",
  Enviado:  "bg-yellow-100 text-yellow-800 border-yellow-300",
  Rascunho: "bg-muted text-muted-foreground border-border",
  Recusado: "bg-red-100 text-red-700 border-red-300",
  Salvo:    "bg-blue-100 text-blue-700 border-blue-300",
}

function formatCurrency(value: number | null) {
  if (value == null) return "—"
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR")
}

// ─── Componente ───────────────────────────────────────────────────────────────

interface Props {
  onNewOrcamento: () => void
  onEdit: (orcamento: OrcamentoDB) => void
  onDuplicate: (orcamento: OrcamentoDB) => void
}

export function ScreenOrcamentos({ onNewOrcamento, onEdit, onDuplicate }: Props) {
  const [search,    setSearch]    = useState("")
  const [data,      setData]      = useState<OrcamentoDB[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: rows, error: err } = await supabase
        .from("orcamentos")
        .select("*")
        .order("created_at", { ascending: false })

      if (err) throw err
      setData(rows ?? [])
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao carregar dados."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  // Recarrega sempre que refreshKey muda (botão manual) ou na montagem
  useEffect(() => { load() }, [load, refreshKey])

  const filtered = data.filter(
    (o) =>
      o.nome_obra.toLowerCase().includes(search.toLowerCase()) ||
      (o.cliente ?? "").toLowerCase().includes(search.toLowerCase())
  )

  const handleDownload = async (o: OrcamentoDB) => {
    try {
      const { generateBudgetPdf } = await import("@/lib/pdf-generator")
      await generateBudgetPdf({
        projectName: o.nome_obra,
        clientName: o.cliente || "",
        date: (o.dados.date as string) || new Date().toISOString().slice(0, 10),
        bdi: (o.dados.bdi as number) || 25,
        encargos: (o.dados.encargos as number) || 85,
        isDesonerado: (o.dados.isDesonerado as boolean) || false,
        items: (o.dados.items as any) || [],
        prof: JSON.parse(localStorage.getItem("orcapro_settings") || "{}")
      })
      toast.success("PDF gerado com sucesso!")
    } catch (err) {
      console.error("Erro ao gerar PDF:", err)
      toast.error("Erro ao gerar o PDF diretamente.")
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-foreground">Meus Orçamentos</h2>
          <p className="text-sm text-muted-foreground">
            Orçamentos salvos na nuvem — dados em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-sm h-9"
            onClick={() => setRefreshKey((k) => k + 1)}
            disabled={loading}
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            Atualizar
          </Button>
          <Button size="sm" className="gap-1.5 text-sm h-9" onClick={onNewOrcamento}>
            <Plus className="w-4 h-4" />
            Novo Orçamento
          </Button>
        </div>
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
                  <TableHead className="text-xs font-semibold">Data</TableHead>
                  <TableHead className="text-xs font-semibold">Obra / Projeto</TableHead>
                  <TableHead className="text-xs font-semibold">Cliente</TableHead>
                  <TableHead className="text-xs font-semibold text-right w-36">Valor Total</TableHead>
                  <TableHead className="text-xs font-semibold w-24 text-center">Status</TableHead>
                  <TableHead className="text-xs font-semibold w-28 text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* ── Loading ── */}
                {loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-14">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Carregando da nuvem...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* ── Erro ── */}
                {!loading && error && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-14">
                      <div className="flex flex-col items-center gap-2 text-destructive">
                        <CloudOff className="w-5 h-5" />
                        <span className="text-sm font-medium">Falha na conexão com o Supabase</span>
                        <span className="text-xs text-muted-foreground">{error}</span>
                        <Button size="sm" variant="outline" onClick={() => setRefreshKey((k) => k + 1)}>
                          Tentar novamente
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* ── Vazio ── */}
                {!loading && !error && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-12">
                      {search
                        ? "Nenhum orçamento encontrado para essa busca."
                        : "Nenhum orçamento salvo ainda. Clique em 'Novo Orçamento' para começar."}
                    </TableCell>
                  </TableRow>
                )}

                {/* ── Dados reais ── */}
                {!loading && !error && filtered.map((o, idx) => (
                  <TableRow
                    key={o.id}
                    className={cn(
                      idx % 2 === 0 ? "bg-background" : "bg-muted/20",
                      "hover:bg-accent/30"
                    )}
                  >
                    <TableCell className="py-3 text-xs font-mono text-muted-foreground">
                      {formatDate(o.created_at)}
                    </TableCell>
                    <TableCell className="py-3 text-sm font-medium text-foreground max-w-[240px] truncate">
                      {o.nome_obra}
                    </TableCell>
                    <TableCell className="py-3 text-sm text-muted-foreground">
                      {o.cliente ?? "—"}
                    </TableCell>
                    <TableCell className="py-3 text-sm font-mono font-semibold text-right">
                      {formatCurrency(o.valor_total)}
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Badge
                        variant="outline"
                        className={cn("text-xs font-medium", statusStyle[o.status] ?? statusStyle.Salvo)}
                      >
                        {o.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center justify-center gap-2.5">
                        <button onClick={() => onEdit(o)} className="text-muted-foreground hover:text-primary transition-colors" title="Visualizar / Editar">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDownload(o)} className="text-muted-foreground hover:text-primary transition-colors" title="Baixar PDF">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onEdit(o)} className="text-muted-foreground hover:text-primary transition-colors" title="Editar">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onDuplicate(o)} className="text-muted-foreground hover:text-primary transition-colors" title="Duplicar Orçamento">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {!loading && !error && (
            <div className="px-5 py-3 border-t bg-muted/20 text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              {filtered.length} registro{filtered.length !== 1 ? "s" : ""} — dados em tempo real via Supabase
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
