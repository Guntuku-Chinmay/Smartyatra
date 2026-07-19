import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

export default function Features() {
  return (
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
  );
}