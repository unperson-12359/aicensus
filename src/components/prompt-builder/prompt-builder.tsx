"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Check,
  Clipboard,
  Copy,
  Eraser,
  RefreshCw,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const goals = [
  "Research brief",
  "Tool comparison",
  "Content draft",
  "Code review",
  "Workflow automation",
  "Customer support",
  "Data analysis",
  "Strategy memo",
] as const;

const audiences = [
  "Internal team",
  "Technical buyer",
  "Non-technical client",
  "Founder or executive",
  "Marketing audience",
  "Developer",
] as const;

const modelStyles = [
  "General assistant",
  "Reasoning model",
  "Coding agent",
  "Image/video tool",
  "Search-enabled assistant",
  "Spreadsheet analyst",
] as const;

const tones = [
  "Clear and direct",
  "Friendly expert",
  "Concise operator",
  "Skeptical analyst",
  "Polished editorial",
  "Plain-language teacher",
] as const;

const formats = [
  "Bulleted plan",
  "Step-by-step guide",
  "Markdown report",
  "Comparison table",
  "JSON schema",
  "Email draft",
  "Checklist",
  "Code block",
] as const;

const constraintOptions = [
  "Ask clarifying questions first",
  "Cite assumptions",
  "Avoid jargon",
  "Keep under 500 words",
  "Include risks and tradeoffs",
  "Return only the final answer",
  "Use examples",
  "Prioritize free or low-cost tools",
] as const;

type PromptState = {
  goal: string;
  audience: string;
  modelStyle: string;
  tone: string;
  format: string;
  context: string;
  examples: string;
  customGoal: string;
  constraints: string[];
  extraConstraints: string;
};

const initialState: PromptState = {
  goal: goals[0],
  audience: audiences[0],
  modelStyle: modelStyles[0],
  tone: tones[0],
  format: formats[0],
  context: "",
  examples: "",
  customGoal: "",
  constraints: [
    "Ask clarifying questions first",
    "Cite assumptions",
    "Include risks and tradeoffs",
  ],
  extraConstraints: "",
};

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function section(label: string, body: string) {
  const trimmed = body.trim();
  return trimmed ? `## ${label}\n${trimmed}` : "";
}

function buildPrompt(state: PromptState) {
  const goal = state.customGoal.trim() || state.goal;
  const constraints = [
    ...state.constraints,
    ...state.extraConstraints
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
  ];

  const blocks = [
    section(
      "Role",
      `You are a ${state.modelStyle.toLowerCase()} helping with: ${goal}.`
    ),
    section(
      "Audience",
      `Write for ${state.audience.toLowerCase()}. Use a ${state.tone.toLowerCase()} tone.`
    ),
    section(
      "Task",
      [
        `Create a ${state.format.toLowerCase()} that solves the user's goal.`,
        "Be specific, useful, and ready to act on.",
      ].join("\n")
    ),
    section(
      "Context",
      state.context ||
        "I will provide any relevant product, market, user, data, or workflow details."
    ),
    constraints.length > 0
      ? section(
          "Constraints",
          constraints.map((item) => `- ${item}`).join("\n")
        )
      : "",
    section(
      "Examples or Inputs",
      state.examples ||
        "If examples are missing, state what examples would improve the result."
    ),
    section(
      "Output Format",
      [
        `Return the answer as a ${state.format.toLowerCase()}.`,
        "Use headings where helpful. Make the final output easy to copy into the next tool or workflow.",
      ].join("\n")
    ),
  ].filter(Boolean);

  return blocks.join("\n\n");
}

function FieldLabel({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-sm font-medium text-white/90">{children}</h2>
    </div>
  );
}

