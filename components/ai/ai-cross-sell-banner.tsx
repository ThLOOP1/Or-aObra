"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BudgetItem } from "@/components/orcamento/budget-table"

// Configuração central do Motor de Correlação
type CrossSellRule = {
  id: string
  // Palavras que DEVEM estar na tabela para ativar a regra
  triggerKeywords: string[]
  // Palavras que NÃO DEVEM estar na tabela (são os "esquecidos")
  missingKeywords: string[]
  message: string
  suggestions: BudgetItem[]
}

/**
 * Base de Conhecimento: Correlações de insumos em construção civil
 * Princípio: "Se o engenheiro adicionou X mas não tem Y, provavelmente esqueceu Y"
 * Regras ordenadas por prioridade de impacto financeiro
 */
const CROSS_SELL_RULES: CrossSellRule[] = [

  // ─── CONCRETO & ESTRUTURA ───────────────────────────────
  {
    id: "rule_cimento_areia",
    triggerKeywords: ["cimento", "brita", "concreto", "fundação", "sapata", "viga", "pilar", "laje"],
    missingKeywords: ["areia", "areia media", "areia grossa"],
    message: "🪨 Detectamos cimento/concreto no orçamento, mas não encontramos areia. Em qualquer traço de concreto ou argamassa, a areia é insumo essencial. Deseja incluí-la?",
    suggestions: [
      { id: "cs_areia", ref: "SINAPI-370", description: "Areia média - posto jazida/fornecedor (retirado na jazida)", unit: "m³", qty: 3, unitPrice: 115, tipo: "material", aiGenerated: true },
    ]
  },
  {
    id: "rule_concreto_forma",
    triggerKeywords: ["concreto", "laje", "viga", "pilar", "fundação"],
    missingKeywords: ["forma", "fôrma", "escoramento", "cimbramento"],
    message: "🏗️ Encontramos serviços de concretagem. Atenção: as fôrmas e o escoramento são custos diretos frequentemente omitidos. Deseja incluí-los?",
    suggestions: [
      { id: "cs_forma", ref: "SINAPI-99633", description: "Fôrma de madeira serrada - tabua 2,5cm - reaproveitamento 3x", unit: "m²", qty: 20, unitPrice: 58.5, tipo: "material", aiGenerated: true },
      { id: "cs_escoramento", ref: "SINAPI-97631", description: "Escoramento e reescoramento de lajes - até 3m de pé direito", unit: "m²", qty: 20, unitPrice: 22.0, tipo: "mao_de_obra", aiGenerated: true },
    ]
  },
  {
    id: "rule_concreto_armado",
    triggerKeywords: ["concreto armado", "laje", "viga", "pilar", "estrutura"],
    missingKeywords: ["aço", "vergalhão", "ferragem", "ca-50", "ca-60"],
    message: "🔩 Orçamento com estruturas de concreto detectado. Sem os vergalhões de aço (CA-50/CA-60), o concreto armado fica incompleto. Deseja incluir a ferragem?",
    suggestions: [
      { id: "cs_aco", ref: "SINFRA-C-05", description: "Aço CA-50 10mm (Vergalhão) - fornecimento e corte", unit: "kg", qty: 80, unitPrice: 8.5, tipo: "material", aiGenerated: true },
    ]
  },

  // ─── ALVENARIA ──────────────────────────────────────────
  {
    id: "rule_alvenaria_cimento",
    triggerKeywords: ["tijolo", "alvenaria", "bloco cerâmico", "bloco de concreto"],
    missingKeywords: ["cimento", "argamassa de assentamento"],
    message: "🧱 Adicionou itens de alvenaria, mas não encontramos argamassa/cimento. Levantar paredes exige argamassa de assentamento em toda a extensão. Deseja incluir?",
    suggestions: [
      { id: "cs_cimento_alv", ref: "SINAPI-1379", description: "Cimento Portland CP II - 50kg", unit: "sc", qty: 10, unitPrice: 38.5, tipo: "material", aiGenerated: true },
      { id: "cs_areia_alv", ref: "SINAPI-370", description: "Areia média - posto jazida/fornecedor", unit: "m³", qty: 2.5, unitPrice: 115, tipo: "material", aiGenerated: true },
    ]
  },
  {
    id: "rule_alvenaria_pedreiro",
    triggerKeywords: ["tijolo", "alvenaria", "bloco"],
    missingKeywords: ["pedreiro", "servente"],
    message: "👷 Identificamos materiais de alvenaria sem mão de obra correspondente. Pedreiro e servente são necessários para o levantamento das paredes. Deseja incluí-los?",
    suggestions: [
      { id: "cs_pedreiro", ref: "ORSE-O-07", description: "Pedreiro com Encargos Complementares", unit: "h", qty: 40, unitPrice: 23.5, tipo: "mao_de_obra", aiGenerated: true },
      { id: "cs_servente", ref: "ORSE-O-08", description: "Servente de Obras com Encargos Complementares", unit: "h", qty: 40, unitPrice: 17.8, tipo: "mao_de_obra", aiGenerated: true },
    ]
  },

  // ─── REVESTIMENTOS & PISOS ──────────────────────────────
  {
    id: "rule_revestimento_massa",
    triggerKeywords: ["reboco", "chapisco", "emboço", "revestimento de argamassa"],
    missingKeywords: ["cimento", "areia"],
    message: "🪵 Detectamos revestimentos de argamassa (chapisco/reboco). O cimento e a areia são os principais insumos deste serviço. Deseja adicioná-los?",
    suggestions: [
      { id: "cs_cimento_rev", ref: "SINAPI-1379", description: "Cimento Portland CP II - 50kg", unit: "sc", qty: 8, unitPrice: 38.5, tipo: "material", aiGenerated: true },
      { id: "cs_areia_rev", ref: "SINAPI-370", description: "Areia média - posto jazida/fornecedor", unit: "m³", qty: 2, unitPrice: 115, tipo: "material", aiGenerated: true },
    ]
  },
  {
    id: "rule_piso_ceramico",
    triggerKeywords: ["porcelanato", "piso cerâmico", "assentamento de piso", "azulejo", "ceramica"],
    missingKeywords: ["rejunte", "argamassa colante", "ac-ii", "ac-iii"],
    message: "📐 Encontramos assentamento de pisos/revestimentos. Sem argamassa colante e rejunte, a fixação fica comprometida — são os erros mais comuns de subvalorização. Deseja incluí-los?",
    suggestions: [
      { id: "cs_ac3", ref: "ORSE-O-04", description: "Argamassa colante AC-III (uso interno/externo)", unit: "sc", qty: 5, unitPrice: 35.0, tipo: "material", aiGenerated: true },
      { id: "cs_rejunte", ref: "ORSE-O-05", description: "Rejunte cimentício colorido", unit: "kg", qty: 5, unitPrice: 5.8, tipo: "material", aiGenerated: true },
    ]
  },

  // ─── PINTURA ─────────────────────────────────────────────
  {
    id: "rule_pintura_preparo",
    triggerKeywords: ["pintura", "tinta acrílica", "pintor", "caiação"],
    missingKeywords: ["massa corrida", "selador", "emassamento"],
    message: "🎨 Há serviços de pintura sem preparação de base. Sem massa corrida e selador, a tinta descasca em pouco tempo — custo reclamado em garantias. Deseja incluir a preparação?",
    suggestions: [
      { id: "cs_selador", ref: "SINAPI-6085", description: "Selador acrílico p/ paredes internas/externas", unit: "l", qty: 18, unitPrice: 8.5, tipo: "material", aiGenerated: true },
      { id: "cs_massa", ref: "SINAPI-8914", description: "Aplicação de massa corrida PVA em paredes internas - 2 demãos", unit: "m²", qty: 40, unitPrice: 12.0, tipo: "mao_de_obra", aiGenerated: true },
    ]
  },
  {
    id: "rule_pintura_lixa",
    triggerKeywords: ["massa corrida", "emassamento", "lixamento"],
    missingKeywords: ["lixa", "lixa d'agua"],
    message: "🖌️ Identificamos emassamento/massa corrida sem lixa. O lixamento entre demãos é etapa obrigatória. Deseja adicionar a lixa ao orçamento?",
    suggestions: [
      { id: "cs_lixa", ref: "SINAPI-3767", description: "Lixa em folha para massa ou madeira - n°100", unit: "un", qty: 30, unitPrice: 1.5, tipo: "material", aiGenerated: true },
    ]
  },

  // ─── INSTALAÇÕES ─────────────────────────────────────────
  {
    id: "rule_hidraulica_ferragem",
    triggerKeywords: ["tubulação", "pvc", "encanamento", "hidráulica", "esgoto", "água fria", "água quente"],
    missingKeywords: ["conexão", "joelho", "luva", "registro", "cap", "curva"],
    message: "🔧 Detectamos serviços hidráulicos sem conexões (joelhos, luvas, registros). As conexões representam 20~30% do material hidráulico e são frequentemente esquecidas. Deseja incluí-las?",
    suggestions: [
      { id: "cs_conexao", ref: "SINAPI-8990", description: "Kit de conexões PVC para tubulação de água fria (joelhos, luvas, tês)", unit: "un", qty: 1, unitPrice: 85.0, tipo: "material", aiGenerated: true },
      { id: "cs_registro", ref: "SINAPI-9020", description: "Registro de gaveta para água fria - 3/4\"", unit: "un", qty: 2, unitPrice: 45.0, tipo: "material", aiGenerated: true },
    ]
  },
  {
    id: "rule_eletrica_disjuntor",
    triggerKeywords: ["fio", "cabo", "eletroduto", "tomada", "interruptor", "elétrica"],
    missingKeywords: ["disjuntor", "quadro", "eletricista"],
    message: "⚡ Identificamos materiais elétricos, mas sem proteção de circuito (disjuntores/quadro) ou mão de obra especializada. Por norma (NBR 5410), todo circuito precisa de disjuntor. Deseja incluir?",
    suggestions: [
      { id: "cs_disjuntor", ref: "SINAPI-9120", description: "Disjuntor unipolar 16A - fornecimento e instalação", unit: "un", qty: 4, unitPrice: 22.0, tipo: "material", aiGenerated: true },
      { id: "cs_eletricista", ref: "SINFRA-C-08", description: "Eletricista com Encargos Complementares", unit: "h", qty: 16, unitPrice: 22.4, tipo: "mao_de_obra", aiGenerated: true },
    ]
  },

  // ─── DEMOLIÇÃO & LIMPEZA ─────────────────────────────────
  {
    id: "rule_demolicao_entulho",
    triggerKeywords: ["demolição", "quebra", "remoção de piso", "retirada"],
    missingKeywords: ["entulho", "transporte de entulho", "caçamba"],
    message: "🗑️ Adicionou serviços de demolição sem prever o descarte do entulho. O transporte e descarte são regulamentados e têm custo significativo. Deseja incluir?",
    suggestions: [
      { id: "cs_entulho", ref: "SINAPI-87251", description: "Remoção e transporte de entulho - até 1km", unit: "m³", qty: 3, unitPrice: 42.0, tipo: "mao_de_obra", aiGenerated: true },
    ]
  },

  // ─── COBERTURA ────────────────────────────────────────────
  {
    id: "rule_telha_cumeeira",
    triggerKeywords: ["telha", "cobertura", "telhado", "rufos"],
    missingKeywords: ["cumeeira", "calha", "rufo"],
    message: "🏠 Detectamos cobertura/telhado sem cumeeira, calhas ou rufos. Esses acabamentos impedem infiltrações — são obrigatórios por boa prática. Deseja incluir?",
    suggestions: [
      { id: "cs_cumeeira", ref: "SINAPI-7780", description: "Cumeeira cerâmica - fornec e assentamento", unit: "m", qty: 6, unitPrice: 28.0, tipo: "mao_de_obra", aiGenerated: true },
      { id: "cs_calha", ref: "SINAPI-7781", description: "Calha de PVC 125mm - fornecimento e instalação", unit: "m", qty: 12, unitPrice: 35.0, tipo: "material", aiGenerated: true },
    ]
  },
]

