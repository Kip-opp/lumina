import { useRef, useEffect } from "react";

export default function TextEditor({ text, setText }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-6 py-3 border-b border-border/40">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Text</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start writing or paste your text here...

The AI will analyze your writing for grammar, style, and clarity improvements."
          className="w-full min-h-[400px] resize-none bg-transparent font-serif text-base leading-relaxed tracking-wide placeholder:text-muted-foreground/40 focus:outline-none"
          spellCheck={false}
        />
      </div>
    </div>
  );
}