import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { certificatesApi, servicesApi } from "../api/api";
import { isExpiringSoon } from "../utils/certificates";
import type { Certificate, PublicService, AdminCertificate } from "../types";

const SUGGESTED_SERVICE_SLUGS = ["passport", "driving-license", "birth-certificate", "marriage-certificate"];

export function Dashboard() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [adminCertificates, setAdminCertificates] = useState<AdminCertificate[]>([]);
  const [services, setServices] = useState<PublicService[]>([]);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    servicesApi
      .getAll()
      .then((res) => setServices(res.data as PublicService[]))
      .catch(() => setServices([]));
  }, []);

  useEffect(() => {
    if (!user) return;

    if (isAdmin) {
      certificatesApi
        .getAllAdmin()
        .then((res) => setAdminCertificates(res.data as AdminCertificate[]))
        .catch(() => setAdminCertificates([]));
      setCertificates([]);
    } else {
      certificatesApi
        .getAll()
        .then((res) => setCertificates(res.data as Certificate[]))
        .catch(() => setCertificates([]));
      setAdminCertificates([]);
    }
  }, [user?.id, user?.role, isAdmin]);

  const listForStats = isAdmin ? adminCertificates : certificates;
  const expiringSoonList = useMemo(
    () => listForStats.filter((c) => isExpiringSoon(c.expiryDate)),
    [listForStats]
  );

  const suggestedServices = useMemo(() => {
    const bySlug = SUGGESTED_SERVICE_SLUGS.map((id) => services.find((s) => s.id === id)).filter(
      (s): s is PublicService => Boolean(s)
    );
    return bySlug.length > 0 ? bySlug : services.slice(0, 4);
  }, [services]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-2 text-2xl font-semibold text-slate-900">
        Welcome, {user?.fullName}
      </h1>
      {isAdmin && (
        <p className="mb-6 rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
          You are signed in as an <span className="font-semibold">administrator</span>. You can manage public services from
          the{" "}
          <Link to="/admin" className="font-medium underline hover:no-underline">
            Admin panel
          </Link>
          . Certificate totals below include <span className="font-medium">all users</span>.
        </p>
      )}

      <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            {isAdmin ? "Total certificates (all users)" : "Total certificates"}
          </p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">{listForStats.length}</p>
          {!isAdmin && (
            <Link
              to="/certificates"
              className="mt-2 inline-block text-sm font-medium text-slate-700 underline hover:no-underline"
            >
              View all
            </Link>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            {isAdmin ? "Expiring soon — all users (<30 days)" : "Expiring soon (<30 days)"}
          </p>
          <p className="mt-1 text-3xl font-semibold text-amber-600">{expiringSoonList.length}</p>
          {!isAdmin && (
            <Link
              to="/certificates"
              className="mt-2 inline-block text-sm font-medium text-slate-700 underline hover:no-underline"
            >
              View certificates
            </Link>
          )}
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
            {!isAdmin && (
              <li>
                <Link
                  to="/certificates"
                  className="text-sm font-medium text-slate-700 underline hover:no-underline"
                >
                  My Certificates
                </Link>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link
                  to="/admin"
                  className="text-sm font-medium text-slate-700 underline hover:no-underline"
                >
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* {isAdmin && (
        <>
          <section id="admin-expiring-certificates" className="mb-10 scroll-mt-24">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Expiring soon in the system (&lt;30 days)
            </h2>
            {expiringSoonListTable(expiringSoonList as AdminCertificate[])}
          </section>

          <section id="admin-all-certificates" className="mb-10 scroll-mt-24">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">All certificates in the system</h2>
            {adminAllCertificatesTable(adminCertificates)}
          </section>
        </>
      )} */}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Suggested Public services</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {suggestedServices.map((service) => (
            <Link
              key={service.id}
              to={`/services/${service.id}`}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900">{service.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{service.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

// function expiringSoonListTable(list: AdminCertificate[]) {
//   if (list.length === 0) {
//     return (
//       <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-8 text-center text-sm text-slate-600">
//         No certificates expiring in the next 30 days.
//       </p>
//     );
//   }
//   return (
//     <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
//       <table className="w-full min-w-[640px] text-left text-sm">
//         <thead>
//           <tr className="border-b border-slate-200 bg-slate-50">
//             <th className="px-4 py-3 font-medium text-slate-700">Certificate</th>
//             <th className="px-4 py-3 font-medium text-slate-700">Number</th>
//             <th className="px-4 py-3 font-medium text-slate-700">Owner</th>
//             <th className="px-4 py-3 font-medium text-slate-700">Email</th>
//             <th className="px-4 py-3 font-medium text-slate-700">Expiry</th>
//           </tr>
//         </thead>
//         <tbody>
//           {list.map((c) => (
//             <tr key={c.id} className="border-b border-slate-100 last:border-0">
//               <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
//               <td className="px-4 py-3 font-mono text-slate-700">{c.certificateNumber}</td>
//               <td className="px-4 py-3 text-slate-700">{c.ownerName ?? "—"}</td>
//               <td className="px-4 py-3 text-slate-600">{c.ownerEmail ?? "—"}</td>
//               <td className="px-4 py-3 text-amber-700">{c.expiryDate}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function adminAllCertificatesTable(list: AdminCertificate[]) {
//   if (list.length === 0) {
//     return (
//       <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-8 text-center text-sm text-slate-600">
//         No certificates in the system yet.
//       </p>
//     );
//   }
//   return (
//     <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
//       <table className="w-full min-w-[720px] text-left text-sm">
//         <thead>
//           <tr className="border-b border-slate-200 bg-slate-50">
//             <th className="px-4 py-3 font-medium text-slate-700">Certificate</th>
//             <th className="px-4 py-3 font-medium text-slate-700">Number</th>
//             <th className="px-4 py-3 font-medium text-slate-700">Owner</th>
//             <th className="px-4 py-3 font-medium text-slate-700">Email</th>
//             <th className="px-4 py-3 font-medium text-slate-700">Issued</th>
//             <th className="px-4 py-3 font-medium text-slate-700">Expires</th>
//           </tr>
//         </thead>
//         <tbody>
//           {list.map((c) => (
//             <tr key={c.id} className="border-b border-slate-100 last:border-0">
//               <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
//               <td className="px-4 py-3 font-mono text-slate-700">{c.certificateNumber}</td>
//               <td className="px-4 py-3 text-slate-700">{c.ownerName ?? "—"}</td>
//               <td className="px-4 py-3 text-slate-600">{c.ownerEmail ?? "—"}</td>
//               <td className="px-4 py-3 text-slate-700">{c.issueDate}</td>
//               <td className="px-4 py-3 text-slate-700">{c.expiryDate}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
