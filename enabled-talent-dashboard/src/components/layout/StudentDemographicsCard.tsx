
// type Props = { pctMale: number; pctFemale: number; pctOther: number };

type Props = {
  totalStudents: number;
  pctMale: number;
  pctFemale: number;
  pctOther: number;
  topSkills: string[];
};


// export function StudentDemographicsCard({ pctMale, pctFemale, pctOther
export function StudentDemographicsCard({
  totalStudents,
  pctMale,
  pctFemale,
  pctOther,
  topSkills = [], // fallback
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="text-lg font-medium text-gray-900">Student Demographics</div>

      <div className="mt-3 space-y-2 text-sm text-gray-600">
        <div>
          Total Students:{" "}
          <span className="font-semibold text-gray-900">{totalStudents}</span>
        </div>

        <div>
          Gender Split:{" "}
          <span className="font-semibold text-gray-900">
            {pctMale}% male • {pctFemale}% female • {pctOther}% other
          </span>
        </div>

        <div>
          Top Skills:{" "}
          <span className="font-semibold text-gray-900">
            {topSkills.length ? topSkills.join(", ") : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}