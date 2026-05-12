import {
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Lightbulb,
  ListChecks,
  ShieldCheck,
  Target,
  Wrench,
} from "lucide-react";

const sectionConfig = [
  {
    key: "score",
    title: "Resume Score",
    match: ["resume score", "score"],
    icon: BadgeCheck,
    color: "text-emerald-300",
    bg: "bg-emerald-300/10",
    border: "border-emerald-300/20",
  },
  {
    key: "skills",
    title: "Skills",
    match: ["skills"],
    icon: ListChecks,
    color: "text-teal-300",
    bg: "bg-teal-300/10",
    border: "border-teal-300/20",
  },
  {
    key: "missing",
    title: "Missing Skills",
    match: ["missing skills"],
    icon: Target,
    color: "text-rose-300",
    bg: "bg-rose-300/10",
    border: "border-rose-300/20",
  },
  {
    key: "improvements",
    title: "Improvements",
    match: ["improvements", "improvement"],
    icon: Wrench,
    color: "text-amber-300",
    bg: "bg-amber-300/10",
    border: "border-amber-300/20",
  },
  {
    key: "roles",
    title: "Recommended Job Roles",
    match: ["recommended job roles", "job roles", "recommended roles"],
    icon: BriefcaseBusiness,
    color: "text-sky-300",
    bg: "bg-sky-300/10",
    border: "border-sky-300/20",
  },
  {
    key: "ats",
    title: "ATS Analysis",
    match: ["ats analysis", "ats"],
    icon: ShieldCheck,
    color: "text-violet-300",
    bg: "bg-violet-300/10",
    border: "border-violet-300/20",
  },
];

function cleanLine(line) {
  return line
    .replace(/^\s*[-*•]\s*/, "")
    .replace(/^\s*\d+[.)]\s*/, "")
    .replace(/\*\*/g, "")
    .trim();
}

function findSectionConfig(title) {
  const lowerTitle = title.toLowerCase();

  return sectionConfig.find((section) =>
    section.match.some((keyword) => lowerTitle.includes(keyword))
  );
}

function parseAnalysis(result) {
  const sections = [];
  const lines = result.split("\n");
  let current = null;

  lines.forEach((line) => {
    const cleaned = cleanLine(line);

    if (!cleaned) {
      return;
    }

    const headingMatch = cleaned.match(/^([^:]+):\s*(.*)$/);
    const possibleHeading = headingMatch?.[1] || cleaned;
    const config = findSectionConfig(possibleHeading);

    if (config && cleaned.length < 80) {
      if (current) {
        sections.push(current);
      }

      current = {
        ...config,
        content: headingMatch?.[2] ? [headingMatch[2].trim()] : [],
      };
      return;
    }

    if (!current) {
      current = {
        key: "summary",
        title: "Summary",
        icon: FileText,
        color: "text-slate-300",
        bg: "bg-white/10",
        border: "border-white/10",
        content: [],
      };
    }

    current.content.push(cleaned);
  });

  if (current) {
    sections.push(current);
  }

  return sections.length ? sections : [{
    key: "summary",
    title: "Summary",
    icon: FileText,
    color: "text-slate-300",
    bg: "bg-white/10",
    border: "border-white/10",
    content: [result],
  }];
}

function getScore(result) {
  const match = result.match(/(\d{1,3})\s*\/\s*100|(\d{1,3})\s*%/);
  const score = Number(match?.[1] || match?.[2] || 0);

  if (!score) {
    return null;
  }

  return Math.min(score, 100);
}

function SectionCard({ section }) {
  const Icon = section.icon || Lightbulb;
  const items = section.content.filter(Boolean);

  return (
    <div className={`rounded-lg border ${section.border} ${section.bg} p-5`}>
      <div className="mb-4 flex items-center gap-3">
        <span className={`rounded-lg bg-zinc-950/45 p-2.5 ${section.color}`}>
          <Icon size={21} />
        </span>
        <h3 className="text-lg font-bold text-white">{section.title}</h3>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${section.key}-${index}`} className="flex gap-3 rounded-lg bg-zinc-950/35 p-3 text-sm leading-6 text-slate-200">
            <CheckCircle2 className={`mt-1 shrink-0 ${section.color}`} size={16} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalysisCard({ result }) {
  const sections = parseAnalysis(result);
  const score = getScore(result);

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-6 flex flex-col justify-between gap-5 border-b border-white/10 pb-5 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-semibold text-emerald-200">AI resume report</p>
          <h2 className="mt-2 text-3xl font-black text-white">Your Analysis Result</h2>
          <p className="mt-2 text-sm text-slate-400">
            Key insights are separated so you can read and improve faster.
          </p>
        </div>

        {score !== null && (
          <div className="min-w-44 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4">
            <div className="flex items-end justify-between gap-3">
              <span className="text-sm text-emerald-100">Score</span>
              <span className="text-3xl font-black text-white">{score}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((section, index) => (
          <SectionCard
            key={`${section.key}-${index}`}
            section={section}
          />
        ))}
      </div>
    </div>
  );
}