function SelectField({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-medium text-white/60">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full border-white/10 bg-white/[0.03]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {values.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

export function PromptBuilder() {
  const [state, setState] = useState<PromptState>(initialState);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const prompt = useMemo(() => buildPrompt(state), [state]);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
      setCopyError(true);
      window.setTimeout(() => setCopyError(false), 2400);
    }
  }

  function update<K extends keyof PromptState>(key: K, value: PromptState[K]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)]">
      <section className="space-y-5">
        <div className="bento-tile p-4 sm:p-5">
          <FieldLabel eyebrow="01 / setup">What should the model do?</FieldLabel>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SelectField
              label="Goal"
              value={state.goal}
              values={goals}
              onChange={(value) => update("goal", value)}
            />
            <SelectField
              label="Audience"
              value={state.audience}
              values={audiences}
              onChange={(value) => update("audience", value)}
            />
            <SelectField
              label="Model or tool style"
              value={state.modelStyle}
              values={modelStyles}
              onChange={(value) => update("modelStyle", value)}
            />
            <SelectField
              label="Tone"
              value={state.tone}
              values={tones}
              onChange={(value) => update("tone", value)}
            />
          </div>
          <label className="mt-4 block space-y-2">
            <span className="text-xs font-medium text-white/60">
              Custom goal
            </span>
            <Input
              value={state.customGoal}
              onChange={(event) => update("customGoal", event.target.value)}
              placeholder="Example: find three AI video tools for a 2-person marketing team"
              className="border-white/10 bg-white/[0.03]"
            />
          </label>
        </div>

        <div className="bento-tile p-4 sm:p-5">
          <FieldLabel eyebrow="02 / shape">Constraints and output</FieldLabel>
          <div className="mt-4">
            <SelectField
              label="Output format"
              value={state.format}
              values={formats}
              onChange={(value) => update("format", value)}
            />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {constraintOptions.map((option) => {
              const active = state.constraints.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    update("constraints", toggleValue(state.constraints, option))
                  }
                  className={cn(
                    "flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 text-left text-xs transition-colors",
                    active
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white"
                  )}
                >
                  <Check
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      active ? "opacity-100" : "opacity-20"
                    )}
                  />
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
          <label className="mt-4 block space-y-2">
            <span className="text-xs font-medium text-white/60">
              Extra constraints
            </span>
            <Textarea
              value={state.extraConstraints}
              onChange={(event) =>
                update("extraConstraints", event.target.value)
              }
              placeholder="One per line: budget, tools to include, sources to avoid, compliance limits..."
              className="min-h-24 resize-y border-white/10 bg-white/[0.03]"
            />
          </label>
        </div>

        <div className="bento-tile p-4 sm:p-5">
          <FieldLabel eyebrow="03 / inputs">Context and examples</FieldLabel>
          <div className="mt-4 grid gap-4">
            <label className="space-y-2">
              <span className="text-xs font-medium text-white/60">
                Context
              </span>
              <Textarea
                value={state.context}
                onChange={(event) => update("context", event.target.value)}
                placeholder="Paste the product, user, market, dataset, brief, or decision context the model should use."
                className="min-h-32 resize-y border-white/10 bg-white/[0.03]"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-medium text-white/60">
                Examples or reference outputs
              </span>
              <Textarea
                value={state.examples}
                onChange={(event) => update("examples", event.target.value)}
                placeholder="Add a good example, bad example, sample row, draft, brand voice note, or source snippet."
                className="min-h-28 resize-y border-white/10 bg-white/[0.03]"
              />
            </label>
          </div>
        </div>
      </section>

      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="bento-tile overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                Generated prompt
              </p>
              <p className="mt-1 text-sm text-white/70">
                Refine the inputs, then copy the result.
              </p>
            </div>
            <WandSparkles className="h-4 w-4 text-white/50" />
          </div>

          <Textarea
            value={prompt}
            readOnly
            className="min-h-[520px] rounded-none border-0 bg-black/40 font-mono text-xs leading-relaxed text-white/80 shadow-none focus-visible:ring-0"
          />

          <div className="flex flex-col gap-2 border-t border-white/10 p-3 sm:flex-row">
            <Button onClick={copyPrompt} className="flex-1">
              {copied ? (
                <>
                  <Clipboard className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy prompt
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setState((current) => ({
                  ...current,
                  constraints: Array.from(
                    new Set([
                      ...current.constraints,
                      "Ask clarifying questions first",
                      "Include risks and tradeoffs",
                      "Use examples",
                    ])
                  ),
                }))
              }
            >
              <RefreshCw className="h-4 w-4" />
              Sharpen
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setState(initialState)}
              aria-label="Reset prompt builder"
            >
              <Eraser className="h-4 w-4" />
            </Button>
          </div>
          {copyError && (
            <p className="px-3 pb-3 text-xs text-destructive">
              Clipboard access was blocked. Select the prompt text to copy it manually.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