interface Props {
  items: BudgetItem[]
  onAcceptSuggestions: (newItems: BudgetItem[]) => void
}

export function AiCrossSellBanner({ items, onAcceptSuggestions }: Props) {
  const [activeRule, setActiveRule] = useState<CrossSellRule | null>(null)
  const [dismissedRules, setDismissedRules] = useState<string[]>([])

  // Engine: Observa a tabela buscando combinações lógicas para sugerir faltantes
  useEffect(() => {
    const matchedRule = CROSS_SELL_RULES.find(rule => {
      if (dismissedRules.includes(rule.id)) return false

      const hasTrigger = items.some(i => {
        const desc = i.description.toLowerCase()
        return rule.triggerKeywords.some(kw => desc.includes(kw))
      })

      // Verifica se nenhum item existente cobre a lacuna (oposto: se NÃO tem a palavra)
      const lacunaPreenchida = items.some(i => {
        const desc = i.description.toLowerCase()
        return rule.missingKeywords.some(kw => desc.includes(kw))
      })

      return hasTrigger && !lacunaPreenchida
    })

    setActiveRule(matchedRule || null)
  }, [items, dismissedRules])

  if (!activeRule) return null

  const handleAccept = () => {
    onAcceptSuggestions(activeRule.suggestions)
    setDismissedRules(prev => [...prev, activeRule.id])
    setActiveRule(null)
  }

  const handleDismiss = () => {
    setDismissedRules(prev => [...prev, activeRule.id])
    setActiveRule(null)
  }

  return (
    <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-4 md:p-5 shadow-sm fade-in-up">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="bg-amber-100 p-2.5 rounded-full text-amber-600 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-3.5 w-full pt-1">
          <div>
            <p className="text-sm font-semibold text-amber-950 leading-snug flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Alerta de Orçamento: Insumo Correlato Detectado
            </p>
            <p className="text-xs text-amber-800/80 mt-1 max-w-xl leading-relaxed">
              {activeRule.message}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeRule.suggestions.map((i) => (
              <span key={i.id} className="px-2.5 py-1 bg-white border border-amber-100/60 text-amber-800 text-[10px] sm:text-xs rounded-md font-medium shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                <span className="font-mono text-amber-500 text-[9px]">{i.ref}</span>
                {i.description.slice(0, 38)}...
                <span className="text-amber-400 font-medium">
                  {i.unitPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}/{i.unit}
                </span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Button size="sm" onClick={handleAccept} className="bg-amber-500 hover:bg-amber-600 text-white shadow-sm h-8 rounded-lg gap-1.5">
              <Sparkles className="w-3 h-3" />
              Adicionar ao Orçamento
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDismiss} className="text-amber-800 hover:text-amber-950 hover:bg-amber-100/50 h-8 rounded-lg">
              Ignorar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
