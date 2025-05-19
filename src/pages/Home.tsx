import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Globe, 
  List, 
  DollarSign, 
  User, 
  Clock, 
  Image, 
  Wallet,
  Star,
  Sparkles,
  Plane
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState, useRef } from 'react';
import TypewriterText from '../components/TypewriterText';

// Animated 3D spinning globe component
const SpinningGlobe = () => {
  return (
    <motion.div
      className="absolute right-10 top-20 md:right-40 md:top-40 text-white opacity-60 pointer-events-none hidden md:block"
      animate={{ 
        rotate: 360,
        y: [0, -20, 0, 20, 0]
      }}
      transition={{ 
        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Globe size={120} strokeWidth={1} />
    </motion.div>
  );
};

// Animated star component for twinkling effect
const TwinklingStar = ({ delay, x, y, size = 4 }: { delay: number; x: number; y: number; size?: number }) => (
  <motion.div 
    className="absolute text-accent"
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

// Animated sparkle component
const AnimatedSparkle = ({ delay, x, y, size = 4 }: { delay: number; x: number; y: number; size?: number }) => (
  <motion.div 
    className="absolute text-primary"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 0, rotate: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      rotate: [0, 180, 360],
      scale: [0.8, 1.5, 0.8],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      repeatType: "loop"
    }}
  >
    <Sparkles size={size} />
  </motion.div>
);

// Floating clouds component
const FloatingClouds = () => {
  const clouds = Array(5).fill(null).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 30,
    size: 60 + Math.random() * 80, // Much bigger clouds (was 30 + Math.random() * 40)
    speed: 5 + Math.random() * 10  // Faster movement (was 10 + Math.random() * 20, lower is faster)
  }));

  return (
    <>
      {clouds.map(cloud => (
        <motion.div
          key={cloud.id}
          className="absolute text-white/20 pointer-events-none"
          style={{
            top: `${cloud.y}%`,
          }}
          initial={{ x: -200 }} // Start further outside the screen
          animate={{ 
            x: ['calc(-20%)', 'calc(120%)'],
          }}
          transition={{ 
            duration: cloud.speed,
            repeat: Infinity,
            delay: cloud.id * 2,
            ease: "linear"
          }}
        >
          <svg width={cloud.size} height={cloud.size * 0.6} viewBox="0 0 100 60" fill="currentColor">
            <path d="M93.8,45.2c-0.7-8.2-7.7-14.7-16.1-14.7c-3.3,0-6.3,1-8.8,2.6c-1.8-12-12.1-21.3-24.7-21.3c-13.8,0-25,11.2-25,25
            c0,0.4,0,0.7,0,1.1C8.2,39.8,0,48.8,0,59.7h93.8C97.1,53.9,95.1,48.2,93.8,45.2z" />
          </svg>
        </motion.div>
      ))}
    </>
  );
};

// 3D rotating travel icon
const Rotating3DIcon = ({ icon: Icon, delay = 0 }) => {
  return (
    <motion.div
      className="inline-block"
      animate={{ 
        rotateY: 360,
        scale: [1, 1.2, 1],
      }}
      transition={{ 
        rotateY: { 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay 
        },
        scale: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          delay: delay + 1
        }
      }}
    >
      <Icon size={28} className="text-primary" />
    </motion.div>
  );
};

