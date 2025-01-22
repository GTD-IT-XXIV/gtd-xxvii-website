import {Timer} from "lucide-react";

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
    <Timer size={48} className="mb-4" />
    <h3 className="text-lg font-medium mb-2">No Teams Have Completed Yet</h3>
    <p className="text-sm text-center max-w-md">
      The leaderboard will be updated as soon as teams start completing their challenges.
    </p>
  </div>
);
