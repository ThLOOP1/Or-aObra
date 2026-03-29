"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, RefreshCw, Save, ShieldCheck, User, Database } from "lucide-react"

export function ScreenConfiguracoes() {
  const [nome, setNome] = useState("")
  const [crea, setCrea] = useState("")
  const [cpfCnpj, setCpfCnpj] = useState("")
  const [bdi, setBdi] = useState(25)
  const [encargos, setEncargos] = useState(85)
  const [desonerado, setDesonerado] = useState(false)
  const [baseAtiva, setBaseAtiva] = useState("sinapi")
  
  const [syncing, setSyncing] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("orcapro_settings")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.nome) setNome(parsed.nome)
        if (parsed.crea) setCrea(parsed.crea)
        if (parsed.cpfCnpj) setCpfCnpj(parsed.cpfCnpj)
        if (parsed.bdi !== undefined) setBdi(parsed.bdi)
        if (parsed.encargos !== undefined) setEncargos(parsed.encargos)
        if (parsed.desonerado !== undefined) setDesonerado(parsed.desonerado)
      }
      
      const savedBase = localStorage.getItem("orcapro_base_ativa")
      if (savedBase) setBaseAtiva(savedBase)
        
    } catch (e) {
      console.error(e)
    }
    setMounted(true)
  }, [])

  const handleSave = () => {
    const data = {
      nome,
      crea,
      cpfCnpj,
      bdi: Number(bdi),
      encargos: Number(encargos),
      desonerado
    }
    localStorage.setItem("orcapro_settings", JSON.stringify(data))
    toast.success("Preferências salvas com sucesso!", {
      description: "As próximas obras e geração de PDF puxarão seus dados padrão.",
    })
  }

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      localStorage.setItem("orcapro_base_ativa", baseAtiva)
      toast.success("Base sincronizada e definida como padrão!", {
        description: `Os itens do modal de inteligência usarão a base selecionada.`,
      })
    }, 1500)
  }

  if (!mounted) return null

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-screen-md mx-auto fade-in-up">
      <div>
        <h2 className="text-xl font-bold text-foreground">Configurações e Preferências</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie seus dados do CREA, termos da LGPD e sincronização da base do SINAPI.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Card 1: Perfil Profissional */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Perfil do Profissional (CREA)
            </CardTitle>
            <CardDescription>
              Estes dados serão utilizados no cabeçalho dos seus orçamentos PDF.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nome">Nome Completo / Engenheiro</Label>
              <Input id="nome" placeholder="Ex: Eng. Carlos Silva" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="crea">Registro CREA</Label>
                <Input id="crea" placeholder="Ex: 123456/MA" value={crea} onChange={(e) => setCrea(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cpf">CPF / CNPJ</Label>
                <Input id="cpf" placeholder="000.000.000-00" value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Parâmetros Padrão */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Parâmetros Padrão de Cálculo</CardTitle>
            <CardDescription>
              Valores pré-carregados sempre que você iniciar um novo orçamento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="bdi">BDI Padrão (%)</Label>
                <Input id="bdi" type="number" min={0} max={100} value={bdi} onChange={(e) => setBdi(parseFloat(e.target.value) || 0)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="encargos">Encargos Sociais Padrão (%)</Label>
                <Input id="encargos" type="number" min={0} max={200} value={encargos} onChange={(e) => setEncargos(parseFloat(e.target.value) || 0)} />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-card gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="regime-toggle" className="text-sm">Regime Tributário Base</Label>
                <p className="text-xs text-muted-foreground max-w-[280px]">
                  Buscador SINAPI focará preçes neste regime por padrão.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="regime-toggle" checked={desonerado} onCheckedChange={setDesonerado} />
                <Label htmlFor="regime-toggle" className="text-sm font-semibold truncate">
                  {desonerado ? "Desonerado" : "Não Desonerado"}
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Gestão de Bases de Preço */}
        <Card className="shadow-sm border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Gestão de Bases de Preço
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="space-y-1.5 flex-1 w-full">
                <Label htmlFor="base-ativa">Base Ativa</Label>
                <Select value={baseAtiva} onValueChange={setBaseAtiva}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Selecione a base" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sinapi">SINAPI (Construção Civil - Maranhão)</SelectItem>
                    <SelectItem value="caema">CAEMA (Saneamento - Maranhão)</SelectItem>
                    <SelectItem value="sicro">SICRO (Pavimentação e Rodovias - Federal)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground pt-1">Determine de qual banco o modal de buscas irá puxar as composições.</p>
              </div>
              <Button variant="default" onClick={handleSync} disabled={syncing} className="w-full sm:w-auto shadow-sm shrink-0 h-10">
                {syncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Atualizando Base...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Verificar e Sincronizar Nova Base</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: LGPD */}
        <Card className="shadow-sm border-blue-100 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 pointer-events-none">
                <Checkbox id="lgpd" checked disabled className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lgpd" className="text-sm font-medium leading-snug cursor-default text-blue-900">
                  <ShieldCheck className="w-4 h-4 inline mr-1 mb-0.5 text-blue-600" />
                  Conformidade de Dados (LGPD)
                </Label>
                <p className="text-xs text-blue-800">
                  Concordo que os dados dos meus clientes sejam processados de forma anônima e segura
                  de acordo com a LGPD (Lei 13.709/2018). Dados não são compartilhados com terceiros.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button size="lg" className="w-full sm:w-auto shadow-sm gap-2" onClick={handleSave}>
          <Save className="w-5 h-5" />
          Salvar Preferências
        </Button>
      </div>

    </div>
  )
}
