import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { certificatesApi, servicesApi } from "../api/api";
import { isExpiringSoon } from "../utils/certificates";
import type { Certificate, PublicService } from "../types";

export function Dashboard() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [services, setServices] = useState<PublicService[]>([]);

  useEffect(() => {
    certificatesApi
      .getAll()
      .then((res) => setCertificates(res.data as Certificate[]))
      .catch(() => setCertificates([]));
    servicesApi
      .getAll()
      .then((res) => setServices(res.data as PublicService[]))
      .catch(() => setServices([]));
  }, []);

  const expiringSoon = certificates.filter((c) => isExpiringSoon(c.expiryDate));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-slate-900">
        Welcome, {user?.fullName}
      </h1>

      <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total certificates</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">{certificates.length}</p>
          <Link
            to="/certificates"
            className="mt-2 inline-block text-sm font-medium text-slate-700 underline hover:no-underline"
          >
            View all
          </Link>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Expiring soon (&lt;30 days)</p>
          <p className="mt-1 text-3xl font-semibold text-amber-600">{expiringSoon.length}</p>
          <Link
            to="/certificates"
            className="mt-2 inline-block text-sm font-medium text-slate-700 underline hover:no-underline"
          >
            View certificates
          </Link>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
          <p className="text-sm font-medium text-slate-500">Quick links</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                to="/services"
                className="text-sm font-medium text-slate-700 underline hover:no-underline"
              >
                Public Services
              </Link>
            </li>
            <li>
              <Link
                to="/certificates"
                className="text-sm font-medium text-slate-700 underline hover:no-underline"
              >
                My Certificates
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Public services</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/services/passport"
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <h3 className="font-semibold text-slate-900">Passport Application</h3>
            <p className="mt-1 text-sm text-slate-600">Apply for or renew your passport</p>
          </Link>
          <Link
            to="/services/driving-license"
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <h3 className="font-semibold text-slate-900">Driving License</h3>
            <p className="mt-1 text-sm text-slate-600">Obtain or renew your license</p>
          </Link>
          <Link
            to="/services/birth-certificate"
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <h3 className="font-semibold text-slate-900">Birth Certificate</h3>
            <p className="mt-1 text-sm text-slate-600">Request official birth certificate</p>
          </Link>
          <Link
            to="/services/national-id"
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <h3 className="font-semibold text-slate-900">National ID</h3>
            <p className="mt-1 text-sm text-slate-600">Apply for national ID</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
