import { Type, Clock, BarChart3, Hash } from "lucide-react";

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function countSentences(text) {
  const matches = text.match(/[.!?]+/g);
  return matches ? matches.length : 0;
}

function estimateReadTime(wordCount) {
  const minutes = Math.ceil(wordCount / 200);
  return minutes < 1 ? "< 1 min" : `${minutes} min`;
}

function countParagraphs(text) {
  return text.trim() ? text.trim().split(/\n\s*\n/).filter(p => p.trim()).length : 0;
}

export default function WritingStats({ text }) {
  const words = countWords(text);
  const sentences = countSentences(text);
  const paragraphs = countParagraphs(text);
  const readTime = estimateReadTime(words);

  const stats = [
    { icon: Type, label: "Words", value: words },
    { icon: Hash, label: "Sentences", value: sentences },
    { icon: BarChart3, label: "Paragraphs", value: paragraphs },
    { icon: Clock, label: "Read time", value: readTime },
  ];

  return (
    <div className="flex items-center gap-1 px-6 py-2.5 border-t border-border/40 bg-muted/30">
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {i > 0 && <span className="mx-2 text-border">·</span>}
          <stat.icon className="h-3 w-3" />
          <span className="font-medium">{stat.value}</span>
          <span>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}