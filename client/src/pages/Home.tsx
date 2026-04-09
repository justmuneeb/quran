import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus, Loader2 } from "lucide-react";
import { useQuranAPI } from "@/hooks/useQuranAPI";
import AudioPlayer from "@/components/AudioPlayer";

type SurahType = "mulk" | "yaseen";

const SURAH_NUMBERS: Record<SurahType, number> = {
  mulk: 67,
  yaseen: 36,
};

// Function to clean Quranic text by replacing special punctuation marks with comma
const cleanVerseText = (text: string): string => {
  // Replace Quranic pause marks, emoji characters, spaces, and zero-width characters with comma
  // Unicode: U+06D9-U+06DD (Quranic marks), U+E001/U+E01A/U+E01C/U+E01E/U+E022 (special chars), U+2003 (em space), U+200B/U+200C/U+200D/U+200F/U+FEFF (zero-width)
  return text
    .replace(/[\u06D9\u06DA\u06DB\u06D6\u06D7\u06D8\u06D3\u06DD\uE001\uE01A\uE01C\uE01E\uE022\u2003\u200B\u200C\u200D\u200F\uFEFF]/g, '،')
    .replace(/،+/g, '،'); // Replace multiple commas with single comma
};

export default function Home() {
  const [activeSurah, setActiveSurah] = useState<SurahType>("mulk");
  const [fontSize, setFontSize] = useState<number>(18);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [highlightedVerseNumber, setHighlightedVerseNumber] = useState<number | null>(null);
  const versesContainerRef = useRef<HTMLDivElement>(null);
  const surahData = useQuranAPI(SURAH_NUMBERS[activeSurah]);

  // Load font size from localStorage on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem("quranFontSize");
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
    }
  }, []);

  // Save font size to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("quranFontSize", fontSize.toString());
  }, [fontSize]);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 32));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  };

  // Update highlighted verse based on audio progress
  useEffect(() => {
    if (duration === 0 || surahData.verses.length === 0) return;
    
    // Calculate which verse is currently playing
    const progress = currentTime / duration;
    const verseIndex = Math.floor(progress * surahData.verses.length);
    // Clamp to valid range
    const clampedIndex = Math.max(0, Math.min(verseIndex, surahData.verses.length - 1));
    const verseNumber = surahData.verses[clampedIndex]?.numberInSurah;
    
    if (verseNumber) {
      setHighlightedVerseNumber(verseNumber);
    }
  }, [currentTime, duration, surahData.verses]);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-green-600 border-b border-green-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center text-black mb-4">
            القرآن الكريم
          </h1>

          {/* Navigation Tabs */}
          <div className="flex gap-2 justify-center flex-wrap">
            <Button
              onClick={() => setActiveSurah("mulk")}
              variant={activeSurah === "mulk" ? "default" : "outline"}
              className="rounded-full bg-white text-black hover:bg-gray-100"
            >
              سورة الملك
            </Button>
            <Button
              onClick={() => setActiveSurah("yaseen")}
              variant={activeSurah === "yaseen" ? "default" : "outline"}
              className="rounded-full bg-white text-black hover:bg-gray-100"
            >
              سورة يس
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <Card className="p-8 bg-green-100 shadow-lg">
          {/* Font Size Controls */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-green-300">
            <div>
              <h2 className="text-xl font-semibold text-black">
                {surahData.name || "جاري التحميل..."}
              </h2>
              {surahData.englishName && (
                <p className="text-sm text-gray-600 mt-1">{surahData.englishName}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={decreaseFontSize}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-sm font-semibold text-black min-w-12 text-center">
                {fontSize}px
              </span>
              <Button
                onClick={increaseFontSize}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Audio Player */}
          <AudioPlayer
            surahNumber={SURAH_NUMBERS[activeSurah]}
            surahName={surahData.name}
            onTimeUpdate={setCurrentTime}
            onDurationChange={setDuration}
          />

          {/* Verses Display */}
          {surahData.loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : surahData.error ? (
            <div className="text-center py-8 text-red-600">
              <p>خطأ في تحميل البيانات: {surahData.error}</p>
            </div>
          ) : (
            <div className="space-y-6 text-right" dir="rtl" ref={versesContainerRef}>
              {surahData.verses.map((verse) => (
                <div
                  key={`verse-${verse.number}`}
                  id={`verse-${verse.numberInSurah}`}
                  className={`flex gap-4 items-start pb-4 border-b border-green-300 last:border-0 transition-all duration-200 ${
                    highlightedVerseNumber === verse.numberInSurah
                      ? "bg-yellow-300 rounded-lg px-4 py-2 shadow-md"
                      : ""
                  }`}
                >
                  <span className="text-sm font-semibold text-black flex-shrink-0 mt-1">
                    {verse.numberInSurah}
                  </span>
                  <p
                    className="text-black leading-relaxed flex-1"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {cleanVerseText(verse.text)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-green-600 border-t border-green-700 py-4 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-black">
          <p>© 2024 Quranic Text App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
