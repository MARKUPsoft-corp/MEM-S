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

// Cache mémoire des polices Montserrat en base64
let cachedMontserratFonts: { regular: string; bold: string } | null = null

export const loadMontserratFonts = async (): Promise<{ regular: string; bold: string } | null> => {
  if (cachedMontserratFonts) {
    return cachedMontserratFonts
  }

  if (typeof window === 'undefined') {
    return null
  }

  try {
    const [regRes, boldRes] = await Promise.all([
      fetch('/fonts/Montserrat-Regular.ttf'),
      fetch('/fonts/Montserrat-Bold.ttf')
    ])

    if (!regRes.ok || !boldRes.ok) {
      return null
    }

    const [regBlob, boldBlob] = await Promise.all([regRes.blob(), boldRes.blob()])

    const blobToBase64 = (blob: Blob): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const res = reader.result as string
          resolve(res.includes(',') ? res.split(',')[1] : res)
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    }

    const [regular, bold] = await Promise.all([blobToBase64(regBlob), blobToBase64(boldBlob)])
    cachedMontserratFonts = { regular, bold }
    return cachedMontserratFonts
  } catch (err) {
    console.warn('[Invoice] Impossible de charger les fichiers TTF Montserrat:', err)
    return null
  }
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
    case 'confirmed': return 'CONFIRMÉE'
    case 'shipped': return 'EXPÉDIÉE'
    case 'delivered': return 'LIVRÉE'
    case 'cancelled': return 'ANNULÉE'
    default: return 'EN ATTENTE'
  }
}

