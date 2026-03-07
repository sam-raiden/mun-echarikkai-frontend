'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface MarketPrice {
  name: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface MarketCardProps {
  crops: MarketPrice[];
}

export function MarketCard({ crops }: MarketCardProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return (
          <TrendingUp className="w-4 h-4 text-green-500" />
        );
      case 'down':
        return (
          <TrendingDown className="w-4 h-4 text-red-500" />
        );
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-3xl p-6 border border-secondary/30 shadow-md"
    >
      <h3 className="text-lg font-bold text-foreground mb-4">Market Prices</h3>
      <div className="space-y-3">
        {crops.map((crop, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex items-center justify-between p-3 bg-background/50 rounded-2xl hover:bg-background/80 transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium text-foreground">{crop.name}</p>
              <p className="text-sm text-muted-foreground">
                ₹ {crop.price.toFixed(2)}{crop.unit}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(crop.trend)}
              <span className={`text-sm font-semibold ${getTrendColor(crop.trend)}`}>
                {crop.change > 0 ? '+' : ''}
                {crop.change}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
