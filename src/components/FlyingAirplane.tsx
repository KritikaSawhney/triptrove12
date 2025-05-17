
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FlyingAirplaneProps {
  size?: number;
  duration?: number;
  color?: string;
}

const FlyingAirplane = ({ size = 96, duration = 10, color = "currentColor" }: FlyingAirplaneProps) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      style={{ color }}
      initial={{ x: -200, y: 100, rotate: 25 }}
      animate={{ 
        x: windowWidth + 200,
        y: [100, 300, 150, 400, 200, 150],
        rotate: [25, 15, 25, 15, 25, 10]
      }}
      transition={{ 
        duration,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 5
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          filter: ["drop-shadow(0 0 15px rgba(255,255,255,0.7))", "drop-shadow(0 0 25px rgba(255,255,255,0.9))", "drop-shadow(0 0 15px rgba(255,255,255,0.7))"]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <Plane size={size} className="drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]" strokeWidth={2} />
      </motion.div>
    </motion.div>
  );
};

export default FlyingAirplane;
