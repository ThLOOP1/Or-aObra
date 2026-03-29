import { SINAPI_MOCK, type SinapiItem } from "./sinapi_mock"

// Reaproveitamos o tipo base para todas as listas
export type { SinapiItem as ReferenciaItem }

// ── Base Principal SINAPI ──
export { SINAPI_MOCK }

// ── Base de Saneamento: CAEMA (Maranhão) ──
export const CAEMA_MOCK: SinapiItem[] = [
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

// ── Base de Rodovias: SICRO (Federal) ──
export const SICRO_MOCK: SinapiItem[] = [
  {
    codigo: "S-01",
    descricao: "Concreto Asfáltico Usinado a Quente (CAUQ) - Faixa C",
    unidade: "T",
    tipo: "material",
    preco_desonerado: 350.00,
    preco_nao_desonerado: 350.00,
  },
  {
    codigo: "S-02",
    descricao: "Escavação mecânica de vala perfil retangular",
    unidade: "M3",
    tipo: "mao_de_obra",
    preco_desonerado: 15.00,
    preco_nao_desonerado: 18.00,
  },
  {
    codigo: "S-03",
    descricao: "Sinalização horizontal com tinta acrílica",
    unidade: "M2",
    tipo: "mao_de_obra",
    preco_desonerado: 22.00,
    preco_nao_desonerado: 25.50,
  }
]
