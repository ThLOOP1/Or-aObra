"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, User, Calendar } from "lucide-react"

interface Props {
  projectName: string
  clientName: string
  date: string
  onChange: (field: string, value: string) => void
}

export function ProjectHeaderCard({ projectName, clientName, date, onChange }: Props) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          Dados do Projeto
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="project-name" className="text-sm font-medium">
            Nome da Obra / Projeto
          </Label>
          <Input
            id="project-name"
            placeholder="Ex: Reforma Banheiro Apto 302 – Bloco B"
            value={projectName}
            onChange={(e) => onChange("projectName", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="client-name" className="text-sm font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              Nome do Cliente
            </Label>
            <Input
              id="client-name"
              placeholder="Ex: Maria Oliveira"
              value={clientName}
              onChange={(e) => onChange("clientName", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="date" className="text-sm font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              Data do Orçamento
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => onChange("date", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
