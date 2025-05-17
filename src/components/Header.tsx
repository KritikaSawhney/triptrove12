
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { Globe, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../App';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">TripTrove</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/packing-list" className="text-muted-foreground hover:text-foreground transition-colors">
            Packing Lists
          </Link>
          <Link to="/destinations" className="text-muted-foreground hover:text-foreground transition-colors">
            Destinations
          </Link>
          <Link to="/currency" className="text-muted-foreground hover:text-foreground transition-colors">
            Currency
          </Link>
          <Link to="/planner" className="text-muted-foreground hover:text-foreground transition-colors">
            Trip Planner
          </Link>
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/user-profile" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <User size={16} />
                <span>{user?.name}</span>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="default" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </nav>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-background border-b animate-fade-in">
          <nav className="container py-4 flex flex-col space-y-3">
            <Link 
              to="/packing-list" 
              className="py-2 px-4 hover:bg-muted rounded-md"
              onClick={toggleMenu}
            >
              Packing Lists
            </Link>
            <Link 
              to="/destinations" 
              className="py-2 px-4 hover:bg-muted rounded-md"
              onClick={toggleMenu}
            >
              Destinations
            </Link>
            <Link 
              to="/currency" 
              className="py-2 px-4 hover:bg-muted rounded-md"
              onClick={toggleMenu}
            >
              Currency
            </Link>
            <Link 
              to="/planner" 
              className="py-2 px-4 hover:bg-muted rounded-md"
              onClick={toggleMenu}
            >
              Trip Planner
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/user-profile" 
                  className="py-2 px-4 hover:bg-muted rounded-md flex items-center gap-2"
                  onClick={toggleMenu}
                >
                  <User size={16} />
                  {user?.name}
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }} 
                  className="mt-2 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="default" asChild className="mt-2">
                <Link to="/login" onClick={toggleMenu}>Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
