/**
 * Helper utilities for formatting, avatars, and exporting.
 */

const AVATAR_PALETTES = [
  { bg: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', text: '#ffffff' },
];

export function getAvatarStyle(name) {
  if (!name || typeof name !== 'string') {
    return AVATAR_PALETTES[0];
  }
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}

export function getInitials(name) {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatPhoneNumber(num) {
  if (!num) return '—';
  const str = String(num).replace(/\D/g, '');
  if (str.length === 10) {
    return `(${str.slice(0, 3)}) ${str.slice(3, 6)}-${str.slice(6)}`;
  }
  if (str.length > 10) {
    return `+${str.slice(0, str.length - 10)} (${str.slice(-10, -7)}) ${str.slice(-7, -4)}-${str.slice(-4)}`;
  }
  return str;
}

export function exportToCSV(records, filename = 'contacts_export.csv') {
  if (!records || records.length === 0) return false;
  
  const headers = ['ID', 'Name', 'Email', 'Phone Number'];
  const rows = records.map((r) => [
    r.id ?? '',
    `"${(r.name ?? '').replace(/"/g, '""')}"`,
    `"${(r.email ?? '').replace(/"/g, '""')}"`,
    `"${r.number ?? ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

export async function copyText(text) {
  if (!text) return false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
}
