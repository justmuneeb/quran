import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface AudioPlayerProps {
  surahNumber: number;
  surahName: string;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
}

export default function AudioPlayer({
  surahNumber,
  surahName,
  onTimeUpdate,
  onDurationChange,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopCount, setLoopCount] = useState(10);
  const [currentLoop, setCurrentLoop] = useState(0);
  const [inputValue, setInputValue] = useState("10");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [audioLanguage, setAudioLanguage] = useState<"arabic" | "arabic-urdu">("arabic");
  const [reciterName, setReciterName] = useState<string>("");
  const [isSeeking, setIsSeeking] = useState(false);

  // Set audio URL based on language choice
  useEffect(() => {
    const surahNum = String(surahNumber).padStart(3, "0");
    let url = "";
    let reciter = "";

    if (audioLanguage === "arabic") {
      // Arabic only - Abdul Basit Murattal from quranicaudio.com
      url = `https://download.quranicaudio.com/quran/abdul_basit_murattal/${surahNum}.mp3`;
      reciter = "Abdul Basit Murattal";
    } else {
      // Arabic + Urdu - Sudais and Shuraym with Urdu translation
      // Surah Mulk (67) from quranicaudio.com, Surah Yaseen (36) from quranurdu.com
      if (surahNumber === 67) {
        url = `https://download.quranicaudio.com/quran/sudais_and_shuraim_with_urdu/${surahNum}.mp3`;
      } else if (surahNumber === 36) {
        // Surah Yaseen (36) - use merged Urdu audio file (part 1 + part 2)
        url = `https://files.manuscdn.com/user_upload_by_module/session_file/310419663029819665/sCuVrXrLfNiGlbBo.mp3`;
      } else {
        // Fallback for other surahs
        url = `https://download.quranicaudio.com/quran/sudais_and_shuraim_with_urdu/${surahNum}.mp3`;
      }
      reciter = "Sudais & Shuraym with Urdu";
    }

    setAudioUrl(url);
    setReciterName(reciter);
  }, [surahNumber, audioLanguage]);

  // Handle audio metadata loaded
  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
      onDurationChange?.(audio.duration);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && !isSeeking) {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime);
    }
  };

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    onTimeUpdate?.(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

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
    setCurrentTime(0);
    onTimeUpdate?.(0);
  };

  // Handle loop count change
  const handleLoopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const num = parseInt(value) || 10;
    setLoopCount(Math.max(1, num));
  };

  // Format time display
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
      <audio
        ref={audioRef}
        src={audioUrl}
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

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

      {/* Progress Slider */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          onMouseDown={() => setIsSeeking(true)}
          onMouseUp={() => setIsSeeking(false)}
          onTouchStart={() => setIsSeeking(true)}
          onTouchEnd={() => setIsSeeking(false)}
          className="w-full h-2 bg-green-300 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
        <div className="flex justify-between text-xs text-gray-700">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
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
          disabled={!audioUrl}
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

      {!audioUrl && (
        <p className="text-center text-sm text-red-600">
          Audio not available for this Surah
        </p>
      )}
    </div>
  );
}
