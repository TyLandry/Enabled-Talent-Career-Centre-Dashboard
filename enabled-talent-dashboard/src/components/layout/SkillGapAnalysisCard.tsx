import { skillGapData, type SkillGap } from '../../data/sampleData';
import { ArrowUpRight, AlertTriangle, CheckCircle2, MinusCircle } from 'lucide-react';

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

function GapPill({ gap }: { gap: number }) {
  const positive = gap > 0;
  const isZero = gap === 0;
  const Icon = isZero ? MinusCircle : positive ? CheckCircle2 : AlertTriangle;

  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        isZero && 'bg-gray-100 text-gray-600',
        positive && 'bg-emerald-50 text-emerald-700',
        !positive && !isZero && 'bg-orange-50 text-orange-700'
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {positive ? `+${gap}` : gap}
    </span>
  );
}

function DemandCell({ demand }: { demand: SkillGap['demand'] }) {
  const rising = demand === 'Rising';
  const stable = demand === 'Stable';
  const declining = demand === 'Declining';

  return (
    <span className="inline-flex items-center gap-2 text-sm">
      {rising && <ArrowUpRight className="h-4 w-4 text-emerald-600" />}
      {stable && <MinusCircle className="h-4 w-4 text-blue-600" />}
      {declining && <ArrowUpRight className="h-4 w-4 rotate-180 text-red-500" />}
      <span className="text-gray-700">{demand}</span>
    </span>
  );
}

export function SkillGapAnalysisCard({ deficitCount }: { deficitCount: number }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold text-gray-900">Skill Gap Analysis</div>
          <div className="mt-1 text-sm text-gray-500">Where student talent meets employer needs</div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-xs font-medium text-orange-700">
          <AlertTriangle className="h-4 w-4" />
          {deficitCount} {deficitCount === 1 ? 'skill' : 'skills'} in deficit
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl ring-1 ring-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs font-medium text-gray-500">
              <th className="px-4 py-3">Skill</th>
              <th className="px-4 py-3">Students</th>
              <th className="px-4 py-3">Jobs</th>
              <th className="px-4 py-3">Gap</th>
              <th className="px-4 py-3">Demand</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {skillGapData.map((s: SkillGap) => (
              <tr key={s.skill} className="text-gray-800">
                <td className="px-4 py-4 font-medium text-gray-900">{s.skill}</td>
                <td className="px-4 py-4 text-gray-700">{s.students}</td>
                <td className="px-4 py-4 text-gray-700">{s.jobs}</td>
                <td className="px-4 py-4">
                  <GapPill gap={s.gap} />
                </td>
                <td className="px-4 py-4">
                  <DemandCell demand={s.demand} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <button type="button" className="text-xs font-medium text-orange-600 hover:text-orange-600 transition-opacity duration-300 ease-in-out hover:opacity-70">
          Expand ↓
        </button>
      </div>
    </div>
  );
}