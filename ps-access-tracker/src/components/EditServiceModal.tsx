import { useState, useEffect } from "react";
import { servicesApi } from "../api/api";
import type { PublicService } from "../types";

interface StageForm {
  stageName: string;
  office: string;
  expectedTime: string;
}

interface EditServiceModalProps {
  service: PublicService | null;
  onClose: () => void;
  onSaved: () => void;
}

export function EditServiceModal({ service, onClose, onSaved }: EditServiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    requirements: [""] as string[],
    stages: [{ stageName: "", office: "", expectedTime: "" }] as StageForm[],
  });

  useEffect(() => {
    if (!service) return;
    setError(null);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      requirements: service.requirements.length > 0 ? [...service.requirements] : [""],
      stages:
        service.stages.length > 0
          ? service.stages.map((s) => ({
              stageName: s.name,
              office: s.office,
              expectedTime: s.time,
            }))
          : [{ stageName: "", office: "", expectedTime: "" }],
    });
  }, [service]);

  if (!service) return null;

  const handleRequirementChange = (index: number, value: string) => {
    const next = [...formData.requirements];
    next[index] = value;
    setFormData({ ...formData, requirements: next });
  };

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ""] });
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index),
    });
  };

  const handleStageChange = (index: number, field: keyof StageForm, value: string) => {
    const next = [...formData.stages];
    next[index][field] = value;
    setFormData({ ...formData, stages: next });
  };

  const addStage = () => {
    setFormData({
      ...formData,
      stages: [...formData.stages, { stageName: "", office: "", expectedTime: "" }],
    });
  };

  const removeStage = (index: number) => {
    setFormData({
      ...formData,
      stages: formData.stages.filter((_, i) => i !== index),
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await servicesApi.update(service.id, {
        ...formData,
        requirements: formData.requirements.filter((r) => r.trim() !== ""),
        stages: formData.stages.filter(
          (st) =>
            st.stageName.trim() !== "" || st.office.trim() !== "" || st.expectedTime.trim() !== ""
        ),
      });
      onSaved();
      onClose();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error || "Failed to update service");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">Edit service</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <span className="sr-only">Close</span>
            <span aria-hidden>×</span>
          </button>
        </div>
        <p className="mb-4 text-sm text-slate-600">{service.name}</p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="edit-svc-name" className="block text-sm font-medium text-slate-700">
              Service name *
            </label>
            <input
              id="edit-svc-name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="edit-svc-cat" className="block text-sm font-medium text-slate-700">
              Category *
            </label>
            <input
              id="edit-svc-cat"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="edit-svc-desc" className="block text-sm font-medium text-slate-700">
              Description *
            </label>
            <textarea
              id="edit-svc-desc"
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-700">Requirements</span>
            {formData.requirements.map((req, index) => (
              <div key={index} className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleRequirementChange(index, e.target.value)}
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="shrink-0 text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addRequirement} className="mt-2 text-sm text-blue-600 hover:text-blue-800">
              + Add requirement
            </button>
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-700">Stages</span>
            {formData.stages.map((stage, index) => (
              <div key={index} className="mt-2 rounded-md border border-slate-200 p-3">
                <div className="grid gap-2 sm:grid-cols-3">
                  <input
                    type="text"
                    placeholder="Stage name"
                    value={stage.stageName}
                    onChange={(e) => handleStageChange(index, "stageName", e.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Office"
                    value={stage.office}
                    onChange={(e) => handleStageChange(index, "office", e.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Expected time"
                    value={stage.expectedTime}
                    onChange={(e) => handleStageChange(index, "expectedTime", e.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStage(index)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Remove stage
                </button>
              </div>
            ))}
            <button type="button" onClick={addStage} className="mt-2 text-sm text-blue-600 hover:text-blue-800">
              + Add stage
            </button>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {loading ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
