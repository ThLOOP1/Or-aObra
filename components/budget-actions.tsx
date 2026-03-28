"use client"

import { Button } from "@/components/ui/button"
import { Save, FileDown, CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface Props {
  onSave: () => void
  onGeneratePdf: () => void
  saved: boolean
}

export function BudgetActions({ onSave, onGeneratePdf, saved }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
      >
        <FileDown className="w-4 h-4" />
        Gerar PDF Profissional
      </Button>
    </div>
  )
}
