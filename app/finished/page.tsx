"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Printing from "@/components/Printing";
import Finished from "@/components/Finished";

// Canvas scale for downloaded image (6× SVG natural size)
const DL_S = 6;
const DL_SLOTS = [
  { x: Math.round(1.851 * DL_S), y: Math.round(  3.664 * DL_S), w: Math.round(51.298 * DL_S), h: Math.round(58.626 * DL_S) },
  { x: Math.round(1.851 * DL_S), y: Math.round( 66.687 * DL_S), w: Math.round(51.298 * DL_S), h: Math.round(58.626 * DL_S) },
  { x: Math.round(1.851 * DL_S), y: Math.round(129.710 * DL_S), w: Math.round(51.298 * DL_S), h: Math.round(58.626 * DL_S) },
];

type Phase = "printing" | "done";

function applyPhotoboothBwToArea(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imageData = ctx.getImageData(x, y, w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Luma grayscale + mild photobooth-style contrast/brightness bump.
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const contrasted = (gray - 128) * 1.2 + 128;
    const brightened = contrasted * 1.06;
    const out = Math.max(0, Math.min(255, brightened));

    data[i] = out;
    data[i + 1] = out;
    data[i + 2] = out;
  }

  ctx.putImageData(imageData, x, y);
}

export default function ResultPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [phase,  setPhase]  = useState<Phase>("printing");
  const [shared, setShared] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("photobooth_photos");
    if (stored) setPhotos(JSON.parse(stored));
  }, []);

  // Download: compose photo strip on canvas and trigger save
  const handleDownload = () => {
    const CW = Math.round(55  * DL_S); // 330
    const CH = Math.round(192 * DL_S); // 1152
    const canvas = document.createElement("canvas");
    canvas.width  = CW;
    canvas.height = CH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, CW, CH);

    const loadImg = (src: string) =>
      new Promise<HTMLImageElement>((res) => {
        const img = new Image();
        img.onload = () => res(img);
        img.src = src;
      });

    Promise.all(photos.slice(0, 3).map(loadImg)).then((imgs) => {
      imgs.forEach((img, i) => {
        const s = DL_SLOTS[i];
        ctx.drawImage(img, s.x, s.y, s.w, s.h);
        applyPhotoboothBwToArea(ctx, s.x, s.y, s.w, s.h);
      });

      ctx.fillStyle = "#ffffff";
      ctx.font      = `${Math.round(8 * DL_S)}px serif`;
      ctx.textAlign = "center";
      ctx.fillText(today, CW / 2, CH - Math.round(4 * DL_S));

      const a = document.createElement("a");
      a.download = "photobooth.jpg";
      a.href = canvas.toDataURL("image/jpeg", 0.95);
      a.click();
    });
  };

  // Share via Web Share API, fallback to clipboard copy
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Photobooth!", text: "Check out my photos!" });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard?.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center overflow-x-hidden py-10 px-6">
      <AnimatePresence mode="wait">

        {phase === "printing" && (
          <motion.div
            key="printing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <Printing onDone={() => setPhase("done")} />
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done">
            <Finished
              photos={photos}
              today={today}
              shared={shared}
              onDownload={handleDownload}
              onShare={handleShare}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}
