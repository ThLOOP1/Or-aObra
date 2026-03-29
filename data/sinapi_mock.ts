import type { ItemTipo } from "@/components/orcamento/budget-table"

export interface SinapiItem {
  codigo: string
  descricao: string
  unidade: string
  tipo: ItemTipo
  preco_desonerado: number
  preco_nao_desonerado: number
}

export const SINAPI_MOCK: SinapiItem[] = [
  // ── Mão de Obra ──
  {
    codigo: "88316",
    descricao: "SERVENTE COM ENCARGOS COMPLEMENTARES",
    unidade: "H",
    tipo: "mao_de_obra",
    preco_desonerado: 18.50,
    preco_nao_desonerado: 21.30,
  },
  {
    codigo: "88309",
    descricao: "PEDREIRO COM ENCARGOS COMPLEMENTARES",
    unidade: "H",
    tipo: "mao_de_obra",
    preco_desonerado: 23.10,
    preco_nao_desonerado: 26.80,
  },
  {
    codigo: "88262",
    descricao: "ENCANADOR OU BOMBEIRO HIDRÁULICO COM ENCARGOS COMPLEMENTARES",
    unidade: "H",
    tipo: "mao_de_obra",
    preco_desonerado: 27.40,
    preco_nao_desonerado: 31.60,
  },
  {
    codigo: "88267",
    descricao: "ELETRICISTA COM ENCARGOS COMPLEMENTARES",
    unidade: "H",
    tipo: "mao_de_obra",
    preco_desonerado: 26.10,
    preco_nao_desonerado: 30.20,
  },
  {
    codigo: "88246",
    descricao: "CARPINTEIRO DE OBRAS COM ENCARGOS COMPLEMENTARES",
    unidade: "H",
    tipo: "mao_de_obra",
    preco_desonerado: 25.60,
    preco_nao_desonerado: 29.70,
  },
  {
    codigo: "88239",
    descricao: "ARMADOR COM ENCARGOS COMPLEMENTARES",
    unidade: "H",
    tipo: "mao_de_obra",
    preco_desonerado: 24.80,
    preco_nao_desonerado: 28.60,
  },
  {
    codigo: "88252",
    descricao: "AZULEJISTA OU LADRILHEIRO COM ENCARGOS COMPLEMENTARES",
    unidade: "H",
    tipo: "mao_de_obra",
    preco_desonerado: 24.20,
    preco_nao_desonerado: 28.00,
  },
  {
    codigo: "88248",
    descricao: "PINTOR DE OBRAS COM ENCARGOS COMPLEMENTARES",
    unidade: "H",
    tipo: "mao_de_obra",
    preco_desonerado: 22.30,
    preco_nao_desonerado: 25.70,
  },

  // ── Materiais ──
  {
    codigo: "00001379",
    descricao: "CIMENTO PORTLAND COMPOSTO CP II-32",
    unidade: "KG",
    tipo: "material",
    preco_desonerado: 0.85,
    preco_nao_desonerado: 0.85,
  },
  {
    codigo: "00000370",
    descricao: "AREIA MÉDIA - POSTO JAZIDA/FORNECEDOR",
    unidade: "M3",
    tipo: "material",
    preco_desonerado: 85.00,
    preco_nao_desonerado: 85.00,
  },
  {
    codigo: "87251",
    descricao: "REVESTIMENTO CERÂMICO PARA PAREDES INTERNAS, VIA ÚMIDA, ASSENTADO c/ ARG. COLANTE",
    unidade: "M2",
    tipo: "material",
    preco_desonerado: 45.20,
    preco_nao_desonerado: 45.20,
  },
  {
    codigo: "00001386",
    descricao: "ARGAMASSA COLANTE INDUSTRIALIZADA AC I",
    unidade: "KG",
    tipo: "material",
    preco_desonerado: 0.95,
    preco_nao_desonerado: 0.95,
  },
  {
    codigo: "00043950",
    descricao: "PORCELANATO POLIDO, 60X60 CM (VARIA POR FORNECEDOR)",
    unidade: "M2",
    tipo: "material",
    preco_desonerado: 78.00,
    preco_nao_desonerado: 78.00,
  },
  {
    codigo: "00006162",
    descricao: "TIJOLO CERÂMICO FURADO 9X19X29 CM (TIJOLO 6 FUROS)",
    unidade: "UN",
    tipo: "material",
    preco_desonerado: 0.68,
    preco_nao_desonerado: 0.68,
  },
  {
    codigo: "00034001",
    descricao: "VERGALHÃO AÇO CA-50, BITOLA 10,0MM",
    unidade: "KG",
    tipo: "material",
    preco_desonerado: 7.20,
    preco_nao_desonerado: 7.20,
  },
  {
    codigo: "00040279",
    descricao: "TUBO PVC SOLDÁVEL DN 25 MM (3/4\") ÁGUA FRIA",
    unidade: "M",
    tipo: "material",
    preco_desonerado: 5.40,
    preco_nao_desonerado: 5.40,
  },
  {
    codigo: "00034132",
    descricao: "TINTA ACRÍLICA PREMIUM FOSCA CORES - LATA 18L",
    unidade: "L",
    tipo: "material",
    preco_desonerado: 12.30,
    preco_nao_desonerado: 12.30,
  },
  {
    codigo: "00038070",
    descricao: "VASO SANITÁRIO COM CAIXA ACOPLADA LOUÇA BRANCA",
    unidade: "UN",
    tipo: "material",
    preco_desonerado: 380.00,
    preco_nao_desonerado: 380.00,
  },
  {
    codigo: "00026450",
    descricao: "BRITA 1 (9,5 A 19 MM) POSTO PEDREIRA/FORNECEDOR",
    unidade: "M3",
    tipo: "material",
    preco_desonerado: 115.00,
    preco_nao_desonerado: 115.00,
  },
  {
    codigo: "00034692",
    descricao: "CONCRETO USINADO BOMBEÁVEL FCK 25 MPA",
    unidade: "M3",
    tipo: "material",
    preco_desonerado: 380.00,
    preco_nao_desonerado: 380.00,
  },
]
