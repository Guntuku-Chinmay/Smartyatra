"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Compass, Wallet, Users, Car, Smile, Check } from "lucide-react";

import api from "@/services/api";
import { createTrip, createItinerary, TripCreateInput } from "@/services/planner.service";
import Button from "@/components/ui/Button";

interface City {
  id: number;
  name: string;
  state: string;
  country: string;
}

const plannerSchema = z.object({
  cityId: z.string().min(1, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  budget: z.number().min(1000, "Minimum budget should be ₹1,000"),
  travelers: z.number().min(1, "At least 1 traveler is required"),
  travelStyle: z.enum(["Budget", "Standard", "Luxury"]),
  travelMode: z.string(),
});

type PlannerInput = z.infer<typeof plannerSchema>;

const availableInterests = [
  "Adventure",
  "Nature",
  "Food",
  "Culture",
  "Shopping",
  "Photography",
];

// Activity pool for auto-generating itineraries based on city
interface ItineraryTemplate {
  time: string;
  activity: string;
  notes: string;
}

const activityTemplates: Record<string, ItineraryTemplate[]> = {
  goa: [
    { time: "09:00:00", activity: "Calangute Beach Relaxing", notes: "Enjoy morning sunbathing and light water sports." },
    { time: "14:00:00", activity: "Fort Aguada Exploration", notes: "Visit the historic Portuguese lighthouse and enjoy panoramic ocean views." },
    { time: "09:30:00", activity: "Basilica of Bom Jesus", notes: "Tour the famous UNESCO World Heritage site in Old Goa." },
    { time: "15:00:00", activity: "Fontainhas Latin Quarter Walk", notes: "Explore the colorful colonial streets and local Portuguese cafes." },
    { time: "09:00:00", activity: "Dudhsagar Waterfalls Trek", notes: "Take a jeep safari and trek to the stunning milky waterfall." },
    { time: "16:00:00", activity: "Anjuna Beach Sunset", notes: "Relax at beachside shacks and enjoy the gorgeous sunset vibes." },
  ],
  manali: [
    { time: "09:00:00", activity: "Solang Valley Adventure", notes: "Try paragliding, zorbing, and capture scenic mountain views." },
    { time: "14:30:00", activity: "Hadimba Temple Tour", notes: "Visit the historical wooden pagoda temple situated in giant cedar forests." },
    { time: "08:00:00", activity: "Rohtang Pass Snow Excursion", notes: "Drive up to the snow point for skiing and spectacular glacier landscapes." },
    { time: "15:30:00", activity: "Vashisht Hot Water Springs", notes: "Relax in natural sulfur hot springs and explore ancient temples." },
    { time: "10:00:00", activity: "Jogini Waterfall Trek", notes: "Enjoy a scenic pine forest trek to the secluded waterfalls." },
    { time: "16:00:00", activity: "Mall Road Shopping", notes: "Stroll along Manali Mall Road for local wooden handicrafts and warm shawls." },
  ],
  hampi: [
    { time: "09:00:00", activity: "Virupaksha Temple Visit", notes: "Explore the active 7th-century temple and meet the temple elephant." },
    { time: "14:00:00", activity: "Vittala Temple & Stone Chariot", notes: "Admire the iconic stone chariot and musical pillars." },
    { time: "09:30:00", activity: "Royal Enclosure & Lotus Mahal", notes: "See the ruins of the Vijayanagara palace and the beautiful zenana structures." },
    { time: "16:30:00", activity: "Hemakuta Hill Sunset", notes: "Trek up the hill for a magnificent sunset view over the boulder ruins landscape." },
    { time: "09:00:00", activity: "Tungabhadra River Coracle Ride", notes: "Cross the river in a traditional round coracle boat." },
    { time: "14:00:00", activity: "Anegundi Village Tour", notes: "Explore the ancient fort ruins and pre-historic cave paintings site." },
  ],
};

const defaultTemplates: ItineraryTemplate[] = [
  { time: "09:00:00", activity: "Local Sightseeing Tour", notes: "Explore key local landmarks, historical spots, and viewpoints." },
  { time: "14:00:00", activity: "Cultural Experience & Food", notes: "Visit a local market, try traditional cuisine, and interact with artisans." },
  { time: "10:00:00", activity: "Scenic Nature Walk", notes: "Spend time in local parks, botanical gardens, or scenic trails." },
  { time: "15:00:00", activity: "Leisure & Shopping", notes: "Browse local shopping streets, souvenir shops, and relax at a cafe." },
];

export default function PlannerForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch available cities
  const { data: cities = [] } = useQuery<City[]>({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await api.get("/cities/");
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlannerInput>({
    resolver: zodResolver(plannerSchema),
    mode: "onChange",
    defaultValues: {
      cityId: "",
      startDate: "",
      endDate: "",
      budget: 20000,
      travelers: 1,
      travelStyle: "Standard",
      travelMode: "DRIVING",
    },
  });

  // Pre-fill destination if query parameter exists
  const destParam = searchParams.get("destination");
  useEffect(() => {
    if (destParam && cities.length > 0) {
      const matchedCity = cities.find(
        (c) => c.name.toLowerCase() === destParam.toLowerCase()
      );
      if (matchedCity) {
        setValue("cityId", matchedCity.id.toString(), { shouldValidate: true });
      }
    }
  }, [destParam, cities, setValue]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
  };

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: PlannerInput) => {
    if (selectedInterests.length === 0) {
      setFormError("Please select at least one interest category!");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const selectedCityObj = cities.find((c) => c.id === parseInt(data.cityId));
      const cityName = selectedCityObj ? selectedCityObj.name : "My Trip";

      // 1. Create the Trip on the backend
      const tripInput: TripCreateInput = {
        name: `Trip to ${cityName}`,
        start_date: data.startDate,
        end_date: data.endDate,
        total_budget: data.budget,
        city_id: parseInt(data.cityId),
        status: "PLANNED",
      };

      const createdTrip = await createTrip(tripInput);

      // 2. Initialize the Budget tracking
      await api.post("/budgets/", {
        estimated_cost: data.budget,
        actual_cost: 0,
        remaining_budget: data.budget,
        trip_id: createdTrip.id,
      });

      // 3. Generate day-wise itineraries
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Select template activities based on destination name
      const cityKey = cityName.toLowerCase();
      let templates = defaultTemplates;
      for (const [key, val] of Object.entries(activityTemplates)) {
        if (cityKey.includes(key)) {
          templates = val;
          break;
        }
      }

      // Add itineraries day-by-day (2 activities per day)
      const itineraryPromises = [];
      for (let day = 1; day <= durationDays; day++) {
        // Retrieve morning and afternoon templates cyclically
        const morningTemplate = templates[((day - 1) * 2) % templates.length];
        const afternoonTemplate = templates[((day - 1) * 2 + 1) % templates.length];

        // We fetch a mock destination stop in the city if any exist
        // For simplicity, we link to a placeholder destination ID (or query city destinations)
        const destResponse = await api.get(`/destinations/city/${data.cityId}`);
        const dbDestinations = destResponse.data;
        const morningDestId = dbDestinations.length > 0 ? dbDestinations[0].id : 1;
        const afternoonDestId = dbDestinations.length > 1 ? dbDestinations[1].id : morningDestId;

        // Morning Itinerary
        itineraryPromises.push(
          createItinerary({
            trip_id: createdTrip.id,
            destination_id: morningDestId,
            day_number: day,
            start_time: morningTemplate.time,
            notes: morningTemplate.activity + ": " + morningTemplate.notes,
          })
        );

        // Afternoon Itinerary
        itineraryPromises.push(
          createItinerary({
            trip_id: createdTrip.id,
            destination_id: afternoonDestId,
            day_number: day,
            start_time: afternoonTemplate.time,
            notes: afternoonTemplate.activity + ": " + afternoonTemplate.notes,
          })
        );
      }

      await Promise.all(itineraryPromises);

      // Invalidate trips queries so dashboard updates
      queryClient.invalidateQueries({ queryKey: ["trips"] });

      // Redirect to itinerary view
      router.push(`/planner/itinerary/${createdTrip.id}`);
    } catch (err) {
      console.error(err);
      setFormError("Failed to generate AI trip. Please check your backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Tracker */}
      <div className="mb-10 flex items-center justify-between px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold border transition ${
                step >= s
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white border-slate-200 text-slate-400"
              }`}
            >
              {step > s ? <Check className="h-5 w-5" /> : s}
            </div>
            <span
              className={`text-sm font-bold ${
                step >= s ? "text-slate-800" : "text-slate-400"
              }`}
            >
              {s === 1 ? "Basics" : s === 2 ? "Details" : "Interests"}
            </span>
            {s < 3 && <div className="h-[2px] w-12 bg-slate-200 sm:w-20"></div>}
          </div>
        ))}
      </div>

      {formError && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-50/50 p-4 text-sm text-red-600">
          ⚠️ {formError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-md"
      >
        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-slate-100 pb-3 flex items-center gap-2 text-slate-800">
              <Compass className="h-5 w-5 text-blue-600" />
              <span>Where and when are you going?</span>
            </h3>

            <div className="grid gap-6">
              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Select Destination
                </label>
                <select
                  {...register("cityId")}
                  className={`w-full rounded-lg border p-3.5 outline-none transition focus:border-blue-500 bg-white text-slate-800 ${
                    errors.cityId ? "border-red-500" : "border-slate-300"
                  }`}
                >
                  <option value="">-- Choose a city --</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id.toString()}>
                      {city.name}, {city.state}
                    </option>
                  ))}
                </select>
                {errors.cityId && (
                  <p className="mt-1 text-xs text-red-400">{errors.cityId.message}</p>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    {...register("startDate")}
                    className={`w-full rounded-lg border p-3 outline-none transition focus:border-blue-500 text-slate-800 ${
                      errors.startDate ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    {...register("endDate")}
                    className={`w-full rounded-lg border p-3 outline-none transition focus:border-blue-500 text-slate-800 ${
                      errors.endDate ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                onClick={nextStep}
                disabled={!watch("cityId") || !watch("startDate") || !watch("endDate")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Trip Details */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-slate-100 pb-3 flex items-center gap-2 text-slate-800">
              <Wallet className="h-5 w-5 text-blue-600" />
              <span>Budget, travelers & transport details</span>
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-slate-700 flex items-center gap-1.5">
                  <Wallet className="h-4 w-4 text-slate-400" />
                  <span>Total Budget (₹)</span>
                </label>
                <input
                  type="number"
                  placeholder="20000"
                  {...register("budget", { valueAsNumber: true })}
                  className={`w-full rounded-lg border p-3 outline-none transition focus:border-blue-500 text-slate-800 ${
                    errors.budget ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.budget && (
                  <p className="mt-1 text-xs text-red-400">{errors.budget.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>Number of Travelers</span>
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="1"
                  {...register("travelers", { valueAsNumber: true })}
                  className={`w-full rounded-lg border p-3 outline-none transition focus:border-blue-500 text-slate-800 ${
                    errors.travelers ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.travelers && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.travelers.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Travel Style
                </label>
                <select
                  {...register("travelStyle")}
                  className="w-full rounded-lg border border-slate-300 p-3 bg-white text-slate-800 outline-none focus:border-blue-500"
                >
                  <option value="Budget">Budget</option>
                  <option value="Standard">Standard</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700 flex items-center gap-1.5">
                  <Car className="h-4 w-4 text-slate-400" />
                  <span>Transport Mode</span>
                </label>
                <select
                  {...register("travelMode")}
                  className="w-full rounded-lg border border-slate-300 p-3 bg-white text-slate-800 outline-none focus:border-blue-500"
                >
                  <option value="DRIVING">Driving / Rental Car</option>
                  <option value="WALKING">Walking</option>
                  <option value="BICYCLING">Bicycle</option>
                  <option value="TRANSIT">Public Transit</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button variant="secondary" onClick={prevStep} className="font-bold">
                Back
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                disabled={!watch("budget") || !watch("travelers")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Interests & Submit */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-slate-100 pb-3 flex items-center gap-2 text-slate-800">
              <Smile className="h-5 w-5 text-blue-600" />
              <span>Choose your travel interests</span>
            </h3>

            <div>
              <label className="mb-4 block font-semibold text-slate-600 text-sm">
                Select one or more interests to help customize daily activities (Choose at least 1)
              </label>

              <div className="flex flex-wrap gap-3">
                {availableInterests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`rounded-full px-5 py-2.5 text-sm font-bold border transition duration-200 ${
                        isSelected
                          ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100">
              <Button variant="secondary" onClick={prevStep} className="font-bold">
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || selectedInterests.length === 0}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 font-extrabold text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 px-8 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating Itinerary...</span>
                  </>
                ) : (
                  "Generate AI Plan"
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}