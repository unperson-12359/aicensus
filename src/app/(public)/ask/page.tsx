import { AskChat } from "@/components/ask/ask-chat";
import { FadeIn, RevealText } from "@/components/motion";

export const metadata = {
  title: "Ask AiCensus — recommend an AI tool",
  description:
    "Describe your task. Get 3 opinionated recommendations drawn from the AiCensus directory. Free.",
  openGraph: {
    title: "Ask AiCensus — recommend an AI tool",
    description:
      "Describe your task. Get 3 opinionated recommendations drawn from the AiCensus directory.",
  },
};

export default function AskPage() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="pointer-events-none absolute inset-0 bento-grid-pattern opacity-25" />

      {/* Hero */}
      <div className="relative mx-auto w-full max-w-3xl px-4 pt-10 sm:px-6 sm:pt-14 lg:pt-16">
        <FadeIn>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
            § 00 · Ask AiCensus
          </p>
        </FadeIn>
        <div className="mt-4 sm:mt-5">
          <RevealText delay={0.1}>
            <h1 className="font-serif text-[clamp(2rem,6.5vw,4.75rem)] font-normal leading-[0.98] tracking-[-0.035em] text-foreground">
              What AI tool do you{" "}
              <em className="font-serif italic text-white/60">need</em>?
            </h1>
          </RevealText>
        </div>
        <FadeIn delay={0.35} direction="up">
          <p className="mt-4 max-w-xl font-serif text-base italic leading-relaxed text-white/75 sm:mt-5 sm:text-lg">
            Describe your task. Get 3 opinionated recommendations.
          </p>
        </FadeIn>
      </div>

      {/* Chat widget */}
      <div className="relative mx-auto mt-6 flex w-full max-w-3xl flex-1 flex-col px-4 pb-4 sm:mt-8 sm:px-6 sm:pb-6">
        <AskChat />
      </div>
    </section>
  );
}
