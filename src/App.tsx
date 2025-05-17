
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PackingList from "./pages/PackingList";
import Destinations from "./pages/Destinations";
import Currency from "./pages/Currency";
import Planner from "./pages/Planner";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ThemeProvider";
import TravelGallery from "./pages/TravelGallery";
import BudgetTracker from "./pages/BudgetTracker";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

// Create a simple auth context and provider
import { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  user: { name: string; email: string } | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Check localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("triptrove-user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email: string, password: string) => {
    // In a real app, you would validate credentials with an API
    // For now, simulate login if the user exists in localStorage
    const storedUsers = JSON.parse(localStorage.getItem("triptrove-users") || "[]");
    const matchedUser = storedUsers.find((u: any) => u.email === email);
    
    if (matchedUser && matchedUser.password === password) {
      const userInfo = { name: matchedUser.name, email: matchedUser.email };
      localStorage.setItem("triptrove-user", JSON.stringify(userInfo));
      setUser(userInfo);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password: string) => {
    // In a real app, you would send this data to an API
    // For now, store in localStorage
    const storedUsers = JSON.parse(localStorage.getItem("triptrove-users") || "[]");
    
    // Check if user already exists
    if (storedUsers.some((u: any) => u.email === email)) {
      return false; // User already exists
    }
    
    // Add new user
    const newUser = { name, email, password };
    storedUsers.push(newUser);
    localStorage.setItem("triptrove-users", JSON.stringify(storedUsers));
    
    // Auto-login after signup
    const userInfo = { name, email };
    localStorage.setItem("triptrove-user", JSON.stringify(userInfo));
    setUser(userInfo);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("triptrove-user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Home />} />
                <Route path="packing-list" element={<PackingList />} />
                <Route path="destinations" element={<Destinations />} />
                <Route path="currency" element={<Currency />} />
                <Route path="planner" element={<Planner />} />
                <Route path="travel-gallery" element={<TravelGallery />} />
                <Route path="budget-tracker" element={<BudgetTracker />} />
                <Route path="user-profile" element={<UserProfile />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
