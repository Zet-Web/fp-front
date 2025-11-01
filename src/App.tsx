import { Header } from "/apps/header/Header"
import { Navigation } from "/apps/navigation/Navigation"
import { Chats } from "/apps/chats/Chats"
import { MobileNav } from "/apps/mobileNav/MobileNav"
import { ProfilePage } from "/apps/profile/src/ProfilePage"
import { AuthPage } from "/apps/auth/src/AuthPage"
import { SettingsPage } from "/apps/settings/src/SettingsPage"
import { HomePage } from "/apps/home/HomePage"
import { PostPage } from "/apps/post/src/PostPage"
import { TestPage } from "/apps/test/src/TestPage"
import { YurServicePage } from "/apps/yurservice/YurServicePage"
import { NetworkPage } from "/apps/network/NetworkPage"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Routes, Route, useLocation } from "react-router-dom"
import { AuthProvider } from "@/components/auth-provider"
import { NotFoundPage } from "/apps/404/404Page"
import { SidebarProvider } from "@/contexts/sidebar-context"

function AppContent() {
  const location = useLocation()

  const fullWidthRoutes = ['/yurservice', '/network']
  const isFullWidth = fullWidthRoutes.includes(location.pathname)

  return (
    <div className="h-full w-full flex flex-col bg-background text-foreground overflow-hidden">
      <div className="flex flex-1 min-h-0">
        <Navigation />
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <main className="flex-1 p-4 overflow-y-auto">
            <div className={isFullWidth ? 'w-full' : 'max-w-7xl mx-auto'}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/post" element={<PostPage />} />
                <Route path="/post/:urlCode" element={<PostPage />} />
                <Route path="/yurservice" element={<YurServicePage />} />
                <Route path="/network" element={<NetworkPage />} />
                <Route path="/:username" element={<ProfilePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/chats" element={<div className="lg:hidden h-full"><Chats /></div>} />
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </main>
        </div>
        <div className="hidden lg:block p-4">
          <Chats />
        </div>
      </div>
      <MobileNav />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <SidebarProvider>
          <AppContent />
        </SidebarProvider>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  )
}

export default App