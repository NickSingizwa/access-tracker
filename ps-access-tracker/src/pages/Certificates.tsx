import { useState, useEffect } from "react";
import { CertificateCard } from "../components/CertificateCard";
import { certificatesApi } from "../api/api";
import type { Certificate } from "../types";

export function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    issueDate: "",
    expiryDate: "",
    certificateNumber: "",
    file: null as File | null,
  });

  function loadCertificates() {
    certificatesApi
      .getAll()
      .then((res) => setCertificates(res.data as Certificate[]))
      .catch(() => setCertificates([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCertificates();
  }, []);

  function resetForm() {
    setForm({
      name: "",
      issueDate: "",
      expiryDate: "",
      certificateNumber: "",
      file: null,
    });
    setEditingId(null);
    setShowForm(false);
    setSubmitError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!form.name || !form.issueDate || !form.expiryDate || !form.certificateNumber) return;

    const payload = {
      certificateName: form.name,
      certificateNumber: form.certificateNumber,
      issueDate: form.issueDate,
      expiryDate: form.expiryDate,
      file: form.file || undefined,
    };

    if (editingId) {
      certificatesApi
        .update(editingId, payload)
        .then(() => {
          loadCertificates();
          resetForm();
        })
        .catch((err) =>
          setSubmitError(err.response?.data?.error || "Failed to update certificate")
        );
    } else {
      certificatesApi
        .create(payload)
        .then(() => {
          loadCertificates();
          resetForm();
        })
        .catch((err) =>
          setSubmitError(err.response?.data?.error || "Failed to add certificate")
        );
    }
  }

  function handleEdit(id: string) {
    const cert = certificates.find((c) => c.id === id);
    if (!cert) return;
    setForm({
      name: cert.name,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate,
      certificateNumber: cert.certificateNumber,
      file: null,
    });
    setEditingId(id);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (window.confirm("Delete this certificate?")) {
      certificatesApi
        .delete(id)
        .then(() => {
          loadCertificates();
          if (editingId === id) resetForm();
        });
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">My Certificates</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          {showForm ? "Cancel" : "Add Certificate"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            {editingId ? "Edit Certificate" : "Add Certificate"}
          </h2>
          {submitError && (
            <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{submitError}</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="certName" className="mb-1 block text-sm font-medium text-slate-700">
                Certificate Name
              </label>
              <input
                id="certName"
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                placeholder="e.g. Driving License"
                required
              />
            </div>
            <div>
              <label htmlFor="certNumber" className="mb-1 block text-sm font-medium text-slate-700">
                Certificate Number
              </label>
              <input
                id="certNumber"
                type="text"
                value={form.certificateNumber}
                onChange={(e) => setForm((f) => ({ ...f, certificateNumber: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                placeholder="e.g. DL-12345"
                required
              />
            </div>
            <div>
              <label htmlFor="issueDate" className="mb-1 block text-sm font-medium text-slate-700">
                Issue Date
              </label>
              <input
                id="issueDate"
                type="date"
                value={form.issueDate}
                onChange={(e) => setForm((f) => ({ ...f, issueDate: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                required
              />
            </div>
            <div>
              <label htmlFor="expiryDate" className="mb-1 block text-sm font-medium text-slate-700">
                Expiry Date
              </label>
              <input
                id="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="certificateFile" className="mb-1 block text-sm font-medium text-slate-700">
              Certificate File (Optional)
            </label>
            <input
              id="certificateFile"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => setForm((f) => ({ ...f, file: e.target.files?.[0] || null }))}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
            <p className="mt-1 text-xs text-slate-500">
              Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG (max 10MB)
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              {editingId ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="py-12 text-center text-slate-600">Loading certificates...</p>
      ) : certificates.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-12 text-center text-slate-600">
          No certificates stored. Add one to get started.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
