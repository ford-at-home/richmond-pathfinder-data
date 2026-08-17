/**
 * O*NET skill names in plain words.
 *
 * The published names are a controlled vocabulary written for analysts —
 * "Management of Personnel Resources", "Social Perceptiveness". Printing them
 * in the body of a screen is the same mistake as printing a SOC code: it is
 * accurate and it is not English. Each phrase below is a translation of the
 * published skill, not a reinterpretation of it, and it reads as a continuation
 * of "what's different about this job:".
 *
 * A test asserts every skill in the pinned slice has an entry, so a refreshed
 * slice that introduces a new skill fails here rather than leaking the raw name
 * onto a screen.
 */
const PLAIN_WORDS: Record<string, string> = {
  "Active Learning": "picking up new information quickly",
  "Active Listening": "listening closely",
  "Complex Problem Solving": "solving tangled problems",
  Coordination: "coordinating work across a team",
  "Critical Thinking": "weighing up options",
  "Equipment Maintenance": "maintaining equipment",
  "Equipment Selection": "choosing the right equipment",
  Installation: "installing equipment",
  Instructing: "teaching other people",
  "Judgment and Decision Making": "deciding between costly options",
  "Learning Strategies": "working out how best to teach something",
  "Management of Financial Resources": "managing a budget",
  "Management of Material Resources": "managing equipment and supplies",
  "Management of Personnel Resources": "managing people",
  Mathematics: "working with numbers",
  Monitoring: "keeping track of how work is going",
  Negotiation: "negotiating",
  "Operation and Control": "operating machinery",
  "Operations Analysis": "working out what a system needs to do",
  "Operations Monitoring": "watching gauges and readouts",
  Persuasion: "persuading people",
  "Quality Control Analysis": "testing and inspecting work",
  "Reading Comprehension": "reading closely",
  Repairing: "repairing equipment",
  Science: "using scientific method",
  "Service Orientation": "looking for ways to help people",
  "Social Perceptiveness": "reading people well",
  Speaking: "explaining things out loud",
  "Systems Analysis": "working out how a system behaves",
  "Systems Evaluation": "judging how well a system is working",
  "Technology Design": "designing equipment to fit a need",
  "Time Management": "managing your own time",
  Troubleshooting: "diagnosing faults",
  Writing: "writing clearly",
};

export const TRANSLATED_SKILLS = Object.keys(PLAIN_WORDS);

export function plainWords(skill: string): string | undefined {
  return PLAIN_WORDS[skill];
}

/**
 * "managing people, coordinating work across a team and reading people well".
 *
 * An untranslated skill is dropped rather than printed raw. The test above
 * makes that path unreachable in practice; it exists so a data refresh degrades
 * to saying less instead of to saying it in analyst vocabulary.
 */
export function plainSkillList(skills: string[]): string {
  const words = skills.map(plainWords).filter((w): w is string => w !== undefined);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0]!;
  return `${words.slice(0, -1).join(", ")} and ${words.at(-1)}`;
}
