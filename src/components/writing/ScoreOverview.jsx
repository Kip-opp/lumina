import { motion } from "framer-motion";

export default function ScoreOverview({ score, grammarCount, styleCount, clarityCount }) {
  if (score === null) return null;

  const getScoreLabel = (s) => {
    if (s >= 90) return "Excellent";
    if (s >= 80) return "Very Good";
    if (s >= 70) return "Good";
    if (s >= 60) return "Fair";
    return "Needs Work";
  };

  const getScoreColor = (s) => {
    if (s >= 80) return "text-accent";
    if (s >= 60) return "text-amber-500";
    return "text-destructive";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-6 mt-4 mb-2 p-4 rounded-xl bg-muted/50 border border-border/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</div>
          <div>
            <p className="text-sm font-medium">{getScoreLabel(score)}</p>
            <p className="text-xs text-muted-foreground">Overall writing score</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-sm font-semibold text-red-600">{grammarCount}</div>
            <div className="text-[10px] text-muted-foreground">Grammar</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-amber-600">{styleCount}</div>
            <div className="text-[10px] text-muted-foreground">Style</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-blue-600">{clarityCount}</div>
            <div className="text-[10px] text-muted-foreground">Clarity</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}