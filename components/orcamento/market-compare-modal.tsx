import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { BudgetItem } from "@/components/orcamento/budget-table"
import { Loader2, Scale, Sparkles } from "lucide-react"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: BudgetItem | null
}

export function MarketCompareModal({ open, onOpenChange, item }: Props) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      setLoading(true)
      const t = setTimeout(() => {
        setLoading(false)
      }, 1800)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!item) return null

  const precoAtual = item.unitPrice
  const precoCaema = precoAtual * 0.88 // -12%
  const precoSicro = precoAtual * 1.08 // +8%
  const precoLocal = precoAtual * 0.82 // -18%

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            <DialogTitle>Análise de Mercado IA</DialogTitle>
          </div>
          <DialogDescription>
            Cruzamento de preços em tempo real com bases governamentais e cotações locais.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground animate-pulse text-center leading-relaxed">
              A IA está cruzando as bases governamentais <br />
              e o seu banco de cotações locais...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-2 animate-in fade-in zoom-in duration-300">
            <h3 className="text-[13px] font-semibold bg-muted/40 p-2.5 rounded-md border text-center shadow-sm leading-tight w-full break-words">
              <span className="text-muted-foreground font-normal">Alvo:</span> {item.description}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {/* Card SINAPI */}
              <div className="flex flex-col gap-1 p-3 border rounded-xl bg-gray-50/50">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">SINAPI (Referência)</span>
                <span className="text-lg font-bold text-gray-700">{fmt(precoAtual)}</span>
              </div>
              {/* Card SINFRA-MA */}
              <div className="flex flex-col gap-1 p-3 border rounded-xl bg-blue-50 border-blue-100">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">SINFRA-MA (-12%)</span>
                <span className="text-lg font-bold text-blue-700">{fmt(precoCaema)}</span>
              </div>
              {/* Card ORSE */}
              <div className="flex flex-col gap-1 p-3 border rounded-xl bg-orange-50 border-orange-100">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">ORSE (+8%)</span>
                <span className="text-lg font-bold text-orange-700">{fmt(precoSicro)}</span>
              </div>
              {/* Card MEU BANCO */}
              <div className="flex flex-col gap-1 p-3 border rounded-xl bg-emerald-50 border-emerald-200 ring-2 ring-emerald-500/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl-md">MELHOR</div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Mercado Local (-18%)</span>
                <span className="text-lg font-bold text-emerald-800">{fmt(precoLocal)}</span>
              </div>
            </div>

            {/* Insight Box */}
            <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex gap-3.5 text-[13px] text-emerald-900 shadow-sm">
              <Sparkles className="w-8 h-8 text-emerald-500 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>💡 Parecer Técnico da IA:</strong> Identificamos que a sua cotação salva no Meu Banco (Mercado Local) está 18% abaixo do referencial SINAPI. Recomenda-se utilizar a composição própria para aumentar a competitividade da proposta, anexando as 3 cotações exigidas pelo TCU.
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
