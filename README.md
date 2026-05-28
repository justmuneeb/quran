# Quranic Text App - Surah Mulk and Yaseen

A modern, interactive web application for reciting and studying Quranic text with synchronized audio playback. Built with React, Express, and tRPC for a seamless user experience.

## 💡 Why I Built This

I created this app to solve real problems I noticed with existing Quranic apps:

**Problem 1: No Loop Control for Recitation**
- Most apps don't allow you to repeat a Surah multiple times automatically
- Whether you're practicing, memorizing, or just want to listen repeatedly, you have to manually restart
- This wastes time and breaks your focus and concentration

**Problem 2: Fixed Font Size**
- Existing apps don't let you increase font size
- People with vision difficulties, elderly users, and anyone who prefers larger text struggle
- Reading small text on screens is tiring and inaccessible for many

**My Solution:**
- ✅ **Loop Control (1-1000 times)** - Repeat any Surah as many times as you want with automatic progression
- ✅ **Adjustable Font Size** - Increase or decrease text size for comfortable, accessible reading
- ✅ **Smooth Seeking** - Jump to any part of the recitation instantly
- ✅ **Real-time Verse Highlighting** - Follow along as the audio plays
- ✅ **Dual Language Support** - Arabic-only or Arabic + Urdu translation

This app is designed for **anyone who wants to read, recite, study, or listen to Quranic text** - whether you are a student, learner, regular reader, or someone who just wants a better, more accessible experience.

## 🌟 Features

### Audio Recitation
- **Surah Mulk** - Complete recitation in Arabic with Urdu translation in Abdul Basit, Sudais & Shuraym voice
- **Surah Yaseen** - Complete recitation in Arabic with Urdu translation in Abdul Basit, Sudais & Shuraym voice
- **Dual Language Support** - Switch between Arabic-only and Arabic + Urdu audio modes
- **Smooth Seeking** - Drag the progress slider to jump to any part of the recitation

### Interactive Controls
- **Play/Pause/Stop** - Full playback controls
- **Loop Control** - Repeat the Surah 1-1000 times (configurable)
- **Progress Tracking** - Real-time progress slider with time display (current/total)
- **Font Size Adjustment** - Increase or decrease text size for better readability

### Verse Display
- **Real-time Highlighting** - Current verse highlights in yellow as audio plays
- **Complete Text** - All verses displayed with proper Arabic formatting
- **Special Character Handling** - Unicode characters properly formatted with Arabic commas
- **Verse Numbers** - Clear verse numbering for easy reference

## 🔧 Technical Challenges & Solutions

During development, I faced and solved several complex technical problems:

### Challenge 1: CORS Restrictions on Audio Playback
**Problem:** Audio files from external CDNs were blocked by browser CORS (Cross-Origin Resource Sharing) policies. Direct links to audio files couldn't be played from the deployed domain.

**Solution:** Built a backend audio proxy endpoint (`/api/audio-proxy`) that:
- Fetches audio files from external CDNs on the server side
- Streams audio to the browser without CORS restrictions
- Properly forwards HTTP headers and content types
- Result: Audio now plays seamlessly from any CDN source

### Challenge 2: Audio Seeking Didn't Work
**Problem:** Users couldn't drag the progress slider to seek to a specific time in the audio. The slider was frozen because the proxy wasn't supporting HTTP range requests (206 Partial Content).

**Solution:** Implemented HTTP range request support in the audio proxy:
- Parse `Range` header from browser requests
- Fetch only the requested byte range from the CDN
- Return 206 Partial Content response with proper headers
- Result: Users can now drag the slider to play from any position instantly

### Challenge 3: Dependency Version Conflicts
**Problem:** Deployment failed because `@tanstack/react-query@4.x` was incompatible with `@trpc/react-query@11.x` (which requires v5)

**Solution:** 
- Updated `@tanstack/react-query` to v5
- Removed problematic pnpm patches that were blocking installation
- Result: Clean build and successful deployment

### Challenge 4: Real-time Verse Highlighting with Audio Sync
**Problem:** Verses needed to highlight in sync with audio playback, but audio timing varies based on reciter and language mode.

