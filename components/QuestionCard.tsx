'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  icon?: string;
}

interface QuestionCardProps {
  question: string;
  icon: string;
  options: Option[];
  onSelect?: (optionId: string) => void;
  type: 'selection' | 'input' | 'location';
}

export function QuestionCard({
  question,
  icon,
  options,
  onSelect,
  type,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleSelect = (optionId: string) => {
    setSelected(optionId);
    onSelect?.(optionId);
  };

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      onSelect?.(inputValue);
      setInputValue('');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const optionVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-6 border-2 border-primary/30 mb-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-3xl">{icon}</span>
        <h3 className="text-lg font-bold text-foreground">{question}</h3>
      </div>

      {/* Selection options */}
      {type === 'selection' && (
        <div className="space-y-2">
          {options.map((option, index) => (
            <motion.button
              key={option.id}
              variants={optionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelect(option.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                selected === option.id
                  ? 'bg-primary/20 border-primary/50 text-primary'
                  : 'bg-background border-border hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-3">
                {option.icon && <span className="text-2xl">{option.icon}</span>}
                <span className="font-medium">{option.label}</span>
              </div>
              {selected === option.id && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Input field */}
      {(type === 'input' || type === 'location') && (
        <div className="flex gap-2">
          <input
            type={type === 'location' ? 'text' : 'text'}
            placeholder={
              type === 'location'
                ? 'Enter your location...'
                : 'Type your answer...'
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleInputSubmit();
              }
            }}
            className="flex-1 bg-background border-2 border-border rounded-2xl px-4 py-3 focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInputSubmit}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
