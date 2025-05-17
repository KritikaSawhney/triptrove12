
import { Link } from 'react-router-dom';
import { Github, Twitter, Facebook, Instagram, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-muted py-12 mt-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Globe className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TripTrove</span>
          </Link>
          <p className="text-muted-foreground mb-4">
            Your smart travel companion for effortless trip planning, packing, and organizing.
          </p>
          <div className="flex space-x-4">
            <a href="https://x.com/" aria-label="Twitter" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://www.facebook.com/" aria-label="Facebook" className="text-muted-foreground hover:text-foreground transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com/?hl=en" aria-label="Instagram" className="text-muted-foreground hover:text-foreground transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://github.com/" aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-4">Features</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/packing-list" className="text-muted-foreground hover:text-foreground transition-colors">
                Packing Lists
              </Link>
            </li>
            <li>
              <Link to="/destinations" className="text-muted-foreground hover:text-foreground transition-colors">
                Destinations
              </Link>
            </li>
            <li>
              <Link to="/currency" className="text-muted-foreground hover:text-foreground transition-colors">
                Currency Converter
              </Link>
            </li>
            <li>
              <Link to="/planner" className="text-muted-foreground hover:text-foreground transition-colors">
                Trip Planner
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/user-profile" className="text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/planner" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/currency" className="text-muted-foreground hover:text-foreground transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/travel-gallery" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/user-profile" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mt-12 pt-6 border-t">
        <p className="text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} TripTrove. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
