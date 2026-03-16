import { useState, useEffect } from "react";
import { ServiceCard } from "../components/ServiceCard";
import { servicesApi } from "../api/api";
import type { PublicService } from "../types";

export function Services() {
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    servicesApi
      .getAll()
      .then((res) => setServices(res.data as PublicService[]))
      .catch(() => setError("Failed to load services"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-slate-600">Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-slate-900">Public Services</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
