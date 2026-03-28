"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MessageCircle, Mail, Phone, Building2 } from "lucide-react"

interface Cliente {
  id: string
  nome: string
  tipo: "PJ" | "PF"
  documento: string
  telefone: string
  email: string
  totalOrcado: number
  orcamentos: number
}

const CLIENTES: Cliente[] = [
  {
    id: "1",
    nome: "Prefeitura de São Luís",
    tipo: "PJ",
    documento: "06.223.633/0001-29",
    telefone: "(98) 3214-7000",
    email: "licitacoes@saoluis.ma.gov.br",
    totalOrcado: 460473.52,
    orcamentos: 4,
  },
  {
    id: "2",
    nome: "SINFRA-MA",
    tipo: "PJ",
    documento: "08.761.543/0001-10",
    telefone: "(98) 3269-8000",
    email: "engenharia@sinfra.ma.gov.br",
    totalOrcado: 348920.00,
    orcamentos: 2,
  },
  {
    id: "3",
    nome: "CAEMA",
    tipo: "PJ",
    documento: "06.300.681/0001-93",
    telefone: "(98) 3217-6200",
    email: "obras@caema.ma.gov.br",
    totalOrcado: 48320.00,
    orcamentos: 1,
  },
  {
    id: "4",
    nome: "IFMA – Bacabal",
    tipo: "PJ",
    documento: "10.735.145/0001-72",
    telefone: "(99) 3321-4566",
    email: "infraestrutura@ifma.edu.br",
    totalOrcado: 53640.00,
    orcamentos: 1,
  },
  {
    id: "5",
    nome: "Secretaria de Saúde MA",
    tipo: "PJ",
    documento: "06.528.872/0001-50",
    telefone: "(98) 3213-7500",
    email: "obras@saude.ma.gov.br",
    totalOrcado: 87540.00,
    orcamentos: 1,
  },
  {
    id: "6",
    nome: "Cond. Vila Embratel",
    tipo: "PJ",
    documento: "12.345.678/0001-00",
    telefone: "(98) 98765-4321",
    email: "sindico@vilaembratel.com.br",
    totalOrcado: 67800.00,
    orcamentos: 1,
  },
  {
    id: "7",
    nome: "Prefeitura de Imperatriz",
    tipo: "PJ",
    documento: "06.223.901/0001-45",
    telefone: "(99) 3529-7000",
    email: "obras@imperatriz.ma.gov.br",
    totalOrcado: 195300.00,
    orcamentos: 1,
  },
  {
    id: "8",
    nome: "Maria Oliveira",
    tipo: "PF",
    documento: "012.345.678-90",
    telefone: "(98) 99810-3344",
    email: "m.oliveira@email.com",
    totalOrcado: 9870.75,
    orcamentos: 1,
  },
]

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 })
}

function whatsappLink(telefone: string) {
  const num = telefone.replace(/\D/g, "")
  return `https://wa.me/55${num}`
}

export function ScreenClientes() {
  return (
    <div className="p-4 md:p-6 space-y-5 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-foreground">Gestão de Clientes</h2>
          <p className="text-sm text-muted-foreground">Mini CRM com histórico de orçamentos por cliente.</p>
        </div>
        <Button size="sm" className="gap-1.5 text-sm h-9">
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {CLIENTES.map((c) => (
          <Card key={c.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground leading-tight truncate">{c.nome}</p>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 shrink-0 font-mono">
                      {c.tipo}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{c.documento}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs text-foreground font-mono">{c.telefone}</span>
                  <a
                    href={whatsappLink(c.telefone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1 text-[10px] text-primary font-medium hover:underline"
                    title="Abrir WhatsApp"
                  >
                    <MessageCircle className="w-3 h-3" />
                    WhatsApp
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs text-foreground truncate">{c.email}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Total Orçado</p>
                  <p className="text-base font-bold text-primary font-mono">{formatCurrency(c.totalOrcado)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Orçamentos</p>
                  <p className="text-base font-bold text-foreground">{c.orcamentos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
