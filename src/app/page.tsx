import { Button } from "@/components/ui/button";
import { Moon, Rss } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FECB2F] text-black font-sans">
      <header className="flex justify-between items-center px-10 py-6">
        <div className="text-lg font-bold flex items-center gap-2">
          <span className="text-2xl"></span> Firebase
        </div>
        <nav className="flex gap-8 text-sm font-medium">
          <a href="#">Products</a>
          <a href="#">Use cases</a>
          <a href="#">Pricing</a>
          <a href="#">Docs</a>
          <a href="#">Support</a>
        </nav>
        <div className="flex items-center gap-4">
          <Moon size={18} />
          <Rss size={18} />
          <a href="#" className="text-sm font-semibold">
            Go to console
          </a>
        </div>
      </header>

      <main className="px-10 py-20">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl">
          Ensure your Firebase Cloud Messaging notifications reach your users on
          Android
        </h1>

        <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center gap-4">
            <Image
              src="https://avatars.githubusercontent.com/u/102310?v=4"
              alt="Sumit Chandel"
              width={64}
              height={64}
              className="w-16 h-16 rounded-md object-cover"
            />
            <div>
              <p className="font-medium">Sumit Chandel</p>
              <p className="text-sm text-gray-700">Developer Advocate</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="https://avatars.githubusercontent.com/u/25479359?v=4"
              alt="Alice Yuan"
              width={64}
              height={64}
              className="w-16 h-16 rounded-md object-cover"
            />
            <div>
              <p className="font-medium">Alice Yuan</p>
              <p className="text-sm text-gray-700">
                Android Developer Relations Engineer
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 flex gap-4">
          <span className="border px-4 py-1 rounded bg-yellow-300 text-sm">
            Cloud Messaging
          </span>
          <span className="border px-4 py-1 rounded bg-yellow-300 text-sm">
            Android
          </span>
          <span className="border px-4 py-1 rounded bg-yellow-300 text-sm">
            Doze Mode
          </span>
        </div>
        <Button className="mt-4">Click me</Button>
      </main>
    </div>
  );
}
