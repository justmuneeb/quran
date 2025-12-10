import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface AudioPlayerProps {
  surahNumber: number;
  surahName: string;
}

export default function AudioPlayer({
  surahNumber,
  surahName,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopCount, setLoopCount] = useState(10);
  const [currentLoop, setCurrentLoop] = useState(0);
  const [inputValue, setInputValue] = useState("10");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState<"arabic" | "arabic-urdu">("arabic");
  const [reciterName, setReciterName] = useState<string>("");

  // Fetch audio URL based on language choice
  useEffect(() => {
    const fetchAudioUrl = async () => {
      try {
        setIsLoading(true);
        let url = "";
        let reciter = "";

        if (audioLanguage === "arabic") {
          // Arabic only - Abdul Basit Murattal from quranicaudio.com
          const surahNum = String(surahNumber).padStart(3, "0");
          url = `https://download.quranicaudio.com/quran/abdul_basit_murattal/${surahNum}.mp3`;
          reciter = "Abdul Basit Murattal";
          setAudioUrl(url);
          setReciterName(reciter);
        } else {
          // Arabic + Urdu - Mishari Alafasy from Quran.com API (reciter_id=5)
          const response = await fetch(
            `https://api.quran.com/api/v4/chapter_recitations/${surahNumber}?reciter_id=5`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch audio");
          }

          const data = await response.json();

          // Find the audio file for this chapter
          if (data.audio_files && data.audio_files.length > 0) {
            const audioFile = data.audio_files.find(
              (file: any) => file.chapter_id === surahNumber
            );
            if (audioFile?.audio_url) {
              setAudioUrl(audioFile.audio_url);
              setReciterName("Mishari Alafasy with Urdu");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching audio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudioUrl();
  }, [surahNumber, audioLanguage]);

  // Handle audio end event for looping
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (currentLoop < loopCount - 1) {
        setCurrentLoop((prev) => prev + 1);
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
        setCurrentLoop(0);
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentLoop, loopCount]);

  // Handle play/pause
  const togglePlayPause = () => {
    if (!audioUrl) return;

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  // Handle stop
  const handleStop = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentLoop(0);
  };

  // Handle loop count change
  const handleLoopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const num = parseInt(value) || 10;
    setLoopCount(Math.max(1, num));
  };

  return (
    <div className="bg-green-200 rounded-lg p-6 mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black">
          🎙️ {surahName} - Audio Recitation
        </h3>
        <p className="text-sm text-gray-700">Reciter: {reciterName}</p>
      </div>

      {/* Audio element */}
      <audio ref={audioRef} src={audioUrl} crossOrigin="anonymous" />

      {/* Audio Language Toggle */}
      <div className="flex items-center gap-4 flex-wrap">
        <label className="text-sm font-medium text-black">Audio:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setAudioLanguage("arabic")}
            disabled={isPlaying}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              audioLanguage === "arabic"
                ? "bg-green-600 text-white"
                : "bg-white border border-green-400 text-black hover:bg-green-50"
            } disabled:opacity-50`}
          >
            Arabic Only
          </button>
          <button
            onClick={() => setAudioLanguage("arabic-urdu")}
            disabled={isPlaying}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              audioLanguage === "arabic-urdu"
                ? "bg-green-600 text-white"
                : "bg-white border border-green-400 text-black hover:bg-green-50"
            } disabled:opacity-50`}
          >
            Arabic + Urdu
          </button>
        </div>
      </div>

      {/* Loop counter input */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-black">
          Number of loops:
        </label>
        <input
          type="number"
          min="1"
          max="1000"
          value={inputValue}
          onChange={handleLoopChange}
          disabled={isPlaying}
          className="w-20 px-3 py-2 border border-green-400 rounded bg-white text-black disabled:opacity-50"
        />
      </div>

      {/* Progress display */}
      {isPlaying && (
        <div className="text-center py-2 bg-green-100 rounded">
          <p className="text-sm font-semibold text-black">
            Loop {currentLoop + 1} of {loopCount}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={togglePlayPause}
          disabled={isLoading || !audioUrl}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Play
            </>
          )}
        </Button>

        <Button
          onClick={handleStop}
          disabled={!isPlaying}
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-50"
        >
          <RotateCcw className="h-4 w-4 mr-2" /> Stop
        </Button>
      </div>

      {isLoading && (
        <p className="text-center text-sm text-gray-600">Loading audio...</p>
      )}

      {!audioUrl && !isLoading && (
        <p className="text-center text-sm text-red-600">
          Audio not available for this Surah
        </p>
      )}
    </div>
  );
}
