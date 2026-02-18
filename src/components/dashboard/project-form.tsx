"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { ImageUpload } from "./image-upload";
import { X, Plus } from "lucide-react";
import type { PortfolioProject } from "@/lib/types/database";

interface ProjectFormProps {
  project?: PortfolioProject;
  userId: string;
}

export function ProjectForm({ project, userId }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(project?.name || "");
  const [slug, setSlug] = useState(project?.slug || "");
  const [description, setDescription] = useState(project?.description || "");
  const [liveUrl, setLiveUrl] = useState(project?.live_url || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnail_url || "");
  const [screenshots, setScreenshots] = useState<string[]>(project?.screenshots || []);
  const [techStack, setTechStack] = useState<string[]>(project?.tech_stack || []);
  const [aiToolsUsed, setAiToolsUsed] = useState<string[]>(project?.ai_tools_used || []);
  const [newTech, setNewTech] = useState("");
  const [newAiTool, setNewAiTool] = useState("");

  const isEditing = !!project;

  function handleNameChange(value: string) {
    setName(value);
    if (!isEditing) {
      setSlug(slugify(value));
    }
  }

  function addToArray(arr: string[], setArr: (v: string[]) => void, value: string, setInput: (v: string) => void) {
    const trimmed = value.trim();
    if (trimmed && !arr.includes(trimmed)) {
      setArr([...arr, trimmed]);
    }
    setInput("");
  }

  function removeFromArray(arr: string[], setArr: (v: string[]) => void, index: number) {
    setArr(arr.filter((_, i) => i !== index));
  }

  async function handleSubmit(status: "draft" | "pending_review") {
    if (!name.trim() || !description.trim() || !liveUrl.trim() || !slug.trim()) {
      setError("Name, description, live URL, and slug are required.");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();

    const data = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      live_url: liveUrl.trim(),
      thumbnail_url: thumbnailUrl || null,
      screenshots,
      tech_stack: techStack,
      ai_tools_used: aiToolsUsed,
      status,
    };

    if (isEditing) {
      const { error: updateError } = await supabase
        .from("portfolio_projects")
        .update(data)
        .eq("id", project.id);

      if (updateError) {
        setError("Failed to update project. " + updateError.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("portfolio_projects")
        .insert({ ...data, user_id: userId });

      if (insertError) {
        if (insertError.message.includes("unique")) {
          setError("A project with this slug already exists. Choose a different name.");
        } else {
          setError("Failed to create project. " + insertError.message);
        }
        setLoading(false);
        return;
      }
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="My AI Project"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="my-ai-project"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="liveUrl">Live URL * (for iframe preview)</Label>
            <Input
              id="liveUrl"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://my-project.vercel.app"
            />
            <p className="text-xs text-muted-foreground">
              Deploy to free hosting (Vercel, Netlify, GitHub Pages) and paste the URL here.
              Note: some sites may block iframe embedding.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what your project does, what makes it special..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <ImageUpload
              bucket="portfolio-images"
              userId={userId}
              currentUrl={thumbnailUrl}
              onUpload={setThumbnailUrl}
              onRemove={() => setThumbnailUrl("")}
            />
          </div>

          <div className="space-y-2">
            <Label>Screenshots (up to 6)</Label>
            <div className="flex flex-wrap gap-3">
              {screenshots.map((url, i) => (
                <div key={i} className="relative">
                  <img
                    src={url}
                    alt={`Screenshot ${i + 1}`}
                    className="h-24 w-40 rounded-lg border border-border object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 h-5 w-5"
                    onClick={() => removeFromArray(screenshots, setScreenshots, i)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {screenshots.length < 6 && (
                <ImageUpload
                  bucket="portfolio-images"
                  userId={userId}
                  onUpload={(url) => setScreenshots([...screenshots, url])}
                  className="h-24"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tech Stack & AI Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tech Stack</Label>
            <div className="flex gap-2">
              <Input
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="e.g., Next.js, React, Python"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToArray(techStack, setTechStack, newTech, setNewTech);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addToArray(techStack, setTechStack, newTech, setNewTech)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeFromArray(techStack, setTechStack, i)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>AI Tools Used</Label>
            <div className="flex gap-2">
              <Input
                value={newAiTool}
                onChange={(e) => setNewAiTool(e.target.value)}
                placeholder="e.g., Claude, ChatGPT, Cursor"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToArray(aiToolsUsed, setAiToolsUsed, newAiTool, setNewAiTool);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addToArray(aiToolsUsed, setAiToolsUsed, newAiTool, setNewAiTool)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiToolsUsed.map((tool, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  {tool}
                  <button
                    type="button"
                    onClick={() => removeFromArray(aiToolsUsed, setAiToolsUsed, i)}
                    className="ml-1 text-primary/70 hover:text-primary"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => handleSubmit("draft")}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save as Draft"}
        </Button>
        <Button
          onClick={() => handleSubmit("pending_review")}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit for Review"}
        </Button>
      </div>
    </div>
  );
}
