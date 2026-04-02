import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import SuggestionCard from "./SuggestionCard";
import ReplyIdeas from "./ReplyIdeas";
import { generateReplies } from "@/lib/ai-service";

const TABS = [
  { key: "all", label: "All" },
  { key: "fixes", label: "Fixes" },
  { key: "rewrite", label: "Rewrite" },
  { key: "replies", label: "Full Reply Ideas" },
  { key: "tones", label: "Tone Variations" },
];

export default function SuggestionPanel({
  suggestions, onApply, onDismiss, isAnalyzing,
  hasText, toneVariations, isGeneratingTones, onGenerateTones,
  text, writingContext,
}) {
  const [tab, setTab] = useState("all");
  const [replies, setReplies] = useState([]);
  const [isGeneratingReplies, setIsGeneratingReplies] = useState(false);

  // Disable tabs if no text
  const disabled = !hasText;

  const handleGenerateReplies = async () => {
    setIsGeneratingReplies(true);
    setReplies([]);
    try {
      const result = await generateReplies(text, writingContext);
      setReplies(result.replies || []);
    } catch (error) {
      console.error("Error generating replies:", error);
    } finally {
      setIsGeneratingReplies(false);
    }
  };

  const fixes = suggestions.filter((s) => s.category === "grammar");
  const rewrites = suggestions.filter((s) => s.category === "style" || s.category === "clarity");
  const tabItems = tab === "all" ? suggestions : tab === "fixes" ? fixes : tab === "rewrite" ? rewrites : [];

  return (
    <div className="flex flex-col h-full border-l border-border/60 bg-card/50">
      {/* Tabs */}
      <div className="px-3 pt-3 pb-0 border-b border-border/40">
        <div className="flex gap-0.5 overflow-x-auto scrollbar-hide pb-px">
          {TABS.map((t) => {
            const count = t.key === "all" ? suggestions.length : t.key === "fixes" ? fixes.length : t.key === "rewrite" ? rewrites.length : null;
            return (
              <button
                key={t.key}
                onClick={() => !disabled && setTab(t.key)}
                disabled={disabled}
                title={disabled ? "Start writing to unlock" : ""}
                className={`shrink-0 px-2.5 py-2 text-[11px] font-medium border-b-2 transition-all whitespace-nowrap ${
                  disabled
                    ? "border-transparent text-muted-foreground/50 cursor-not-allowed"
                    : tab === t.key
                    ? "border-teal-600 text-teal-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
                {count !== null && count > 0 && (
                  <span className="ml-1 text-[9px] bg-foreground/10 px-1 py-0.5 rounded-full">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {/* Suggestions tabs (all/fixes/rewrite) */}
        {(tab === "all" || tab === "fixes" || tab === "rewrite") && (
          <>
            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-8 w-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
                <p className="text-sm font-medium text-foreground/70">Analyzing your writing...</p>
              </div>
            )}
            {!isAnalyzing && tabItems.length === 0 && (
              <div className="space-y-3">
                {!disabled && (
                  <>
                    <p className="text-xs text-muted-foreground text-center">Example of what you'll see:</p>
                    <div className="border border-border rounded-lg p-3 bg-muted/20">
                      <div className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-3 w-3 text-teal-700" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-foreground">Consider using active voice</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Change "The report was written by me" to "I wrote the report" for more direct communication.
                          </p>
                          <div className="flex gap-2 mt-2">
                            <button className="text-xs bg-teal-600 text-white px-2 py-1 rounded">Apply</button>
                            <button className="text-xs border border-border px-2 py-1 rounded">Dismiss</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {disabled && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center mb-3">
                      <Sparkles className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground/70">Start writing to unlock AI suggestions</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[180px]">
                      Type at least 10 words to get personalized feedback
                    </p>
                  </div>
                )}
              </div>
            )}
            <AnimatePresence mode="popLayout">
              {tabItems.map((s) => (
                <SuggestionCard key={s.id} suggestion={s} onApply={onApply} onDismiss={onDismiss} />
              ))}
            </AnimatePresence>
          </>
        )}

        {/* Full Reply Ideas */}
        {tab === "replies" && (
          <ReplyIdeas
            replies={replies}
            isGenerating={isGeneratingReplies}
            onGenerate={handleGenerateReplies}
            hasText={hasText}
          />
        )}

        {/* Tone Variations */}
        {tab === "tones" && (
          <ReplyIdeas
            replies={toneVariations}
            isGenerating={isGeneratingTones}
            onGenerate={onGenerateTones}
            hasText={hasText}
          />
        )}
      </div>
    </div>
  );
}