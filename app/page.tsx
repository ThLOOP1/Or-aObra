"use client"

import { useState, useCallback } from "react"
import { AppSidebar, type AppScreen } from "@/components/app-sidebar"
import { MobileHeader } from "@/components/mobile-header"
import { ProjectHeaderCard } from "@/components/project-header-card"
import { AiInputCard } from "@/components/ai-input-card"
import { CostSettingsCard } from "@/components/cost-settings-card"
import { BudgetTable, BudgetItem } from "@/components/budget-table"
import { BudgetActions } from "@/components/budget-actions"
import { ScreenDashboard } from "@/components/screen-dashboard"
import { ScreenOrcamentos } from "@/components/screen-orcamentos"
import { ScreenClientes } from "@/components/screen-clientes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Sparkles, HardHat, Upload, FileSpreadsheet, FileText as FilePdf, AlertCircle } from "lucide-react"

// --- Mock AI items ---
const AI_MOCK_ITEMS: BudgetItem[] = [
  { id: "1", ref: "SINAPI-87251", description: "Demolição de piso cerâmico existente, inclusive remoção de entulho", unit: "m²", qty: 5, unitPrice: 32.5, aiGenerated: true },
  { id: "2", ref: "SINAPI-88309", description: "Regularização e nivelamento de piso com argamassa de cimento e areia", unit: "m²", qty: 5, unitPrice: 48, aiGenerated: true },
  { id: "3", ref: "SINAPI-96614", description: "Assentamento de porcelanato 60×60cm com argamassa colante AC-III", unit: "m²", qty: 5, unitPrice: 95, aiGenerated: true },
  { id: "4", ref: "SINAPI-91924", description: "Pintura acrílica em paredes internas – 2 demãos + selador", unit: "m²", qty: 20, unitPrice: 18.5, aiGenerated: true },
  { id: "5", ref: "SINAPI-89634", description: "Fornecimento e instalação de vaso sanitário com caixa acoplada", unit: "un", qty: 1, unitPrice: 620, aiGenerated: true },
  { id: "6", ref: "PROP-001", description: "Bancada de granito preto São Gabriel – espessura 2cm, borda chanfrada", unit: "m²", qty: 0.6, unitPrice: 780, aiGenerated: true },
]

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

// Screen title map
const SCREEN_TITLES: Record<AppScreen, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Visão geral da sua operação de engenharia" },
  orcamentos: { title: "Meus Orçamentos", subtitle: "Gerencie e acompanhe todas as suas propostas" },
  "nova-obra": { title: "Nova Obra / Orçamento", subtitle: "Preencha os dados e use a IA para extrair itens automaticamente" },
  clientes: { title: "Gestão de Clientes", subtitle: "Mini CRM com histórico de orçamentos por cliente" },
  configuracoes: { title: "Configurações", subtitle: "Parâmetros do sistema e preferências do usuário" },
}

