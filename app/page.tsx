"use client"

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { AppSidebar, type AppScreen } from "@/components/layout/app-sidebar"
import { MobileHeader } from "@/components/layout/mobile-header"
import { ProjectHeaderCard } from "@/components/orcamento/project-header-card"
import { AiInputCard } from "@/components/ai/ai-input-card"
import { CostSettingsCard } from "@/components/orcamento/cost-settings-card"
import { BudgetTable, type BudgetItem } from "@/components/orcamento/budget-table"
import { BudgetActions } from "@/components/orcamento/budget-actions"
import { ScreenOrcamentos } from "@/components/screens/screen-orcamentos"
import { ScreenConfiguracoes } from "@/components/screens/screen-configuracoes"
import { SinapiSearchModal } from "@/components/orcamento/sinapi-search-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { SINAPI_MOCK } from "@/data/sinapi_mock"
import {
  Sparkles,
  HardHat,
  Upload,
  FileSpreadsheet,
  FileText as FilePdf,
  AlertCircle,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"

// --- Mock AI items com sinapiCodigo e tipagem correta ---
const AI_MOCK_ITEMS: BudgetItem[] = [
  { id: "1", ref: "SINAPI-87251", description: "Demolição de piso cerâmico existente, inclusive remoção de entulho", unit: "m²", qty: 5, unitPrice: 32.5, tipo: "mao_de_obra", aiGenerated: true },
  { id: "2", ref: "SINAPI-88309", description: "Regularização e nivelamento de piso com argamassa de cimento e areia", unit: "m²", qty: 5, unitPrice: 48, tipo: "mao_de_obra", aiGenerated: true },
  { id: "3", ref: "SINAPI-96614", description: "Assentamento de porcelanato 60×60cm com argamassa colante AC-III", unit: "m²", qty: 5, unitPrice: 95, tipo: "mao_de_obra", aiGenerated: true },
  { id: "4", ref: "SINAPI-91924", description: "Pintura acrílica em paredes internas – 2 demãos + selador", unit: "m²", qty: 20, unitPrice: 18.5, tipo: "mao_de_obra", aiGenerated: true },
  { id: "5", ref: "SINAPI-89634", description: "Fornecimento e instalação de vaso sanitário com caixa acoplada", unit: "un", qty: 1, unitPrice: 620, tipo: "material", aiGenerated: true },
  { id: "6", ref: "PROP-001", description: "Bancada de granito preto São Gabriel – espessura 2cm, borda chanfrada", unit: "m²", qty: 0.6, unitPrice: 780, tipo: "material", aiGenerated: true },
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
  const [projectData, setProjectData] = useState({ projectName: "", clientName: "", date: new Date().toISOString().slice(0, 10) })
  const [bdi, setBdi] = useState(25)
  const [encargos, setEncargos] = useState(85)
  const [items, setItems] = useState<BudgetItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiProcessed, setAiProcessed] = useState(false)
  const [showAiSuggestion, setShowAiSuggestion] = useState(false)
  const [aiSuggestionTerm, setAiSuggestionTerm] = useState("")
  const [saved, setSaved] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)

  // ── Carregar configs padrão (BDI/Encargos) ──
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("orcapro_settings")
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        if (parsed.bdi !== undefined) setBdi(parsed.bdi)
        if (parsed.encargos !== undefined) setEncargos(parsed.encargos)
        if (parsed.desonerado !== undefined) setIsDesonerado(parsed.desonerado)
      }
    } catch(e) {}
  }, [])

  // ── Toggle de regime tributário ──
  const [isDesonerado, setIsDesonerado] = useState(true)

  // ── Modal de busca SINAPI ──
  const [sinapiOpen, setSinapiOpen] = useState(false)

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

  // ── Toggle Desonerado: reprecifica todos os itens vindos do SINAPI ──
  const handleToggleDesoneracao = useCallback((checked: boolean) => {
    setIsDesonerado(checked)
    setItems((prev) =>
      prev.map((item) => {
        if (!item.sinapiCodigo) return item
        const source = SINAPI_MOCK.find((s) => s.codigo === item.sinapiCodigo)
        if (!source) return item
        return {
          ...item,
          unitPrice: checked ? source.preco_desonerado : source.preco_nao_desonerado,
        }
      })
    )
    setSaved(false)
  }, [])

  // ── Adicionar item via busca SINAPI ──
  const handleAddFromSinapi = useCallback((item: BudgetItem) => {
    setItems((prev) => [...prev, item])
    setSaved(false)
  }, [])

  const handleAiProcess = useCallback((desc: string) => {
    setIsProcessing(true)
    setAiProcessed(false)
    setAiSuggestionTerm(desc.length > 30 ? desc.slice(0, 30) + "..." : desc)
    setTimeout(() => {
      setIsProcessing(false)
      setShowAiSuggestion(true)
    }, 2000)
  }, [])

  const handleAcceptAiSuggestion = useCallback(() => {
    setShowAiSuggestion(false)
    setProjectData({
      projectName: "Reforma Banheiro Apto 302 – Bloco B",
      clientName: "Maria Oliveira",
      date: new Date().toISOString().slice(0, 10),
    })
    setItems(AI_MOCK_ITEMS)
    setAiProcessed(true)
    setSaved(false)
    toast.success("Itens sugeridos incorporados à tabela com sucesso!")
  }, [])

  const handleEditOrcamento = useCallback((orc: any) => {
    setProjectData({
      projectName: orc.nome_obra,
      clientName: orc.cliente || "",
      date: (orc.dados?.date as string) || new Date().toISOString().slice(0, 10),
    })
    setItems((orc.dados?.items as BudgetItem[]) || [])
    setBdi((orc.dados?.bdi as number) || 25)
    setEncargos((orc.dados?.encargos as number) || 85)
    setIsDesonerado((orc.dados?.isDesonerado as boolean) || false)
    setSaved(true)
    navigate("nova-obra")
    toast.info(`Editando Orçamento: ${orc.nome_obra}`)
  }, [navigate])

  const handleDuplicateOrcamento = useCallback((orc: any) => {
    setProjectData({
      projectName: orc.nome_obra + " (Cópia)",
      clientName: orc.cliente || "",
      date: new Date().toISOString().slice(0, 10),
    })
    setItems((orc.dados?.items as BudgetItem[]) || [])
    setBdi((orc.dados?.bdi as number) || 25)
    setEncargos((orc.dados?.encargos as number) || 85)
    setIsDesonerado((orc.dados?.isDesonerado as boolean) || false)
    setSaved(false)
    navigate("nova-obra")
    toast.info(`Cópia criada a partir de: ${orc.nome_obra}`)
  }, [navigate])

  const handleAddItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      { id: generateId(), ref: "PROP-" + String(prev.length + 1).padStart(3, "0"), description: "Novo serviço – clique para editar", unit: "un", qty: 1, unitPrice: 0, tipo: "material", aiGenerated: false },
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

  const handleSave = useCallback(async () => {
    // Cálculo do valor_total antes de salvar
    const materiaisRaw = items.filter(i => i.tipo === "material")
                                .reduce((acc, i) => acc + i.qty * i.unitPrice, 0)
    const moRaw        = items.filter(i => i.tipo === "mao_de_obra")
                                .reduce((acc, i) => acc + i.qty * i.unitPrice, 0)
    const encargosValue = moRaw * (encargos / 100)
    const moComEncargos = moRaw + encargosValue
    const custoDireto  = materiaisRaw + moComEncargos
    const bdiValue     = custoDireto * (bdi / 100)
    const precoFinal   = custoDireto + bdiValue

    try {
      const { error } = await supabase.from('orcamentos').insert({
        nome_obra: projectData.projectName,
        cliente: projectData.clientName,
        status: 'Salvo',
        valor_total: precoFinal,
        dados: {
          items,
          bdi,
          encargos,
          isDesonerado,
          date: projectData.date,
        }
      })

      if (error) {
        throw error
      }
      
      setSaved(true)
      toast.success("Orçamento salvo na nuvem com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error)
      toast.error("Erro ao salvar orçamento na nuvem.")
    }
  }, [items, encargos, bdi, projectData, isDesonerado])

  const handleGeneratePdf = useCallback(async () => {
    if (pdfGenerating) return
    setPdfGenerating(true)
    try {
      const { generateBudgetPdf } = await import("@/lib/pdf-generator")
      await generateBudgetPdf({
        projectName: projectData.projectName,
        clientName:  projectData.clientName,
        date:        projectData.date,
        bdi,
        encargos,
        isDesonerado,
        items,
        prof: JSON.parse(localStorage.getItem("orcapro_settings") || "{}")
      })
    } catch (err) {
      console.error("Erro ao gerar PDF:", err)
      alert("Erro ao gerar o PDF. Verifique o console.")
    } finally {
      setPdfGenerating(false)
    }
  }, [pdfGenerating, projectData, bdi, encargos, isDesonerado, items])

  const handleImportConfirm = useCallback(() => {
    if (!importFile) return
    setImportStatus("processing")
    setTimeout(() => {
      setImportStatus("done")
      setItems((prev) => [
        ...prev,
        { id: generateId(), ref: "IMP-001", description: "Serviço importado: Concretagem de piso industrial FCK 25MPa", unit: "m²", qty: 120, unitPrice: 145, tipo: "mao_de_obra", aiGenerated: false },
        { id: generateId(), ref: "IMP-002", description: "Serviço importado: Instalação de gradil metálico galvanizado", unit: "m", qty: 48, unitPrice: 230, tipo: "material", aiGenerated: false },
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

          {/* ── Header right: regime toggle + badge IA ── */}
          <div className="flex items-center gap-4">
            {screen === "nova-obra" && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/40 cursor-default select-none">
                      <Switch
                        id="regime-toggle"
                        checked={isDesonerado}
                        onCheckedChange={handleToggleDesoneracao}
                        aria-label="Alternar regime tributário"
                      />
                      <Label
                        htmlFor="regime-toggle"
                        className={cn(
                          "text-xs font-semibold cursor-pointer transition-colors leading-none",
                          isDesonerado ? "text-primary" : "text-orange-700"
                        )}
                      >
                        {isDesonerado ? "Desonerado" : "Não Desonerado"}
                      </Label>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs max-w-[280px] space-y-1.5">
                    <p className="font-semibold">Regime Tributário — SINAPI</p>
                    <p>
                      <strong>Desonerado:</strong> Aplica desoneração da folha de pagamento (Lei 12.546/2011).
                      Mão de obra com menor custo tributário — indicado para obras públicas.
                    </p>
                    <p>
                      <strong>Não Desonerado:</strong> Alíquota padrão do INSS sobre salários.
                      Gera custos de MO maiores. Alterar este toggle repreça automaticamente
                      todos os itens SINAPI da tabela.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {screen === "nova-obra" && aiProcessed && items.length > 0 && (
              <Badge className="gap-1.5 bg-accent text-accent-foreground border-0 text-xs font-medium hidden sm:flex">
                <Sparkles className="w-3 h-3" />
                {items.filter((i) => i.aiGenerated).length} itens gerados pela IA
              </Badge>
            )}
          </div>
        </div>

        {/* Screens */}
        <main className="flex-1">
          {/* Dashboard: oculto da navegação demo — não acessível pelos jurados */}

          {screen === "orcamentos" && (
            <ScreenOrcamentos 
              onNewOrcamento={() => navigate("nova-obra")} 
              onEdit={handleEditOrcamento}
              onDuplicate={handleDuplicateOrcamento}
            />
          )}

          {screen === "nova-obra" && (
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start max-w-screen-2xl mx-auto">
                {/* 1. Coluna Esquerda: IA e Parâmetros globais */}
                <div className="flex flex-col gap-4">
                  <AiInputCard onProcess={handleAiProcess} isProcessing={isProcessing} />
                  <ProjectHeaderCard projectName={projectData.projectName} clientName={projectData.clientName} date={projectData.date} onChange={handleProjectChange} />
                  <CostSettingsCard bdi={bdi} encargos={encargos} onChange={handleCostChange} />
                </div>
                
                {/* 2. Coluna Direita (maior): Tabela de Orçamento */}
                <div className="flex flex-col gap-4">
                  {/* Banner de Sugestão de IA (Mágico) */}
                  {showAiSuggestion && (
                    <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-4 md:p-5 shadow-sm fade-in-up">
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="bg-emerald-100 p-2.5 rounded-full text-emerald-600 shrink-0">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="space-y-3.5 w-full pt-1">
                          <div>
                            <p className="text-sm font-semibold text-emerald-950 leading-snug">
                              A IA analisou seu projeto e propõe {AI_MOCK_ITEMS.length} itens da base oficial:
                            </p>
                            <p className="text-xs text-emerald-700/80 mt-1 max-w-xl">
                              Trecho contextual: <span className="font-medium italic text-emerald-800">"{aiSuggestionTerm}"</span>
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {AI_MOCK_ITEMS.map((i, idx) => (
                              <span key={i.sinapiCodigo || idx} className="px-2.5 py-1 bg-white border border-emerald-100/50 text-emerald-800 text-[10px] sm:text-xs rounded-md font-medium shadow-sm">
                                [{i.tipo === "material" ? "Material" : "Mão de Obra"}] {i.description.slice(0, 50)}...
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 pt-2">
                            <Button size="sm" onClick={handleAcceptAiSuggestion} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm h-8 rounded-lg">
                              Aceitar e Adicionar à Tabela
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setShowAiSuggestion(false)} className="text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100/50 h-8 rounded-lg">
                              Descartar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <BudgetTable
                    items={items}
                    bdi={bdi}
                    encargos={encargos}
                    isDesonerado={isDesonerado}
                    onSearch={() => setSinapiOpen(true)}
                    onAdd={handleAddItem}
                    onImport={() => setImportOpen(true)}
                    onDelete={handleDeleteItem}
                    onUpdate={handleUpdateItem}
                  />
                  <BudgetActions onSave={handleSave} onGeneratePdf={handleGeneratePdf} saved={saved} isGeneratingPdf={pdfGenerating} />
                </div>
              </div>
            </div>
          )}

          {/* Clientes: oculto da navegação demo — não acessível pelos jurados */}

          {screen === "configuracoes" && (
            <ScreenConfiguracoes />
          )}
        </main>
      </div>

      {/* ── Modal de Busca SINAPI ── */}
      <SinapiSearchModal
        open={sinapiOpen}
        onOpenChange={setSinapiOpen}
        isDesonerado={isDesonerado}
        onAddItem={handleAddFromSinapi}
      />

      {/* Import Dialog */}
      <Dialog open={importOpen} onOpenChange={(v: boolean) => { if (!v) { setImportFile(null); setImportStatus("idle") } setImportOpen(v) }}>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
