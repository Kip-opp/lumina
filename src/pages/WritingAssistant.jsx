import { useState, useCallback } from "react";
import { analyzeText, generateReplies, generateTones } from "@/lib/ai-service";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Header from "../components/writing/Header";
import TextEditor from "../components/writing/TextEditor";
import WritingStats from "../components/writing/WritingStats";
import SuggestionPanel from "../components/writing/SuggestionPanel";
import ScoreOverview from "../components/writing/ScoreOverview";
import ContextPanel from "../components/writing/ContextPanel";

const DEFAULT_CONTEXT = {
  writingType: "",
  contextText: "",
  fileName: "",
  fileContent: "",
  outputInstructions: "",
};

export default function WritingAssistant() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState(null);
  const [writingContext, setWritingContext] = useState(DEFAULT_CONTEXT);
  const [replies, setReplies] = useState([]);
  const [isGeneratingReplies, setIsGeneratingReplies] = useState(false);
  const [toneVariations, setToneVariations] = useState([]);
  const [isGeneratingTones, setIsGeneratingTones] = useState(false);

  const analyzeTextHandler = useCallback(async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setSuggestions([]);
    setScore(null);

    try {
      const result = await analyzeText(text, writingContext);

      const enriched = (result.suggestions || []).map((s, i) => ({
        ...s,
        id: `suggestion-${i}-${Date.now()}`,
      }));

      setSuggestions(enriched);
      setScore(result.score ?? null);
    } catch (error) {
      console.error("Error analyzing text:", error);
      // You could show an error toast here
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, writingContext]);

  const handleGenerateReplies = useCallback(async () => {
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
  }, [text, writingContext]);

  const handleGenerateTones = useCallback(async () => {
    if (!text.trim()) return;
    setIsGeneratingTones(true);
    setToneVariations([]);

    try {
      const result = await generateTones(text, writingContext);
      setToneVariations(result.replies || []);
    } catch (error) {
      console.error("Error generating tones:", error);
    } finally {
      setIsGeneratingTones(false);
    }
  }, [text, writingContext]);

  const handleApply = useCallback(
    (suggestion) => {
      if (suggestion.original && suggestion.replacement) {
        setText((prev) => prev.replace(suggestion.original, suggestion.replacement));
        setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
      }
    },
    []
  );

  const handleDismiss = useCallback((id) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleClear = useCallback(() => {
    setText("");
    setSuggestions([]);
    setScore(null);
    setReplies([]);
    setToneVariations([]);
  }, []);

  const handleNewDoc = useCallback(() => {
    handleClear();
    setWritingContext(DEFAULT_CONTEXT);
  }, [handleClear]);

  const grammarCount = suggestions.filter((s) => s.category === "grammar").length;
  const styleCount = suggestions.filter((s) => s.category === "style").length;
  const clarityCount = suggestions.filter((s) => s.category === "clarity").length;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header
        onAnalyze={analyzeTextHandler}
        onClear={handleClear}
        onNewDoc={handleNewDoc}
        isAnalyzing={isAnalyzing}
        hasText={text.trim().length > 0}
        score={score}
      />

      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar – Writing Context */}
        <div className="w-[260px] shrink-0 border-r border-border/60 bg-card/40 overflow-y-auto">
          <div className="px-4 pt-3 pb-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Writing Context
            </p>
          </div>
          <ContextPanel context={writingContext} onChange={setWritingContext} />
        </div>

        {/* Center – Editor */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {score !== null && (
            <ScoreOverview
              score={score}
              grammarCount={grammarCount}
              styleCount={styleCount}
              clarityCount={clarityCount}
            />
          )}
          <TextEditor text={text} setText={setText} />
          <div className="px-6 py-3 border-t border-border/40 flex items-center justify-between gap-3">
            <WritingStats text={text} />
            <Button
              onClick={handleGenerateReplies}
              disabled={isGeneratingReplies}
              size="sm"
              className="h-8 text-xs gap-1.5 shrink-0 bg-primary shadow-md shadow-primary/20"
            >
              {isGeneratingReplies ? (
                <div className="h-3 w-3 border border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {isGeneratingReplies ? "Generating..." : "Generate Full Replies"}
            </Button>
          </div>
        </div>

        {/* Right Sidebar – AI Suggestions */}
        <div className="w-[360px] xl:w-[400px] shrink-0">
          <SuggestionPanel
            suggestions={suggestions}
            onApply={handleApply}
            onDismiss={handleDismiss}
            isAnalyzing={isAnalyzing}
            replies={replies}
            isGeneratingReplies={isGeneratingReplies}
            onGenerateReplies={handleGenerateReplies}
            hasText={text.trim().length > 0}
            toneVariations={toneVariations}
            isGeneratingTones={isGeneratingTones}
            onGenerateTones={handleGenerateTones}
          />
        </div>
      </div>
    </div>
  );
}