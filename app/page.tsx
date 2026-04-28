import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="relative inline-block w-fit">
        
        <img src="/svg/booth-machine.svg" className="w-[373px] max-w-[100vw] h-auto" alt="Photobooth" />
        
        <Link 
          href="/capture" 
          style={{ left: "32px", top: "300px", width: "29px", height: "26px" }}
          className="absolute cursor-pointer z-10 " 
        />
        
        <a 
          href="https://xhslink.com/m/7EbjLE6Tusu" 
          target="_blank" 
          style={{ left: "301px", top: "389px" }}
          className="absolute text-[12px] font-medium text-black no-underline z-20 font-mono"
        >
          @Jade X.
        </a>

      </div>
    </main>
  );
}