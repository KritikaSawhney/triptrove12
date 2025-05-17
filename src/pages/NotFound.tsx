
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

// Animated star component for twinkling effect
const TwinklingStar = ({ delay, x, y, size = 4 }: { delay: number; x: number; y: number; size?: number }) => (
  <motion.div 
    className="absolute text-accent/30"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 0.2, scale: 0.8 }}
    animate={{ 
      opacity: [0.2, 1, 0.2],
      scale: [0.8, 1.2, 0.8],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      repeatType: "loop"
    }}
  >
    <Star size={size} fill="currentColor" />
  </motion.div>
);

// Animated falling star
const FallingStar = ({ delay, startX, startY }: { delay: number; startX: number; startY: number }) => (
  <motion.div 
    className="absolute text-accent"
    style={{ left: `${startX}%`, top: `${startY}%` }}
    initial={{ opacity: 1, scale: 0.8 }}
    animate={{ 
      opacity: [1, 0.5, 0],
      scale: [1, 0.6, 0.2],
      x: [0, 100, 200],
      y: [0, 100, 200],
      rotate: [0, 45, 90]
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      repeatType: "loop"
    }}
  >
    <Star size={4} fill="currentColor" />
  </motion.div>
);

const NotFound = () => {
  const location = useLocation();
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    size: Math.random() * 6 + 2
  }));
  
  const fallingStars = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    startX: Math.random() * 80,
    startY: Math.random() * 40,
    delay: Math.random() * 10
  }));

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Text animation variants
  const letterVariants = {
    initial: { opacity: 0, y: 50 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    })
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center relative overflow-hidden">
      {/* Twinkling stars in background */}
      {stars.map((star) => (
        <TwinklingStar 
          key={star.id}
          delay={star.delay} 
          x={star.x} 
          y={star.y} 
          size={star.size}
        />
      ))}
      
      {/* Falling stars */}
      {fallingStars.map((star) => (
        <FallingStar 
          key={`falling-${star.id}`}
          delay={star.delay} 
          startX={star.startX} 
          startY={star.startY} 
        />
      ))}
      
      <motion.h1 
        className="text-9xl font-bold text-primary mb-4 relative"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <motion.div
          className="absolute -inset-4 rounded-full opacity-20 bg-primary blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        404
      </motion.h1>
      
      <div className="mb-6 overflow-hidden">
        {["O", "o", "p", "s", "!", " ", "P", "a", "g", "e", " ", "n", "o", "t", " ", "f", "o", "u", "n", "d"].map((letter, i) => (
          <motion.span
            key={i}
            className="text-3xl font-semibold inline-block"
            variants={letterVariants}
            initial="initial"
            animate="animate"
            custom={i}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </div>
      
      <motion.p 
        className="text-xl text-muted-foreground mb-8 max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        We couldn't find the page you're looking for. Let's get you back on track.
      </motion.p>
      
      <motion.div 
        className="flex gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <motion.div 
          whileHover={{ scale: 1.05, rotate: [-1, 1, -1], transition: { rotate: { repeat: Infinity, duration: 0.3 } } }} 
          whileTap={{ scale: 0.95 }}
        >
          <Button asChild className="relative overflow-hidden">
            <Link to="/">
              <motion.span className="absolute inset-0 bg-primary/20 rounded-md"
                animate={{ 
                  x: ["-100%", "100%"],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                  repeatDelay: 0.5
                }}
              />
              Return to Home
            </Link>
          </Button>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05, y: [0, -3, 0], transition: { y: { repeat: Infinity, duration: 0.6 } } }} 
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="outline" asChild className="backdrop-blur-sm border-primary/20">
            <Link to="/destinations">Explore Destinations</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
