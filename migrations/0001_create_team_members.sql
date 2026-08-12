-- Cloudflare D1 SQL Migration for Team Members
CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  committee TEXT NOT NULL, -- 'advisory_committee', 'steering_committee', 'team'
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_committee_order ON team_members (committee, display_order ASC);
