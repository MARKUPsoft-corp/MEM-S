import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface OrderItem {
  id?: string | number
  name: string
  price: number
  quantity: number
  variant?: string | { attributes?: Array<{ name: string; value: string }> } | null
  image?: string
}

export interface OrderCustomer {
  name?: string
  phone?: string
  email?: string
  address?: string
  city?: string
}

export interface OrderData {
  orderNumber: string
  createdAt?: string
  status?: string
  customer?: OrderCustomer
  items?: OrderItem[]
  subtotal?: number
  total: number
  notes?: string
}

export interface StoreInvoiceSettings {
  storeName?: string
  contactEmail?: string
  contactPhone?: string
  whatsappNumber?: string
  address?: string
  rccm?: string
  nui?: string
}

// Convertit une image en base64 via un canvas en haute résolution
export const loadLogoBase64 = async (src: string = '/images/LOGO.png'): Promise<string> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve('')
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const maxDim = 1000
        const scale = Math.min(maxDim / img.width, maxDim / img.height, 1)
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve('')
          return
        }
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/png'))
      } catch (e) {
        console.warn('[Invoice] Impossible de convertir le logo en base64:', e)
        resolve('')
      }
    }
    img.onerror = () => {
      console.warn('[Invoice] Logo introuvable à l\'URL:', src)
      resolve('')
    }
    img.src = src
  })
}

// Formatage de prix en FCFA
const formatFcfa = (val: number | undefined | null) => {
  return `${(val || 0).toLocaleString('fr-FR')} FCFA`
}

// Formatage de date élégante
const formatLongDate = (isoStr?: string) => {
  if (!isoStr) return 'Date inconnue'
  try {
    const d = new Date(isoStr)
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return isoStr
  }
}

// Libellé de statut
const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'confirmed': return 'COMMANDE CONFIRMÉE'
    case 'shipped': return 'EXPÉDIÉE'
    case 'delivered': return 'LIVRÉE'
    case 'cancelled': return 'ANNULÉE'
    default: return 'EN ATTENTE DE TRAITEMENT'
  }
}

/**
 * Génère un document PDF ultra-haute résolution (300 DPI) directement
 * à partir de l'élément HTML de la facture (#mems-invoice-sheet).
 * Cela garantit une correspondance stricte 100% identique entre l'aperçu à l'écran
 * (police Montserrat, disposition exacte, colonnes, bordures or, badges, sceau) et le fichier PDF final.
 */
export const generatePdfFromHtml = async (element: HTMLElement): Promise<jsPDF> => {
  if (typeof window === 'undefined') {
    throw new Error('generatePdfFromHtml can only be executed in a browser environment')
  }

  // S'assurer que les polices web (Montserrat) sont prêtes
  if (document.fonts) {
    await document.fonts.ready
  }

  const html2canvas = (await import('html2canvas')).default

  // Capture ultra-haute résolution (scale: 2.5 pour ~300 DPI)
  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#FFFFFF',
    logging: false
  })

  const imgData = canvas.toDataURL('image/png')

  // Format standard A4 portrait : 210 x 297 mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  })

  const pdfWidth = 210
  const pdfHeight = 297

  const canvasWidth = canvas.width
  const canvasHeight = canvas.height
  const canvasRatio = canvasHeight / canvasWidth
  const renderedHeight = pdfWidth * canvasRatio

  if (renderedHeight <= pdfHeight) {
    // Si la hauteur rentre sur la page A4, centrage vertical propre
    const offsetY = (pdfHeight - renderedHeight) / 2
    pdf.addImage(imgData, 'PNG', 0, Math.max(0, offsetY), pdfWidth, renderedHeight, undefined, 'FAST')
  } else {
    // Ajustement proportionnel pour tenir sur une seule page A4
    const scaleFactor = pdfHeight / renderedHeight
    const fittedWidth = pdfWidth * scaleFactor
    const fittedHeight = pdfHeight
    const offsetX = (pdfWidth - fittedWidth) / 2
    pdf.addImage(imgData, 'PNG', Math.max(0, offsetX), 0, fittedWidth, fittedHeight, undefined, 'FAST')
  }

  return pdf
}

