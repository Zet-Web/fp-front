import { Header } from "/apps/header/Header";
import { Navigation } from "/apps/navigation/Navigation";
// import { Chats } from "/apps/chats/Chats";
import { MobileNav } from "/apps/mobileNav/MobileNav";
import { ProfilePage } from "/apps/profile/src/ProfilePage";
import { AuthPage } from "/apps/auth/src/AuthPage";
import { SettingsPage } from "/apps/settings/src/SettingsPage";
import { HomePage } from "/apps/home/HomePage";
import { PostPage } from "/apps/post/src/PostPage";
import { TestPage } from "/apps/test/src/TestPage";
import { YurServicePage } from "/apps/yurservice/YurServicePage";
import { NetworkPage } from "/apps/network/NetworkPage";
import ContragentPage from "/apps/contragent/ContragentPage";
import SplitPage from "/apps/split/SplitPage";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuthContext } from "@/components/auth-provider";
import { NotFoundPage } from "/apps/404/404Page";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { useMemo } from "react";

const fullWidthRoutes = ["/yurservice", "/network"];

function AppContent() {
  const location = useLocation();

  const isFullWidth = useMemo(
    () => fullWidthRoutes.includes(location.pathname),
    [location.pathname]
  );

  const { loading } = useAuthContext();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-muted-foreground">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-background text-foreground overflow-hidden">
      <div className="flex flex-1 min-h-0">
        <Navigation />
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <main className="flex-1 p-4 overflow-y-auto">
            <div className={isFullWidth ? "w-full" : "max-w-7xl mx-auto"}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/post" element={<PostPage />} />
                <Route path="/post/:urlCode" element={<PostPage />} />
                <Route path="/yurservice" element={<YurServicePage />} />
                <Route path="/network" element={<NetworkPage />} />
                <Route path="/contragent" element={<ContragentPage />} />
                <Route path="/split" element={<SplitPage />} />
                <Route path="/:username" element={<ProfilePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/test" element={<TestPage />} />
                {/* <Route
                  path="/chats"
                  element={
                    <div className="lg:hidden h-full">
                      <Chats />
                    </div>
                  }
                /> */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </main>
        </div>
        {/* <div className="hidden lg:block p-4">
          <Chats />
        </div> */}
      </div>
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AuthProvider>
        <SidebarProvider>
          <AppContent />
        </SidebarProvider>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
