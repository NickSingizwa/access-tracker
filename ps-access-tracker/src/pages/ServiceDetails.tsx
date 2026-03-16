import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { StatusTimeline } from "../components/StatusTimeline";
import { servicesApi } from "../api/api";
import type { PublicService } from "../types";

export function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<PublicService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    servicesApi
      .getById(id)
      .then((res) => setService(res.data as PublicService))
      .catch(() => setError("Failed to load service"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Service not found</h1>
        <Link to="/services" className="mt-4 inline-block text-slate-600 underline hover:no-underline">
          Back to services
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        to="/services"
        className="mb-6 inline-block text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        ← Back to services
      </Link>

      <div className="mb-8">
        <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {service.category}
        </span>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">{service.name}</h1>
        <p className="mt-2 text-slate-600">{service.description}</p>
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Service Requirements</h2>
        <ul className="list-inside list-disc space-y-1.5 text-slate-700">
          {service.requirements.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Application Stages</h2>
        <StatusTimeline stages={service.stages} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Expected Timeline</h2>
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-2 font-medium text-slate-700">Stage</th>
                <th className="pb-2 font-medium text-slate-700">Duration</th>
              </tr>
            </thead>
            <tbody>
              {service.stages.map((stage, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 text-slate-700">{stage.name}</td>
                  <td className="py-2 font-medium text-slate-800">{stage.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
