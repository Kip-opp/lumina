import { useState } from "react";
import { MessageSquare, Briefcase, Mail, Linkedin, Heart, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const WRITING_TYPES = [
  { key: "email", label: "Email", icon: Mail },
  { key: "message", label: "Message", icon: MessageSquare },
  { key: "linkedin-post", label: "LinkedIn Post", icon: Linkedin },
  { key: "cold-email", label: "Cold Email", icon: Mail },
  { key: "job-application", label: "Job Application", icon: Briefcase },
  { key: "apology", label: "Apology", icon: Heart },
  { key: "follow-up", label: "Follow-up", icon: Target },
];

const TONE_PRESETS = ["Formal", "Casual", "Persuasive", "Empathetic", "Direct", "Creative"];

const TEMPLATES = [
  {
    name: "Cold Email",
    writingType: "cold-email",
    tone: "Persuasive",
    context: "Write a professional cold email to introduce my services."
  },
  {
    name: "LinkedIn Post",
    writingType: "linkedin-post",
    tone: "Casual",
    context: "Create an engaging LinkedIn post about industry insights."
  },
  {
    name: "Apology",
    writingType: "email",
    tone: "Empathetic",
    context: "Write a sincere apology email for a business mistake."
  },
  {
    name: "Job Application",
    writingType: "job-application",
    tone: "Formal",
    context: "Craft a cover letter for a software engineer position."
  },
  {
    name: "Follow-up",
    writingType: "follow-up",
    tone: "Direct",
    context: "Send a professional follow-up email after a meeting."
  }
];

export default function ContextPanel({ context, onChange }) {
  const [activeTab, setActiveTab] = useState("context");
  const [customTone, setCustomTone] = useState("");

  const update = (key, value) => onChange({ ...context, [key]: value });

  const selectedType = WRITING_TYPES.find(t => t.key === context.writingType);

  const handleTemplateSelect = (template) => {
    onChange({
      ...context,
      writingType: template.writingType,
      outputInstructions: template.tone,
      contextText: template.context
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("context")}
          className={cn(
            "flex-1 px-3 py-2 text-xs font-medium transition-colors",
            activeTab === "context" ? "text-teal-600 border-b-2 border-teal-600" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Context
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={cn(
            "flex-1 px-3 py-2 text-xs font-medium transition-colors",
            activeTab === "templates" ? "text-teal-600 border-b-2 border-teal-600" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Templates
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === "context" && (
          <>
            {/* Writing Type */}
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Writing Type</p>
              <select
                value={context.writingType || ""}
                onChange={(e) => update("writingType", e.target.value)}
                className="w-full text-xs rounded-lg border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">Select writing type...</option>
                {WRITING_TYPES.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Context / Reference */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Context / Reference</p>
                {context.contextText && (
                  <span className="text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full">Active</span>
                )}
              </div>
              <textarea
                value={context.contextText || ""}
                onChange={(e) => update("contextText", e.target.value)}
                placeholder="Paste any reference text, background info, or the message you're replying to..."
                className="w-full text-xs rounded-lg border border-border bg-background px-3 py-2.5 resize-none h-24 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed"
              />
            </div>

            {/* Tone */}
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tone</p>
              <div className="flex flex-wrap gap-1.5">
                {TONE_PRESETS.map((tone) => (
                  <button
                    key={tone}
                    onClick={() => update("outputInstructions", tone)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
                      context.outputInstructions === tone
                        ? "bg-teal-600 text-white border-teal-600"
                        : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-teal-300"
                    )}
                  >
                    {tone}
                  </button>
                ))}
                <button
                  onClick={() => update("outputInstructions", "custom")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
                    context.outputInstructions === "custom"
                      ? "bg-teal-600 text-white border-teal-600"
                      : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-teal-300"
                  )}
                >
                  Custom
                </button>
              </div>
              {context.outputInstructions === "custom" && (
                <input
                  value={customTone}
                  onChange={(e) => {
                    setCustomTone(e.target.value);
                    update("outputInstructions", e.target.value);
                  }}
                  placeholder="Enter custom tone..."
                  className="w-full text-xs rounded-lg border border-border bg-background px-3 py-2 mt-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              )}
            </div>
          </>
        )}

        {activeTab === "templates" && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Saved Templates</p>
            {TEMPLATES.map((template, index) => (
              <button
                key={index}
                onClick={() => handleTemplateSelect(template)}
                className="w-full text-left p-3 rounded-lg border border-border bg-background hover:border-teal-300 transition-colors"
              >
                <p className="text-sm font-medium text-foreground">{template.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{template.context}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}