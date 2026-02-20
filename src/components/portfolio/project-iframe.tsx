"use client";

import { useState } from "react";
import { ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectIframeProps {
  url: string;
  title: string;
}

function isValidPreviewUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function ProjectIframe({ url, title }: ProjectIframeProps) {
  const [loadError, setLoadError] = useState(false);
  const safeUrl = isValidPreviewUrl(url);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Live Preview</h3>
        {safeUrl && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              Open in New Tab
            </Button>
          </a>
        )}
      </div>

      {!safeUrl || loadError ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/50 py-16">
          <AlertCircle className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            This site doesn&apos;t allow iframe embedding.
          </p>
          {safeUrl && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3"
            >
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                Visit Site Directly
              </Button>
            </a>
          )}
        </div>
      ) : (
        <div
          className="relative w-full overflow-hidden rounded-lg border border-border/50"
          style={{ paddingBottom: "56.25%" }}
        >
          <iframe
            src={url}
            title={title}
            className="absolute inset-0 h-full w-full"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setLoadError(true)}
          />
        </div>
      )}
    </div>
  );
}
