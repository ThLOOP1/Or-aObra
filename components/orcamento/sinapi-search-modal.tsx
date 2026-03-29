"use client"

import { useState, useCallback, useEffect } from "react"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Package, Wrench } from "lucide-react"
import { SINAPI_MOCK, SINFRA_MOCK, ORSE_MOCK, type ReferenciaItem } from "@/data/bases_mock"
import type { BudgetItem, ItemTipo } from "@/components/orcamento/budget-table"
import { cn } from "@/lib/utils"

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  isDesonerado: boolean
  onAddItem: (item: BudgetItem) => void
}

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function SinapiSearchModal({ open, onOpenChange, isDesonerado, onAddItem }: Props) {
  const [query, setQuery] = useState("")
  const [baseName, setBaseName] = useState("SINAPI")
  const [activeBase, setActiveBase] = useState<ReferenciaItem[]>([])
  const [personalItems, setPersonalItems] = useState<BudgetItem[]>([])

  // Load active base and personal items on open
  useEffect(() => {
    if (open) {
      // 1. Load government base
      const savedBase = localStorage.getItem("orcapro_base_ativa") || "sinapi"
      if (savedBase === "caema") {
        setActiveBase(SINFRA_MOCK)
        setBaseName("SINFRA-MA")
      } else if (savedBase === "sicro") {
        setActiveBase(ORSE_MOCK)
        setBaseName("ORSE")
      } else {
        setActiveBase(SINAPI_MOCK)
        setBaseName("SINAPI")
      }

      // 2. Load personal items from "Meu Banco"
      try {
        const savedPersonal = localStorage.getItem("orcapro_banco_proprio")
        if (savedPersonal) {
          setPersonalItems(JSON.parse(savedPersonal))
        } else {
          setPersonalItems([])
        }
      } catch (e) {
        console.error("Erro ao carregar itens pessoais na busca", e)
      }
    }
  }, [open])

  // Filtra por código ou descrição (case insensitive, normalizado)
  const filteredGov = query.trim().length === 0
    ? activeBase
    : activeBase.filter((item) => {
        const q = query.toLowerCase()
        return (
          item.codigo.toLowerCase().includes(q) ||
          item.descricao.toLowerCase().includes(q)
        )
      })

  const filteredPersonal = query.trim().length === 0
    ? personalItems
    : personalItems.filter((item) => {
        const q = query.toLowerCase()
        return (
          item.ref.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
        )
      })

  // Agrupa para exibição
  const materiais = [
    ...filteredPersonal.filter((i) => i.tipo === "material").map(i => ({
      codigo: i.ref,
      descricao: i.description,
      unidade: i.unit,
      tipo: "material",
      preco_desonerado: i.unitPrice,
      preco_nao_desonerado: i.unitPrice,
      isPersonal: true
    })),
    ...filteredGov.filter((i) => i.tipo === "material")
  ]
  const maoDeObra = [
    ...filteredPersonal.filter((i) => i.tipo === "mao_de_obra").map(i => ({
      codigo: i.ref,
      descricao: i.description,
      unidade: i.unit,
      tipo: "mao_de_obra",
      preco_desonerado: i.unitPrice,
      preco_nao_desonerado: i.unitPrice,
      isPersonal: true
    })),
    ...filteredGov.filter((i) => i.tipo === "mao_de_obra")
  ]

  const handleSelect = useCallback((sinapiItem: any) => {
    const price = isDesonerado
      ? sinapiItem.preco_desonerado
      : sinapiItem.preco_nao_desonerado

    const newItem: BudgetItem = {
      id: generateId(),
      ref: sinapiItem.isPersonal ? sinapiItem.codigo : `${baseName}-${sinapiItem.codigo}`,
      description: sinapiItem.descricao,
      unit: sinapiItem.unidade,
      qty: 1,
      unitPrice: price,
      tipo: sinapiItem.tipo as ItemTipo,
      sinapiCodigo: sinapiItem.isPersonal ? undefined : sinapiItem.codigo,
      aiGenerated: false,
      personalItem: sinapiItem.isPersonal
    }

    onAddItem(newItem)
    setQuery("")
    onOpenChange(false)
  }, [isDesonerado, onAddItem, onOpenChange, baseName])

  const priceLabel = isDesonerado ? "Desonerado" : "Não Desonerado"

  return (
    <CommandDialog
      open={open}
      onOpenChange={(v: boolean) => {
        onOpenChange(v)
        if (!v) setQuery("")
      }}
      title={`Buscar em ${baseName}`}
      description={`Pesquise por código ou descrição na base ${baseName}`}
    >
      {/* Regime badge no topo */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-1">
        <span className="text-xs text-muted-foreground">Regime:</span>
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] px-2 py-0 h-5 font-semibold",
            isDesonerado
              ? "bg-primary/10 text-primary border-primary/30"
              : "bg-orange-50 text-orange-700 border-orange-300"
          )}
        >
          {priceLabel}
        </Badge>
        <span className="text-xs text-muted-foreground ml-auto mr-6">
          Preços em {priceLabel.toLowerCase()}
        </span>
      </div>

      <CommandInput
        placeholder="Buscar por código ou descrição (ex: cimento, 88309)..."
        value={query}
        onValueChange={setQuery}
      />

      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground">
            <span className="text-2xl">🔍</span>
            <p className="text-sm font-medium">Nenhum item encontrado</p>
            <p className="text-xs">Tente buscar por código (ex: 88309) ou descrição (ex: pedreiro)</p>
          </div>
        </CommandEmpty>

        {/* Grupo: Mão de Obra */}
        {maoDeObra.length > 0 && (
          <CommandGroup
            heading={
              <span className="flex items-center gap-1.5 text-amber-700">
                <Wrench className="w-3 h-3" />
                Mão de Obra
              </span>
            }
          >
            {maoDeObra.map((item: any) => {
              const price = isDesonerado ? item.preco_desonerado : item.preco_nao_desonerado
              return (
                <CommandItem
                  key={item.codigo}
                  value={`${item.codigo} ${item.descricao}`}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center gap-3 py-2.5 cursor-pointer"
                >
                  <Wrench className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground shrink-0">
                        {item.codigo}
                      </span>
                      <span className="text-sm font-medium text-foreground leading-tight truncate">
                         {item.isPersonal ? (
                           <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded-sm mr-1.5 font-bold tracking-tight border border-emerald-200">[MEU BANCO]</span>
                         ) : (
                           <span className="text-[10px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded-sm mr-1.5 font-bold tracking-tight">[{baseName}]</span>
                         )}
                        {item.descricao}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      Unidade: {item.unidade}
                    </span>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-amber-700">
                      {formatCurrency(price)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">por {item.unidade}</p>
                  </div>
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}

        {/* Grupo: Materiais */}
        {materiais.length > 0 && (
          <CommandGroup
            heading={
              <span className="flex items-center gap-1.5 text-blue-700">
                <Package className="w-3 h-3" />
                Materiais
              </span>
            }
          >
            {materiais.map((item: any) => {
              const price = isDesonerado ? item.preco_desonerado : item.preco_nao_desonerado
              return (
                <CommandItem
                  key={item.codigo}
                  value={`${item.codigo} ${item.descricao}`}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center gap-3 py-2.5 cursor-pointer"
                >
                  <Package className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground shrink-0">
                        {item.codigo}
                      </span>
                      <span className="text-sm font-medium text-foreground leading-tight truncate">
                        {item.isPersonal ? (
                           <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded-sm mr-1.5 font-bold tracking-tight border border-emerald-200">[MEU BANCO]</span>
                         ) : (
                           <span className="text-[10px] bg-blue-100 text-blue-800 px-1 py-0.5 rounded-sm mr-1.5 font-bold tracking-tight">[{baseName}]</span>
                         )}
                        {item.descricao}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      Unidade: {item.unidade}
                    </span>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-blue-700">
                      {formatCurrency(price)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">por {item.unidade}</p>
                  </div>
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}
      </CommandList>

      {/* Footer informativo */}
      <div className="border-t px-3 py-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {filteredGov.length + filteredPersonal.length} item{filteredGov.length + filteredPersonal.length !== 1 ? "s" : ""} disponível{filteredGov.length + filteredPersonal.length !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-muted rounded text-[9px]">↑↓</kbd> navegar
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-muted rounded text-[9px]">↵</kbd> adicionar
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-muted rounded text-[9px]">Esc</kbd> fechar
          </span>
        </div>
      </div>
    </CommandDialog>
  )
}
