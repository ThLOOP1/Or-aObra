"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, Lightbulb } from "lucide-react"

interface Props {
  onProcess: (description: string) => void
  isProcessing: boolean
}

export function AiInputCard({ onProcess, isProcessing }: Props) {
  const [description, setDescription] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          <Sparkles className="w-4 h-4 text-primary" />
          Entrada Inteligente com IA
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/60 border border-accent text-xs text-accent-foreground">
          <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
          <span>
            Descreva a obra em linguagem natural ou cole o pedido do cliente. A IA irá extrair e estruturar os
            itens do orçamento automaticamente.
          </span>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="ai-description" className="text-sm font-medium">
            Descreva a Obra ou Cole o Pedido do Cliente
          </label>
          <Textarea
            id="ai-description"
            className={`resize-none text-sm leading-relaxed transition-all duration-300 ease-in-out ${
              isFocused || description.trim().length > 0 ? "min-h-[240px]" : "min-h-[80px]"
            }`}
            placeholder="Ex: Preciso reformar um banheiro de 5m². Trocar piso..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        <Button
          className="w-full gap-2 font-semibold"
          onClick={() => onProcess(description)}
          disabled={isProcessing || description.trim().length < 10}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analisando projeto...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Processar com IA
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
