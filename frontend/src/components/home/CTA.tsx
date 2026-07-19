import Button from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="bg-blue-600 py-20">
      <div className="mx-auto max-w-4xl px-6 text-center text-white">
        <h2 className="text-4xl font-bold">
          Ready to Plan Your Next Adventure?
        </h2>

        <p className="mt-4 text-lg text-blue-100">
          Let AI create the perfect itinerary based on your budget, interests,
          and travel dates.
        </p>

        <div className="mt-8">
          <Button className="bg-white text-blue-600 hover:bg-slate-100">
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}