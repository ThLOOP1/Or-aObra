"use client"

import { Button } from "@/components/ui/button"
import { Save, FileDown, CheckCircle2, Loader2, Sheet } from "lucide-react"

interface Props {
  onSave: () => void
  onGeneratePdf: () => void
  onExportCsv: () => void
  saved: boolean
  isGeneratingPdf?: boolean
}

export function BudgetActions({ onSave, onGeneratePdf, onExportCsv, saved, isGeneratingPdf = false }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
      <Button
        variant="outline"
        className="flex-1 gap-2 font-medium"
        onClick={onSave}
      >
        {saved ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Rascunho Salvo
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Salvar Rascunho
          </>
        )}
      </Button>
      <Button
        className="flex-1 gap-2 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow"
        onClick={onGeneratePdf}
        disabled={isGeneratingPdf}
      >
        {isGeneratingPdf ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Gerando PDF...
          </>
        ) : (
          <>
            <FileDown className="w-4 h-4" />
            Gerar PDF
          </>
        )}
      </Button>
      <Button
        variant="outline"
        className="flex-1 gap-2 font-semibold text-green-700 hover:text-green-800 hover:bg-green-50 border-green-200"
        onClick={onExportCsv}
      >
        <Sheet className="w-4 h-4" />
        Exportar CSV
      </Button>
    </div>
  )
}