const Home = () => {
  const [stars, setStars] = useState<{id: number; x: number; y: number; delay: number; size: number}[]>([]);
  const [sparkles, setSparkles] = useState<{id: number; x: number; y: number; delay: number; size: number}[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Generate random stars and sparkles
  useEffect(() => {
    const newStars = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 5 + 2
    }));
    
    const newSparkles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 4 + 2
    }));
    
    setStars(newStars);
    setSparkles(newSparkles);
  }, []);

  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX / width - 0.5) * 20;
      const y = (clientY / height - 0.5) * 20;
      
      heroRef.current.style.setProperty('--mouse-x', `${x}px`);
      heroRef.current.style.setProperty('--mouse-y', `${y}px`);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      {/* Hero Section with 3D parallax effect */}
      <section 
        ref={heroRef}
        className="relative bg-gradient-to-br from-primary to-secondary py-24 md:py-32 overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Floating clouds */}
        <FloatingClouds />
        
        {/* 3D spinning globe */}
        <SpinningGlobe />
        
        {/* Twinkling stars */}
        {stars.map((star) => (
          <TwinklingStar 
            key={star.id}
            delay={star.delay} 
            x={star.x} 
            y={star.y} 
            size={star.size}
          />
        ))}
        
        {/* Animated sparkles */}
        {sparkles.map((sparkle) => (
          <AnimatedSparkle
            key={`sparkle-${sparkle.id}`}
            delay={sparkle.delay} 
            x={sparkle.x} 
            y={sparkle.y}
            size={sparkle.size}
          />
        ))}
        
        <motion.div 
          className="container mx-auto px-4 flex flex-col items-center text-center text-white relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            transform: 'translateZ(20px)',
          }}
        >
          <motion.div
            className="mb-6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              damping: 10, 
              stiffness: 100, 
              delay: 0.2 
            }}
          >
            <span className="text-6xl">✈️</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold mb-6"
            variants={itemVariants}
            custom={1}
          >
            <TypewriterText 
              text="Your Smart Travel Companion" 
              speed={80} 
              bold={true} 
              gradientClass="bg-gradient-to-r from-white via-yellow-300 to-amber-300 text-transparent bg-clip-text"
            />
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mb-10"
            variants={itemVariants}
            custom={2}
          >
            Plan your trips, manage packing lists, track expenses, and organize your travel all in one place.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            variants={itemVariants}
            custom={3}
          >
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -1 }} 
              whileTap={{ scale: 0.95 }}
              className="perspective"
            >
              <Button 
                size="lg" 
                asChild 
                className="bg-accent hover:bg-accent/90 text-white transition-all hover:shadow-lg relative overflow-hidden group"
              >
                <Link to="/planner">
                  <span className="relative z-10 flex items-center">
                    <span>Plan Your Trip</span>
                    <motion.span 
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Plane size={16} />
                    </motion.span>
                  </span>
                  <span className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 1 }} 
              whileTap={{ scale: 0.95 }}
              className="perspective"
            >
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20 transition-all hover:shadow-lg"
              >
                <Link to="/packing-list">
                  <motion.span
                    animate={{ rotate: [0, -5, 0, 5, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="mr-2"
                  >
                    🧳
                  </motion.span>
                  Create Packing List
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Parallax background */}
        <motion.div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format')] bg-cover bg-center opacity-10"
          style={{ 
            transform: 'translateZ(0px) translateX(var(--mouse-x, 0)) translateY(var(--mouse-y, 0))'
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        ></motion.div>
        
        {/* Bottom wave pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="absolute bottom-0 left-0 w-full h-full text-background"
            fill="currentColor"
          >
            <motion.path 
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2 }}
            ></motion.path>
          </svg>
        </div>
      </section>

      {/* Features Section with 3D cards */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <motion.span
              className="inline-block text-3xl mb-3"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🌟
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-bold text-gradient">
              <TypewriterText text="Everything You Need For Perfect Travel" speed={50} />
            </h2>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <TooltipProvider>
              <motion.div variants={itemVariants} whileHover="hover">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="hover-float card-shadow h-full transition-all duration-300 hover:bg-primary/5 relative overflow-hidden">
                      <CardHeader className="relative z-10">
                        <motion.div
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="mb-2"
                        >
                          <Rotating3DIcon icon={List} />
                        </motion.div>
                        <CardTitle>Packing Lists 📝</CardTitle>
                        <CardDescription>Create and organize packing lists by category</CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <p className="text-muted-foreground">
                          Never forget essential items with our smart packing checklist. Create multiple lists for different trip types.
                        </p>
                        <Button variant="link" asChild className="mt-4 p-0 group">
                          <Link to="/packing-list" className="flex items-center gap-1">
                            Get Started
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="inline-block"
                            >→</motion.span>
                          </Link>
                        </Button>
                      </CardContent>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create customizable packing lists</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>

              {/* The rest of the feature cards follow the same pattern */}
              <motion.div variants={itemVariants} whileHover="hover">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="hover-float card-shadow h-full relative overflow-hidden">
                      <CardHeader className="relative z-10">
                        <motion.div className="mb-2">
                          <Rotating3DIcon icon={Globe} delay={0.5} />
                        </motion.div>
                        <CardTitle>Destinations 🗺️</CardTitle>
                        <CardDescription>Browse and filter destinations by region</CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <p className="text-muted-foreground">
                          Discover amazing destinations worldwide. Filter by continent, climate, or activities.
                        </p>
                        <Button variant="link" asChild className="mt-4 p-0 group">
                          <Link to="/destinations" className="flex items-center gap-1">
                            Explore Now
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="inline-block"
                            >→</motion.span>
                          </Link>
                        </Button>
                      </CardContent>
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Find your next adventure destination</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>

              <motion.div variants={itemVariants} whileHover="hover">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="hover-float card-shadow h-full relative overflow-hidden">
                      <CardHeader className="relative z-10">
                        <motion.div className="mb-2">
                          <Rotating3DIcon icon={DollarSign} delay={1} />
                        </motion.div>
                        <CardTitle>Currency Converter 💱</CardTitle>
                        <CardDescription>Convert between different currencies easily</CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <p className="text-muted-foreground">
                          Convert between currencies with our simple and intuitive converter. Save your recent conversions.
                        </p>
                        <Button variant="link" asChild className="mt-4 p-0 group">
                          <Link to="/currency" className="flex items-center gap-1">
                            Convert Now
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="inline-block"
                            >→</motion.span>
                          </Link>
                        </Button>
                      </CardContent>
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Currency conversion on the go</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>

              <motion.div variants={itemVariants} whileHover="hover">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="hover-float card-shadow h-full relative overflow-hidden">
                      <CardHeader className="relative z-10">
                        <motion.div className="mb-2">
                          <Rotating3DIcon icon={Calendar} delay={1.5} />
                        </motion.div>
                        <CardTitle>Trip Planner 📅</CardTitle>
                        <CardDescription>Plan your daily activities with a countdown</CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <p className="text-muted-foreground">
                          Organize your trip with our daily planner. Set a countdown and never miss important events.
                        </p>
                        <Button variant="link" asChild className="mt-4 p-0 group">
                          <Link to="/planner" className="flex items-center gap-1">
                            Plan Now
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="inline-block"
                            >→</motion.span>
                          </Link>
                        </Button>
                      </CardContent>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Organize your trip activities</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            </TooltipProvider>
          </motion.div>
        </div>
      </section>
      
      {/* Coming Soon Section */}
      <section className="py-16 bg-muted relative overflow-hidden">
        <div className="container relative z-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            New Features
          </motion.h2>
          
          {/* Add some random stars in the background */}
          {stars.slice(0, 15).map((star) => (
            <TwinklingStar 
              key={`coming-${star.id}`}
              delay={star.delay + 1} 
              x={star.x} 
              y={star.y * 0.6} 
              size={star.size * 0.7}
            />
          ))}
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} whileHover="hover">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link to="/travel-gallery">
                    <Card className="bg-background/50 transition-all hover:shadow-md cursor-pointer hover:bg-background/80">
                      <CardHeader>
                        <Image className="h-8 w-8 text-muted-foreground mb-2" />
                        <CardTitle>Travel Gallery</CardTitle>
                        <CardDescription>Store and share your travel memories</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Travel Gallery</h4>
                    <p className="text-sm">
                      Upload photos from your trips, organize them by destination, 
                      and share your memories with friends and family.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </motion.div>
            
            <motion.div variants={itemVariants} whileHover="hover">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link to="/budget-tracker">
                    <Card className="bg-background/50 transition-all hover:shadow-md cursor-pointer hover:bg-background/80">
                      <CardHeader>
                        <Wallet className="h-8 w-8 text-muted-foreground mb-2" />
                        <CardTitle>Budget Tracker</CardTitle>
                        <CardDescription>Track and manage your travel expenses</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Budget Tracker</h4>
                    <p className="text-sm">
                      Set travel budgets, track your expenses by category, 
                      and analyze your spending habits to help plan future trips.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </motion.div>
            
            <motion.div variants={itemVariants} whileHover="hover">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link to="/user-profile">
                    <Card className="bg-background/50 transition-all hover:shadow-md cursor-pointer hover:bg-background/80">
                      <CardHeader>
                        <User className="h-8 w-8 text-muted-foreground mb-2" />
                        <CardTitle>User Profiles</CardTitle>
                        <CardDescription>Create and customize your traveler profile</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">User Profiles</h4>
                    <p className="text-sm">
                      Create a detailed traveler profile with preferences, travel history, 
                      and favorite destinations to enhance personalized recommendations.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
        {/* More subtle stars */}
        {stars.slice(0, 10).map((star) => (
          <TwinklingStar 
            key={`cta-${star.id}`}
            delay={star.delay + 2} 
            x={star.x} 
            y={star.y} 
            size={star.size * 0.7}
          />
        ))}
        
        <motion.div 
          className="container text-center relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-5xl mb-6"
            animate={{ 
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            🚀
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            <TypewriterText text="Ready to Plan Your Next Adventure?" speed={40} />
          </h2>
          
          <p className="text-xl max-w-2xl mx-auto mb-10">
            Join TripTrove today and make your travel planning easier, more organized, and more enjoyable.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="perspective"
          >
            <Button 
              size="lg" 
              asChild 
              className="shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-accent text-white"
            >
              <Link to="/packing" className="relative overflow-hidden group">
                <span className="relative z-10">Get Started for Free</span>
                <motion.span 
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                ></motion.span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default Home;
