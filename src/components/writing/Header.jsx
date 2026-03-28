import { FileText, Sparkles, RotateCcw, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Header({ onAnalyze, onClear, onNewDoc, isAnalyzing, hasText, score }) {
  const getScoreColor = (s) => {
    if (s >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (s >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };
  const getScoreLabel = (s) => {
    if (s >= 90) return "Excellent";
    if (s >= 80) return "Very Good";
    if (s >= 70) return "Good";
    if (s >= 60) return "Fair";
    return "Needs Work";
  };

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-card shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight leading-none">WriteFlow</h1>
          <p className="text-[10px] text-muted-foreground leading-none mt-0.5">AI Writing Assistant</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {score !== null && (
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${getScoreColor(score)}`}>
            <span className="text-base font-bold leading-none">{score}</span>
            <span className="font-medium">{getScoreLabel(score)}</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={onNewDoc} className="h-8 text-xs gap-1.5 text-muted-foreground">
          <FilePlus className="h-3.5 w-3.5" />
          New Doc
        </Button>
        {hasText && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-8 text-xs gap-1.5 text-muted-foreground">
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
        <Button onClick={onAnalyze} disabled={!hasText || isAnalyzing} size="sm" className="h-8 text-xs gap-1.5 bg-primary shadow-sm shadow-primary/20">
          {isAnalyzing ? (
            <div className="h-3.5 w-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          Analyze Writing
        </Button>
      </div>
    </header>
  );
}