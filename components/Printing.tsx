"use client";

import { useEffect, useRef, useState } from "react";
import { PHOTO_BOOTH_BW_FILTER } from "@/lib/photoboothPhotoFilter";

// ── 尺寸 (SVG natural × S) ──────────────────────────────────────────────────
const S = 1.5;
const PRINTER_W = Math.round(129 * S); // 194
const PRINTER_H = Math.round(214 * S); // 321  ← 打印机完整高度 / 出纸边界
const TOAST_W = Math.round(124 * S); // 186
const TOAST_H = Math.round(57 * S); //  86
const EXPORT_W = Math.round(80 * S); // 120
const EXPORT_H = Math.round(95 * S); // 143
const EXPORT_LEFT = Math.round(((129 - 80) / 2) * S); // 37  居中
const EXPORT_TOP = PRINTER_H - EXPORT_H; // 178 贴近底边
const STRIP_W = Math.round(55 * S); //  83
const STRIP_H = Math.round(192 * S); // 288
const STRIP_LEFT = EXPORT_LEFT + Math.round((EXPORT_W - STRIP_W) / 2); // 56

// 照片格位置（与 Finished.tsx 一致）
const SLOTS = [
  {
    x: Math.round(1.851 * S),
    y: Math.round(3.664 * S),
    w: Math.round(51.298 * S),
    h: Math.round(58.626 * S),
  },
  {
    x: Math.round(1.851 * S),
    y: Math.round(66.687 * S),
    w: Math.round(51.298 * S),
    h: Math.round(58.626 * S),
  },
  {
    x: Math.round(1.851 * S),
    y: Math.round(129.71 * S),
    w: Math.round(51.298 * S),
    h: Math.round(58.626 * S),
  },
];

// 相纸下落终点：让大部分相纸可见（可见高度 ≈ FALL_Y + STRIP_H - PRINTER_H）
const FALL_Y = 300;

function sleep(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

// ── 组件 ─────────────────────────────────────────────────────────────────────
export default function Printing({ onDone }: { onDone: () => void }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  // 完美保留：读取真实的拍摄照片
  useEffect(() => {
    const stored = sessionStorage.getItem("photobooth_photos");
    if (stored) setPhotos(JSON.parse(stored));
  }, []);

  // 完美保留：相纸掉落动画逻辑
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const strip = stripRef.current as HTMLElement | null;
      if (!strip) return;

      // 短暂停留，让 toast 先出现
      await sleep(400);
      if (cancelled) return;

      // 相纸从打印机内部下落穿过 export 槽（重力感 ease-in）
      strip.style.transition = `transform 900ms cubic-bezier(0.4, 0, 1, 1)`;
      strip.style.transform = `translateY(${FALL_Y}px)`;
      await sleep(1000);
      if (cancelled) return;

      // 短暂展示已出纸的相纸
      await sleep(600);
      if (cancelled) return;

      onDone();
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [onDone]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Toast 提示 */}
      <img
        src="/svg/countdown-toast.svg"
        style={{ width: TOAST_W, height: TOAST_H }}
        alt="photo delivery here"
      />

      {/* 打印机场景 */}
      <div
        style={{
          position: "relative",
          width: PRINTER_W,
          height: PRINTER_H,
          flexShrink: 0,
          overflow: "visible",
        }}
      >
        {/* 1. 最底层 (z-index: 1)：打印机主体白色背景 */}
        <img
          src="/svg/printer-main.svg"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: PRINTER_W,
            height: PRINTER_H,
            zIndex: 1,
          }}
          alt=""
        />

        {/* 2. 中间层 (z-index: 2)：出纸口边框装饰 */}
        <img
          src="/svg/export.svg"
          style={{
            position: "absolute",
            left: EXPORT_LEFT,
            top: EXPORT_TOP,
            width: EXPORT_W,
            height: EXPORT_H,
            zIndex: 2,
            mixBlendMode: "multiply" as const, // 保留滤镜
          }}
          alt=""
        />

        {/* 3. 最顶层 (z-index: 3) 🌟 核心修复 🌟：相纸的裁剪遮罩 */}
        {/* 它盖在机器和出口边框的上方，确保掉出来的相纸能遮住底部的边线 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: EXPORT_TOP, // 从出纸口的缝隙开始往下显示
            width: PRINTER_W,
            height: 1000, // 足够高，防止掉落后被拦腰截断
            overflow: "hidden", // 缝隙以上的相纸全部隐身
            zIndex: 3, // 最高层级！覆盖下方所有大框边线
          }}
        >
          {/* 包含真实照片的相纸本体 */}
          <div
            ref={stripRef}
            style={{
              position: "absolute",
              left: STRIP_LEFT,
              top: -EXPORT_TOP, // 向上偏移抵消父容器，完美适配原动画数值 FALL_Y
              width: STRIP_W,
              height: STRIP_H,
            }}
          >
            <img
              src="/svg/photostrip.svg"
              style={{ width: STRIP_W, height: STRIP_H, display: "block" }}
              alt=""
            />
            {/* 真实照片网格映射 */}
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
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: PHOTO_BOOTH_BW_FILTER,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
