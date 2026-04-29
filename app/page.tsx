import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center">
      
      <div className="pointer-events-none select-none fixed inset-0 z-0">
        <Image src="/svg/star%201.svg" alt="" width={64} height={64}
          className="absolute top-4 left-4 md:top-8 md:left-10 md:w-20 md:h-20" />
        <Image src="/svg/sunglasses.svg" alt="" width={64} height={64}
          className="absolute top-4 right-4 md:top-8 md:right-10 md:w-20 md:h-20" />
        <Image src="/svg/ice%20cream.svg" alt="" width={64} height={64}
          className="absolute bottom-4 left-4 md:bottom-8 md:left-10 md:w-20 md:h-20" />
        <Image src="/svg/camera%20icon.svg" alt="" width={64} height={64}
          className="absolute bottom-4 right-4 md:bottom-8 md:right-10 md:w-20 md:h-20" />
      </div>

      <div className="relative inline-block w-fit z-10">
        <img
          src="/svg/booth-machine.svg"
          className="w-[373px] max-w-[100vw] h-auto"
          alt="Photobooth"
        />
        <Link
          href="/capture"
          style={{ left: "32px", top: "300px", width: "29px", height: "26px" }}
          className="absolute cursor-pointer z-10"
        />
        <a
          href="https://xhslink.com/m/7EbjLE6Tusu"
          target="_blank"
          rel="noopener noreferrer"
          style={{ left: "301px", top: "389px" }}
          className="absolute text-[12px] font-medium text-black no-underline z-20 font-mono"
        >
          @Jade X.
        </a>
      </div>

    </main>
  );
}