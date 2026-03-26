import { useState, useEffect } from "react";

export interface Verse {
  number: number;
  text: string;
  numberInSurah: number;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  verses: Verse[];
  loading: boolean;
  error: string | null;
}

const QURAN_API_BASE = "https://api.quran.com/api/v4";

export const useQuranAPI = (surahNumber: number): SurahData => {
  const [data, setData] = useState<SurahData>({
    number: surahNumber,
    name: "",
    englishName: "",
    verses: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setData((prev) => ({ ...prev, loading: true, error: null }));

        // Fetch verses with Arabic text (Indo-Pak script)
        const versesRes = await fetch(
          `${QURAN_API_BASE}/quran/verses/indopak?chapter_number=${surahNumber}&limit=300`
        );
        
        if (!versesRes.ok) {
          throw new Error(`API Error: ${versesRes.status}`);
        }

        const versesData = await versesRes.json();

        if (!versesData.verses || versesData.verses.length === 0) {
          throw new Error("No verses found");
        }

        // Get surah name from first verse or use default
        const firstVerse = versesData.verses[0];
        const surahName = firstVerse.surah?.name || "السورة";
        const surahEnglishName = firstVerse.surah?.english_name || "Surah";

        const verses: Verse[] = versesData.verses.map((verse: any) => {
          // Extract verse number from verse_key (format: "67:1")
          const verseNumber = parseInt(verse.verse_key?.split(":")[1] || "0", 10);
          return {
            number: verse.id || verseNumber, // Use id as fallback, then verse_key
            text: verse.text_indopak || verse.text || "",
            numberInSurah: verseNumber,
          };
        });

        setData({
          number: surahNumber,
          name: surahName,
          englishName: surahEnglishName,
          verses,
          loading: false,
          error: null,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "حدث خطأ غير معروف";
        console.error("Quran API Error:", err);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      }
    };

    fetchSurah();
  }, [surahNumber]);

  return data;
};
