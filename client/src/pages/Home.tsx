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
              onClick={() => setActiveSurah("manzil")}
              variant={activeSurah === "manzil" ? "default" : "outline"}
              className="rounded-full bg-white text-black hover:bg-gray-100"
            >
              المنزل
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
            <h2 className="text-xl font-semibold text-black">
              {currentSurah.name}
            </h2>
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
          <div className="space-y-6 text-right" dir="rtl">
            {currentSurah.verses.map((verse, index) => (
              <div
                key={index}
                className="flex gap-4 items-start pb-4 border-b border-green-300 last:border-0"
              >
                <span className="text-sm font-semibold text-black flex-shrink-0 mt-1">
                  {index + 1}
                </span>
                <p
                  className="text-black leading-relaxed flex-1"
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
      <footer className="bg-green-600 border-t border-green-700 py-4 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-black">
          <p>تطبيق القرآن الكريم - Quranic Text App</p>
        </div>
      </footer>
    </div>
  );
}
