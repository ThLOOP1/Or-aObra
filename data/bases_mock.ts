import { SINAPI_MOCK, type SinapiItem } from "./sinapi_mock"

// Reaproveitamos o tipo base para todas as listas
export type { SinapiItem as ReferenciaItem }

// ── Base Principal SINAPI ──
export { SINAPI_MOCK }

// ── Base Principal SINFRA-MA (Infraestrutura e Edificações Públicas) ──
export const SINFRA_MOCK: SinapiItem[] = [

  // Mão de Obra
  { codigo: "C-02", descricao: "Instalação de Hidrômetro 1/2\"", unidade: "un", tipo: "mao_de_obra", preco_desonerado: 120.00, preco_nao_desonerado: 140.00 },
  { codigo: "C-03", descricao: "Ligação Predial de Esgoto com PVC 100mm", unidade: "un", tipo: "mao_de_obra", preco_desonerado: 250.00, preco_nao_desonerado: 280.00 },
  { codigo: "C-06", descricao: "Pintura Látex Acrílica Externa - 2 Demãos", unidade: "m²", tipo: "mao_de_obra", preco_desonerado: 18.50, preco_nao_desonerado: 21.30 },
  { codigo: "C-08", descricao: "Eletricista com Encargos Complementares", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 22.40, preco_nao_desonerado: 26.80 },
  { codigo: "C-09", descricao: "Escavação Manual de Vala em Terra", unidade: "m³", tipo: "mao_de_obra", preco_desonerado: 45.00, preco_nao_desonerado: 52.00 },
  { codigo: "C-11", descricao: "Chapisco de Cimento e Areia para Paredes", unidade: "m²", tipo: "mao_de_obra", preco_desonerado: 8.50, preco_nao_desonerado: 9.80 },
  { codigo: "C-12", descricao: "Reboco Paulista (Emboço + Reboco) - Esp. 2,5cm", unidade: "m²", tipo: "mao_de_obra", preco_desonerado: 28.00, preco_nao_desonerado: 32.50 },
  { codigo: "C-13", descricao: "Camada de Regularização de Piso com Argamassa", unidade: "m²", tipo: "mao_de_obra", preco_desonerado: 22.00, preco_nao_desonerado: 25.00 },
  { codigo: "C-14", descricao: "Encanador com Encargos Complementares - Alta Complexidade", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 30.00, preco_nao_desonerado: 34.50 },
  { codigo: "C-15", descricao: "Servente de Obras com Encargos Complementares", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 18.50, preco_nao_desonerado: 21.30 },

  // Materiais – Estrutura e Concreto
  { codigo: "C-04", descricao: "Concreto Usinado Bombeavel Fck 25 MPa", unidade: "m³", tipo: "material", preco_desonerado: 410.00, preco_nao_desonerado: 410.00 },
  { codigo: "C-05", descricao: "Aço CA-50 10mm (Vergalhão) - Fornec e Cort", unidade: "kg", tipo: "material", preco_desonerado: 8.50, preco_nao_desonerado: 8.50 },
  { codigo: "C-16", descricao: "Brita 1 (9.5 a 19mm) - Fornecamento e Transporte", unidade: "m³", tipo: "material", preco_desonerado: 120.00, preco_nao_desonerado: 120.00 },
  { codigo: "C-17", descricao: "Areia Média - Posto Jazida com Transporte", unidade: "m³", tipo: "material", preco_desonerado: 95.00, preco_nao_desonerado: 95.00 },
  { codigo: "C-18", descricao: "Cimento Portland CP-II 50kg - com Frete", unidade: "sc", tipo: "material", preco_desonerado: 42.00, preco_nao_desonerado: 42.00 },

  // Materiais – Elétrica
  { codigo: "C-07", descricao: "Luminária de Teto LED 18W - Sobrepor", unidade: "un", tipo: "material", preco_desonerado: 35.90, preco_nao_desonerado: 35.90 },
  { codigo: "C-19", descricao: "Cabo Elétrico Flexível 2,5mm² (Rolo 100m)", unidade: "m", tipo: "material", preco_desonerado: 4.20, preco_nao_desonerado: 4.20 },
  { codigo: "C-20", descricao: "Eletroduto PVC Rígido 3/4 (25mm) - Barra 3m", unidade: "m", tipo: "material", preco_desonerado: 4.80, preco_nao_desonerado: 4.80 },
  { codigo: "C-21", descricao: "Disjuntor Unipolar 16A DIN - Curva C", unidade: "un", tipo: "material", preco_desonerado: 20.00, preco_nao_desonerado: 20.00 },
  { codigo: "C-22", descricao: "Quadro de Distribuição Elétrica 12 Circuitos Embutir", unidade: "un", tipo: "material", preco_desonerado: 195.00, preco_nao_desonerado: 195.00 },
  { codigo: "C-23", descricao: "Tomada 2P+T 10A Padrão NBR - Kit c/Placa", unidade: "un", tipo: "material", preco_desonerado: 15.00, preco_nao_desonerado: 15.00 },

  // Materiais – Hidrossanitário
  { codigo: "C-24", descricao: "Tubo PVC Soldável DN 25mm (Água Fria) - Barra 6m", unidade: "m", tipo: "material", preco_desonerado: 5.80, preco_nao_desonerado: 5.80 },
  { codigo: "C-25", descricao: "Tubo PVC Esgoto DN 100mm - Barra 6m", unidade: "m", tipo: "material", preco_desonerado: 15.50, preco_nao_desonerado: 15.50 },
  { codigo: "C-26", descricao: "Joelho 90° PVC Soldável 25mm - Água Fria", unidade: "un", tipo: "material", preco_desonerado: 3.20, preco_nao_desonerado: 3.20 },
  { codigo: "C-27", descricao: "Registro de Gaveta Metal 3/4\"", unidade: "un", tipo: "material", preco_desonerado: 42.00, preco_nao_desonerado: 42.00 },
  { codigo: "C-01", descricao: "Tubo PVC Defofo Água 100mm", unidade: "m", tipo: "material", preco_desonerado: 45.00, preco_nao_desonerado: 45.00 },
  { codigo: "C-28", descricao: "Tampa de Inspeção PVC 100mm para Esgoto", unidade: "un", tipo: "material", preco_desonerado: 18.00, preco_nao_desonerado: 18.00 },

  // Materiais – Cobertura
  { codigo: "C-10", descricao: "Telha Cerâmica Colonial - Fornecimento", unidade: "m²", tipo: "material", preco_desonerado: 32.00, preco_nao_desonerado: 32.00 },
  { codigo: "C-29", descricao: "Telha Fibrocimento Ondulada 6mm 110x244cm - S/Amianto", unidade: "m²", tipo: "material", preco_desonerado: 30.00, preco_nao_desonerado: 30.00 },
  { codigo: "C-30", descricao: "Cumeeira Cerâmica para Telha Colonial", unidade: "m", tipo: "material", preco_desonerado: 14.00, preco_nao_desonerado: 14.00 },
  { codigo: "C-31", descricao: "Calha PVC Meia Caña 125mm - Barra 3m", unidade: "m", tipo: "material", preco_desonerado: 34.00, preco_nao_desonerado: 34.00 },
]

