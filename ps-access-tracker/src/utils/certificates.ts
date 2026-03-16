import type { Certificate } from "../types";

const STORAGE_KEY = "ps_access_certificates";

export function getCertificates(): Certificate[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCertificates(certificates: Certificate[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(certificates));
}

export function addCertificate(cert: Omit<Certificate, "id">): Certificate {
  const certs = getCertificates();
  const newCert: Certificate = {
    ...cert,
    id: crypto.randomUUID(),
  };
  certs.push(newCert);
  saveCertificates(certs);
  return newCert;
}

export function updateCertificate(id: string, updates: Partial<Certificate>): Certificate | null {
  const certs = getCertificates();
  const idx = certs.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  certs[idx] = { ...certs[idx], ...updates };
  saveCertificates(certs);
  return certs[idx];
}

export function deleteCertificate(id: string): boolean {
  const certs = getCertificates().filter((c) => c.id !== id);
  if (certs.length === getCertificates().length) return false;
  saveCertificates(certs);
  return true;
}

export function isExpiringSoon(expiryDate: string, daysThreshold = 30): boolean {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= daysThreshold;
}