export default function SmartBudgetApp() {
  const [screen, setScreen] = useState<AppScreen>("nova-obra")

  // Nova obra state
  const [projectData, setProjectData] = useState({ projectName: "Reforma Banheiro Apto 302 – Bloco B", clientName: "Maria Oliveira", date: new Date().toISOString().slice(0, 10) })
  const [bdi, setBdi] = useState(25)
  const [encargos, setEncargos] = useState(85)
  const [items, setItems] = useState<BudgetItem[]>(AI_MOCK_ITEMS)
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiProcessed, setAiProcessed] = useState(true)
  const [saved, setSaved] = useState(false)

  // Import modal state
  const [importOpen, setImportOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importStatus, setImportStatus] = useState<"idle" | "processing" | "done">("idle")

  const navigate = useCallback((s: AppScreen) => setScreen(s), [])

  const handleProjectChange = useCallback((field: string, value: string) => {
    setProjectData((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }, [])

  const handleCostChange = useCallback((field: string, value: number) => {
    if (field === "bdi") setBdi(value)
    else setEncargos(value)
    setSaved(false)
  }, [])

  const handleAiProcess = useCallback((_desc: string) => {
    setIsProcessing(true)
    setAiProcessed(false)
    setTimeout(() => {
      setItems(AI_MOCK_ITEMS)
      setIsProcessing(false)
      setAiProcessed(true)
      setSaved(false)
    }, 2200)
  }, [])

  const handleAddItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      { id: generateId(), ref: "PROP-" + String(prev.length + 1).padStart(3, "0"), description: "Novo serviço – clique para editar", unit: "un", qty: 1, unitPrice: 0, aiGenerated: false },
    ])
    setSaved(false)
  }, [])

  const handleDeleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    setSaved(false)
  }, [])

  const handleUpdateItem = useCallback((id: string, patch: Partial<BudgetItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))
    setSaved(false)
  }, [])

  const handleSave = useCallback(() => setSaved(true), [])
  const handleGeneratePdf = useCallback(() => alert("Funcionalidade de geração de PDF será implementada na versão completa."), [])

  const handleImportConfirm = useCallback(() => {
    if (!importFile) return
    setImportStatus("processing")
    setTimeout(() => {
      setImportStatus("done")
      // Simulate adding 2 imported items
      setItems((prev) => [
        ...prev,
        { id: generateId(), ref: "IMP-001", description: "Serviço importado: Concretagem de piso industrial FCK 25MPa", unit: "m²", qty: 120, unitPrice: 145, aiGenerated: false },
        { id: generateId(), ref: "IMP-002", description: "Serviço importado: Instalação de gradil metálico galvanizado", unit: "m", qty: 48, unitPrice: 230, aiGenerated: false },
      ])
      setSaved(false)
      setTimeout(() => {
        setImportOpen(false)
        setImportFile(null)
        setImportStatus("idle")
      }, 1200)
    }, 2000)
  }, [importFile])

  const { title, subtitle } = SCREEN_TITLES[screen]

  return (
    <div className="flex min-h-screen bg-background font-sans">
      <AppSidebar activeScreen={screen} onNavigate={navigate} />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader activeScreen={screen} onNavigate={navigate} />

        {/* Page header */}
        <div className="border-b bg-card px-6 py-4 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-accent">
              <HardHat className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight text-balance">{title}</h1>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          {screen === "nova-obra" && aiProcessed && items.length > 0 && (
            <Badge className="gap-1.5 bg-accent text-accent-foreground border-0 text-xs font-medium hidden sm:flex">
              <Sparkles className="w-3 h-3" />
              {items.filter((i) => i.aiGenerated).length} itens gerados pela IA
            </Badge>
          )}
        </div>

        {/* Screens */}
        <main className="flex-1">
          {screen === "dashboard" && <ScreenDashboard />}

          {screen === "orcamentos" && (
            <ScreenOrcamentos onNewOrcamento={() => navigate("nova-obra")} />
          )}

          {screen === "nova-obra" && (
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start max-w-screen-xl mx-auto">
                <div className="flex flex-col gap-4">
                  <ProjectHeaderCard projectName={projectData.projectName} clientName={projectData.clientName} date={projectData.date} onChange={handleProjectChange} />
                  <AiInputCard onProcess={handleAiProcess} isProcessing={isProcessing} />
                  <CostSettingsCard bdi={bdi} encargos={encargos} onChange={handleCostChange} />
                </div>
                <div className="flex flex-col gap-4">
                  <BudgetTable items={items} bdi={bdi} onAdd={handleAddItem} onImport={() => setImportOpen(true)} onDelete={handleDeleteItem} onUpdate={handleUpdateItem} />
                  <BudgetActions onSave={handleSave} onGeneratePdf={handleGeneratePdf} saved={saved} />
                </div>
              </div>
            </div>
          )}

          {screen === "clientes" && <ScreenClientes />}

          {screen === "configuracoes" && (
            <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
              <div className="flex items-center justify-center h-60 rounded-xl border-2 border-dashed border-border">
                <p className="text-muted-foreground text-sm">Tela de configurações em desenvolvimento.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Import Dialog */}
      <Dialog open={importOpen} onOpenChange={(v) => { if (!v) { setImportFile(null); setImportStatus("idle") } setImportOpen(v) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" />
              Importar Planilha / PDF
            </DialogTitle>
            <DialogDescription>
              Selecione um arquivo Excel (.xlsx), CSV ou PDF com os itens do orçamento. O sistema extrairá os dados automaticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Format options */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-muted/30">
                <FileSpreadsheet className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Planilha Excel</p>
                  <p className="text-[11px] text-muted-foreground">.xlsx / .csv</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-muted/30">
                <FilePdf className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground">PDF de Orçamento</p>
                  <p className="text-[11px] text-muted-foreground">.pdf</p>
                </div>
              </div>
            </div>

            {/* File input */}
            <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent/30 transition-colors cursor-pointer">
              <Upload className="w-7 h-7 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {importFile ? importFile.name : "Clique para selecionar o arquivo"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">ou arraste e solte aqui</p>
              </div>
              <input
                type="file"
                accept=".xlsx,.csv,.pdf"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) setImportFile(f)
                }}
              />
            </label>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/40 border border-accent">
              <AlertCircle className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-accent-foreground">
                O arquivo deve conter colunas: <strong>Descrição, Unidade, Quantidade, Valor Unitário</strong>. Baixe o modelo padrão caso necessário.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => setImportOpen(false)}>
                Cancelar
              </Button>
              <Button
                size="sm"
                disabled={!importFile || importStatus === "processing"}
                onClick={handleImportConfirm}
                className="gap-1.5 min-w-28"
              >
                {importStatus === "processing" ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    Processando...
                  </>
                ) : importStatus === "done" ? (
                  "Importado!"
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    Importar Itens
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
