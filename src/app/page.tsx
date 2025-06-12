import Image from "next/image";
import StartButton from "@/components/StartButton";

export default function LandingPage() {
  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <div className="bg-shape-top"></div>
      <Image
        src="/images/leaves-background.png"
        alt="Hiasan daun di latar belakang"
        width={300}
        height={400}
        className="bg-leaves-bottom"
        style={{ objectFit: "contain" }}
      />

      <main className="relative flex min-h-screen flex-col items-center justify-center p-8 z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-3xl">
          <div className="flex-shrink-0">
            <Image
              src="/images/becycle-logo.png"
              alt="Logo Becycle"
              width={240}
              height={240}
              priority
            />
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <h1 className="font-inter text-heading font-medium tracking-[0.2px] text-slate-800 mt-4">
              Selamat Datang di Becycle!
            </h1>

            <p className="font-mulish text-body font-normal tracking-[0.2px] text-slate-600">
              Siklus Baru untuk Sampahmu.
            </p>

            <div className="mt-6">
              <StartButton />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}