import { FavoritesProvider } from "@/components/favorites-provider"
import { Navbar } from "@/components/navbar"

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <FavoritesProvider>
      <Navbar />
      {children}
    </FavoritesProvider>
  )
}
