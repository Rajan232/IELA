// lib/db.ts - Cloudflare D1 & Fallback Data Client

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  order?: number;
}

import staticData from "@/data/team-data.json";

/**
 * Fetches committee members from Cloudflare D1 or fallback local data.
 * @param collectionName 'advisory_committee' | 'steering_committee' | 'team'
 */
export async function getCommitteeMembers(collectionName: string): Promise<TeamMember[]> {
  // If running in Cloudflare Environment with D1 database binding available
  if (typeof process !== "undefined" && (process.env as any).DB) {
    try {
      const db = (process.env as any).DB;
      const { results } = await db
        .prepare("SELECT id, name, role, image, display_order as `order` FROM team_members WHERE committee = ? ORDER BY display_order ASC")
        .bind(collectionName)
        .all();
      return results as TeamMember[];
    } catch (e) {
      console.warn(`[Cloudflare D1] Error fetching ${collectionName}, falling back to static data:`, e);
    }
  }

  // Fallback to static data
  const key = collectionName as keyof typeof staticData;
  const members = staticData[key] || [];
  return [...members].sort((a, b) => (a.order || 0) - (b.order || 0));
}
