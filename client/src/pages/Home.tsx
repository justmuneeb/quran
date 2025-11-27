import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus, Loader2 } from "lucide-react";
import { useQuranAPI } from "@/hooks/useQuranAPI";

type SurahType = "mulk" | "yaseen";

const SURAH_NUMBERS: Record<SurahType, number> = {
  mulk: 67,
  yaseen: 36,
};

export default function Home() {
  const [activeSurah, setActiveSurah] = useState<SurahType>("mulk");
  const [fontSize, setFontSize] = useState<number>(18);
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
            <div className="flex items-center gap-3 bg-green-200 rounded-lg p-2">
              <Button
                onClick={decreaseFontSize}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Decrease font size"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-black min-w-12 text-center">
                {fontSize}px
              </span>
              <Button
                onClick={increaseFontSize}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Increase font size"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Verses Display */}
          {surahData.loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : surahData.error ? (
            <div className="text-center py-8 text-red-600">
              <p>خطأ في تحميل البيانات: {surahData.error}</p>
            </div>
          ) : (
            <div className="space-y-6 text-right" dir="rtl">
              {surahData.verses.map((verse) => (
                <div
                  key={verse.number}
                  className="flex gap-4 items-start pb-4 border-b border-green-300 last:border-0"
                >
                  <span className="text-sm font-semibold text-black flex-shrink-0 mt-1">
                    {verse.numberInSurah}
                  </span>
                  <p
                    className="text-black leading-relaxed flex-1"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {verse.text}
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
          <p>تطبيق القرآن الكريم - Quranic Text App</p>
          <p className="text-xs mt-1">Indo-Pak Edition | Data from Quran.com API</p>
        </div>
      </footer>
    </div>
  );
}
