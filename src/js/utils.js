export function fmt(n) {
  return Math.abs(n).toLocaleString('fr-FR');
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

export function getCatEmoji(cat) {
  const map = {
    Logement:    '🏠',
    Alimentaire: '🛒',
    Transport:   '🚗',
    Loisirs:     '🎬',
    Santé:       '⚕️',
    Virement:    '🔄',
    Divers:      '📦',
  };
  return map[cat] || '💳';
}
