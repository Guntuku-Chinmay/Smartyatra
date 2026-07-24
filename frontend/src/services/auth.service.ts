import { UserPreferences, User } from "../store/auth.store";

export async function loginUser(email: string): Promise<{ user: User; token: string }> {
  // If backend implements auth later:
  // const response = await api.post("/auth/login", { email, password });
  // return response.data;
  
  // Simulated:
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    user: {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0],
      email: email,
      preferences: {
        interests: ["Nature", "Food", "Adventure"],
        budget: 25000,
        travelStyle: "Standard",
        homeCity: "Delhi",
      },
    },
    token: "mock-jwt-token-12345",
  };
}

export async function signupUser(
  name: string,
  email: string,
  preferences: UserPreferences
): Promise<{ user: User; token: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    user: {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      name,
      email,
      preferences,
    },
    token: "mock-jwt-token-12345",
  };
}