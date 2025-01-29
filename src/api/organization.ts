import type { ClubDetails, Organization } from "../types/types";

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

export async function fetchClubDetails(
  organizationId: string
): Promise<ClubDetails> {
  const response = await fetch(
    `https://api-v2.golee.dev/club/public-clubs/${organizationId}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}
