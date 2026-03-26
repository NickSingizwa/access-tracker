import type { Certificate } from "../types";
import { isExpiringSoon } from "../utils/certificates";
import { certificatesApi } from "../api/api";

interface CertificateCardProps {
  certificate: Certificate;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function CertificateCard({ certificate, onEdit, onDelete }: CertificateCardProps) {
  const expiringSoon = isExpiringSoon(certificate.expiryDate);

  const handleDownload = async () => {
    try {
      const response = await certificatesApi.download(certificate.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", certificate.fileName || "certificate");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download file");
    }
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-900">{certificate.name}</h3>
        {expiringSoon && (
          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            Expiring soon
          </span>
        )}
      </div>
      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Issue Date</dt>
          <dd className="font-medium text-slate-700">{certificate.issueDate}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Expiry Date</dt>
          <dd className={`font-medium ${expiringSoon ? "text-amber-600" : "text-slate-700"}`}>
            {certificate.expiryDate}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Number</dt>
          <dd className="font-mono text-slate-700">{certificate.certificateNumber}</dd>
        </div>
        {certificate.fileName && (
          <div className="flex justify-between">
            <dt className="text-slate-500">File</dt>
            <dd className="text-slate-700">{certificate.fileName}</dd>
          </div>
        )}
      </dl>
      {(onEdit || onDelete || certificate.fileName) && (
        <div className="mt-4 flex gap-2">
          {certificate.fileName && (
            <button
              onClick={handleDownload}
              className="rounded border border-blue-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              Download
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(certificate.id)}
              className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(certificate.id)}
              className="rounded border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
}
