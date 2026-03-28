"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, FileText, CheckCircle, Percent, Clock } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const chartData = [
  { mes: "Out", projetado: 92000, realizado: 78000 },
  { mes: "Nov", projetado: 115000, realizado: 110000 },
  { mes: "Dez", projetado: 98000, realizado: 95000 },
  { mes: "Jan", projetado: 130000, realizado: 121000 },
  { mes: "Fev", projetado: 142000, realizado: 138000 },
  { mes: "Mar", projetado: 155000, realizado: 145000 },
]

const activities = [
  { icon: CheckCircle, color: "text-primary", text: 'Orçamento #104 aprovado por João Silva — Prefeitura de São Luís', time: "há 2h" },
  { icon: FileText, color: "text-muted-foreground", text: 'Novo rascunho criado: Reforma Escola Vovó Vitorina', time: "há 5h" },
  { icon: CheckCircle, color: "text-primary", text: 'Orçamento #101 aprovado — CAEMA · R$ 48.320,00', time: "ontem" },
  { icon: FileText, color: "text-muted-foreground", text: 'Proposta #106 enviada para SINFRA-MA', time: "ontem" },
  { icon: Clock, color: "text-yellow-600", text: 'Orçamento #103 aguardando retorno do cliente há 7 dias', time: "2 dias" },
]

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 })
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; fill: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-md text-sm">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.fill }} className="font-mono">
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ScreenDashboard() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Top cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Aprovados (Mês)</p>
                <p className="text-2xl font-bold text-foreground mt-1 font-mono">R$ 145k</p>
                <p className="text-xs text-primary font-medium mt-1">+12% vs. mês anterior</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <LineChart className="w-4.5 h-4.5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Propostas Enviadas</p>
                <p className="text-2xl font-bold text-foreground mt-1 font-mono">12</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">neste trimestre</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <FileText className="w-4.5 h-4.5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-foreground mt-1 font-mono">65%</p>
                <p className="text-xs text-primary font-medium mt-1">8 de 12 aprovadas</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <CheckCircle className="w-4.5 h-4.5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">BDI Médio Praticado</p>
                <p className="text-2xl font-bold text-foreground mt-1 font-mono">26,68%</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">conforme SINAPI</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <Percent className="w-4.5 h-4.5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Receita Projetada vs. Realizada (6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={(v: number) => `R$ ${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={72}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="projetado" name="Projetado" fill="var(--border)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="realizado" name="Realizado" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {activities.map((act, i) => (
                <li key={i} className="flex items-start gap-3 px-5 py-3.5">
                  <act.icon className={`w-4 h-4 mt-0.5 shrink-0 ${act.color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground leading-snug">{act.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{act.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
