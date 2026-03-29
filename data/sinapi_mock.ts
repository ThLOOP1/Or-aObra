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

  // ── Mão de Obra ──────────────────────────────────────────────
  { codigo: "88316", descricao: "SERVENTE COM ENCARGOS COMPLEMENTARES", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 18.50, preco_nao_desonerado: 21.30 },
  { codigo: "88309", descricao: "PEDREIRO COM ENCARGOS COMPLEMENTARES", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 23.10, preco_nao_desonerado: 26.80 },
  { codigo: "88262", descricao: "ENCANADOR OU BOMBEIRO HIDRÁULICO COM ENCARGOS COMPLEMENTARES", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 27.40, preco_nao_desonerado: 31.60 },
  { codigo: "88267", descricao: "ELETRICISTA COM ENCARGOS COMPLEMENTARES", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 26.10, preco_nao_desonerado: 30.20 },
  { codigo: "88246", descricao: "CARPINTEIRO DE OBRAS COM ENCARGOS COMPLEMENTARES", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 25.60, preco_nao_desonerado: 29.70 },
  { codigo: "88239", descricao: "ARMADOR COM ENCARGOS COMPLEMENTARES", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 24.80, preco_nao_desonerado: 28.60 },
  { codigo: "88252", descricao: "AZULEJISTA OU LADRILHEIRO COM ENCARGOS COMPLEMENTARES", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 24.20, preco_nao_desonerado: 28.00 },
  { codigo: "88248", descricao: "PINTOR DE OBRAS COM ENCARGOS COMPLEMENTARES", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 22.30, preco_nao_desonerado: 25.70 },
  { codigo: "88295", descricao: "GESSEIRO COM ENCARGOS COMPLEMENTARES", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 22.80, preco_nao_desonerado: 26.40 },
  { codigo: "88287", descricao: "CALCETEIRO COM ENCARGOS COMPLEMENTARES", unidade: "h", tipo: "mao_de_obra", preco_desonerado: 21.60, preco_nao_desonerado: 24.80 },

  // ── Cimento, Areia & Agregados ─────────────────────────────
  { codigo: "00001379", descricao: "CIMENTO PORTLAND COMPOSTO CP II-32", unidade: "kg", tipo: "material", preco_desonerado: 0.85, preco_nao_desonerado: 0.85 },
  { codigo: "00001380", descricao: "CIMENTO PORTLAND DE ALTA RESISTÊNCIA INICIAL CP V-ARI (SACO 50 KG)", unidade: "sc", tipo: "material", preco_desonerado: 42.00, preco_nao_desonerado: 42.00 },
  { codigo: "00000370", descricao: "AREIA MÉDIA - POSTO JAZIDA/FORNECEDOR", unidade: "m³", tipo: "material", preco_desonerado: 85.00, preco_nao_desonerado: 85.00 },
  { codigo: "00000369", descricao: "AREIA GROSSA - POSTO JAZIDA/FORNECEDOR", unidade: "m³", tipo: "material", preco_desonerado: 80.00, preco_nao_desonerado: 80.00 },
  { codigo: "00026450", descricao: "BRITA 1 (9,5 A 19 MM) POSTO PEDREIRA/FORNECEDOR", unidade: "m³", tipo: "material", preco_desonerado: 115.00, preco_nao_desonerado: 115.00 },
  { codigo: "00026451", descricao: "BRITA 0 (4,8 A 9,5 MM) POSTO PEDREIRA/FORNECEDOR", unidade: "m³", tipo: "material", preco_desonerado: 118.00, preco_nao_desonerado: 118.00 },
  { codigo: "00003003", descricao: "CAL HIDRATADA CH-III (SACO 20 KG)", unidade: "sc", tipo: "material", preco_desonerado: 18.50, preco_nao_desonerado: 18.50 },

  // ── Alvenaria e Blocos ─────────────────────────────────────
  { codigo: "00006162", descricao: "TIJOLO CERÂMICO FURADO 9X19X29 CM (TIJOLO 6 FUROS)", unidade: "un", tipo: "material", preco_desonerado: 0.68, preco_nao_desonerado: 0.68 },
  { codigo: "00006160", descricao: "BLOCO CERÂMICO (TIJOLO) DE VEDACÃO 8 FUROS 9X19X19CM", unidade: "un", tipo: "material", preco_desonerado: 0.85, preco_nao_desonerado: 0.85 },
  { codigo: "00006170", descricao: "BLOCO DE CONCRETO ESTRUTURAL 14X19X39 CM", unidade: "un", tipo: "material", preco_desonerado: 3.80, preco_nao_desonerado: 3.80 },
  { codigo: "00001386", descricao: "ARGAMASSA COLANTE INDUSTRIALIZADA AC I", unidade: "kg", tipo: "material", preco_desonerado: 0.95, preco_nao_desonerado: 0.95 },
  { codigo: "00001387", descricao: "ARGAMASSA COLANTE INDUSTRIALIZADA AC III - ALTA ADERÊNCIA (SC 20KG)", unidade: "sc", tipo: "material", preco_desonerado: 35.00, preco_nao_desonerado: 35.00 },
  { codigo: "00001392", descricao: "REJUNTE CIMENTÍCIO BRANCO (SACO 1 KG)", unidade: "kg", tipo: "material", preco_desonerado: 6.20, preco_nao_desonerado: 6.20 },

  // ── Revestimentos e Pisos ──────────────────────────────────
  { codigo: "87251", descricao: "REVESTIMENTO CERÂMICO PARA PAREDES INTERNAS 40X40, VIA ÚMIDA", unidade: "m²", tipo: "material", preco_desonerado: 45.20, preco_nao_desonerado: 45.20 },
  { codigo: "00043950", descricao: "PORCELANATO POLIDO, 60X60 CM (VARIA POR FORNECEDOR)", unidade: "m²", tipo: "material", preco_desonerado: 78.00, preco_nao_desonerado: 78.00 },
  { codigo: "00043951", descricao: "PORCELANATO RETIFICADO EXTERNO ANTIDERRAPANTE 60X60 CM", unidade: "m²", tipo: "material", preco_desonerado: 92.00, preco_nao_desonerado: 92.00 },
  { codigo: "00043980", descricao: "ROD APÉ CERÂMICO H=7CM - FORNECIMENTO", unidade: "m", tipo: "material", preco_desonerado: 8.50, preco_nao_desonerado: 8.50 },

  // ── Pintura e Revestimento de Parede ──────────────────────
  { codigo: "00034132", descricao: "TINTA ACRLÍLICA PREMIUM FOSCA CORES - LATA 18L", unidade: "l", tipo: "material", preco_desonerado: 12.30, preco_nao_desonerado: 12.30 },
  { codigo: "00034135", descricao: "TINTA ESMALTE SINTÉTICO ACETINADO - LATA 3,6L", unidade: "un", tipo: "material", preco_desonerado: 68.00, preco_nao_desonerado: 68.00 },
  { codigo: "00034140", descricao: "MASSA CORRIDA PVA PARA PAREDES INTERNAS - BALDE 25KG", unidade: "un", tipo: "material", preco_desonerado: 65.00, preco_nao_desonerado: 65.00 },
  { codigo: "00006085", descricao: "SELADOR ACRLÍLICO PARA PAREDES - GALAO 3,6L", unidade: "un", tipo: "material", preco_desonerado: 38.00, preco_nao_desonerado: 38.00 },
  { codigo: "00006090", descricao: "IMPERMEABILIZANTE FLEXÍVEL BI-COMPONENTE - BALDE 18KG", unidade: "un", tipo: "material", preco_desonerado: 185.00, preco_nao_desonerado: 185.00 },
  { codigo: "00003767", descricao: "LIXA EM FOLHA PARA MASSA OU MADEIRA Nº 100 (PACOTE 50UN)", unidade: "un", tipo: "material", preco_desonerado: 1.20, preco_nao_desonerado: 1.20 },
  { codigo: "00003770", descricao: "FITA CREPE 48MMX50M (MASCARAMENTO DE PINTURA)", unidade: "un", tipo: "material", preco_desonerado: 8.50, preco_nao_desonerado: 8.50 },
  { codigo: "00003780", descricao: "ROLO DE LÃ PARA PINTURA 23CM C/ CABO", unidade: "un", tipo: "material", preco_desonerado: 18.00, preco_nao_desonerado: 18.00 },

  // ── Estrutura e Concreto ────────────────────────────────────
  { codigo: "00034001", descricao: "VERGALHÃO AÇO CA-50, BITOLA 10,0MM", unidade: "kg", tipo: "material", preco_desonerado: 7.20, preco_nao_desonerado: 7.20 },
  { codigo: "00034002", descricao: "VERGALHÃO AÇO CA-60, BITOLA 6,3MM (ESTRIBOS)", unidade: "kg", tipo: "material", preco_desonerado: 8.10, preco_nao_desonerado: 8.10 },
  { codigo: "00034010", descricao: "TELA SOLDADA Q-196 (2,45X6M) - AÇO CA-60", unidade: "m²", tipo: "material", preco_desonerado: 22.50, preco_nao_desonerado: 22.50 },
  { codigo: "00034692", descricao: "CONCRETO USINADO BOMBEAVEL FCK 25 MPA", unidade: "m³", tipo: "material", preco_desonerado: 380.00, preco_nao_desonerado: 380.00 },
  { codigo: "00034693", descricao: "CONCRETO USINADO FCK 30 MPA", unidade: "m³", tipo: "material", preco_desonerado: 410.00, preco_nao_desonerado: 410.00 },
  { codigo: "00099010", descricao: "FÔRMA DE MADEIRA SERRADA - TÁBUA 2,5CM (REAPROVEITAMENTO 3X)", unidade: "m²", tipo: "material", preco_desonerado: 32.00, preco_nao_desonerado: 32.00 },

  // ── Instalações Hidrossántárias ────────────────────────────
  { codigo: "00040279", descricao: "TUBO PVC SOLDAVEL DN 25 MM (3/4\") ÁGUA FRIA", unidade: "m", tipo: "material", preco_desonerado: 5.40, preco_nao_desonerado: 5.40 },
  { codigo: "00040280", descricao: "TUBO PVC SOLDAVEL DN 32 MM (1\") ÁGUA FRIA", unidade: "m", tipo: "material", preco_desonerado: 8.20, preco_nao_desonerado: 8.20 },
  { codigo: "00040295", descricao: "TUBO PVC ESGOTO SERIE NORMAL DN 100 MM", unidade: "m", tipo: "material", preco_desonerado: 14.50, preco_nao_desonerado: 14.50 },
  { codigo: "00040296", descricao: "JOELHO 90° PVC SOLDAVEL 25MM - ÁGUA FRIA (EMBALAGEM 10UN)", unidade: "un", tipo: "material", preco_desonerado: 2.80, preco_nao_desonerado: 2.80 },
  { codigo: "00040297", descricao: "TE PVC SOLDAVEL 25MM - ÁGUA FRIA", unidade: "un", tipo: "material", preco_desonerado: 3.20, preco_nao_desonerado: 3.20 },
  { codigo: "00040310", descricao: "REGISTRO GAVETA BRUTO METAL 3/4\"", unidade: "un", tipo: "material", preco_desonerado: 38.00, preco_nao_desonerado: 38.00 },
  { codigo: "00040320", descricao: "TORNEIRA CROMADA PARA PIA DE COZINHA BICA ALTA", unidade: "un", tipo: "material", preco_desonerado: 95.00, preco_nao_desonerado: 95.00 },
  { codigo: "00038070", descricao: "VASO SANITARÍO COM CAIXA ACOPLADA LOUÇA BRANCA", unidade: "un", tipo: "material", preco_desonerado: 380.00, preco_nao_desonerado: 380.00 },
  { codigo: "00038080", descricao: "PIA DE LOUÇA PARA BANHEIRO 45X38CM - BRANCA", unidade: "un", tipo: "material", preco_desonerado: 145.00, preco_nao_desonerado: 145.00 },
  { codigo: "00038090", descricao: "CHUVEIRO ELÉTRICO DE EMBUTIR 5500W 220V", unidade: "un", tipo: "material", preco_desonerado: 145.00, preco_nao_desonerado: 145.00 },

  // ── Instalações Elétricas ──────────────────────────────────
  { codigo: "00039010", descricao: "CABO FLEXÍVEL 2,5MM² 750V ROLO 100M - AMARELO/VERDE", unidade: "m", tipo: "material", preco_desonerado: 3.80, preco_nao_desonerado: 3.80 },
  { codigo: "00039011", descricao: "CABO FLEXÍVEL 4MM² 750V ROLO 100M - PRETO/VERMELHO", unidade: "m", tipo: "material", preco_desonerado: 5.90, preco_nao_desonerado: 5.90 },
  { codigo: "00039020", descricao: "ELETRODUTO PVC RÍGIDO 25MM (3/4\") 3M", unidade: "m", tipo: "material", preco_desonerado: 4.20, preco_nao_desonerado: 4.20 },
  { codigo: "00039021", descricao: "ELETRODUTO CORRUGADO PVC 25MM ROLO 25M - PARA EMBUTIR", unidade: "m", tipo: "material", preco_desonerado: 2.10, preco_nao_desonerado: 2.10 },
  { codigo: "00039030", descricao: "TOMADA 2P+T 10A - PADRÃO ABNT NBR 14136", unidade: "un", tipo: "material", preco_desonerado: 12.50, preco_nao_desonerado: 12.50 },
  { codigo: "00039031", descricao: "INTERRUPTOR SIMPLES 10A - PADRÃO ABNT NBR 14136", unidade: "un", tipo: "material", preco_desonerado: 11.80, preco_nao_desonerado: 11.80 },
  { codigo: "00039040", descricao: "DISJUNTOR UNIPOLAR 16A CURVA C - DIN", unidade: "un", tipo: "material", preco_desonerado: 18.00, preco_nao_desonerado: 18.00 },
  { codigo: "00039041", descricao: "DISJUNTOR BIPOLAR 40A CURVA C - DIN", unidade: "un", tipo: "material", preco_desonerado: 48.00, preco_nao_desonerado: 48.00 },
  { codigo: "00039050", descricao: "QUADRO DE DISTRIBUIÇÃO 12 CIRCUITOS EMBUTIR C/ BARRAMENTO", unidade: "un", tipo: "material", preco_desonerado: 185.00, preco_nao_desonerado: 185.00 },
  { codigo: "00039060", descricao: "LUMINAR LED EMBUTIR QUADRADO 18W 4000K", unidade: "un", tipo: "material", preco_desonerado: 42.00, preco_nao_desonerado: 42.00 },
  { codigo: "00039061", descricao: "LUMINARIA EXTERNA LED PAR 20 9W - SOBREPOR", unidade: "un", tipo: "material", preco_desonerado: 35.00, preco_nao_desonerado: 35.00 },

  // ── Cobertura ─────────────────────────────────────────────
  { codigo: "00050010", descricao: "TELHA CERÂMICA COLONIAL TIPO FRANCESA - MEIA CAL", unidade: "un", tipo: "material", preco_desonerado: 1.80, preco_nao_desonerado: 1.80 },
  { codigo: "00050011", descricao: "TELHA FIBROCIMENTO SEM AMIANTO ONDULADA 6MM 110X244CM", unidade: "m²", tipo: "material", preco_desonerado: 28.50, preco_nao_desonerado: 28.50 },
  { codigo: "00050020", descricao: "CALHA PVC 125MM (MEIA CAÑA) - BARRA 3M", unidade: "m", tipo: "material", preco_desonerado: 32.00, preco_nao_desonerado: 32.00 },
  { codigo: "00050030", descricao: "MADEIRA SERRADA IMBUIA - CABÃO 6X12CM (BARRA 6M)", unidade: "m", tipo: "material", preco_desonerado: 28.00, preco_nao_desonerado: 28.00 },
]

