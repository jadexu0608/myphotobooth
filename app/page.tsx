import Link from "next/link";

export default function HomePage() {
  return (
    // 1. 给 main 加了 "relative"，让署名相对于这个容器来定位
    <main className="min-h-screen bg-white flex flex-col items-center justify-center relative">
      
      {/* 2. 给 Link 加了 "w-fit"，点击区域现在只在这个按键图片上 */}
      <Link href="/capture" className="active:scale-95 transition-transform cursor-pointer w-fit z-10">
        <img
          src="/svg/booth-machine.svg"
          style={{ width: "373px", maxWidth: "100vw", height: "auto" }}
          alt="Photobooth — click enter"
        />
      </Link>

      {/* 3. 署名部分 */}
      <a
        href="https://xhslink.com/m/7EbjLE6Tusu"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          right: "48px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "12px",
          fontWeight: 500, // 这代表 Medium (中等粗细)
          fontFamily: '"IBM Plex Mono", monospace',
          color: "#000000",
          textDecoration: "none",
          border: "1px solid #000000",
          padding: "8px 12px",
          zIndex: 20, // 确保它在最上层
        }}
      >
        @Jade X.
      </a>

    </main>
  );
}