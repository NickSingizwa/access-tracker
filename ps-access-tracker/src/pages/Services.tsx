import { useState, useEffect, useRef, useCallback } from "react";
import { ServiceCard } from "../components/ServiceCard";
import { EditServiceModal } from "../components/EditServiceModal";
import { servicesApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import type { PublicService } from "../types";

export function Services() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingService, setEditingService] = useState<PublicService | null>(null);
  const fetchSeq = useRef(0);
  const isFirstSearchEffect = useRef(true);

  useEffect(() => {
    const term = search.trim();
    const requestId = ++fetchSeq.current;
    const debounceMs = isFirstSearchEffect.current ? 0 : 300;
    isFirstSearchEffect.current = false;

    setLoading(true);
    const timeoutId = window.setTimeout(() => {
      servicesApi
        .getAll(term)
        .then((res) => {
          if (fetchSeq.current === requestId) {
            setServices(res.data as PublicService[]);
            setError(null);
          }
        })
        .catch(() => {
          if (fetchSeq.current === requestId) {
            setError("Failed to load services");
            setServices([]);
          }
        })
        .finally(() => {
          if (fetchSeq.current === requestId) {
            setLoading(false);
          }
        });
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  const refetchServices = useCallback(() => {
    const term = search.trim();
    servicesApi
      .getAll(term)
      .then((res) => setServices(res.data as PublicService[]))
      .catch(() => {});
  }, [search]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-slate-900">Public Services</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search services by name, category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-md border border-slate-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {loading && <p className="text-slate-600">Loading services...</p>}

      {error && !loading && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isAdmin={isAdmin}
              onEdit={isAdmin ? setEditingService : undefined}
            />
          ))}
        </div>
      )}

      {!loading && !error && services.length === 0 && (
        <p className="text-slate-600">No services found.</p>
      )}

      <EditServiceModal
        service={editingService}
        onClose={() => setEditingService(null)}
        onSaved={refetchServices}
      />
    </div>
  );
}