/**
 * Télécharge la facture PDF directement à partir du rendu HTML de la modale
 * (Garantit police Montserrat et mise en page 100% identique à l'aperçu)
 */
export const downloadInvoiceFromElement = async (
  element: HTMLElement,
  filename: string = 'Facture-MEMS.pdf'
) => {
  const pdf = await generatePdfFromHtml(element)
  pdf.save(filename)
}

/**
 * Ouvre la facture PDF générée depuis le rendu HTML dans un nouvel onglet
 */
export const openInvoiceFromElement = async (element: HTMLElement) => {
  const pdf = await generatePdfFromHtml(element)
  const blob = pdf.output('blob')
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}

/**
 * Construit l'instance vectorielle jsPDF de secours pour une commande MEM'S
 */
export const buildInvoicePdfDocument = async (
  order: OrderData,
  settings?: StoreInvoiceSettings
): Promise<jsPDF> => {
  // Format A4 portrait : 210 x 297 mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  })

  // Palette Charte Graphique MEM'S
  const COLOR_BLACK = [11, 11, 11] as [number, number, number]       // #0B0B0B
  const COLOR_GOLD = [201, 164, 108] as [number, number, number]     // #C9A46C
  const COLOR_IVORY = [245, 242, 236] as [number, number, number]    // #F5F2EC
  const COLOR_CREAM = [250, 248, 245] as [number, number, number]    // #FAF8F5
  const COLOR_BORDER = [229, 224, 216] as [number, number, number]   // #E5E0D8
  const COLOR_MUTED = [120, 120, 120] as [number, number, number]    // #787878
  const COLOR_CHARCOAL = [42, 42, 42] as [number, number, number]   // #2A2A2A

  const pageWidth = 210
  const pageHeight = 297
  const marginX = 14
  const contentWidth = pageWidth - (marginX * 2) // 182 mm

  // 1. Cadre décoratif extérieur très fin (Signature Haute Couture)
  doc.setDrawColor(...COLOR_GOLD)
  doc.setLineWidth(0.4)
  doc.rect(7, 7, pageWidth - 14, pageHeight - 14)

  doc.setDrawColor(...COLOR_BORDER)
  doc.setLineWidth(0.15)
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16)

  // 2. EN-TÊTE : Logo MEM'S & Titre de la Maison
  let curY = 14

  // Charger le logo officiel
  try {
    const logoBase64 = await loadLogoBase64('/images/LOGO.png')
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', marginX, curY, 24, 24, undefined, 'FAST')
    }
  } catch (err) {
    console.warn('[Invoice] Erreur affichage logo:', err)
  }

  // Marque & Sous-titre à droite du logo
  const brandX = marginX + 27
  doc.setTextColor(...COLOR_BLACK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('MAISON MEM\'S', brandX, curY + 7)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...COLOR_GOLD)
  doc.text('HAUTE COUTURE AFRICAINE & PRÊT-À-PORTER DE PRESTIGE', brandX, curY + 12)

  doc.setFontSize(7)
  doc.setTextColor(...COLOR_MUTED)
  const city = settings?.address && !settings.address.toLowerCase().includes('douala')
    ? settings.address
    : 'Yaoundé, République du Cameroun'
  const phone = settings?.contactPhone || settings?.whatsappNumber || '+237 6 96 96 26 62'
  const email = settings?.contactEmail || 'contact@mems-concept.com'
  doc.text(`${city}  •  Tél / WhatsApp : ${phone}`, brandX, curY + 17)
  doc.text(`Email : ${email}  •  Web : www.mems-couture.com`, brandX, curY + 21)

  // Bloc Facture & Référence (Aligné à Droite)
  const rightAlignX = pageWidth - marginX
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...COLOR_BLACK)
  doc.text('FACTURE OFFICIELLE', rightAlignX, curY + 6, { align: 'right' })

  // Badge Référence Facture
  const invoiceRef = order.orderNumber ? `FAC-${order.orderNumber}` : 'FAC-000000'
  doc.setFont('courier', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(...COLOR_GOLD)
  doc.text(invoiceRef, rightAlignX, curY + 11.5, { align: 'right' })

  // Date d'émission
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...COLOR_MUTED)
  doc.text(`Émise le : ${formatLongDate(order.createdAt)}`, rightAlignX, curY + 16.5, { align: 'right' })

  // Statut
  const statusTxt = getStatusLabel(order.status)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  if (order.status === 'confirmed' || order.status === 'delivered') {
    doc.setTextColor(15, 81, 50) // vert sombre
  } else {
    doc.setTextColor(...COLOR_GOLD)
  }
  doc.text(`Statut : ${statusTxt}`, rightAlignX, curY + 21, { align: 'right' })

  // Ligne de séparation or brossé double
  curY += 27
  doc.setDrawColor(...COLOR_GOLD)
  doc.setLineWidth(0.6)
  doc.line(marginX, curY, pageWidth - marginX, curY)

  doc.setDrawColor(...COLOR_BORDER)
  doc.setLineWidth(0.2)
  doc.line(marginX, curY + 1.2, pageWidth - marginX, curY + 1.2)

  // 3. BLOCS COORDONNÉES : ÉMETTEUR & CLIENT
  curY += 6
  const boxWidth = (contentWidth - 6) / 2
  const boxHeight = 31

  // Bloc Émetteur (Gauche)
  doc.setFillColor(...COLOR_CREAM)
  doc.setDrawColor(...COLOR_BORDER)
  doc.setLineWidth(0.2)
  doc.roundedRect(marginX, curY, boxWidth, boxHeight, 1.5, 1.5, 'FD')

  doc.setFillColor(...COLOR_GOLD)
  doc.rect(marginX, curY, 2, boxHeight, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...COLOR_GOLD)
  doc.text('ÉMETTEUR / MAISON DE COUTURE', marginX + 5, curY + 5)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...COLOR_BLACK)
  doc.text(settings?.storeName || 'Maison MEM\'S', marginX + 5, curY + 10)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...COLOR_CHARCOAL)
  doc.text(`Siège : ${city}`, marginX + 5, curY + 15)
  doc.text(`Service Ventes : ${phone}`, marginX + 5, curY + 19.5)
  doc.text(`RCCM : RC/YAO/2024/B/1842  •  NUI : M032412895412`, marginX + 5, curY + 24)
  doc.text(`Boutique en ligne officielle`, marginX + 5, curY + 28.5)

  // Bloc Client / Facturé à (Droite)
  const clientX = marginX + boxWidth + 6
  doc.setFillColor(...COLOR_CREAM)
  doc.setDrawColor(...COLOR_BORDER)
  doc.setLineWidth(0.2)
  doc.roundedRect(clientX, curY, boxWidth, boxHeight, 1.5, 1.5, 'FD')

  doc.setFillColor(...COLOR_BLACK)
  doc.rect(clientX, curY, 2, boxHeight, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...COLOR_BLACK)
  doc.text('FACTURÉ À / DESTINATAIRE', clientX + 5, curY + 5)

  const customerName = order.customer?.name || 'Client Particulier'
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...COLOR_BLACK)
  doc.text(customerName.toUpperCase(), clientX + 5, curY + 10)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...COLOR_CHARCOAL)
  const custPhone = order.customer?.phone ? `Tél / WhatsApp : ${order.customer.phone}` : 'Tél : Non renseigné'
  doc.text(custPhone, clientX + 5, curY + 15)

  const custEmail = order.customer?.email ? `Email : ${order.customer.email}` : ''
  if (custEmail) {
    doc.text(custEmail, clientX + 5, curY + 19.5)
  }

  const custAddress = [order.customer?.address, order.customer?.city, 'Cameroun']
    .filter(Boolean)
    .join(', ')
  doc.text(`Livraison : ${custAddress}`, clientX + 5, custEmail ? curY + 24 : curY + 19.5)

  // 4. TABLEAU DES ARTICLES
  curY += boxHeight + 6

  const tableRows = (order.items || []).map((item, idx) => {
    let variantDesc = ''
    if (typeof item.variant === 'string') {
      variantDesc = item.variant
    } else if (item.variant && item.variant.attributes) {
      variantDesc = item.variant.attributes.map(a => `${a.name}: ${a.value}`).join(' | ')
    }

    const unitPrice = item.price || 0
    const qty = item.quantity || 1
    const lineTotal = unitPrice * qty

    return [
      String(idx + 1).padStart(2, '0'),
      item.name || 'Article Haute Couture',
      variantDesc || 'Standard / Sur Mesure',
      String(qty),
      formatFcfa(unitPrice),
      formatFcfa(lineTotal)
    ]
  })

  if (tableRows.length === 0) {
    tableRows.push(['01', 'Commande personnalisée', 'Confection sur mesure', '1', formatFcfa(order.total), formatFcfa(order.total)])
  }

  autoTable(doc, {
    startY: curY,
    head: [['N°', 'DÉSIGNATION DE L\'ARTICLE', 'OPTIONS / DÉTAILS', 'QTÉ', 'PRIX UNIT.', 'TOTAL']],
    body: tableRows,
    theme: 'plain',
    margin: { left: marginX, right: marginX },
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: { top: 3.5, bottom: 3.5, left: 3, right: 3 },
      textColor: COLOR_BLACK,
      lineColor: COLOR_BORDER,
      lineWidth: 0.15,
      valign: 'middle'
    },
    headStyles: {
      fillColor: COLOR_BLACK,
      textColor: COLOR_IVORY,
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'left',
      cellPadding: { top: 3.5, bottom: 3.5, left: 3, right: 3 }
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center', textColor: COLOR_MUTED },
      1: { cellWidth: 'auto', fontStyle: 'bold' },
      2: { cellWidth: 38, textColor: COLOR_CHARCOAL, fontSize: 7.5 },
      3: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
      4: { cellWidth: 28, halign: 'right', textColor: COLOR_CHARCOAL },
      5: { cellWidth: 32, halign: 'right', fontStyle: 'bold', textColor: COLOR_BLACK }
    },
    alternateRowStyles: {
      fillColor: COLOR_CREAM
    }
  })

  let tableEndY = (doc as any).lastAutoTable?.finalY || (curY + 40)

  // 5. BLOC RÉCAPITULATIF FINANCIER
  curY = tableEndY + 5

  if (curY > pageHeight - 75) {
    doc.addPage()
    curY = 20
  }

  const totalsBoxWidth = 80
  const totalsBoxX = pageWidth - marginX - totalsBoxWidth

  doc.setFillColor(...COLOR_CREAM)
  doc.setDrawColor(...COLOR_BORDER)
  doc.setLineWidth(0.3)
  doc.roundedRect(totalsBoxX, curY, totalsBoxWidth, 38, 2, 2, 'FD')

  let totY = curY + 6.5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...COLOR_MUTED)
  doc.text('Sous-total brut :', totalsBoxX + 5, totY)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLOR_BLACK)
  const subtotalVal = order.subtotal || order.total || 0
  doc.text(formatFcfa(subtotalVal), totalsBoxX + totalsBoxWidth - 5, totY, { align: 'right' })

  totY += 6.5
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLOR_MUTED)
  doc.text('Frais de livraison :', totalsBoxX + 5, totY)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 81, 50)
  doc.text('OFFERTE (0 FCFA)', totalsBoxX + totalsBoxWidth - 5, totY, { align: 'right' })

  totY += 4
  doc.setDrawColor(...COLOR_BORDER)
  doc.setLineWidth(0.2)
  doc.line(totalsBoxX + 4, totY, totalsBoxX + totalsBoxWidth - 4, totY)

  totY += 7
  doc.setFillColor(...COLOR_BLACK)
  doc.roundedRect(totalsBoxX + 3, totY - 4.5, totalsBoxWidth - 6, 12, 1.5, 1.5, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...COLOR_GOLD)
  doc.text('TOTAL NET TTC :', totalsBoxX + 6, totY + 2.5)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.text(formatFcfa(order.total), totalsBoxX + totalsBoxWidth - 6, totY + 2.5, { align: 'right' })

  // Bloc Arrêté de compte à gauche
  const leftNotesWidth = totalsBoxX - marginX - 6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...COLOR_BLACK)
  doc.text('ARRÊTÉ DE COMPTE :', marginX, curY + 6)

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(7.5)
  doc.setTextColor(...COLOR_CHARCOAL)
  doc.text(`La présente facture est arrêtée à la somme nette de :`, marginX, curY + 11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLOR_GOLD)
  doc.text(`${formatFcfa(order.total)} TTC`, marginX, curY + 16)

  if (order.notes) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(...COLOR_MUTED)
    doc.text('Note client :', marginX, curY + 22)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...COLOR_BLACK)
    const splitNotes = doc.splitTextToSize(order.notes, leftNotesWidth)
    doc.text(splitNotes, marginX, curY + 26.5)
  }

  // 6. SCEAU OFFICIEL DORÉ & SIGNATURE
  curY += 46
  if (curY > pageHeight - 45) {
    doc.addPage()
    curY = 20
  }

  // Sceau sans "Douala Cameroun", juste "MAISON MEM'S" et "CERTIFIÉ"
  const sealCenterX = marginX + 32
  const sealCenterY = curY + 10

  doc.setDrawColor(...COLOR_GOLD)
  doc.setLineWidth(0.6)
  doc.circle(sealCenterX, sealCenterY, 11)

  doc.setLineWidth(0.2)
  doc.circle(sealCenterX, sealCenterY, 9.5)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(5.5)
  doc.setTextColor(...COLOR_GOLD)
  doc.text('MAISON MEM\'S', sealCenterX, sealCenterY - 2.5, { align: 'center' })
  doc.setFontSize(5)
  doc.text('★', sealCenterX, sealCenterY + 0.8, { align: 'center' })
  doc.setFontSize(5.5)
  doc.text('CERTIFIÉ', sealCenterX, sealCenterY + 4, { align: 'center' })

  // Signature
  const sigX = marginX + 50
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...COLOR_BLACK)
  doc.text('POUR LA DIRECTION / MAISON MEM\'S', sigX, curY + 4)

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(7)
  doc.setTextColor(...COLOR_MUTED)
  doc.text('Signature & Cachet Officiels Numérisés', sigX, curY + 8)

  doc.setFont('courier', 'bolditalic')
  doc.setFontSize(9)
  doc.setTextColor(...COLOR_GOLD)
  doc.text('Maison Mem\'s Haute Couture', sigX, curY + 15)

  // Message de remerciement et politique d'échange
  const policyX = pageWidth - marginX
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...COLOR_GOLD)
  doc.text('MERCI POUR VOTRE CONFIANCE', policyX, curY + 4, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.8)
  doc.setTextColor(...COLOR_MUTED)
  doc.text('Chaque création MEM\'S est confectionnée avec soin et passion.', policyX, curY + 8.5, { align: 'right' })
  doc.text('Échange possible sous 7 jours ouvrés sur présentation de cette facture.', policyX, curY + 12.5, { align: 'right' })
  doc.text('Articles non portés, dans leur housse ou packaging d\'origine.', policyX, curY + 16.5, { align: 'right' })

  // 7. PIED DE PAGE RÉGLEMENTAIRE
  const footerY = pageHeight - 11
  doc.setDrawColor(...COLOR_GOLD)
  doc.setLineWidth(0.4)
  doc.line(marginX, footerY - 4, pageWidth - marginX, footerY - 4)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  doc.setTextColor(...COLOR_MUTED)
  doc.text(
    `Maison MEM'S - Yaoundé, Cameroun  •  WhatsApp Service Client : ${phone}  •  contact@mems-concept.com`,
    pageWidth / 2,
    footerY,
    { align: 'center' }
  )

  doc.setFontSize(5.8)
  doc.text(
    'Société enregistrée au RCCM de Yaoundé  •  Facture originale générée par le système officiel de vente MEM\'S',
    pageWidth / 2,
    footerY + 3.2,
    { align: 'center' }
  )

  return doc
}

/**
 * Télécharge directement la facture PDF
 */
export const downloadInvoicePdf = async (
  order: OrderData,
  settings?: StoreInvoiceSettings
) => {
  const doc = await buildInvoicePdfDocument(order, settings)
  const filename = `Facture-${order.orderNumber || 'MEMS'}.pdf`
  doc.save(filename)
}

/**
 * Ouvre la facture PDF dans un nouvel onglet
 */
export const openInvoicePdfInNewTab = async (
  order: OrderData,
  settings?: StoreInvoiceSettings
) => {
  const doc = await buildInvoicePdfDocument(order, settings)
  const pdfBlob = doc.output('blob')
  const blobUrl = URL.createObjectURL(pdfBlob)
  window.open(blobUrl, '_blank')
}