**Solution:** Implemented dynamic verse timing calculation:
- Calculate verse duration based on total audio length and verse count
- Update verse highlighting as audio progresses
- Support multiple loop iterations with proper verse tracking
- Result: Verses highlight perfectly in sync with audio playback

**Key Learning:** These challenges taught me about backend optimization, HTTP protocols, and real-time frontend synchronization - skills that are valuable in production applications.

## 🛠️ Tech Stack

- **Frontend**: React 19 + Tailwind CSS 4
- **Backend**: Express 4 + tRPC 11
- **Database**: MySQL with Drizzle ORM
- **Authentication**: Manus OAuth
- **Audio Streaming**: Backend proxy with HTTP range request support
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js 22+
- pnpm 10+
- MySQL database (or compatible)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/justmuneeb/quran.git
cd quran
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=mysql://user:password@localhost:3306/quran_app
JWT_SECRET=your_jwt_secret_here
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

### 4. Set Up Database
```bash
pnpm db:push
```

### 5. Start Development Server
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## 📦 Build for Production
```bash
pnpm build
```

## 🧪 Running Tests
```bash
pnpm test
```

## 📁 Project Structure

```
client/
  ├── src/
  │   ├── components/        # Reusable UI components
  │   ├── pages/            # Page-level components
  │   ├── hooks/            # Custom React hooks
  │   └── lib/              # Utility functions and tRPC client
  └── public/               # Static assets

server/
  ├── routers.ts            # tRPC procedure definitions
  ├── db.ts                 # Database query helpers
  └── _core/                # Core server infrastructure
      ├── index.ts          # Express server setup
      ├── context.ts        # tRPC context
      └── oauth.ts          # OAuth integration

drizzle/
  ├── schema.ts             # Database schema definitions
  └── migrations/           # Database migrations

shared/
  └── const.ts              # Shared constants
```

## 🎯 Key Features Implementation

### Audio Proxy with Range Request Support
The backend includes a custom audio proxy endpoint (`/api/audio-proxy`) that:
- Fetches audio from external CDNs
- Supports HTTP range requests for seeking
- Bypasses CORS restrictions
- Streams audio efficiently

### Real-time Verse Highlighting
The audio player synchronizes with verse display:
- Calculates verse timing based on audio duration
- Updates verse highlighting as audio plays
- Supports multiple loop iterations

### Responsive Design
- Mobile-friendly interface
- Adjustable font sizes
- Touch-friendly controls

## 🔧 Configuration

### Audio Sources
Audio files are configured in `client/src/components/AudioPlayer.tsx`:
- Arabic-only recitations
- Arabic + Urdu translation audio
- Configurable reciter selections

### Loop Settings
Users can set the number of loops (1-1000) for continuous recitation practice.

## 🐛 Troubleshooting

### Audio Not Playing
- Check browser console for CORS errors
- Verify audio URLs are accessible
- Ensure backend proxy is running

### Seeking Not Working
- Verify HTTP range request support is enabled
- Check backend logs for proxy errors
- Clear browser cache and reload

### Database Connection Issues
- Verify `DATABASE_URL` is correctly set
- Ensure MySQL server is running
- Check database credentials

## 📝 Development Guidelines

### Adding New Features
1. Update database schema in `drizzle/schema.ts`
2. Run `pnpm db:push` to migrate
3. Add tRPC procedures in `server/routers.ts`
4. Create UI components in `client/src/components/`
5. Write tests in `server/*.test.ts`

### Code Style
- Use TypeScript for type safety
- Follow existing code patterns
- Add comments for complex logic
- Run `pnpm format` before committing

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Muneeb** - [@justmuneeb](https://github.com/justmuneeb)

## 🙏 Acknowledgments

- Quranic audio from authentic reciters (Sudais & Shuraym, Abdul Basit)
- Urdu translation audio sources
- Built with [Manus](https://manus.im) platform
- UI components from [shadcn/ui](https://ui.shadcn.com)

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the author.

---

**Happy Recitation! 📖✨**
