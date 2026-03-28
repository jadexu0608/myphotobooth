"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_SHOTS = 3;
const COUNTDOWN_START = 3;

type Phase = "idle" | "countdown" | "flash";

export default function BoothPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  
  const [phase, setPhase] = useState<Phase>("idle");
  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        setError("无法访问摄像头，请允许权限后刷新页面。");
      }
    })();
    return () => { stream?.getTracks().forEach((t) => t.stop()); };
  }, []);

  const capturePhoto = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.filter = "grayscale(1) contrast(1.2) brightness(1.05)";
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.92);
  }, []);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
    const photo = capturePhoto();
    setPhase("flash");
    setTimeout(() => {
      if (photo) setPhotos((prev) => [...prev, photo]);
      setPhase("idle");
    }, 700);
  }, [phase, countdown, capturePhoto]);

  useEffect(() => {
    if (photos.length === 0) return;

    if (photos.length >= TOTAL_SHOTS) {
      sessionStorage.setItem("photobooth_photos", JSON.stringify(photos));
      router.push("/finished");
    } else if (phase === "idle") {
      setCountdown(COUNTDOWN_START);
      setPhase("countdown");
    }
  }, [photos.length, phase, router]);

  const handleStart = () => {
    setPhotos([]);
    setCountdown(COUNTDOWN_START);
    setPhase("countdown");
  };

  const FRAME_W = 233;
  const FRAME_H = 270;
  const SLOT = {
    top: 54,
    left: 45.5,
    width: 140,
    height: 160,
  };
  const FOOTER_W = 313;
  const FOOTER_H = 71;
  const FOOTER_GREEN_DOT = {
    left: 216.9, // light-green 覆盖 footer.svg 内置红点中心点位置
    top: 29.7,
    size: 10,
  };

  return (
    <main className="min-h-screen bg-white flex items-start justify-center px-4 py-8 sm:py-10">
      <div className="w-full max-w-[393px]">
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-hand text-[26px] leading-none text-black/45 hover:text-black transition-colors wiggle-base"
        >
          <span>←</span>
          <span>back</span>
        </Link>

        <div className="mt-8 flex flex-col items-center gap-[22px]">
          <div className="flex flex-col items-center">
            <img src="/svg/header.svg" className="h-auto w-[313px]" alt="strike a pose" />
          </div>

          <div
            className="relative wiggle-base"
            style={{ width: `${FRAME_W}px`, height: `${FRAME_H}px` }}
          >
            <img src="/svg/camera.svg" className="absolute inset-0 h-full w-full" alt="" />

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              position: "absolute",
              top: `${SLOT.top}px`,
              left: `${SLOT.left}px`,
              width: `${SLOT.width}px`,
              height: `${SLOT.height}px`,
              objectFit: "cover",
              transform: "scaleX(-1)",
              zIndex: 1,
            }}
          />

          {phase === "flash" && (
            <div
              className="absolute bg-white animate-flash pointer-events-none"
              style={{
                top: `${SLOT.top}px`,
                left: `${SLOT.left}px`,
                width: `${SLOT.width}px`,
                height: `${SLOT.height}px`,
                zIndex: 4,
              }}
            />
          )}

          <AnimatePresence mode="wait">
            {phase === "countdown" && countdown > 0 && (
              <motion.div
                key={countdown}
                className="absolute pointer-events-none flex items-center justify-center"
                style={{
                  top: `${SLOT.top}px`,
                  left: `${SLOT.left}px`,
                  width: `${SLOT.width}px`,
                  height: `${SLOT.height}px`,
                  zIndex: 5,
                }}
                initial={{ scale: 1.8, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={{    scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <img
                  src={`/svg/count down-${countdown}.svg`}
                  style={{
                    height: "82px",
                    width: "auto",
                    filter: "invert(1) drop-shadow(0 3px 10px rgba(0,0,0,0.32))",
                  }}
                  alt={String(countdown)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

          <div className="relative w-[313px] h-[71px]">
            <button
              type="button"
              onClick={handleStart}
              disabled={phase !== "idle" || !!error}
              className="absolute inset-0 h-full w-full p-0 m-0 transition-transform active:scale-95 wiggle-fast"
              style={{
                opacity: phase === "idle" && !error ? 1 : 0.45,
                cursor: phase === "idle" ? "pointer" : "default",
              }}
              aria-label="Start"
            >
              <img src="/svg/footer.svg" className="w-full h-full block" alt="" />
            </button>

            {phase !== "idle" && !error && (
              <img
                src="/svg/light-green.svg"
                alt="green light"
                className="absolute"
                style={{
                  width: FOOTER_GREEN_DOT.size,
                  height: FOOTER_GREEN_DOT.size,
                  left: FOOTER_GREEN_DOT.left,
                  top: FOOTER_GREEN_DOT.top,
                }}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_SHOTS }).map((_, i) => (
              <div
                key={i}
                className="h-[10px] w-[10px] rounded-full border border-black"
                style={{ background: i < photos.length ? "#000" : "#fff" }}
              />
            ))}
          </div>

          {error && <p className="font-hand text-2xl text-red-500 text-center">{error}</p>}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </main>
  );
}