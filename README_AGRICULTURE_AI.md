# AgriAI - Voice-First Agricultural Assistant

A premium mobile-first AI agriculture assistant with voice interaction, real-time weather insights, and market intelligence. Built with Next.js 16, Framer Motion, and Tailwind CSS.

## Features

- **Voice-First Interface**: Intuitive microphone button with animated wave effects
- **Friendly Farmer Mascot**: Animated character that reacts to AI states (listening, thinking, speaking)
- **Real-Time Chat**: AI-powered chat with integrated advice, weather insights, market data, and audio playback
- **Weather Integration**: Current conditions, forecasts, and agricultural alerts
- **Market Intelligence**: Real-time crop prices with trend analysis
- **Pipeline Visibility**: Shows AI processing steps (Listening → Processing → Thinking → Responding)
- **Dynamic Q&A**: Smart question cards for gathering farm context
- **Market Analysis Dashboard**: Farm statistics, price trends, and market recommendations
- **User Profile**: Farm management and contact information
- **Trustworthy Design**: Mascot guides farmers through conversations, making the AI feel human and approachable

## Project Structure

```
app/
├── page.tsx                 # Home dashboard with mascot hero section
├── assistant/page.tsx       # Merged chat & AI interaction (voice-first, pipeline, insights)
├── market/page.tsx          # Market analysis, prices, farm statistics
├── profile/page.tsx         # User profile & farm management
├── missing-info/page.tsx    # Dynamic question flow with mascot
├── api/
│   ├── voice/route.ts       # Speech-to-text endpoint (placeholder)
│   ├── query/route.ts       # AI query processing (placeholder)
│   ├── weather/route.ts     # Weather data fetching (placeholder)
│   └── market/route.ts      # Market prices (placeholder)
└── layout.tsx               # Root layout

components/
├── FarmerMascot.tsx         # Animated farmer character (idle, listening, thinking, speaking)
├── VoiceButton.tsx          # Animated voice input button with wave effect
├── WeatherCard.tsx          # Weather display component
├── MarketCard.tsx           # Market prices component
├── ChatBubble.tsx           # Chat message with integrated advice, weather & market insights, audio button
├── PipelineStatus.tsx       # Processing pipeline visualizer
├── QuestionCard.tsx         # Dynamic question card
├── BottomNavigation.tsx     # Mobile navigation tabs (Home, Assistant, Market, Profile)
└── SplashScreen.tsx         # App intro screen

data/
└── mockData.ts              # Mock data for demo

lib/
└── utils.ts                 # Utility functions

styles/
└── globals.css              # Global styles with agriculture-themed tokens
```

## Farmer Mascot

The app features a friendly, animated farmer character that builds trust and guides users through conversations:

### Mascot States
- **Idle**: Default resting state with subtle breathing animation
- **Listening**: Ears perk up, head nods gently while user speaks
- **Thinking**: Rotating head, contemplative expression with thought bubbles
- **Speaking**: Mouth animates, arms move expressively while delivering advice

### Integration Points
- Home screen: Hero section greeting users
- Assistant screen: Avatar bubble at the top, reacts to each interaction
- Missing Info screen: Encourages users to complete their profile

The mascot uses Framer Motion for smooth, charming animations that make the AI feel approachable and human.

## Color Scheme

The app uses an agriculture-themed color palette:
- **Primary Green** (oklch(0.48 0.15 142)): Main action color, crop-related
- **Secondary Orange** (oklch(0.55 0.2 32)): Earth tones, market data
- **Accent Blue** (oklch(0.65 0.2 225)): Sky/weather data
- **Neutrals**: Soft grays for backgrounds and borders

## API Integration Points

### 1. Voice Transcription (`/api/voice`)
Currently returns mock transcription. Integrate with:
- Google Cloud Speech-to-Text
- AWS Transcribe
- Azure Speech Services
- Deepgram

```bash
POST /api/voice
{
  "audioBlob": "...",
  "language": "en"
}
```

### 2. AI Query Processing (`/api/query`)
Processes farm queries and generates recommendations. Integrate with:
- OpenAI GPT-4
- Anthropic Claude
- Specialized agricultural LLMs
- Hugging Face models

```bash
POST /api/query
{
  "query": "My rice has brown spots",
  "cropId": 1,
  "problemType": "disease",
  "location": "North Glasgow, Montana"
}
```

### 3. Weather Data (`/api/weather`)
Fetches weather information for the farm location. Integrate with:
- OpenWeatherMap API
- Government weather services (IMD for India)
- NOAA Weather API
- Local weather stations

```bash
GET /api/weather?location=latitude,longitude&days=7
```

### 4. Market Prices (`/api/market`)
Provides current and historical crop prices. Integrate with:
- NCDEX (India)
- MANDI APIs
- Government agricultural databases
- Commodity exchange APIs

```bash
GET /api/market?crop=rice&region=maharashtra&days=30
```

## State Management

Uses SWR for data fetching and client-side caching:
```typescript
import useSWR from 'swr';

const { data, error } = useSWR('/api/weather?location=...', fetcher);
```

## Animations

Built with Framer Motion for:
- Wave animations on voice button
- Chat message entrance animations
- Pipeline step transitions
- Page transitions with stagger effects
- Smooth interactive elements

## Mobile Optimization

- **Mobile-first design**: Optimized for 320px-480px base width
- **Touch-friendly**: Large interactive areas with haptic feedback
- **Safe areas**: Respects notches and rounded corners
- **Bottom navigation**: Fixed navigation above system UI
- **Viewport optimization**: Prevents scaling issues

## Running the App

```bash
# Install dependencies
pnpm install

# Add Framer Motion if not already present
pnpm add framer-motion

# Run development server
pnpm dev

# Open http://localhost:3000
```

## Dark Mode

The app automatically supports dark mode with CSS custom properties:
```css
--background: oklch(0.98 0.005 192)      /* Light */
--background: oklch(0.12 0.01 180)       /* Dark */
```

## Future Enhancements

1. **Real Backend Integration**: Connect all API endpoints to actual services
2. **User Authentication**: Implement user accounts and farm profiles
3. **Notifications**: Push notifications for weather alerts and market changes
4. **Offline Support**: Service workers for offline functionality
5. **Image Recognition**: Crop disease detection from photos
6. **Multilingual Support**: Tamil, Hindi, and regional language support
7. **Video Responses**: AI-generated video tutorials and recommendations
8. **Community Features**: Share tips with other farmers

## Environment Variables

Create a `.env.local` file with:
```
# Voice/Speech Services
NEXT_PUBLIC_SPEECH_API_KEY=
SPEECH_API_ENDPOINT=

# AI/LLM Services
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Weather Services
WEATHER_API_KEY=

# Market Data Services
MARKET_API_KEY=
```

## Performance Tips

- Images are lazy-loaded
- Components use React.memo for optimization
- Framer Motion uses GPU acceleration where possible
- CSS is scoped and optimized with Tailwind
- API calls are debounced and cached

## Browser Support

- iOS Safari 12+
- Android Chrome 80+
- Modern mobile browsers with ES6+ support

## License

Created with v0 by Vercel
