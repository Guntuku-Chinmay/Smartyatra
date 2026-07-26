import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TravelStoreState {
  bookmarks: number[]; // Array of bookmarked destination IDs
  recentlyViewed: number[]; // Array of recently viewed destination IDs (max 6)
  toggleBookmark: (id: number) => void;
  isBookmarked: (id: number) => boolean;
  addRecentlyViewed: (id: number) => void;
}

export const useTravelStore = create<TravelStoreState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      recentlyViewed: [],
      toggleBookmark: (id) =>
        set((state) => {
          const exists = state.bookmarks.includes(id);
          return {
            bookmarks: exists
              ? state.bookmarks.filter((bId) => bId !== id)
              : [...state.bookmarks, id],
          };
        }),
      isBookmarked: (id) => get().bookmarks.includes(id),
      addRecentlyViewed: (id) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((vId) => vId !== id);
          // Keep only the 6 most recent views
          return {
            recentlyViewed: [id, ...filtered].slice(0, 6),
          };
        }),
    }),
    {
      name: "smartyatra-travel-storage",
    }
  )
);
