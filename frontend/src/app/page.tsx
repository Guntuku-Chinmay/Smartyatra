import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-slate-50">
        <div className="mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
          <span className="mb-4 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            AI Powered Travel Planner
          </span>

          <h1 className="max-w-4xl text-5xl font-extrabold leading-tight text-slate-900 md:text-6xl">
            Plan Your Dream Trip with{" "}
            <span className="text-blue-600">Smartyatra</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Discover destinations, estimate budgets, generate personalized
            itineraries, and plan smarter using Artificial Intelligence.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button>Start Planning</Button>

            <Button variant="secondary">
              Explore Destinations
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Section
        title="Everything You Need"
        subtitle="Smart tools to simplify every step of your travel planning."
      >
        <div className="grid gap-8 md:grid-cols-3">
          <Card title="AI Itinerary">
            Generate personalized day-by-day travel plans in seconds.
          </Card>

          <Card title="Budget Planner">
            Estimate expenses before you travel and stay within budget.
          </Card>

          <Card title="Destination Explorer">
            Discover attractions, food, hotels, and local experiences.
          </Card>
        </div>
      </Section>
    </main>
  );
}