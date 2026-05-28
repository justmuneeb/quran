# Quranic Text App - Surah Mulk, Manzil & Yaseen

A modern, interactive web application for reciting and studying Quranic text with synchronized audio playback. Built with React, Express, and tRPC for a seamless user experience.

## 🌟 Features

### Audio Recitation
- **Surah Mulk** - Complete recitation with authentic Sudais & Shuraym voice
- **Surah Yaseen** - Full recitation with Urdu translation audio
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

- Quranic audio from authentic reciters (Sudais & Shuraym)
- Urdu translation audio sources
- Built with [Manus](https://manus.im) platform
- UI components from [shadcn/ui](https://ui.shadcn.com)

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the author.

---

**Happy Recitation! 📖✨**
