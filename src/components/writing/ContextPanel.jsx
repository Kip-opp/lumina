import { useRef } from "react";
import { Mail, MessageSquare, FileText, Pencil, Upload, X, Linkedin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const WRITING_TYPES = [
  { key: "email", label: "Email", icon: Mail },
  { key: "message", label: "Message", icon: MessageSquare },
  { key: "article", label: "Article", icon: FileText },
  { key: "cold-dm", label: "Cold DM", icon: MessageSquare },
  { key: "cover-letter", label: "Cover Letter", icon: Briefcase },
  { key: "linkedin-post", label: "LinkedIn Post", icon: Linkedin },
  { key: "custom", label: "Custom", icon: Pencil },
];

export default function ContextPanel({ context, onChange }) {
  const fileRef = useRef(null);
  const update = (key, value) => onChange({ ...context, [key]: value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { update("fileContent", ev.target.result); update("fileName", file.name); };
    reader.readAsText(file);
  };

  const clearFile = () => {
    onChange({ ...context, fileContent: "", fileName: "" });
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-5 p-4 h-full overflow-y-auto">
      {/* Writing Type */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">I'm writing a…</p>
        <div className="flex flex-wrap gap-1.5">
          {WRITING_TYPES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => update("writingType", context.writingType === key ? "" : key)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
                context.writingType === key
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30"
              )}
            >
              <Icon className="h-2.5 w-2.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Context / Reference */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Context / Reference</p>
        <textarea
          value={context.contextText || ""}
          onChange={(e) => update("contextText", e.target.value)}
          placeholder="Paste any reference text, background info, or the message you're replying to..."
          className="w-full text-xs rounded-lg border border-border bg-background px-3 py-2.5 resize-none h-24 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
        />
        {/* File upload */}
        <div className="mt-1.5">
          <input ref={fileRef} type="file" accept=".txt,.md,.csv,.json" className="hidden" onChange={handleFile} />
          {context.fileName ? (
            <div className="flex items-center gap-2 text-xs bg-muted px-2.5 py-1.5 rounded-lg border border-border">
              <FileText className="h-3 w-3 text-primary shrink-0" />
              <span className="truncate font-medium flex-1">{context.fileName}</span>
              <button onClick={clearFile} className="text-muted-foreground hover:text-destructive shrink-0">
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="h-7 text-[11px] gap-1.5 w-full">
              <Upload className="h-3 w-3" />
              Upload File
            </Button>
          )}
        </div>
      </div>

      {/* Output Instructions */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Desired Tone & Style</p>
        <p className="text-[10px] text-muted-foreground mb-2">Describe how you want to sound in the reply</p>
        <textarea
          value={context.outputInstructions || ""}
          onChange={(e) => update("outputInstructions", e.target.value)}
          placeholder="e.g. confident junior dev, eager but professional. Or: warm, empathetic, solution-focused. Or: direct and concise, no fluff."
          className="w-full text-xs rounded-lg border border-border bg-background px-3 py-2.5 resize-none h-20 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
        />
      </div>
    </div>
  );
}