// ── Base Regional Nordeste: ORSE (Edificações e Reformas) ──
export const ORSE_MOCK: SinapiItem[] = [

  // Mão de Obra
  { codigo: "O-02", descricao: "Azulejista para Revestimento Cerâmico", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 24.00, preco_nao_desonerado: 28.00 },
  { codigo: "O-07", descricao: "Pedreiro com Encargos Complementares", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 23.50, preco_nao_desonerado: 27.90 },
  { codigo: "O-08", descricao: "Servente de Obras com Encargos Complementares", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 17.80, preco_nao_desonerado: 20.50 },
  { codigo: "O-10", descricao: "Pintor com Encargos Complementares", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 23.00, preco_nao_desonerado: 27.20 },
  { codigo: "O-11", descricao: "Gesseiro com Encargos Complementares", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 23.80, preco_nao_desonerado: 27.50 },
  { codigo: "O-12", descricao: "Eletricista com Encargos Complementares", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 25.00, preco_nao_desonerado: 29.00 },
  { codigo: "O-13", descricao: "Encanador com Encargos Complementares", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 26.00, preco_nao_desonerado: 30.30 },
  { codigo: "O-14", descricao: "Carpinteiro de Obras com Encargos Complementares", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 25.00, preco_nao_desonerado: 28.80 },

  // Materiais – Alvenaria e Argamassas
  { codigo: "O-01", descricao: "Revestimento Cerâmico 40x40 - Piso", unidade: "m²", tipo: "material", preco_desonerado: 28.50, preco_nao_desonerado: 28.50 },
  { codigo: "O-03", descricao: "Cimento Portland CP-II (Saco de 50kg)", unidade: "sc", tipo: "material", preco_desonerado: 38.00, preco_nao_desonerado: 38.00 },
  { codigo: "O-04", descricao: "Argamassa Colante AC-II (Saco 20kg)", unidade: "sc", tipo: "material", preco_desonerado: 22.50, preco_nao_desonerado: 22.50 },
  { codigo: "O-05", descricao: "Rejunte Cimentício (Cores Claras) - Saco 1kg", unidade: "kg", tipo: "material", preco_desonerado: 5.80, preco_nao_desonerado: 5.80 },
  { codigo: "O-15", descricao: "Cal Hidratada CH-III (Saco 20kg)", unidade: "sc", tipo: "material", preco_desonerado: 18.00, preco_nao_desonerado: 18.00 },
  { codigo: "O-16", descricao: "Areia Média - Fornecimento e Transporte Nordeste", unidade: "m³", tipo: "material", preco_desonerado: 90.00, preco_nao_desonerado: 90.00 },
  { codigo: "O-17", descricao: "Argamassa Industrializada de Assentamento (Saco 20kg)", unidade: "sc", tipo: "material", preco_desonerado: 24.00, preco_nao_desonerado: 24.00 },

  // Materiais – Pintura
  { codigo: "O-09", descricao: "Tinta Acrílica Fosca Branca - Lata 18L", unidade: "un", tipo: "material", preco_desonerado: 210.00, preco_nao_desonerado: 210.00 },
  { codigo: "O-18", descricao: "Selador Acrílico para Paredes - Galão 3,6L", unidade: "un", tipo: "material", preco_desonerado: 40.00, preco_nao_desonerado: 40.00 },
  { codigo: "O-19", descricao: "Massa Corrida PVA - Balde 25kg", unidade: "un", tipo: "material", preco_desonerado: 68.00, preco_nao_desonerado: 68.00 },
  { codigo: "O-20", descricao: "Lixa em Folha para Massa Nº 100 (Pacote 50un)", unidade: "un", tipo: "material", preco_desonerado: 1.20, preco_nao_desonerado: 1.20 },
  { codigo: "O-21", descricao: "Fita Crepe 48mm x 50m - Mascaramento", unidade: "un", tipo: "material", preco_desonerado: 9.00, preco_nao_desonerado: 9.00 },
  { codigo: "O-22", descricao: "Tinta Textura Acrílica Grafiato - Balde 25kg", unidade: "un", tipo: "material", preco_desonerado: 185.00, preco_nao_desonerado: 185.00 },

  // Materiais – Elétrica
  { codigo: "O-23", descricao: "Cabo Flexível 2,5mm² (Rolo 100m)", unidade: "m", tipo: "material", preco_desonerado: 3.90, preco_nao_desonerado: 3.90 },
  { codigo: "O-24", descricao: "Eletroduto Corrugado PVC 25mm (Rolo 25m)", unidade: "m", tipo: "material", preco_desonerado: 2.20, preco_nao_desonerado: 2.20 },
  { codigo: "O-25", descricao: "Tomada 2P+T 10A - Padrão NBR 14136", unidade: "un", tipo: "material", preco_desonerado: 13.00, preco_nao_desonerado: 13.00 },
  { codigo: "O-26", descricao: "Interruptor Simples 10A - Padrão NBR 14136", unidade: "un", tipo: "material", preco_desonerado: 12.50, preco_nao_desonerado: 12.50 },
  { codigo: "O-27", descricao: "Disjuntor Unipolar 20A Curva C - DIN", unidade: "un", tipo: "material", preco_desonerado: 20.00, preco_nao_desonerado: 20.00 },
  { codigo: "O-28", descricao: "Luminaria LED Embutir 18W 4000K Quadrada", unidade: "un", tipo: "material", preco_desonerado: 45.00, preco_nao_desonerado: 45.00 },

  // Materiais – Hidrossanitário e Louças
  { codigo: "O-29", descricao: "Tubo PVC Água Fria 25mm (Barra 6m)", unidade: "m", tipo: "material", preco_desonerado: 6.20, preco_nao_desonerado: 6.20 },
  { codigo: "O-30", descricao: "Joelho 90° PVC 25mm para Água Fria", unidade: "un", tipo: "material", preco_desonerado: 3.50, preco_nao_desonerado: 3.50 },
  { codigo: "O-31", descricao: "Torneira Cromada para Pia de Banheiro", unidade: "un", tipo: "material", preco_desonerado: 85.00, preco_nao_desonerado: 85.00 },
  { codigo: "O-32", descricao: "Pia de Louça para Banheiro c/Coluna - Branca", unidade: "un", tipo: "material", preco_desonerado: 185.00, preco_nao_desonerado: 185.00 },
  { codigo: "O-33", descricao: "Chuveiro Elétrico Lorenzetti Acqua Storm 7500W", unidade: "un", tipo: "material", preco_desonerado: 168.00, preco_nao_desonerado: 168.00 },

  // Materiais – Acabamentos e Esquadrias
  { codigo: "O-06", descricao: "Porta de Madeira Semi-oca 80x210cm", unidade: "un", tipo: "material", preco_desonerado: 145.00, preco_nao_desonerado: 145.00 },
  { codigo: "O-34", descricao: "Porta de Madeira Maçiça 80x210cm c/Batente", unidade: "un", tipo: "material", preco_desonerado: 290.00, preco_nao_desonerado: 290.00 },
  { codigo: "O-35", descricao: "Janela de Alumínio de Correr 120x100cm", unidade: "un", tipo: "material", preco_desonerado: 380.00, preco_nao_desonerado: 380.00 },
  { codigo: "O-36", descricao: "Rodá pe de PVC Flexível 7cm (Rolo 50m)", unidade: "m", tipo: "material", preco_desonerado: 4.50, preco_nao_desonerado: 4.50 },
  { codigo: "O-37", descricao: "Forro em Placas de PVC 8mm Branco (Caixa 6m²)", unidade: "m²", tipo: "material", preco_desonerado: 28.00, preco_nao_desonerado: 28.00 },
]