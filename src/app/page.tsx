import Link from "next/link";

export default function HomePage() {
  return (
    <div className="radial-bg relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 z-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="bg-foreground star-twinkle absolute h-1 w-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center">
        <div className="flex w-screen flex-col items-center justify-center">
          <video
            src="/videos/NovaTitleAnim.webm"
            autoPlay
            loop
            muted
            playsInline
            className="h-[40%] w-[40%]"
            style={{ pointerEvents: "none" }}
          />

          <div className="flex flex-col items-center justify-center gap-4">
            <Link href={"/auth/signin"}>
              <button className="btn-custom px-16 py-10 text-3xl">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
