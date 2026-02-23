import { attentionNeeded } from '../../data/sampleData';

export function AttentionNeededCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="text-lg font-medium text-gray-900">Attention Needed</div>

      <div className="mt-3 text-sm text-gray-600">
        {attentionNeeded.length} {attentionNeeded.length === 1 ? 'issue' : 'issues'} require action this week
      </div>

      <ul className="mt-3 space-y-2 text-sm text-gray-600">
        {attentionNeeded.slice(0, 3).map((t) => (
          <li key={t.id} className="flex items-center justify-between">
            <span className="text-gray-700">{t.title}</span>
            <span className="text-xs text-gray-400">{t.type}</span>
          </li>
        ))}
      </ul>

      <button type="button" className="mt-4 w-full rounded-xl bg-orange-600 py-2 text-white">
        Review all alerts
      </button>
    </div>
  );
}