/**
 * Construit le document PDF 100% vectoriel pur pour une commande MEM'S :
 * - Tous les textes sont vectoriels, sélectionnables et copiables
 * - Police réelle Montserrat intégrée
 * - Disposition et typographie rigoureusement identiques à l'aperçu de la modale
 * - Logo officiel MEM'S, bordures or, encadrés, tableau autoTable et sceau officiel
 * - "Yaoundé" partout sans aucune mention de Douala
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

  // Chargement et enregistrement des polices Montserrat natives
  let fontName = 'helvetica'
  try {
    const fonts = await loadMontserratFonts()
    if (fonts) {
      doc.addFileToVFS('Montserrat-Regular.ttf', fonts.regular)
      doc.addFont('Montserrat-Regular.ttf', 'Montserrat', 'normal')

      doc.addFileToVFS('Montserrat-Bold.ttf', fonts.bold)
      doc.addFont('Montserrat-Bold.ttf', 'Montserrat', 'bold')

      fontName = 'Montserrat'
    }
  } catch (err) {
    console.warn('[Invoice] Utilisation de la police de secours:', err)
  }

  // Palette Charte Graphique MEM'S
  const COLOR_BLACK = [11, 11, 11] as [number, number, number]       // #0B0B0B
  const COLOR_GOLD = [201, 164, 108] as [number, number, number]     // #C9A46C
  const COLOR_IVORY = [245, 242, 236] as [number, number, number]    // #F5F2EC
  const COLOR_CREAM = [250, 248, 245] as [number, number, number]    // #FAF8F5
  const COLOR_BORDER = [229, 224, 216] as [number, number, number]   // #E5E0D8
  const COLOR_MUTED = [119, 119, 119] as [number, number, number]    // #777777
  const COLOR_CHARCOAL = [68, 68, 68] as [number, number, number]   // #444444
  const COLOR_GREEN = [15, 81, 50] as [number, number, number]       // #0F5132

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
  doc.rect(8.5, 8.5, pageWidth - 17, pageHeight - 17)

  // 2. EN-TÊTE : Logo officiel MEM'S & Identité de marque (Logo agrandi et prestigieux)
  let curY = 11.5
  const logoSize = 28 // Agrandissement à 28x28 mm (présence imposante de marque)

  // Logo officiel MEM'S (sur la gauche)
  try {
    const logoBase64 = await loadLogoBase64('/images/LOGO.png')
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', marginX, curY, logoSize, logoSize, undefined, 'FAST')
    }
  } catch (err) {
    console.warn('[Invoice] Erreur affichage logo:', err)
  }

  // Marque et coordonnées (à droite du logo agrandi)
  const brandX = marginX + logoSize + 4 // 46 mm
  doc.setFont(fontName, 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...COLOR_BLACK)
  doc.text('MAISON MEM\'S', brandX, curY + 6.5)

  doc.setFont(fontName, 'bold')
  doc.setFontSize(6.2)
  doc.setTextColor(...COLOR_GOLD)
  doc.text('HAUTE COUTURE AFRICAINE & PRÊT-À-PORTER DE PRESTIGE', brandX, curY + 11.5)

  doc.setFont(fontName, 'normal')
  doc.setFontSize(6.8)
  doc.setTextColor(...COLOR_MUTED)
  const city = settings?.address && !settings.address.toLowerCase().includes('douala')
    ? settings.address
    : 'Yaoundé, République du Cameroun'
  const phone = settings?.contactPhone || settings?.whatsappNumber || '+237 6 96 96 26 62'
  const email = settings?.contactEmail || 'contact@mems-concept.com'
  doc.text(`${city}  •  Tél / WhatsApp : ${phone}`, brandX, curY + 17)
  doc.text(`Email : ${email}  •  Web : www.mems-couture.com`, brandX, curY + 21.5)

  // Métadonnées Facture (Aligné à droite)
  const rightX = pageWidth - marginX
  doc.setFont(fontName, 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...COLOR_BLACK)
  doc.text('FACTURE', rightX, curY + 6.5, { align: 'right' })

  // Référence Facture
  const invoiceRef = order.orderNumber ? `FAC-${order.orderNumber}` : 'FAC-000000'
  doc.setFont('courier', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(...COLOR_GOLD)
  doc.text(invoiceRef, rightX, curY + 12, { align: 'right' })

  // Date d'émission
  doc.setFont(fontName, 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...COLOR_MUTED)
  doc.text(`Émise le : ${formatLongDate(order.createdAt)}`, rightX, curY + 17, { align: 'right' })

  // Statut sous forme de badge pill
  const statusLabel = getStatusLabel(order.status)
  doc.setFont(fontName, 'bold')
  doc.setFontSize(6.5)

  const pillTextWidth = doc.getTextWidth(statusLabel) + 7
  const pillHeight = 5
  const pillX = rightX - pillTextWidth
  const pillY = curY + 19.5

  if (order.status === 'confirmed' || order.status === 'delivered') {
    doc.setFillColor(209, 231, 221) // #D1E7DD
    doc.setTextColor(15, 81, 50)
  } else {
    doc.setFillColor(255, 243, 205) // #FFF3CD
    doc.setTextColor(133, 100, 4)
  }
  doc.roundedRect(pillX, pillY, pillTextWidth, pillHeight, 2, 2, 'F')
  doc.text(statusLabel, pillX + (pillTextWidth / 2), pillY + 3.5, { align: 'center' })

  // Double ligne de séparation dorée sous l'en-tête
  curY += logoSize + 4.5
  doc.setDrawColor(...COLOR_GOLD)
  doc.setLineWidth(0.5)
  doc.line(marginX, curY, rightX, curY)

  doc.setDrawColor(...COLOR_BORDER)
  doc.setLineWidth(0.15)
  doc.line(marginX, curY + 1, rightX, curY + 1)

  // 3. BLOCS COORDONNÉES : ÉMETTEUR & CLIENT
  curY += 5
  const boxWidth = (contentWidth - 6) / 2
  const boxHeight = 29

  // Bloc Émetteur (Gauche)
  doc.setFillColor(...COLOR_CREAM)
  doc.setDrawColor(...COLOR_BORDER)
  doc.setLineWidth(0.2)
  doc.roundedRect(marginX, curY, boxWidth, boxHeight, 1.5, 1.5, 'FD')

  // Bandeau vertical or
  doc.setFillColor(...COLOR_GOLD)
  doc.rect(marginX, curY, 1.2, boxHeight, 'F')

  doc.setFont(fontName, 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(...COLOR_GOLD)
  doc.text('ÉMETTEUR / MAISON DE COUTURE', marginX + 4.5, curY + 5)

  doc.setFont(fontName, 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...COLOR_BLACK)
  doc.text(settings?.storeName || 'Maison MEM\'S', marginX + 4.5, curY + 10)

  doc.setFont(fontName, 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...COLOR_CHARCOAL)
  doc.text(`${city}`, marginX + 4.5, curY + 15)
  doc.text(`${phone}`, marginX + 4.5, curY + 19.5)
  doc.setFontSize(6)
  doc.setTextColor(...COLOR_MUTED)
  doc.text(`RCCM : RC/YAO/2024/B/1842  •  NUI : M032412895412`, marginX + 4.5, curY + 24.5)

  // Bloc Client / Facturé à (Droite)
  const clientX = marginX + boxWidth + 6
  doc.setFillColor(...COLOR_CREAM)
  doc.setDrawColor(...COLOR_BORDER)
  doc.setLineWidth(0.2)
  doc.roundedRect(clientX, curY, boxWidth, boxHeight, 1.5, 1.5, 'FD')

  // Bandeau vertical noir
  doc.setFillColor(...COLOR_BLACK)
  doc.rect(clientX, curY, 1.2, boxHeight, 'F')

  doc.setFont(fontName, 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(...COLOR_BLACK)
  doc.text('FACTURÉ À / DESTINATAIRE', clientX + 4.5, curY + 5)

  const customerName = order.customer?.name || 'Client Particulier'
  doc.setFont(fontName, 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...COLOR_BLACK)
  doc.text(customerName.toUpperCase(), clientX + 4.5, curY + 10)

  doc.setFont(fontName, 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...COLOR_CHARCOAL)
  const custPhone = order.customer?.phone || 'Téléphone non renseigné'
  doc.text(custPhone, clientX + 4.5, curY + 15)

  const custEmail = order.customer?.email || ''
  if (custEmail) {
    doc.text(custEmail, clientX + 4.5, curY + 19.5)
  }

  const custAddress = [order.customer?.address, order.customer?.city, 'Cameroun']
    .filter(Boolean)
    .join(', ')
  doc.text(custAddress, clientX + 4.5, custEmail ? curY + 24 : curY + 19.5)

  // 4. TABLEAU VECTORIEL DES ARTICLES (via autoTable)
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
      variantDesc || 'Standard / Sur mesure',
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
    head: [['N°', 'DÉSIGNATION DE L\'ARTICLE', 'OPTION / TAILLE', 'QTÉ', 'PRIX UNIT.', 'TOTAL']],
    body: tableRows,
    theme: 'plain',
    margin: { left: marginX, right: marginX },
    styles: {
      font: fontName,
      fontSize: 7.5,
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
      fontSize: 7,
      halign: 'left',
      cellPadding: { top: 3.5, bottom: 3.5, left: 3, right: 3 }
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center', textColor: COLOR_MUTED },
      1: { cellWidth: 'auto', fontStyle: 'bold' },
      2: { cellWidth: 42, textColor: COLOR_MUTED, fontSize: 7 },
      3: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
      4: { cellWidth: 32, halign: 'right', textColor: COLOR_CHARCOAL },
      5: { cellWidth: 35, halign: 'right', fontStyle: 'bold', textColor: COLOR_BLACK }
    },
    alternateRowStyles: {
      fillColor: COLOR_CREAM
    }
  })

  let tableEndY = (doc as any).lastAutoTable?.finalY || (curY + 40)

  // 5. RÉCAPITULATIF FINANCIER & ARRÊTÉ DE COMPTE
  curY = tableEndY + 5

  if (curY > pageHeight - 80) {
    doc.addPage()
    curY = 20
  }

  const totalsBoxWidth = 82
  const totalsBoxX = pageWidth - marginX - totalsBoxWidth
  const leftBoxWidth = contentWidth - totalsBoxWidth - 6

  // Boîte Arrêté de compte (Gauche)
  doc.setFillColor(...COLOR_CREAM)
  doc.setDrawColor(...COLOR_BORDER)
  doc.setLineWidth(0.2)
  doc.roundedRect(marginX, curY, leftBoxWidth, 34, 1.5, 1.5, 'FD')

  doc.setFont(fontName, 'bold')
  doc.setFontSize(6.8)
  doc.setTextColor(...COLOR_BLACK)
  doc.text('ARRÊTÉ DE COMPTE :', marginX + 4.5, curY + 5)

  doc.setFont(fontName, 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...COLOR_CHARCOAL)
  doc.text('La présente facture est arrêtée à la somme nette de :', marginX + 4.5, curY + 10)

  doc.setFont(fontName, 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(...COLOR_GOLD)
  doc.text(`${formatFcfa(order.total)} TTC`, marginX + 4.5, curY + 16)

  if (order.notes) {
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(marginX + 4.5, curY + 19, leftBoxWidth - 9, 11, 1, 1, 'F')
    doc.setDrawColor(...COLOR_GOLD)
    doc.setLineWidth(0.5)
    doc.line(marginX + 4.5, curY + 19, marginX + 4.5, curY + 30)

    doc.setFont(fontName, 'bold')
    doc.setFontSize(5.8)
    doc.setTextColor(...COLOR_GOLD)
    doc.text('Note / Instruction client :', marginX + 6.5, curY + 22.5)

    doc.setFont(fontName, 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(...COLOR_CHARCOAL)
    const splitNotes = doc.splitTextToSize(order.notes, leftBoxWidth - 14)
    doc.text(splitNotes, marginX + 6.5, curY + 26.5)
  }

  // Boîte Totaux Financiers (Droite)
  doc.setFillColor(...COLOR_CREAM)
  doc.setDrawColor(...COLOR_BORDER)
  doc.setLineWidth(0.2)
  doc.roundedRect(totalsBoxX, curY, totalsBoxWidth, 34, 1.5, 1.5, 'FD')

  let totY = curY + 6
  doc.setFont(fontName, 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...COLOR_MUTED)
  doc.text('Sous-total brut :', totalsBoxX + 4.5, totY)
  doc.setFont(fontName, 'bold')
  doc.setTextColor(...COLOR_BLACK)
  const subtotalVal = order.subtotal || order.total || 0
  doc.text(formatFcfa(subtotalVal), totalsBoxX + totalsBoxWidth - 4.5, totY, { align: 'right' })

  totY += 6
  doc.setFont(fontName, 'normal')
  doc.setTextColor(...COLOR_MUTED)
  doc.text('Frais d\'expédition :', totalsBoxX + 4.5, totY)
  doc.setFont(fontName, 'bold')
  doc.setTextColor(...COLOR_GREEN)
  doc.text('Offerte (0 FCFA)', totalsBoxX + totalsBoxWidth - 4.5, totY, { align: 'right' })

  // Total Net TTC en noir avec accent doré
  totY += 4
  const netBoxY = totY
  doc.setFillColor(...COLOR_BLACK)
  doc.roundedRect(totalsBoxX + 3, netBoxY, totalsBoxWidth - 6, 12, 1.5, 1.5, 'F')

  doc.setFont(fontName, 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...COLOR_GOLD)
  doc.text('TOTAL NET TTC', totalsBoxX + 6.5, netBoxY + 7)

  doc.setFont(fontName, 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(255, 255, 255)
  doc.text(formatFcfa(order.total), totalsBoxX + totalsBoxWidth - 6.5, netBoxY + 7, { align: 'right' })

  // 6. BLOC DU BAS UNIFIÉ : SCEAU D'AUTHENTICITÉ, SIGNATURE, REMERCIEMENT & PIED DE PAGE LÉGAL
  const totalsEndY = curY + 34
  const bottomBlockHeight = 44

  // Ancrage élégant en bas de l'encadré A4 pour les factures 1 page, ou enchaînement naturel si tableau plus long
  let targetBottomY = Math.max(totalsEndY + 8, pageHeight - 16 - bottomBlockHeight)

  // Si le contenu déborde de la page 1, basculer sur une page 2 et redessiner le double cadre
  if (targetBottomY + bottomBlockHeight > pageHeight - 10) {
    doc.addPage()
    doc.setDrawColor(...COLOR_GOLD)
    doc.setLineWidth(0.4)
    doc.rect(7, 7, pageWidth - 14, pageHeight - 14)
    doc.setDrawColor(...COLOR_BORDER)
    doc.setLineWidth(0.15)
    doc.rect(8.5, 8.5, pageWidth - 17, pageHeight - 17)
    targetBottomY = pageHeight - 16 - bottomBlockHeight
  }

  // A. Sceau circulaire doré (sans mention de Douala, épuré officiel)
  const sealCenterX = marginX + 18
  const sealCenterY = targetBottomY + 11
  const sealRadius = 10

  // Cercle extérieur or
  doc.setDrawColor(...COLOR_GOLD)
  doc.setLineWidth(0.6)
  doc.circle(sealCenterX, sealCenterY, sealRadius)

  // Cercle pointillé intérieur or
  doc.setLineWidth(0.2)
  doc.circle(sealCenterX, sealCenterY, sealRadius - 1.5)

  // Texte dans le sceau : MAISON MEM'S ★ CERTIFIÉ
  doc.setFont(fontName, 'bold')
  doc.setFontSize(4.8)
  doc.setTextColor(...COLOR_GOLD)
  doc.text('MAISON MEM\'S', sealCenterX, sealCenterY - 2.5, { align: 'center' })
  doc.setFontSize(5.5)
  doc.text('★', sealCenterX, sealCenterY + 0.8, { align: 'center' })
  doc.setFontSize(4.8)
  doc.text('CERTIFIÉ', sealCenterX, sealCenterY + 4, { align: 'center' })

  // B. Titre Direction et Signature Calligraphique
  const sigX = marginX + 34
  doc.setFont(fontName, 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...COLOR_BLACK)
  doc.text('POUR LA DIRECTION / MAISON MEM\'S', sigX, targetBottomY + 4.5)

  doc.setFont(fontName, 'normal')
  doc.setFontSize(6.2)
  doc.setTextColor(...COLOR_MUTED)
  doc.text('Service Facturation & Confection', sigX, targetBottomY + 8.5)

  doc.setFont('times', 'bolditalic')
  doc.setFontSize(10.5)
  doc.setTextColor(...COLOR_GOLD)
  doc.text('Maison Mem\'s Haute Couture', sigX, targetBottomY + 15.5)

  // C. Gratitude & Conditions sur la droite
  doc.setFont(fontName, 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...COLOR_GOLD)
  doc.text('MERCI POUR VOTRE CONFIANCE', rightX, targetBottomY + 4.5, { align: 'right' })

  doc.setFont(fontName, 'normal')
  doc.setFontSize(6)
  doc.setTextColor(...COLOR_MUTED)
  doc.text('Chaque création MEM\'S est façonnée selon les règles de l\'art.', rightX, targetBottomY + 8.5, { align: 'right' })
  doc.text('Échange possible sous 7 jours ouvrés sur présentation de cette facture.', rightX, targetBottomY + 12, { align: 'right' })
  doc.text('Articles neufs, non portés, avec étiquettes et emballage d\'origine.', rightX, targetBottomY + 15.5, { align: 'right' })

  // D. Filet de séparation or
  const separatorY = targetBottomY + 26
  doc.setDrawColor(...COLOR_GOLD)
  doc.setLineWidth(0.35)
  doc.line(marginX, separatorY, rightX, separatorY)

  // E. Pied de page légal et réglementaire (3 lignes parfaitement centrées, strictement dans l'encadré)
  doc.setFont(fontName, 'normal')
  doc.setFontSize(6.2)
  doc.setTextColor(...COLOR_MUTED)
  doc.text(
    `Maison MEM'S • Haute Couture Africaine & Confection de Prestige • ${city}`,
    pageWidth / 2,
    separatorY + 4.2,
    { align: 'center' }
  )

  doc.setFontSize(6)
  doc.text(
    `WhatsApp Service Client : ${phone}  •  Email : ${email}`,
    pageWidth / 2,
    separatorY + 7.5,
    { align: 'center' }
  )

  doc.setFontSize(5.5)
  doc.text(
    'Société enregistrée au RCCM de Yaoundé  •  Document officiel généré par le système informatique de vente MEM\'S',
    pageWidth / 2,
    separatorY + 10.7,
    { align: 'center' }
  )

  return doc
}

/**
 * Télécharge la facture PDF 100% vectorielle (texte sélectionnable/copiable, police Montserrat, layout identique)
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
 * Ouvre la facture PDF vectorielle dans un nouvel onglet
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
