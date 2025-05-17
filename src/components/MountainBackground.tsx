
import { motion } from 'framer-motion';
import { Mountain } from 'lucide-react';

const MountainBackground = () => {
  const mountains = Array(10).fill(null).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 60 + Math.random() * 30,
    size: 20 + Math.random() * 50,
    opacity: 0.1 + Math.random() * 0.2
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {mountains.map(mountain => (
        <motion.div
          key={mountain.id}
          className="absolute text-accent"
          style={{
            left: `${mountain.x}%`,
            bottom: `${mountain.y}%`,
            opacity: mountain.opacity
          }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: mountain.opacity }}
          transition={{ 
            duration: 2,
            delay: mountain.id * 0.2,
            ease: "easeOut"
          }}
        >
          <Mountain size={mountain.size} />
        </motion.div>
      ))}
    </div>
  );
};

export default MountainBackground;
