import { Bell } from 'lucide-react';

export function AttentionNeededCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="text-lg font-medium text-gray-900">Attention Needed</div>

      <div className="mt-6 flex flex-col items-center justify-center py-8">
        <Bell className="h-12 w-12 text-gray-300" />
        <div className="mt-4 text-sm text-gray-500 text-center">
          Alert system coming soon
        </div>
      </div>
    </div>
  );
}