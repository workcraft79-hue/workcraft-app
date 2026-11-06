import React, { useRef, useState } from 'react';
import { Mic, Square } from 'lucide-react';

interface VoiceRecorderProps {
  onUploaded?: (url: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onUploaded }) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const startRecording = async () => {
    setErrorMsg('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMsg('Microphone access is unavailable in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const localUrl = URL.createObjectURL(audioBlob);
        
        // Pass audio url to callback
        onUploaded?.(localUrl);
      };

      recorder.start();
      setSeconds(0);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 59) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setErrorMsg('Microphone permission was not granted.');
    }
  };

  return (
    <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/[.06] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black text-cyan-100">In-Portal Voice Support</p>
          <p className="mt-1 text-[10px] text-white/45">
            Hold to record up to 60 seconds. Your number stays private.
          </p>
        </div>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
          className={`grid size-11 shrink-0 place-items-center rounded-full transition-transform active:scale-95 ${
            isRecording
              ? 'bg-red-400 text-[#12241C]'
              : 'bg-cyan-300 text-[#12241C]'
          }`}
        >
          {isRecording ? <Square className="size-4" /> : <Mic className="size-5" />}
        </button>
      </div>

      {isRecording && (
        <p className="mt-3 text-[10px] font-black text-red-200">
          Recording {String(seconds).padStart(2, '0')} / 60 sec
        </p>
      )}

      {errorMsg && (
        <p className="mt-3 text-[10px] text-red-200">{errorMsg}</p>
      )}
    </div>
  );
};
