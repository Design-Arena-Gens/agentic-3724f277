'use client'

import { useState } from 'react'

interface ProductData {
  productName: string
  price: number
  monthlyVisitors: number
  conversionRate: number
  platformFee: number
  marketingCost: number
}

export default function Home() {
  const [data, setData] = useState<ProductData>({
    productName: 'Curso Online',
    price: 97,
    monthlyVisitors: 1000,
    conversionRate: 2,
    platformFee: 5,
    marketingCost: 300
  })

  const [loading, setLoading] = useState(false)

  const monthlySales = Math.floor((data.monthlyVisitors * data.conversionRate) / 100)
  const grossRevenue = monthlySales * data.price
  const platformFees = grossRevenue * (data.platformFee / 100)
  const netRevenue = grossRevenue - platformFees - data.marketingCost
  const yearlyRevenue = netRevenue * 12
  const profitMargin = grossRevenue > 0 ? ((netRevenue / grossRevenue) * 100).toFixed(1) : 0

  const handleDownloadExcel = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Error al generar archivo')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `producto-digital-${data.productName.replace(/\s+/g, '-').toLowerCase()}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert('Error al descargar el archivo')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadNumbers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-numbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Error al generar archivo')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `producto-digital-${data.productName.replace(/\s+/g, '-').toLowerCase()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert('Error al descargar el archivo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: 'white', textAlign: 'center', fontSize: '2.5rem', marginBottom: '10px' }}>
          💰 Calculadora de Productos Digitales
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: '40px' }}>
          Calcula la rentabilidad de tu producto digital y descarga los números en Excel o Numbers
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {/* Input Panel */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, color: '#333', fontSize: '1.5rem' }}>📊 Datos del Producto</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '600' }}>
                Nombre del Producto
              </label>
              <input
                type="text"
                value={data.productName}
                onChange={(e) => setData({ ...data, productName: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '600' }}>
                Precio de Venta ($)
              </label>
              <input
                type="number"
                value={data.price}
                onChange={(e) => setData({ ...data, price: Number(e.target.value) })}
                style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '600' }}>
                Visitantes Mensuales
              </label>
              <input
                type="number"
                value={data.monthlyVisitors}
                onChange={(e) => setData({ ...data, monthlyVisitors: Number(e.target.value) })}
                style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '600' }}>
                Tasa de Conversión (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={data.conversionRate}
                onChange={(e) => setData({ ...data, conversionRate: Number(e.target.value) })}
                style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '600' }}>
                Comisión de Plataforma (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={data.platformFee}
                onChange={(e) => setData({ ...data, platformFee: Number(e.target.value) })}
                style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '600' }}>
                Costo de Marketing Mensual ($)
              </label>
              <input
                type="number"
                value={data.marketingCost}
                onChange={(e) => setData({ ...data, marketingCost: Number(e.target.value) })}
                style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Results Panel */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, color: '#333', fontSize: '1.5rem' }}>💎 Resultados</h2>

            <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Ventas Mensuales</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>{monthlySales}</div>
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Ingresos Brutos Mensuales</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>${grossRevenue.toLocaleString()}</div>
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Comisiones de Plataforma</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>-${platformFees.toLocaleString()}</div>
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Costo de Marketing</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>-${data.marketingCost.toLocaleString()}</div>
            </div>

            <div style={{ marginBottom: '20px', padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px' }}>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginBottom: '5px' }}>Ganancia Neta Mensual</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>${netRevenue.toLocaleString()}</div>
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', background: '#d4edda', borderRadius: '8px', border: '2px solid #28a745' }}>
              <div style={{ color: '#155724', fontSize: '14px', marginBottom: '5px' }}>Ganancia Anual Proyectada</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>${yearlyRevenue.toLocaleString()}</div>
            </div>

            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Margen de Ganancia</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>{profitMargin}%</div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <button
                onClick={handleDownloadExcel}
                disabled={loading}
                style={{
                  padding: '15px 25px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Generando...' : '📥 Descargar Excel (.xlsx)'}
              </button>

              <button
                onClick={handleDownloadNumbers}
                disabled={loading}
                style={{
                  padding: '15px 25px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Generando...' : '📥 Descargar CSV (Numbers)'}
              </button>
            </div>
          </div>
        </div>

        {/* Ideas Section */}
        <div style={{ marginTop: '40px', background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, color: '#333', fontSize: '1.8rem' }}>💡 Ideas de Productos Digitales Rentables</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📚</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#667eea' }}>Cursos Online</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Enseña tu expertise en video, texto o audio. Precio típico: $47-$997</p>
            </div>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📖</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#667eea' }}>eBooks</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Guías completas sobre temas específicos. Precio típico: $9-$49</p>
            </div>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎨</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#667eea' }}>Plantillas</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Diseños, documentos, código reutilizable. Precio típico: $19-$99</p>
            </div>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔧</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#667eea' }}>Software/Apps</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Herramientas SaaS con suscripción. Precio típico: $9-$99/mes</p>
            </div>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎵</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#667eea' }}>Audio/Música</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Beats, efectos de sonido, podcasts. Precio típico: $5-$199</p>
            </div>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#667eea' }}>Membresías</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Comunidad con contenido exclusivo. Precio típico: $19-$199/mes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
