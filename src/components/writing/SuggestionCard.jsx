import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categoryStyles = {
  grammar: {
    bg: "bg-red-50",
    border: "border-red-200/60",
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
  style: {
    bg: "bg-amber-50",
    border: "border-amber-200/60",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
  clarity: {
    bg: "bg-blue-50",
    border: "border-blue-200/60",
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
};

export default function SuggestionCard({ suggestion, onApply, onDismiss }) {
  const [expanded, setExpanded] = useState(false);
  const style = categoryStyles[suggestion.category] || categoryStyles.grammar;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`rounded-xl border ${style.border} ${style.bg} p-3.5 transition-all`}
    >
      <div className="flex items-start gap-3">
        <div className={`h-2 w-2 rounded-full ${style.dot} mt-1.5 shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}>
              {suggestion.category}
            </span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{suggestion.message}</p>

          {suggestion.original && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {expanded ? "Hide details" : "Show details"}
            </button>
          )}

          <AnimatePresence>
            {expanded && suggestion.original && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-1.5 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground shrink-0 mt-0.5">Before:</span>
                    <span className="line-through text-muted-foreground/70">{suggestion.original}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground shrink-0 mt-0.5">After:</span>
                    <span className="font-medium text-foreground">{suggestion.replacement}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-1.5 mt-3">
            {suggestion.original && suggestion.replacement && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onApply(suggestion)}
                className="h-7 text-xs gap-1 bg-white/80 hover:bg-white shadow-sm"
              >
                <Check className="h-3 w-3" />
                Apply
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDismiss(suggestion.id)}
              className="h-7 text-xs text-muted-foreground"
            >
              <X className="h-3 w-3" />
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}