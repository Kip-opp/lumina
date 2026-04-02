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

export default function WritingStats({ text, wordGoal, onGoalChange }) {
  const words = countWords(text);
  const sentences = countSentences(text);
  const paragraphs = countParagraphs(text);
  const readTime = estimateReadTime(words);

  // Calculate Flesch-Kincaid readability score
  const readabilityScore = calculateReadability(text);

  // Only show if more than 10 words
  if (words < 10) return null;

  const stats = [
    { icon: Type, label: "Words", value: words },
    { icon: Hash, label: "Sentences", value: sentences },
    { icon: BarChart3, label: "Paragraphs", value: paragraphs },
    { icon: Clock, label: "Read time", value: readTime },
  ];

  const getReadabilityLabel = (score) => {
    if (score >= 90) return "Very Easy";
    if (score >= 80) return "Easy";
    if (score >= 70) return "Fairly Easy";
    if (score >= 60) return "Standard";
    if (score >= 50) return "Fairly Difficult";
    if (score >= 30) return "Difficult";
    return "Very Difficult";
  };

  const getGradeLevel = (score) => {
    // Approximate grade level from Flesch score
    if (score >= 90) return 5;
    if (score >= 80) return 6;
    if (score >= 70) return 7;
    if (score >= 60) return 8;
    if (score >= 50) return 9;
    if (score >= 30) return 10;
    return 12;
  };

  return (
    <div className="px-6 py-3 border-t border-border/40 bg-muted/30">
      <div className="flex items-center gap-4 mb-3">
        {/* Word count goal */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Goal:</span>
          <input
            type="number"
            value={wordGoal || ""}
            onChange={(e) => onGoalChange(parseInt(e.target.value) || 0)}
            placeholder="___"
            className="w-12 text-xs rounded border border-border bg-background px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
            min="1"
          />
          <span className="text-muted-foreground">words</span>
        </div>

        {/* Progress bar */}
        {wordGoal && (
          <div className="flex-1 max-w-32">
            <div className="w-full bg-border rounded-full h-1.5">
              <div
                className="bg-teal-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((words / wordGoal) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Readability score */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="font-medium text-teal-600">Grade {getGradeLevel(readabilityScore)}</span>
          <span>— {getReadabilityLabel(readabilityScore)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {i > 0 && <span className="mx-2 text-border">·</span>}
            <stat.icon className="h-3 w-3" />
            <span className="font-medium">{stat.value}</span>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function calculateReadability(text) {
  if (!text.trim()) return 0;

  const words = text.trim().split(/\s+/).length;
  const sentences = text.match(/[.!?]+/g)?.length || 1;
  const syllables = text.split(/\s+/).reduce((count, word) => {
    return count + (word.match(/[aeiouy]/gi)?.length || 1);
  }, 0);

  // Flesch Reading Ease formula
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, Math.round(score)));
}