import { TransactionTable } from "@/components/transaction-table";
import { Constellation } from "@/components/constellation";
import { DataAnalytics } from "@/components/data-analytics";

export default function Home() {
  return (
    <div className="relative min-h-[150vh] overflow-hidden">
      {/* Background stars */}
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

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-border/50 border-b backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="group flex cursor-pointer items-center gap-3">
                <Constellation />
                <h1 className="shimmer-text text-2xl font-bold tracking-tight transition-colors duration-300 hover:text-purple-400">
                  Nova
                </h1>
              </div>
              <nav className="flex items-center gap-6">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Dashboard
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <h2 className="shimmer-text text-secondary-foreground text-8xl font-bold transition-colors duration-500 hover:text-purple-400">
              Dashboard
            </h2>
            <Constellation />
          </div>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl text-pretty">
            Where data meets cosmos
          </p>
        </section>

        {/* Transaction table */}
        <section className="container mx-auto px-4 pb-16">
          <TransactionTable />
        </section>

        {/* Data Analytics section */}
        <section className="container mx-auto px-4 pb-32">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Data Analytics (metrics not being used)
            </h2>
            <p className="text-muted-foreground mt-2">
              Comprehensive insights into your income streams
            </p>
          </div>
          <DataAnalytics />
        </section>

        {/* Added extra spacing to make page longer */}
        <div className="h-32" />
      </div>
    </div>
  );
}
