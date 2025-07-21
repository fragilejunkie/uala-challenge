import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Transaction } from '@/types/transaction'

function loadLogoPng(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = '/logo-uala.png' // served by Next.js public folder
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

export async function exportTransactionsPdf(
  rows: Transaction[],
  fileLabel: string //  e.g. "2023-10-01_2023-10-05"
) {
  const doc = new jsPDF('p', 'mm', 'a4')

  const logo = await loadLogoPng()
  doc.addImage(logo, 'PNG', 14, 10, 20, 4.5) // tweak size to taste

  doc.setFontSize(12)

  autoTable(doc, {
    headStyles: { fillColor: [2, 42, 154] },
    head: [['Fecha', 'Tarjeta', 'Método', 'Cuotas', 'Monto']],
    body: rows.map((t) => [
      new Date(t.updatedAt).toLocaleDateString('es-AR'),
      t.card.toUpperCase(),
      t.paymentMethod.toUpperCase(),
      t.installments,
      new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
      }).format(t.amount),
    ]),
    startY: 20,
    styles: { fontSize: 10 },
  })

  doc.save(`transacciones_${fileLabel}.pdf`)
}
