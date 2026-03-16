import { Link } from "react-router-dom";
import type { PublicService } from "../types";

interface ServiceCardProps {
  service: PublicService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>
          <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {service.category}
          </span>
        </div>
      </div>
      <p className="mb-4 line-clamp-2 text-sm text-slate-600">
        {service.description}
      </p>
      <Link
        to={`/services/${service.id}`}
        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        View Details
      </Link>
    </article>
  );
}
