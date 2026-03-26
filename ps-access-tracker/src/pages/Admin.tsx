import { useState } from "react";
import { servicesApi } from "../api/api";

interface Stage {
  stageName: string;
  office: string;
  expectedTime: string;
}

export function Admin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    requirements: [""],
    stages: [{ stageName: "", office: "", expectedTime: "" }],
  });

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({ ...formData, requirements: newRequirements });
  };

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ""] });
  };

  const removeRequirement = (index: number) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
  };

  const handleStageChange = (index: number, field: keyof Stage, value: string) => {
    const newStages = [...formData.stages];
    newStages[index][field] = value;
    setFormData({ ...formData, stages: newStages });
  };

  const addStage = () => {
    setFormData({ ...formData, stages: [...formData.stages, { stageName: "", office: "", expectedTime: "" }] });
  };

  const removeStage = (index: number) => {
    const newStages = formData.stages.filter((_, i) => i !== index);
    setFormData({ ...formData, stages: newStages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await servicesApi.create({
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== ""),
        stages: formData.stages.filter(stage => stage.stageName.trim() !== "" || stage.office.trim() !== "" || stage.expectedTime.trim() !== ""),
      });
      setSuccess(true);
      setFormData({
        name: "",
        category: "",
        description: "",
        requirements: [""],
        stages: [{ stageName: "", office: "", expectedTime: "" }],
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-slate-900">Admin Panel - Add Service</h1>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-600">
          Service created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Service Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700">
            Category *
          </label>
          <input
            type="text"
            id="category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">
            Description *
          </label>
          <textarea
            id="description"
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Requirements
          </label>
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                placeholder="Enter requirement"
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="px-3 py-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRequirement}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Requirement
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Stages
          </label>
          {formData.stages.map((stage, index) => (
            <div key={index} className="border border-slate-200 rounded-md p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <input
                  type="text"
                  placeholder="Stage Name"
                  value={stage.stageName}
                  onChange={(e) => handleStageChange(index, "stageName", e.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Office"
                  value={stage.office}
                  onChange={(e) => handleStageChange(index, "office", e.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Expected Time"
                  value={stage.expectedTime}
                  onChange={(e) => handleStageChange(index, "expectedTime", e.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={() => removeStage(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove Stage
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStage}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Stage
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Service"}
        </button>
      </form>
    </div>
  );
}