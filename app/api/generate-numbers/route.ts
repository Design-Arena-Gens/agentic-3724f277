import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const monthlySales = Math.floor((data.monthlyVisitors * data.conversionRate) / 100)
    const grossRevenue = monthlySales * data.price
    const platformFees = grossRevenue * (data.platformFee / 100)
    const netRevenue = grossRevenue - platformFees - data.marketingCost
    const yearlyRevenue = netRevenue * 12
    const profitMargin = grossRevenue > 0 ? ((netRevenue / grossRevenue) * 100).toFixed(1) : 0

    // Create CSV content compatible with Numbers
    const csvContent = [
      ['ANÁLISIS DE PRODUCTO DIGITAL', ''],
      [data.productName, ''],
      ['', ''],
      ['PARÁMETROS DE ENTRADA', ''],
      ['Precio de Venta', `$${data.price}`],
      ['Visitantes Mensuales', data.monthlyVisitors],
      ['Tasa de Conversión', `${data.conversionRate}%`],
      ['Comisión de Plataforma', `${data.platformFee}%`],
      ['Costo de Marketing Mensual', `$${data.marketingCost}`],
      ['', ''],
      ['RESULTADOS FINANCIEROS', ''],
      ['Ventas Mensuales', monthlySales],
      ['Ingresos Brutos Mensuales', `$${grossRevenue.toLocaleString()}`],
      ['Comisiones de Plataforma', `-$${platformFees.toLocaleString()}`],
      ['Costo de Marketing', `-$${data.marketingCost.toLocaleString()}`],
      ['Ganancia Neta Mensual', `$${netRevenue.toLocaleString()}`],
      ['Ganancia Anual Proyectada', `$${yearlyRevenue.toLocaleString()}`],
      ['Margen de Ganancia', `${profitMargin}%`],
      ['', ''],
      ['IDEAS DE PRODUCTOS DIGITALES', ''],
      ['Cursos Online', '$47-$997'],
      ['eBooks', '$9-$49'],
      ['Plantillas', '$19-$99'],
      ['Software/Apps (SaaS)', '$9-$99/mes'],
      ['Audio/Música', '$5-$199'],
      ['Membresías', '$19-$199/mes']
    ]

    const csv = csvContent.map(row => row.join(',')).join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="producto-digital-${data.productName.replace(/\s+/g, '-').toLowerCase()}.csv"`
      }
    })
  } catch (error) {
    console.error('Error generating CSV:', error)
    return NextResponse.json({ error: 'Error generating file' }, { status: 500 })
  }
}
