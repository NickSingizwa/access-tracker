import type { ServiceStage } from "../types";

interface StatusTimelineProps {
  stages: ServiceStage[];
}

export function StatusTimeline({ stages }: StatusTimelineProps) {
  return (
    <div className="space-y-0">
      {stages.map((stage, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-sm font-medium text-slate-600">
              {index + 1}
            </div>
            {index < stages.length - 1 && (
              <div className="min-h-6 w-0.5 flex-1 bg-slate-200" />
            )}
          </div>
          <div className="flex-1 pb-8">
            <h4 className="font-semibold text-slate-900">{stage.name}</h4>
            <p className="text-sm text-slate-600">{stage.office}</p>
            <p className="mt-0.5 text-sm font-medium text-slate-700">
              Expected: {stage.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
