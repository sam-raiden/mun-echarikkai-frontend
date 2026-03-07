export const mockWeather = {
  location: 'North Glasgow, Montana',
  current: {
    temperature: 30,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 3,
    uvIndex: 5,
    icon: '⛅',
  },
  forecast: [
    {
      day: 'Monday',
      high: 32,
      low: 18,
      condition: 'Rainy',
      humidity: 75,
      windSpeed: 5,
    },
    {
      day: 'Tuesday',
      high: 28,
      low: 16,
      condition: 'Cloudy',
      humidity: 60,
      windSpeed: 3,
    },
  ],
  warning: {
    type: 'Rainy Weather',
    severity: 'moderate',
    description: 'Rainy weather is predicted to occur in the next few days. Monday is a good day to apply irrigation.',
  },
};

export const mockMarketPrices = {
  crops: [
    {
      name: 'Rice',
      price: 45.5,
      unit: '/kg',
      trend: 'up',
      change: 2.3,
    },
    {
      name: 'Wheat',
      price: 38.2,
      unit: '/kg',
      trend: 'down',
      change: -1.5,
    },
    {
      name: 'Cotton',
      price: 62.8,
      unit: '/kg',
      trend: 'stable',
      change: 0.2,
    },
    {
      name: 'Sugarcane',
      price: 52.1,
      unit: '/kg',
      trend: 'up',
      change: 3.1,
    },
  ],
};

export const mockCrops = [
  {
    id: 1,
    name: 'Rice',
    icon: '🌾',
    status: 'healthy',
    waterNeeded: true,
  },
  {
    id: 2,
    name: 'Wheat',
    icon: '🌾',
    status: 'healthy',
    waterNeeded: false,
  },
  {
    id: 3,
    name: 'Cotton',
    icon: '🌾',
    status: 'warning',
    waterNeeded: true,
  },
];

export const mockCropProblems = [
  {
    id: 1,
    name: 'Pest Infestation',
    description: 'Insects damaging crop leaves',
  },
  {
    id: 2,
    name: 'Disease',
    description: 'Fungal or bacterial disease',
  },
  {
    id: 3,
    name: 'Water Stress',
    description: 'Insufficient or excess water',
  },
  {
    id: 4,
    name: 'Nutrient Deficiency',
    description: 'Lacking essential nutrients',
  },
  {
    id: 5,
    name: 'Weather Damage',
    description: 'Damage from extreme weather',
  },
];

export const mockAIResponses = {
  textResponse:
    "Based on your rice crop and the current weather conditions, I recommend applying fertilizer in the next 3-5 days. The soil moisture is optimal now, and the nitrogen content needs boosting before the monsoon arrives.",
  weatherInsight:
    'Monsoon rains expected in 5-7 days. Ensure proper drainage systems are in place.',
  marketInsight:
    'Rice prices are at a 2-month high. Consider harvesting soon for better market value.',
  audioUrl: 'https://example.com/audio/response.mp3',
};

export const pipelineSteps = [
  { step: 'Listening', icon: '🎤', status: 'complete' },
  { step: 'Processing', icon: '⚙️', status: 'complete' },
  { step: 'AI Thinking', icon: '🧠', status: 'in-progress' },
  { step: 'Responding', icon: '💬', status: 'pending' },
];

export const mockChatHistory = [
  {
    id: 1,
    type: 'user',
    message: 'My rice crop has brown spots on the leaves',
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: 2,
    type: 'ai',
    message: mockAIResponses.textResponse,
    weatherInsight: mockAIResponses.weatherInsight,
    marketInsight: mockAIResponses.marketInsight,
    audioUrl: mockAIResponses.audioUrl,
    timestamp: new Date(Date.now() - 5000),
  },
  {
    id: 3,
    type: 'user',
    message: 'Should I apply pesticide?',
    timestamp: new Date(Date.now() - 1000),
  },
];

export const mockUserProfile = {
  name: 'Leonard',
  avatar: '👨‍🌾',
  farmName: 'My Farm',
  location: 'North Glasgow, Montana',
  totalAcres: 25.5,
  cropsManaged: 3,
  memberSince: 'January 2024',
  phone: '+1 (555) 123-4567',
  email: 'leonard@farm.com',
};
