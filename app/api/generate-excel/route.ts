import { NextRequest, NextResponse } from 'next/server'
import ExcelJS from 'exceljs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Producto Digital')

    // Title
    worksheet.mergeCells('A1:D1')
    const titleCell = worksheet.getCell('A1')
    titleCell.value = '💰 ANÁLISIS DE PRODUCTO DIGITAL'
    titleCell.font = { size: 18, bold: true, color: { argb: 'FFFFFFFF' } }
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' }
    }
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getRow(1).height = 35

    // Product name
    worksheet.mergeCells('A2:D2')
    const productCell = worksheet.getCell('A2')
    productCell.value = data.productName
    productCell.font = { size: 14, bold: true }
    productCell.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getRow(2).height = 25

    // Headers
    worksheet.getRow(4).height = 25
    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFFFF' } },
      fill: {
        type: 'pattern' as const,
        pattern: 'solid' as const,
        fgColor: { argb: 'FF764BA2' }
      },
      alignment: { vertical: 'middle' as const, horizontal: 'center' as const }
    }

    worksheet.getCell('A4').value = 'PARÁMETRO'
    worksheet.getCell('B4').value = 'VALOR'
    worksheet.getCell('A4').style = headerStyle
    worksheet.getCell('B4').style = headerStyle

    // Input data
    const inputData = [
      ['Precio de Venta', `$${data.price}`],
      ['Visitantes Mensuales', data.monthlyVisitors.toLocaleString()],
      ['Tasa de Conversión', `${data.conversionRate}%`],
      ['Comisión de Plataforma', `${data.platformFee}%`],
      ['Costo de Marketing Mensual', `$${data.marketingCost}`]
    ]

    let currentRow = 5
    inputData.forEach(([param, value]) => {
      worksheet.getCell(`A${currentRow}`).value = param
      worksheet.getCell(`B${currentRow}`).value = value
      worksheet.getCell(`A${currentRow}`).font = { bold: true }
      worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'right' }
      currentRow++
    })

    // Calculations
    currentRow += 2
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`)
    const resultsTitle = worksheet.getCell(`A${currentRow}`)
    resultsTitle.value = 'RESULTADOS FINANCIEROS'
    resultsTitle.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } }
    resultsTitle.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' }
    }
    resultsTitle.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getRow(currentRow).height = 25

    currentRow++
    worksheet.getCell(`A${currentRow}`).value = 'MÉTRICA'
    worksheet.getCell(`B${currentRow}`).value = 'VALOR'
    worksheet.getCell(`A${currentRow}`).style = headerStyle
    worksheet.getCell(`B${currentRow}`).style = headerStyle

    const monthlySales = Math.floor((data.monthlyVisitors * data.conversionRate) / 100)
    const grossRevenue = monthlySales * data.price
    const platformFees = grossRevenue * (data.platformFee / 100)
    const netRevenue = grossRevenue - platformFees - data.marketingCost
    const yearlyRevenue = netRevenue * 12
    const profitMargin = grossRevenue > 0 ? ((netRevenue / grossRevenue) * 100).toFixed(1) : 0

    currentRow++
    const results = [
      ['Ventas Mensuales', monthlySales],
      ['Ingresos Brutos Mensuales', `$${grossRevenue.toLocaleString()}`],
      ['Comisiones de Plataforma', `-$${platformFees.toLocaleString()}`],
      ['Costo de Marketing', `-$${data.marketingCost.toLocaleString()}`],
      ['Ganancia Neta Mensual', `$${netRevenue.toLocaleString()}`],
      ['Ganancia Anual Proyectada', `$${yearlyRevenue.toLocaleString()}`],
      ['Margen de Ganancia', `${profitMargin}%`]
    ]

    results.forEach(([metric, value], index) => {
      worksheet.getCell(`A${currentRow}`).value = metric
      worksheet.getCell(`B${currentRow}`).value = value
      worksheet.getCell(`A${currentRow}`).font = { bold: true }
      worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'right' }

      if (index === 4 || index === 5) {
        worksheet.getCell(`B${currentRow}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD4EDDA' }
        }
        worksheet.getCell(`B${currentRow}`).font = { bold: true, color: { argb: 'FF28A745' } }
      }

      currentRow++
    })

    // Column widths
    worksheet.getColumn('A').width = 30
    worksheet.getColumn('B').width = 20

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="producto-digital-${data.productName.replace(/\s+/g, '-').toLowerCase()}.xlsx"`
      }
    })
  } catch (error) {
    console.error('Error generating Excel:', error)
    return NextResponse.json({ error: 'Error generating file' }, { status: 500 })
  }
}
