// Sample mock data for dashboard UI

export type KPI = {
  id: string;
  title: string;
  value: string;
};

export type Applicant = {
  id: string;
  name: string;
  matchedRole?: string;
  status: 'new' | 'in-review' | 'matched' | 'needs-action';
};

export type Opportunity = {
  id: string;
  title: string;
  company: string;
  location?: string;
};

export const kpis: KPI[] = [
  { id: 'k1', title: 'Active Students', value: '1,248' },
  { id: 'k2', title: 'Placements This Month', value: '87' },
  { id: 'k3', title: 'Avg. Time-to-Placement', value: '21 days' },
  { id: 'k4', title: 'Open Opportunities', value: '42' },
];

export const matchedApplicants: Applicant[] = [
  { id: 'a1', name: 'Sahana Kumar', matchedRole: 'Frontend Dev', status: 'matched' },
  { id: 'a2', name: 'Ravi Patel', matchedRole: 'Data Analyst', status: 'in-review' },
  { id: 'a3', name: 'Lina Gomez', status: 'needs-action' },
  { id: 'a4', name: 'Omar Idris', status: 'new' },
];

export const opportunities: Opportunity[] = [
  { id: 'o1', title: 'Frontend Engineer', company: 'Acme Co', location: 'Remote' },
  { id: 'o2', title: 'Junior Data Analyst', company: 'DataWorks', location: 'Toronto' },
  { id: 'o3', title: 'QA Tester', company: 'BuildIt', location: 'Bangalore' },
];

export const demographics = {
  totalStudents: 1248,
  byGender: { male: 680, female: 540, other: 28 },
  topSkills: ['JavaScript', 'React', 'Python', 'SQL'],
};

export const attentionNeeded = [
  { id: 't1', title: 'Update resume for Lina Gomez', type: 'task' },
  { id: 't2', title: 'Follow up with DataWorks on interview', type: 'follow-up' },
];

export default {
  kpis,
  matchedApplicants,
  opportunities,
  demographics,
  attentionNeeded,
};
