-- Seed script for Cloudflare D1 team_members table
INSERT OR REPLACE INTO team_members (id, committee, name, role, image, display_order) VALUES
  ('adv-1', 'advisory_committee', 'Dr. Aruna Kumar', 'Senior Energy Law Advisor & Former Regulatory Chair', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop', 1),
  ('adv-2', 'advisory_committee', 'Justice Vikramjit Sen', 'Legal Counsel & Honorary Patron', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop', 2),
  ('adv-3', 'advisory_committee', 'Prof. Sunita Deshmukh', 'Dean of Energy Policy & Sustainability', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop', 3),
  ('exec-1', 'team', 'Rohan Sharma', 'President & Managing Director', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', 1),
  ('exec-2', 'team', 'Ananya Roy', 'Vice President & Head of Regulatory Affairs', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop', 2),
  ('exec-3', 'team', 'Kabir Mehta', 'General Secretary & Policy Lead', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop', 3);
