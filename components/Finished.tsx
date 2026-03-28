import Link from "next/link";
import { motion } from "framer-motion";

// Photostrip displayed at 2.5× its SVG size
const S = 2.5;
const STRIP_W = Math.round(55  * S); // 138
const STRIP_H = Math.round(192 * S); // 480

// Photo slot positions from photostrip.svg, scaled to display size
const SLOTS = [
  { x: Math.round(1.851 * S), y: Math.round(  3.664 * S), w: Math.round(51.298 * S), h: Math.round(58.626 * S) },
  { x: Math.round(1.851 * S), y: Math.round( 66.687 * S), w: Math.round(51.298 * S), h: Math.round(58.626 * S) },
  { x: Math.round(1.851 * S), y: Math.round(129.710 * S), w: Math.round(51.298 * S), h: Math.round(58.626 * S) },
];

interface FinishedProps {
  photos: string[];
  today: string;
  shared: boolean;
  onDownload: () => void;
  onShare: () => void;
}

export default function Finished({ photos, today, shared, onDownload, onShare }: FinishedProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Finish print label */}
      <img
        src="/svg/finish pint.svg"
        style={{ width: 137, height: 42 }}
        alt="finish print"
      />

      {/* Photostrip with photos */}
      <div
        style={{
          position: "relative",
          width: STRIP_W,
          height: STRIP_H,
          flexShrink: 0,
        }}
      >
        <img
          src="/svg/photostrip.svg"
          style={{ width: STRIP_W, height: STRIP_H, display: "block" }}
          alt=""
        />

        {SLOTS.map((slot, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: slot.x,
              top: slot.y,
              width: slot.w,
              height: slot.h,
              overflow: "hidden",
            }}
          >
            {photos[i] && (
              <img
                src={photos[i]}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
        ))}

        {/* Date label */}
        <p
          style={{
            position: "absolute",
            bottom: 6,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 10,
            color: "#ffffff",
            fontFamily: "serif",
            letterSpacing: "0.03em",
          }}
        >
          {today}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onDownload}
          className="hover:opacity-70 active:scale-95 transition-all"
        >
          <img src="/svg/download.svg" style={{ width: 147, height: 31 }} alt="Download" />
        </button>
        <button
          onClick={onShare}
          className="hover:opacity-70 active:scale-95 transition-all"
        >
          <img
            src="/svg/share.svg"
            style={{ width: 147, height: 31 }}
            alt={shared ? "Copied!" : "Share"}
          />
        </button>
        <Link
          href="/"
          className="hover:opacity-70 active:scale-95 transition-all"
          onClick={() => sessionStorage.removeItem("photobooth_photos")}
        >
          <img src="/svg/restart.svg" style={{ width: 147, height: 31 }} alt="Restart" />
        </Link>
      </div>
    </motion.div>
  );
}
