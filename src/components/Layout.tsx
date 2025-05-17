
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import FlyingAirplane from './FlyingAirplane';
import { useTheme } from './ThemeProvider';

const Layout = () => {
  const location = useLocation();
  const { theme } = useTheme();
  
  // Use a darker blue color for the airplane in light mode for better visibility
  const airplaneColor = theme === 'light' ? "#0c4a6e" : "white"; // Dark blue for light mode, white for dark mode
  
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      
      {/* Flying Airplane Animation with dynamic color based on theme */}
      <FlyingAirplane color={airplaneColor} />
      
      {/* Page Transitions */}
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          className="flex-grow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default Layout;
