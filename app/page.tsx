import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center">
      <Link href="/capture" className="active:scale-95 transition-transform cursor-pointer">
        <img
          src="/svg/booth-machine.svg"
          style={{ width: "373px", maxWidth: "100vw", height: "auto" }}
          alt="Photobooth — click enter"
        />
      </Link>
    </main>
  );
}
