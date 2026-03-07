'use client';

import { useState } from 'react';
import { QuestionCard } from '@/components/QuestionCard';
import { motion } from 'framer-motion';
import { mockCrops, mockCropProblems } from '@/data/mockData';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function MissingInfoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const questions = [
    {
      id: 'crop',
      question: 'Which crop is affected?',
      icon: '🌾',
      type: 'selection' as const,
      options: mockCrops.map((crop) => ({
        id: crop.id.toString(),
        label: crop.name,
        icon: crop.icon,
      })),
    },
    {
      id: 'problem',
      question: 'What problem are you facing?',
      icon: '🔍',
      type: 'selection' as const,
      options: mockCropProblems.map((problem) => ({
        id: problem.id.toString(),
        label: problem.name,
        icon: '⚠️',
      })),
    },
    {
      id: 'location',
      question: 'Where is your farm located?',
      icon: '📍',
      type: 'location' as const,
      options: [],
    },
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = {
      ...answers,
      [questions[currentStep].id]: answer,
    };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
      setTimeout(() => {
        router.push('/assistant');
      }, 2000);
    }
  };

  const progressPercentage = ((currentStep + 1) / questions.length) * 100;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-primary/5 max-w-md mx-auto px-5"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-center"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Great! Ready to Help
          </h2>
          <p className="text-muted-foreground mb-6">
            Heading to chat to get AI recommendations...
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex flex-col max-w-md mx-auto"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-5 py-4 flex items-center gap-3"
      >
        <button
          onClick={() => router.push('/assistant')}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">
            Tell Me About Your Farm
          </h1>
          <p className="text-xs text-muted-foreground">
            This helps me give you better advice
          </p>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        variants={itemVariants}
        className="w-full h-1 bg-muted overflow-hidden"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-primary to-accent"
        />
      </motion.div>

      {/* Content */}
      <div className="flex-1 px-5 py-8 space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Tell us more
          </h1>
          <p className="text-muted-foreground">
            Help us understand your farm situation better for accurate recommendations
          </p>
        </motion.div>

        {/* Current Question */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionCard
            question={questions[currentStep].question}
            icon={questions[currentStep].icon}
            type={questions[currentStep].type}
            options={questions[currentStep].options}
            onSelect={handleAnswer}
          />
        </motion.div>

        {/* Question Counter */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 justify-center"
        >
          {questions.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index <= currentStep ? 'bg-primary' : 'bg-border'
              }`}
              animate={{
                width: index <= currentStep ? '24px' : '8px',
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Footer Info */}
      <motion.div
        variants={itemVariants}
        className="sticky bottom-0 bg-gradient-to-t from-background to-transparent px-5 py-6 text-center text-sm text-muted-foreground border-t border-border"
      >
        <p>
          Your answers help us provide personalized farming recommendations
        </p>
      </motion.div>
    </motion.div>
  );
}
