import { Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReplyIdeas({ replies, isGenerating, onGenerate, hasText }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-8 w-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-foreground/70">Generating reply ideas...</p>
      </div>
    );
  }

  if (!replies || replies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center mb-3">
          <Sparkles className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground/70">No reply ideas yet</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[180px]">
          Click "Generate" to create AI-powered reply suggestions
        </p>
        <Button
          onClick={onGenerate}
          disabled={!hasText}
          size="sm"
          className="mt-4 h-8 text-xs gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Generate Replies
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {replies.map((reply, index) => (
          <motion.div
            key={`${reply.tone}-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="rounded-xl border border-border/60 bg-card p-3.5 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {reply.tone}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(reply.text, index)}
                className="h-6 w-6 p-0"
              >
                {copiedIndex === index ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3 text-muted-foreground" />
                )}
              </Button>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {reply.text}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
