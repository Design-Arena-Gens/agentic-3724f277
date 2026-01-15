import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculadora de Productos Digitales',
  description: 'Calcula la rentabilidad de tu producto digital',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
