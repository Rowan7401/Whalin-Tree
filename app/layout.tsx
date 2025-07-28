import type React from "react"
import "./globals.css"
import "../family-tree.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Whalin Family Tree",
  description: "Created with v0",
  generator: "v0.dev",
  icons: {
    icon: "/Whalin-Icon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}