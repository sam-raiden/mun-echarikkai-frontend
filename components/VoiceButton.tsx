'use client';

import { Mic } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface VoiceButtonProps {
  onPress?: () => void;
  isListening?: boolean;
  isProcessing?: boolean;
}

export function VoiceButton({
  onPress,
  isListening = false,
  isProcessing = false,
}: VoiceButtonProps) {
  const [isActive, setIsActive] = useState(false);

  const handlePress = () => {
    setIsActive(!isActive);
    onPress?.();
  };

  const waveVariants = {
    initial: { scale: 1, opacity: 0.5 },
    animate: {
      scale: [1, 1.2, 1.4, 1.6],
      opacity: [0.8, 0.6, 0.4, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Animated background waves */}
      {(isActive || isListening) && (
        <>
          <motion.div
            variants={waveVariants}
            initial="initial"
            animate="animate"
            className="absolute w-32 h-32 rounded-full border-2 border-primary/50"
          />
          <motion.div
            variants={waveVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3, duration: 1.5, repeat: Infinity }}
            className="absolute w-32 h-32 rounded-full border-2 border-primary/30"
          />
        </>
      )}

      {/* Main button */}
      <motion.button
        onClick={handlePress}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center font-semibold text-lg transition-all shadow-lg ${
          isActive || isListening
            ? 'bg-primary text-primary-foreground'
            : 'bg-gradient-to-br from-primary/80 to-primary/60 text-primary-foreground hover:from-primary hover:to-primary/70'
        } ${isProcessing ? 'opacity-75' : ''}`}
      >
        <motion.div
          animate={isActive || isListening ? { rotate: [0, 360] } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Mic className="w-10 h-10" />
        </motion.div>
      </motion.button>

      {/* Status text */}
      {isActive && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-12 text-sm font-medium text-primary"
        >
          Listening...
        </motion.p>
      )}

      {isProcessing && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-12 text-sm font-medium text-secondary"
        >
          Processing...
        </motion.p>
      )}
    </div>
  );
}
