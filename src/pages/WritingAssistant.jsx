import { useState, useCallback } from "react";
import { analyzeText, generateTones } from "@/lib/ai-service";
import { logger } from "@/lib/logger";
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

function detectTone(text) {
  if (!text.trim()) return "";

  const lowerText = text.toLowerCase();

  // Simple tone detection based on keywords
  const formalWords = ['therefore', 'consequently', 'furthermore', 'moreover', 'accordingly', 'hence', 'thus', 'shall', 'hereby'];
  const casualWords = ['hey', 'hi', 'cool', 'awesome', 'totally', 'kinda', 'sorta', 'gonna', 'wanna'];
  const persuasiveWords = ['should', 'must', 'need to', 'important', 'essential', 'benefit', 'advantage', 'recommend'];
  const empatheticWords = ['understand', 'feel', 'sorry', 'apologize', 'concern', 'care', 'support', 'help'];

  const formalCount = formalWords.reduce((count, word) => count + (lowerText.includes(word) ? 1 : 0), 0);
  const casualCount = casualWords.reduce((count, word) => count + (lowerText.includes(word) ? 1 : 0), 0);
  const persuasiveCount = persuasiveWords.reduce((count, word) => count + (lowerText.includes(word) ? 1 : 0), 0);
  const empatheticCount = empatheticWords.reduce((count, word) => count + (lowerText.includes(word) ? 1 : 0), 0);

  const maxCount = Math.max(formalCount, casualCount, persuasiveCount, empatheticCount);

  if (maxCount === 0) return "Neutral";

  if (formalCount === maxCount) return "Formal";
  if (casualCount === maxCount) return "Casual";
  if (persuasiveCount === maxCount) return "Persuasive";
  if (empatheticCount === maxCount) return "Empathetic";

  return "Neutral";
}

export default function WritingAssistant() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState(null);
  const [writingContext, setWritingContext] = useState(DEFAULT_CONTEXT);
  // Removed replies generation from center panel - now handled in SuggestionPanel tabs
  const [toneVariations, setToneVariations] = useState([]);
  const [isGeneratingTones, setIsGeneratingTones] = useState(false);
  const [wordGoal, setWordGoal] = useState(0);
  const [versionHistory, setVersionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [mobileTab, setMobileTab] = useState("write");

  const analyzeTextHandler = useCallback(async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setSuggestions([]);
    setScore(null);

    // Save to version history
    setVersionHistory(prev => [{
      text,
      timestamp: new Date().toISOString(),
      score: null
    }, ...prev.slice(0, 9)]); // Keep last 10

    try {
      const result = await analyzeText(text, writingContext);

      const enriched = (result.suggestions || []).map((s, i) => ({
        ...s,
        id: `suggestion-${i}-${Date.now()}`,
      }));

      setSuggestions(enriched);
      setScore(result.score ?? null);

      // Update the latest history entry with score
      setVersionHistory(prev => prev.map((entry, i) =>
        i === 0 ? { ...entry, score: result.score ?? null } : entry
      ));
    } catch (error) {
      logger.error("Error analyzing text", error);
      // You could show an error toast here
    } finally {
      setIsAnalyzing(false);
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
      logger.error("Error generating tones", error);
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
    setToneVariations([]);
  }, []);

  const handleNewDoc = useCallback(() => {
    handleClear();
    setWritingContext(DEFAULT_CONTEXT);
  }, [handleClear]);

  const handleExport = useCallback(() => {
    // Simple export: copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
      alert("Text copied to clipboard!");
    });
  }, [text]);

  const handleShowHistory = useCallback(() => {
    setShowHistory(!showHistory);
  }, [showHistory]);

  const restoreVersion = useCallback((version) => {
    setText(version.text);
    setShowHistory(false);
  }, []);

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
        onExport={handleExport}
        onShowHistory={handleShowHistory}
      />

      {/* Mobile Tabs */}
      <div className="md:hidden flex border-b border-border">
        <button
          onClick={() => setMobileTab("write")}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${mobileTab === "write" ? "text-teal-600 border-b-2 border-teal-600" : "text-muted-foreground"}`}
        >
          Write
        </button>
        <button
          onClick={() => setMobileTab("context")}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${mobileTab === "context" ? "text-teal-600 border-b-2 border-teal-600" : "text-muted-foreground"}`}
        >
          Context
        </button>
        <button
          onClick={() => setMobileTab("suggestions")}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${mobileTab === "suggestions" ? "text-teal-600 border-b-2 border-teal-600" : "text-muted-foreground"}`}
        >
          Suggestions
        </button>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar – Writing Context */}
        <div className="hidden md:block w-[260px] shrink-0 border-r border-border/60 bg-card/40 overflow-y-auto">
          <div className="px-4 pt-3 pb-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Writing Context
            </p>
          </div>
          <ContextPanel context={writingContext} onChange={setWritingContext} />
        </div>

        {/* Center – Editor */}
        <div className={`flex-1 flex flex-col min-w-0 min-h-0 ${mobileTab !== "write" ? "hidden md:flex" : ""}`}>
          {score !== null && (
            <ScoreOverview
              score={score}
              grammarCount={grammarCount}
              styleCount={styleCount}
              clarityCount={clarityCount}
            />
          )}
          <TextEditor text={text} setText={setText} />

          {/* Tone Detector */}
          {text.trim() && (
            <div className="px-6 py-3 border-t border-border/40">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your writing sounds:</span>
                <span className="text-sm font-medium text-teal-600">
                  {detectTone(text)}
                </span>
              </div>
            </div>
          )}

          {/* Version History */}
          {showHistory && versionHistory.length > 0 && (
            <div className="px-6 py-3 border-t border-border/40">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Version History</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {versionHistory.map((version, index) => (
                  <button
                    key={index}
                    onClick={() => restoreVersion(version)}
                    className="w-full text-left p-2 rounded border border-border bg-background hover:border-teal-300 transition-colors"
                  >
                    <p className="text-xs text-muted-foreground">
                      {new Date(version.timestamp).toLocaleString()}
                      {version.score !== null && ` - Score: ${version.score}`}
                    </p>
                    <p className="text-xs text-foreground truncate">{version.text.substring(0, 50)}...</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="px-6 py-3 border-t border-border/40">
            <WritingStats text={text} wordGoal={wordGoal} onGoalChange={setWordGoal} />
          </div>
        </div>

        {/* Mobile Context Panel */}
        <div className={`md:hidden flex-1 ${mobileTab !== "context" ? "hidden" : ""}`}>
          <ContextPanel context={writingContext} onChange={setWritingContext} />
        </div>

        {/* Right Sidebar – AI Suggestions */}
        <div className={`w-[360px] xl:w-[400px] shrink-0 ${mobileTab !== "suggestions" ? "hidden md:block" : ""}`}>
          <SuggestionPanel
            suggestions={suggestions}
            onApply={handleApply}
            onDismiss={handleDismiss}
            isAnalyzing={isAnalyzing}
            hasText={text.trim().length > 0}
            toneVariations={toneVariations}
            isGeneratingTones={isGeneratingTones}
            onGenerateTones={handleGenerateTones}
            text={text}
            writingContext={writingContext}
          />
        </div>
      </div>
    </div>
  );
}