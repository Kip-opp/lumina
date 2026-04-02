import { useRef, useEffect, useState } from "react";

function highlightText(text) {
  if (!text) return text;

  // Simple highlighting logic (in a real app, this would use AI/ML)
  const words = text.split(/(\s+)/);

  return words.map((word, index) => {
    const lowerWord = word.toLowerCase();

    // Grammar errors (red) - basic check for common issues
    if (lowerWord.includes('their') && Math.random() > 0.8) { // Example: random for demo
      return <span key={index} className="underline decoration-red-500 decoration-2">{word}</span>;
    }

    // Weak/passive words (yellow)
    if (['is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'make', 'get'].includes(lowerWord)) {
      return <span key={index} className="underline decoration-yellow-400 decoration-1">{word}</span>;
    }

    // Complex sentences (blue) - long words
    if (word.length > 8 && /[a-zA-Z]/.test(word)) {
      return <span key={index} className="underline decoration-blue-400 decoration-1">{word}</span>;
    }

    return word;
  });
}

export default function TextEditor({ text, setText }) {
  const textareaRef = useRef(null);
  const [highlightedText, setHighlightedText] = useState(text);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  useEffect(() => {
    // Update highlights as user types
    setHighlightedText(highlightText(text));
  }, [text]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-6 py-3 border-b border-border/40">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Text</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 relative">
        {/* Hidden textarea for input */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start writing or paste your text here...

The AI will analyze your writing for grammar, style, and clarity improvements."
          className="absolute inset-0 w-full min-h-[400px] resize-none bg-transparent font-serif text-base leading-relaxed tracking-wide placeholder:text-muted-foreground/40 focus:outline-none z-10 text-transparent caret-black"
          spellCheck={false}
          style={{ caretColor: 'black' }}
        />

        {/* Highlighted overlay */}
        <div className="absolute inset-0 w-full min-h-[400px] font-serif text-base leading-relaxed tracking-wide pointer-events-none whitespace-pre-wrap break-words">
          {highlightedText || (
            <span className="text-muted-foreground/40">
              Start writing or paste your text here...

The AI will analyze your writing for grammar, style, and clarity improvements.
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-2 border-t border-border/40 bg-muted/30">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-red-500"></div>
            <span>Grammar</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-yellow-400"></div>
            <span>Weak words</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-blue-400"></div>
            <span>Complex</span>
          </div>
        </div>
      </div>
    </div>
  );
}