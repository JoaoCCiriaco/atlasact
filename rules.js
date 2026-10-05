// Simplified AI Act risk rules. Decision support only, not legal advice.
export const LEVELS = ['prohibited', 'high', 'limited', 'minimal'];

export const FLAGS = [
  { id: 'social_scoring', tier: 'prohibited', label: 'Scores people on social behaviour with detrimental effects' },
  { id: 'manipulation', tier: 'prohibited', label: 'Uses subliminal techniques or exploits vulnerabilities' },
  { id: 'rt_biometric', tier: 'prohibited', label: 'Real-time remote biometric ID in public spaces (law enforcement)' },
  { id: 'emotion_work', tier: 'prohibited', label: 'Infers emotions of people at work or in education' },
  { id: 'hr', tier: 'high', label: 'Recruitment, selection or employee management' },
  { id: 'education', tier: 'high', label: 'Access to education, exams or student assessment' },
  { id: 'credit', tier: 'high', label: 'Credit, insurance or access to essential services' },
  { id: 'justice', tier: 'high', label: 'Law enforcement, migration, justice or democratic processes' },
  { id: 'infra', tier: 'high', label: 'Critical infrastructure (energy, water, traffic)' },
  { id: 'biometric_id', tier: 'high', label: 'Biometric identification or categorisation of people' },
  { id: 'safety', tier: 'high', label: 'Safety component of a regulated product (machinery, medical devices)' },
  { id: 'chatbot', tier: 'limited', label: 'Interacts directly with people (chatbot, assistant)' },
  { id: 'synthetic', tier: 'limited', label: 'Generates synthetic text, image, audio or video' },
  { id: 'emotion', tier: 'limited', label: 'Recognises emotions outside work and education' },
];

export const OBLIGATIONS = {
  prohibited: ['Do not place on the market or use in the EU', 'Document the decision to discontinue'],
  high: ['Risk management system', 'Technical documentation', 'Human oversight', 'Event logging', 'Data governance and quality', 'Conformity assessment'],
  limited: ['Tell users they are interacting with AI', 'Label synthetic content'],
  minimal: ['No mandatory obligations; voluntary codes of conduct'],
};

export function classify(selected = []) {
  const hits = FLAGS.filter((f) => selected.includes(f.id));
  const level = LEVELS.find((l) => hits.some((h) => h.tier === l)) ?? 'minimal';
  const reasons = hits.filter((h) => h.tier === level).map((h) => h.label);
  return { level, reasons };
}
