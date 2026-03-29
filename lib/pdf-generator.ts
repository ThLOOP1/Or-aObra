/**
 * lib/pdf-generator.ts
 * Gerador de Orçamento Técnico em PDF — SmartBudget CREA-MA
 * Usa jspdf + jspdf-autotable para produzir documento A4 profissional.
 */

import type { BudgetItem } from "@/components/orcamento/budget-table"

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface PdfParams {
  projectName: string
  clientName: string
  date: string          // YYYY-MM-DD
  bdi: number
  encargos: number
  isDesonerado: boolean
  items: BudgetItem[]
  prof?: { nome?: string; crea?: string; cpfCnpj?: string }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function fmtNum(value: number, decimals = 2): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function lineCost(item: BudgetItem, encargos: number): number {
  const base = item.qty * item.unitPrice
  return item.tipo === "mao_de_obra" ? base * (1 + encargos / 100) : base
}

function slugify(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .toLowerCase()
    .slice(0, 40)
}

function formatDateBR(dateStr: string): string {
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00")
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString("pt-BR")
}

// ─── Paleta de cores (RGB) ────────────────────────────────────────────────────

const C = {
  darkGreen:   [20,  83, 45]   as [number,number,number],
  green:       [34, 139, 84]   as [number,number,number],
  lightGreen:  [237, 247, 241] as [number,number,number],
  paleGreen:   [248, 252, 249] as [number,number,number],
  amber:       [161,  98,  7]  as [number,number,number],
  amberBg:     [255, 251, 235] as [number,number,number],
  blue:        [30,  90, 180]  as [number,number,number],
  blueBg:      [239, 246, 255] as [number,number,number],
  gray:        [70,  70,  70]  as [number,number,number],
  grayDark:    [50,  50,  50]  as [number,number,number],
  grayLight:   [120, 120, 120] as [number,number,number],
  border:      [209, 230, 219] as [number,number,number],
  rowAlt:      [245, 249, 246] as [number,number,number],
  white:       [255, 255, 255] as [number,number,number],
  black:       [20,  20,  20]  as [number,number,number],
  red:         [180,  40,  40] as [number,number,number],
}

// ─── Gerador principal ────────────────────────────────────────────────────────

export async function generateBudgetPdf(params: PdfParams): Promise<void> {
  // Import dinâmico para evitar SSR
  const { default: jsPDF } = await import("jspdf")
  const { default: autoTable } = await import("jspdf-autotable")

  const { projectName, clientName, date, bdi, encargos, isDesonerado, items, prof } = params

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  const PW = 210   // page width mm
  const PH = 297   // page height mm
  const ML = 15    // margin left
  const MR = 15    // margin right
  const CW = PW - ML - MR  // content width = 180mm

  // ── Cálculos financeiros ────────────────────────────────────────────────────
  const materiaisRaw   = items.filter(i => i.tipo === "material")
                              .reduce((acc, i) => acc + i.qty * i.unitPrice, 0)
  const moRaw          = items.filter(i => i.tipo === "mao_de_obra")
                              .reduce((acc, i) => acc + i.qty * i.unitPrice, 0)
  const encargosValue  = moRaw * (encargos / 100)
  const moComEncargos  = moRaw + encargosValue
  const custoDireto    = materiaisRaw + moComEncargos
  const bdiValue       = custoDireto * (bdi / 100)
  const precoFinal     = custoDireto + bdiValue

  const hoje          = formatDateBR(date)
  const validade      = addDays(date, 30)
  const regime        = isDesonerado ? "Desonerado" : "Não Desonerado"
  const activeBaseStr = typeof window !== "undefined" ? localStorage.getItem("orcapro_base_ativa")?.toUpperCase() || "SINAPI" : "SINAPI"
  const baseRef       = `${activeBaseStr} Maranhão — Regime ${regime}`
  const projectSlug   = slugify(projectName) || "tecnico"
  const filename      = `orcamento_${projectSlug}.pdf`

  let y = 0   // cursor Y atual

  // ────────────────────────────────────────────────────────────────────────────
  // BLOCO 0 — CABEÇALHO PRINCIPAL
  // ────────────────────────────────────────────────────────────────────────────

  // Fundo verde topo
  doc.setFillColor(...C.darkGreen)
  doc.rect(0, 0, PW, 28, "F")

  // Linha decorativa clara embaixo do header
  doc.setFillColor(...C.green)
  doc.rect(0, 28, PW, 1.5, "F")

  // Mock/Reais do Profissional
  const profNome = prof?.nome || "Eng. Carlos Silva"
  const profRegistro = prof?.crea ? `Registro: ${prof.crea}` : "Registro CREA 12345/MA"
  const profDoc = prof?.cpfCnpj ? `CPF/CNPJ: ${prof.cpfCnpj}` : "CPF/CNPJ: 000.000.000-00"
  // Dados do Profissional – Esquerda
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(...C.white)
  doc.text(profNome.toUpperCase(), ML, 10)
  
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(200, 230, 210)
  doc.text(profRegistro, ML, 15)
  doc.text(profDoc, ML, 19.5)

  // Dados Obra – Direita
  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.setTextColor(...C.white)
  doc.text("ORÇAMENTO TÉCNICO DE ENGENHARIA", PW / 2, 12, { align: "center" })

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(200, 230, 210)
  doc.text("SmartBudget — Sistema de Orçamento", PW / 2, 18, { align: "center" })

  // Data/Validade — direita
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(200, 230, 210)
  doc.text(`Emissão: ${hoje}`, PW - MR, 10, { align: "right" })
  doc.text(`Validade: ${validade} (30 dias)`, PW - MR, 15, { align: "right" })
  doc.text(`Ref.: ${regime}`, PW - MR, 20, { align: "right" })

  y = 34

  // ────────────────────────────────────────────────────────────────────────────
  // BLOCO 1 — DADOS DO PROFISSIONAL & OBRA
  // ────────────────────────────────────────────────────────────────────────────

  const infoBoxH = 48
  const halfW    = CW / 2 - 3

  // Caixa esquerda — Profissional
  doc.setFillColor(...C.lightGreen)
  doc.setDrawColor(...C.border)
  doc.setLineWidth(0.3)
  doc.roundedRect(ML, y, halfW, infoBoxH, 2, 2, "FD")

  // label topo da caixa
  doc.setFillColor(...C.green)
  doc.roundedRect(ML, y, halfW, 7, 2, 2, "F")
  doc.rect(ML, y + 3.5, halfW, 3.5, "F")  // fix roundedRect bottom corners

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(...C.white)
  doc.text("DADOS DO PROFISSIONAL", ML + halfW / 2, y + 4.8, { align: "center" })

  const lx = ML + 4
  let ly = y + 12
  const lineGap = 6.5

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8.5)
  doc.setTextColor(...C.darkGreen)
  doc.text("Profissional:", lx, ly)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...C.black)
  doc.text(profNome, lx + 30, ly)

  ly += lineGap
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...C.darkGreen)
  doc.text("Registro CREA:", lx, ly)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...C.black)
  doc.text(prof?.crea || "12345/MA", lx + 30, ly)

  ly += lineGap
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...C.darkGreen)
  doc.text("CPF/CNPJ:", lx, ly)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...C.black)
  doc.text(prof?.cpfCnpj || "000.000.000-00", lx + 30, ly)

  ly += lineGap
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...C.darkGreen)
  doc.text("Base de Preços:", lx, ly)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...C.black)
  
  // Aqui dividimos o texto caso seja muito longo (evitando overflow lateral)
  const baseLines = doc.splitTextToSize(baseRef, halfW - 32)
  doc.text(baseLines, lx + 30, ly)

  ly += lineGap * baseLines.length
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...C.darkGreen)
  doc.text("Encargos Sociais:", lx, ly)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...C.black)
  doc.text(`${encargos}% (sobre Mão de Obra)`, lx + 30, ly)

  // Caixa direita — Obra
  const rx = ML + halfW + 6
  doc.setFillColor(...C.lightGreen)
  doc.setDrawColor(...C.border)
  doc.roundedRect(rx, y, halfW, infoBoxH, 2, 2, "FD")

  doc.setFillColor(...C.green)
  doc.roundedRect(rx, y, halfW, 7, 2, 2, "F")
  doc.rect(rx, y + 3.5, halfW, 3.5, "F")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(...C.white)
  doc.text("DADOS DA OBRA / CLIENTE", rx + halfW / 2, y + 4.8, { align: "center" })

  let ry = y + 12

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8.5)
  doc.setTextColor(...C.darkGreen)
  doc.text("Obra/Projeto:", rx + 4, ry)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...C.black)
  // Quebra de linha se nome for longo
  const obraLines = doc.splitTextToSize(projectName, halfW - 32)
  doc.text(obraLines, rx + 30, ry)

  ry += lineGap
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...C.darkGreen)
  doc.text("Cliente:", rx + 4, ry)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...C.black)
  doc.text(clientName, rx + 30, ry)

  ry += lineGap
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...C.darkGreen)
  doc.text("Data da Obra:", rx + 4, ry)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...C.black)
  doc.text(hoje, rx + 30, ry)

  ry += lineGap
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...C.darkGreen)
  doc.text("BDI Aplicado:", rx + 4, ry)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...C.black)
  doc.text(`${bdi}% (sobre Custo Direto Total)`, rx + 30, ry)

  y += infoBoxH + 7

  // ────────────────────────────────────────────────────────────────────────────
  // BLOCO 2 — TÍTULO DA SEÇÃO + LEGENDA DE TIPOS
  // ────────────────────────────────────────────────────────────────────────────

  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(...C.darkGreen)
  doc.text("COMPOSIÇÃO DE SERVIÇOS E MATERIAIS", ML, y + 5)

  // Legenda MAT / MO
  const legendX = PW - MR
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)

  doc.setFillColor(...C.blueBg)
  doc.setDrawColor(...C.blue)
  doc.setLineWidth(0.3)
  doc.roundedRect(legendX - 84, y - 0.5, 40, 6.5, 1.5, 1.5, "FD")
  doc.setTextColor(...C.blue)
  doc.text("■ MAT — Material", legendX - 81, y + 4)

  doc.setFillColor(...C.amberBg)
  doc.setDrawColor(...C.amber)
  doc.roundedRect(legendX - 42, y - 0.5, 42, 6.5, 1.5, 1.5, "FD")
  doc.setTextColor(...C.amber)
  doc.text("■ MO — Mão de Obra", legendX - 39, y + 4)

  y += 10

  // ────────────────────────────────────────────────────────────────────────────
  // BLOCO 3 — TABELA DE ITENS (autoTable)
  // ────────────────────────────────────────────────────────────────────────────

  const colWidths = [28, 66, 12, 11, 18, 23, 22]
  // Cód | Descrição | Tipo | Un. | Qtd | Vlr.Unit | Total

  const tableRows = items.map((item) => {
    const total = lineCost(item, encargos)
    const tipoLabel = item.tipo === "material" ? "MAT" : "MO"
    return [
      item.ref,
      item.description,
      tipoLabel,
      item.unit,
      fmtNum(item.qty),
      fmt(item.unitPrice),
      fmt(total),
    ]
  })

  autoTable(doc, {
    startY: y,
    margin: { left: ML, right: MR },
    head: [["Ref./Cód.", "Descrição do Serviço / Material", "Tipo", "Un.", "Qtd.", "Vlr. Unit.", "Total (c/ Enc.)"]],
    body: tableRows,
    columnStyles: {
      0: { cellWidth: colWidths[0], fontSize: 7, textColor: C.grayLight, fontStyle: "normal" },
      1: { cellWidth: colWidths[1], fontSize: 7.5 },
      2: { cellWidth: colWidths[2], fontSize: 7, halign: "center", fontStyle: "bold" },
      3: { cellWidth: colWidths[3], fontSize: 7, halign: "center" },
      4: { cellWidth: colWidths[4], fontSize: 7, halign: "right" },
      5: { cellWidth: colWidths[5], fontSize: 7, halign: "right" },
      6: { cellWidth: colWidths[6], fontSize: 7.5, halign: "right", fontStyle: "bold" },
    },
    headStyles: {
      fillColor: C.darkGreen,
      textColor: C.white,
      fontStyle: "bold",
      fontSize: 7.5,
      cellPadding: { top: 3, bottom: 3, left: 2, right: 2 },
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: C.rowAlt,
    },
    bodyStyles: {
      fontSize: 7.5,
      cellPadding: { top: 2.5, bottom: 2.5, left: 2, right: 2 },
      textColor: C.black,
      lineColor: C.border,
      lineWidth: 0.1,
    },
    didParseCell(data) {
      // Colorir coluna Tipo conforme Material/Mão de Obra
      if (data.section === "body" && data.column.index === 2) {
        const raw = data.row.raw as string[]
        if (raw[2] === "MO") {
          data.cell.styles.textColor = C.amber
          data.cell.styles.fillColor = C.amberBg
        } else {
          data.cell.styles.textColor = C.blue
          data.cell.styles.fillColor = C.blueBg
        }
      }
      // Colorir coluna Total do MO em âmbar
      if (data.section === "body" && data.column.index === 6) {
        const raw = data.row.raw as string[]
        if (raw[2] === "MO") {
          data.cell.styles.textColor = C.amber
        }
      }
    },
    // Header repetido em cada nova página
    showHead: "everyPage",
    // Rodapé de tabela
    foot: [[
      { content: `Total de itens: ${items.length}`, colSpan: 4, styles: { halign: "left", fontSize: 7, textColor: C.grayLight } },
      { content: "Subtotais →", styles: { halign: "right", fontStyle: "bold", fontSize: 7, textColor: C.darkGreen } },
      { content: fmt(materiaisRaw + moRaw), styles: { halign: "right", fontStyle: "bold", fontSize: 7 } },
      { content: fmt(custoDireto), styles: { halign: "right", fontStyle: "bold", fontSize: 8, textColor: C.darkGreen } },
    ]],
    footStyles: {
      fillColor: C.lightGreen,
      textColor: C.black,
      fontStyle: "bold",
      fontSize: 7.5,
      lineColor: C.border,
      lineWidth: 0.2,
    },
    didDrawPage(data) {
      // Numeração de páginas no rodapé
      const pageNum = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages()
      doc.setFont("helvetica", "normal")
      doc.setFontSize(7)
      doc.setTextColor(...C.grayLight)
      doc.text(
        `SmartBudget CREA-MA — Página ${data.pageNumber} de ${pageNum}`,
        PW / 2,
        PH - 8,
        { align: "center" }
      )
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 8

  // Se não há espaço suficiente para o resumo financeiro, nova página
  if (y > PH - 90) {
    doc.addPage()
    y = 20
  }

  // ────────────────────────────────────────────────────────────────────────────
  // BLOCO 4 — RESUMO FINANCEIRO
  // ────────────────────────────────────────────────────────────────────────────

  // Título da seção
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(...C.darkGreen)
  doc.text("RESUMO FINANCEIRO DO ORÇAMENTO", ML, y)

  y += 5

  const boxX   = ML
  const boxW   = CW
  const boxPad = 5

  // Fundo do bloco de resumo
  const resumoLines = [
    { label: `■  Subtotal de Materiais`,                        value: fmt(materiaisRaw),   color: C.blue },
    { label: `■  Subtotal de Mão de Obra (base s/ encargos)`,  value: fmt(moRaw),          color: C.amber },
    { label: `   + Encargos Sociais (${encargos}%)`,           value: fmt(encargosValue),  color: C.amber },
    { label: `   Mão de Obra c/ Encargos`,                     value: fmt(moComEncargos),  color: C.amber },
  ]

  const lineH = 7
  const resumoH = resumoLines.length * lineH + 4 + 22 + 16 // linhas + separadores + total final + BDI

  doc.setFillColor(...C.paleGreen)
  doc.setDrawColor(...C.border)
  doc.setLineWidth(0.4)
  doc.roundedRect(boxX, y, boxW, resumoH, 2, 2, "FD")

  // Linha de título interna
  doc.setFillColor(...C.lightGreen)
  doc.rect(boxX, y, boxW, 0, "F")

  let ry2 = y + boxPad + 2

  resumoLines.forEach(({ label, value, color }) => {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.setTextColor(...color)
    doc.text(label, boxX + boxPad, ry2)
    doc.setFont("helvetica", "bold")
    doc.text(value, boxX + boxW - boxPad, ry2, { align: "right" })
    ry2 += lineH
  })

  // Separador 1
  ry2 += 1
  doc.setDrawColor(...C.border)
  doc.setLineWidth(0.3)
  doc.line(boxX + boxPad, ry2, boxX + boxW - boxPad, ry2)
  ry2 += 5

  // Custo Direto Total
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(...C.darkGreen)
  doc.text("Custo Direto Total (Mat + MO c/ Encargos)", boxX + boxPad, ry2)
  doc.text(fmt(custoDireto), boxX + boxW - boxPad, ry2, { align: "right" })
  ry2 += 8

  // BDI
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(...C.gray)
  doc.text(`+ BDI ${bdi}% (Benefícios e Despesas Indiretas)`, boxX + boxPad, ry2)
  doc.setFont("helvetica", "bold")
  doc.text(fmt(bdiValue), boxX + boxW - boxPad, ry2, { align: "right" })
  ry2 += 3

  // Separador 2 + destaque verde
  doc.setDrawColor(...C.green)
  doc.setLineWidth(0.5)
  doc.line(boxX + boxPad, ry2 + 1, boxX + boxW - boxPad, ry2 + 1)
  ry2 += 6

  // TOTAL FINAL — destaque máximo
  doc.setFillColor(...C.darkGreen)
  doc.roundedRect(boxX + 2, ry2 - 3, boxW - 4, 11, 1.5, 1.5, "F")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(...C.white)
  doc.text("PREÇO DE VENDA FINAL", boxX + boxPad + 2, ry2 + 4.5)
  doc.text(fmt(precoFinal), boxX + boxW - boxPad - 2, ry2 + 4.5, { align: "right" })

  y = ry2 + 16

  // ────────────────────────────────────────────────────────────────────────────
  // BLOCO 5 — OBSERVAÇÕES + ASSINATURA
  // ────────────────────────────────────────────────────────────────────────────

  if (y > PH - 85) {
    doc.addPage()
    y = 20
  }

  y += 4

  // Observações
  doc.setFillColor(254, 252, 232)  // amarelo muito claro
  doc.setDrawColor(234, 179, 8)    // amarelo
  doc.setLineWidth(0.3)
  doc.roundedRect(ML, y, CW, 22, 2, 2, "FD")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(133, 77, 14)
  doc.text("⚠  OBSERVAÇÕES E CONDIÇÕES GERAIS", ML + 4, y + 6)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(7.5)
  doc.setTextColor(92, 60, 0)
  const obs = [
    `• Orçamento válido por 30 dias a partir de ${hoje} (até ${validade}).`,
    `• Preços baseados na tabela ${baseRef}.  Encargos Sociais: ${encargos}%.  BDI: ${bdi}%.`,
    "• Valores sujeitos a alteração conforme atualização do SINAPI ou variação de materiais.",
  ]
  obs.forEach((line, i) => {
    doc.text(line, ML + 4, y + 12 + i * 4.5)
  })

  y += 30

  // Assinatura
  const sigLineY = y + 20
  const sigCenterX = ML + CW / 2

  doc.setDrawColor(...C.darkGreen)
  doc.setLineWidth(0.6)
  doc.line(sigCenterX - 55, sigLineY, sigCenterX + 55, sigLineY)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8.5)
  doc.setTextColor(...C.darkGreen)
  // Utiliza os dados dinâmicos do perfil!
  doc.text(profNome, sigCenterX, sigLineY + 5, { align: "center" })

  doc.setFont("helvetica", "normal")
  doc.setFontSize(7.5)
  doc.setTextColor(...C.gray)
  const creaRodape = prof?.crea ? `CREA: ${prof.crea}` : "CREA: 12345/MA-D"
  doc.text(`${creaRodape} — Responsável Técnico`, sigCenterX, sigLineY + 10, { align: "center" })
  doc.text(`Data: ${hoje}`, sigCenterX, sigLineY + 15, { align: "center" })

  // Rodapé final da última página
  doc.setFont("helvetica", "italic")
  doc.setFontSize(6.5)
  doc.setTextColor(...C.grayLight)
  doc.text(
    "Documento gerado pelo SmartBudget CREA-MA — Sistema de Orçamento Técnico de Engenharia",
    PW / 2, PH - 12, { align: "center" }
  )

  // ── Salva / faz download ─────────────────────────────────────────────────────
  const blob = doc.output("blob")
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 200)
}
