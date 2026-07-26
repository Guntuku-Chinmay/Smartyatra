"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Wallet, Users, Car, Smile, ArrowRight, Loader2, Sparkles, CalendarDays, MapPin } from "lucide-react";

import api from "@/services/api";
import { createTrip, createItinerary, TripCreateInput } from "@/services/planner.service";
import Stepper from "@/components/ui/Stepper";

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

  const cityIdVal = watch("cityId");
  const startDateVal = watch("startDate");
  const endDateVal = watch("endDate");
  const budgetVal = watch("budget");
  const travelersVal = watch("travelers");

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

      const tripInput: TripCreateInput = {
        name: `Trip to ${cityName}`,
        start_date: data.startDate,
        end_date: data.endDate,
        total_budget: data.budget,
        city_id: parseInt(data.cityId),
        status: "PLANNED",
      };

      const createdTrip = await createTrip(tripInput);

      await api.post("/budgets/", {
        estimated_cost: data.budget,
        actual_cost: 0,
        remaining_budget: data.budget,
        trip_id: createdTrip.id,
      });

      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const cityKey = cityName.toLowerCase();
      let templates = defaultTemplates;
      for (const [key, val] of Object.entries(activityTemplates)) {
        if (cityKey.includes(key)) {
          templates = val;
          break;
        }
      }

      const itineraryPromises = [];
      for (let day = 1; day <= durationDays; day++) {
        const morningTemplate = templates[((day - 1) * 2) % templates.length];
        const afternoonTemplate = templates[((day - 1) * 2 + 1) % templates.length];

        const destResponse = await api.get(`/destinations/city/${data.cityId}`);
        const dbDestinations = destResponse.data;
        const morningDestId = dbDestinations.length > 0 ? dbDestinations[0].id : 1;
        const afternoonDestId = dbDestinations.length > 1 ? dbDestinations[1].id : morningDestId;

        itineraryPromises.push(
          createItinerary({
            trip_id: createdTrip.id,
            destination_id: morningDestId,
            day_number: day,
            start_time: morningTemplate.time,
            notes: morningTemplate.activity + ": " + morningTemplate.notes,
          })
        );

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
      queryClient.invalidateQueries({ queryKey: ["trips"] });
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
      {/* Progress tracker stepper */}
      <Stepper
        steps={["Basics", "Details", "Interests"]}
        currentStep={step}
        className="mb-10 px-4"
      />

      {formError && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-xs font-semibold text-red-600">
          ⚠️ {formError}
        </div>
      )}

      {/* Steps Animating Wrapper */}
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl shadow-slate-200/50">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="font-display text-xl font-black flex items-center gap-2 text-slate-900 border-b border-slate-50 pb-3">
                  <Compass className="h-5 w-5 text-blue-600" />
                  <span>Where and when are you traveling?</span>
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700">Select Destination</label>
                    <div className="relative mt-2">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <select
                        {...register("cityId")}
                        className={`w-full rounded-xl border bg-slate-50/30 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white focus:ring-4 ${
                          errors.cityId
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                        }`}
                      >
                        <option value="">-- Choose destination --</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id.toString()}>
                            {city.name}, {city.state}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.cityId && (
                      <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.cityId.message}</p>
                    )}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-bold text-slate-700">Start Date</label>
                      <div className="relative mt-2">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <CalendarDays className="h-4 w-4" />
                        </span>
                        <input
                          type="date"
                          {...register("startDate")}
                          className={`w-full rounded-xl border bg-slate-50/30 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white focus:ring-4 ${
                            errors.startDate
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                              : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                          }`}
                        />
                      </div>
                      {errors.startDate && (
                        <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.startDate.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700">End Date</label>
                      <div className="relative mt-2">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <CalendarDays className="h-4 w-4" />
                        </span>
                        <input
                          type="date"
                          {...register("endDate")}
                          className={`w-full rounded-xl border bg-slate-50/30 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white focus:ring-4 ${
                            errors.endDate
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                              : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                          }`}
                        />
                      </div>
                      {errors.endDate && (
                        <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.endDate.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!cityIdVal || !startDateVal || !endDateVal}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 shadow-lg shadow-blue-500/10 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="font-display text-xl font-black flex items-center gap-2 text-slate-900 border-b border-slate-50 pb-3">
                  <Wallet className="h-5 w-5 text-blue-600" />
                  <span>Budget, travelers & transit details</span>
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-bold text-slate-700">Total Budget (₹)</label>
                    <div className="relative mt-2">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Wallet className="h-4 w-4" />
                      </span>
                      <input
                        type="number"
                        placeholder="20000"
                        {...register("budget", { valueAsNumber: true })}
                        className={`w-full rounded-xl border bg-slate-50/30 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white focus:ring-4 ${
                          errors.budget
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                        }`}
                      />
                    </div>
                    {errors.budget && (
                      <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.budget.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700">Number of Travelers</label>
                    <div className="relative mt-2">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Users className="h-4 w-4" />
                      </span>
                      <input
                        type="number"
                        min={1}
                        placeholder="1"
                        {...register("travelers", { valueAsNumber: true })}
                        className={`w-full rounded-xl border bg-slate-50/30 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white focus:ring-4 ${
                          errors.travelers
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                        }`}
                      />
                    </div>
                    {errors.travelers && (
                      <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.travelers.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700">Preferred Travel Style</label>
                    <select
                      {...register("travelStyle")}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-3 text-sm text-slate-800 outline-none transition focus:bg-white focus:ring-4 focus:border-blue-500 focus:ring-blue-500/10"
                    >
                      <option value="Budget">Budget</option>
                      <option value="Standard">Standard</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700">Transport Mode</label>
                    <div className="relative mt-2">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Car className="h-4 w-4" />
                      </span>
                      <select
                        {...register("travelMode")}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/30 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white focus:ring-4 focus:border-blue-500 focus:ring-blue-500/10"
                      >
                        <option value="DRIVING">Driving / Rental Car</option>
                        <option value="WALKING">Walking</option>
                        <option value="BICYCLING">Bicycle</option>
                        <option value="TRANSIT">Public Transit</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-3 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!budgetVal || !travelersVal}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 shadow-lg shadow-blue-500/10 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="font-display text-xl font-black flex items-center gap-2 text-slate-900 border-b border-slate-50 pb-3">
                  <Smile className="h-5 w-5 text-blue-600" />
                  <span>Select your travel interests</span>
                </h3>

                <div className="space-y-5">
                  <p className="text-xs font-semibold text-slate-400">
                    Select interests to help customize daily activities (Choose at least 1).
                  </p>

                  <div className="flex flex-wrap gap-2.5">
                    {availableInterests.map((interest) => {
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all border ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-3 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || selectedInterests.length === 0}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/10 transition-all hover:-translate-y-0.5 disabled:opacity-50 px-8 py-3.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Generating Itinerary...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 animate-pulse" />
                        <span>Generate AI Plan</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}