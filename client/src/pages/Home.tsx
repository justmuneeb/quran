import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { quranTexts } from "@/data/quranTexts";

type SurahType = "mulk" | "manzil" | "yaseen";

export default function Home() {
  const [activeSurah, setActiveSurah] = useState<SurahType>("mulk");
  const [fontSize, setFontSize] = useState<number>(18);

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

  const currentSurah = quranTexts[activeSurah];

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 32));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-4">
            القرآن الكريم
          </h1>

          {/* Navigation Tabs */}
          <div className="flex gap-2 justify-center flex-wrap">
            <Button
              onClick={() => setActiveSurah("mulk")}
              variant={activeSurah === "mulk" ? "default" : "outline"}
              className="rounded-full"
            >
              سورة الملك
            </Button>
            <Button
              onClick={() => setActiveSurah("manzil")}
              variant={activeSurah === "manzil" ? "default" : "outline"}
              className="rounded-full"
            >
              المنزل
            </Button>
            <Button
              onClick={() => setActiveSurah("yaseen")}
              variant={activeSurah === "yaseen" ? "default" : "outline"}
              className="rounded-full"
            >
              سورة يس
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <Card className="p-8 bg-white dark:bg-slate-900 shadow-lg">
          {/* Font Size Controls */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {currentSurah.name}
            </h2>
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
              <Button
                onClick={decreaseFontSize}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Decrease font size"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-12 text-center">
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
          <div className="space-y-6 text-right" dir="rtl">
            {currentSurah.verses.map((verse, index) => (
              <div
                key={index}
                className="flex gap-4 items-start pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0"
              >
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex-shrink-0 mt-1">
                  {index + 1}
                </span>
                <p
                  className="text-slate-800 dark:text-slate-200 leading-relaxed flex-1"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {verse}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>تطبيق القرآن الكريم - Quranic Text App</p>
        </div>
      </footer>
    </div>
  );
}
