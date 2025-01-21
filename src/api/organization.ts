import type { Organization } from "../types/types";

export async function fetchOrganizations(): Promise<Organization[]> {
  try {
    const response = await fetch(
      "https://api.golee.dev/club/club/public/organizations-with-coordinates"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return [];
  }
}
