import { SINAPI_MOCK, type SinapiItem } from "./sinapi_mock"

// Reaproveitamos o tipo base para todas as listas
export type { SinapiItem as ReferenciaItem }

// ── Base Principal SINAPI ──
export { SINAPI_MOCK }

// ── Base Principal SINFRA-MA (Infraestrutura) ──
export const SINFRA_MOCK: SinapiItem[] = [
  {
    codigo: "C-01",
    descricao: "Tubo PVC Defofo Água 100mm",
    unidade: "M",
    tipo: "material",
    preco_desonerado: 45.00,
    preco_nao_desonerado: 45.00,
  },
  {
    codigo: "C-02",
    descricao: "Instalação de Hidrômetro 1/2\"",
    unidade: "UN",
    tipo: "mao_de_obra",
    preco_desonerado: 120.00,
    preco_nao_desonerado: 140.00,
  },
  {
    codigo: "C-03",
    descricao: "Ligação Predial de Esgoto com PVC 100mm",
    unidade: "UN",
    tipo: "mao_de_obra",
    preco_desonerado: 250.00,
    preco_nao_desonerado: 280.00,
  }
]

// ── Base Regional Nordeste: ORSE (Regional) ──
export const ORSE_MOCK: SinapiItem[] = [
  {
    codigo: "O-01",
    descricao: "Revestimento Cerâmico 40x40 - Piso",
    unidade: "M2",
    tipo: "material",
    preco_desonerado: 28.50,
    preco_nao_desonerado: 28.50,
  },
  {
    codigo: "O-02",
    descricao: "Azulejista para revestimento cerâmico",
    unidade: "H",
    tipo: "mao_de_obra",
    preco_desonerado: 24.00,
    preco_nao_desonerado: 28.00,
  },
  {
    codigo: "O-03",
    descricao: "Cimento CP-II sacola de 50kg",
    unidade: "SC",
    tipo: "material",
    preco_desonerado: 38.00,
    preco_nao_desonerado: 38.00,
  }
]
