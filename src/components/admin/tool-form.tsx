"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, Trash2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface ToolFormProps {
  tool?: Record<string, unknown>;
  categories: { id: string; name: string }[];
}

export function ToolForm({ tool, categories }: ToolFormProps) {
  const router = useRouter();
  const isEditing = !!tool;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    (tool?.category_id as string) || "none"
  );
  const [selectedPricingModel, setSelectedPricingModel] = useState(
    (tool?.pricing_model as string) || "freemium"
  );

  // Array field state
  const [useCases, setUseCases] = useState<string[]>(
    (tool?.use_cases as string[]) || []
  );
  const [pros, setPros] = useState<string[]>((tool?.pros as string[]) || []);
  const [cons, setCons] = useState<string[]>((tool?.cons as string[]) || []);
  const [whoItsFor, setWhoItsFor] = useState<string[]>(
    (tool?.who_its_for as string[]) || []
  );
  const [keyFeatures, setKeyFeatures] = useState<string[]>(
    (tool?.key_features as string[]) || []
  );

  function ArrayInput({
    label,
    items,
    setItems,
    placeholder,
  }: {
    label: string;
    items: string[];
    setItems: (items: string[]) => void;
    placeholder: string;
  }) {
    const [input, setInput] = useState("");

    function addItem() {
      if (input.trim() && !items.includes(input.trim())) {
        setItems([...items, input.trim()]);
        setInput("");
      }
    }

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem();
              }
            }}
          />
          <Button type="button" variant="outline" size="icon" onClick={addItem}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {items.map((item, i) => (
              <Badge key={i} variant="secondary" className="gap-1">
                {item}
                <button
                  type="button"
                  onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const status = (e.nativeEvent as SubmitEvent).submitter?.getAttribute(
      "data-status"
    ) || "draft";

    if (!selectedPricingModel) {
      setError("Pricing model is required.");
      setLoading(false);
      return;
    }

    const name = formData.get("name") as string;
    const toolData = {
      name,
      slug: (formData.get("slug") as string) || slugify(name),
      tagline: formData.get("tagline") as string,
      description: (formData.get("description") as string) || (formData.get("tagline") as string),
      website_url: formData.get("website_url") as string,
      logo_url: (formData.get("logo_url") as string) || null,
      screenshot_url: (formData.get("screenshot_url") as string) || null,
      category_id: selectedCategoryId === "none" ? null : selectedCategoryId,
      pricing_model: selectedPricingModel,
      pricing_details: (formData.get("pricing_details") as string) || null,
      editor_rating: formData.get("editor_rating")
        ? parseFloat(formData.get("editor_rating") as string)
        : null,
      is_verified: formData.get("is_verified") === "on",
      is_featured: formData.get("is_featured") === "on",
      meta_title: (formData.get("meta_title") as string) || null,
      meta_description: (formData.get("meta_description") as string) || null,
      affiliate_url: (formData.get("affiliate_url") as string) || null,
      company_name: (formData.get("company_name") as string) || null,
      founded_year: formData.get("founded_year")
        ? parseInt(formData.get("founded_year") as string)
        : null,
      use_cases: useCases,
      pros,
      cons,
      who_its_for: whoItsFor,
      key_features: keyFeatures,
      status,
      ...(status === "published" && !tool?.published_at
        ? { published_at: new Date().toISOString() }
        : {}),
    };

    try {
      const supabase = createClient();

      if (isEditing) {
        const { error: dbError } = await supabase
          .from("tools")
          .update(toolData)
          .eq("id", tool.id as string);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase
          .from("tools")
          .insert(toolData);
        if (dbError) throw dbError;
      }

      router.push("/admin/tools");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!tool || !confirm("Are you sure you want to delete this tool?")) return;
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("tools")
        .delete()
        .eq("id", tool.id as string);
      if (deleteError) throw deleteError;
      router.push("/admin/tools");
      router.refresh();
    } catch {
      setError("Failed to delete tool.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media & Links</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Basic Info */}
        <TabsContent value="basic">
          <Card>
            <CardContent className="space-y-5 pt-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Tool Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    defaultValue={(tool?.name as string) || ""}
                    placeholder="e.g., ChatGPT"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={(tool?.slug as string) || ""}
                    placeholder="auto-generated from name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline *</Label>
                <Input
                  id="tagline"
                  name="tagline"
                  required
                  defaultValue={(tool?.tagline as string) || ""}
                  placeholder="One-liner description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website_url">Website URL *</Label>
                <Input
                  id="website_url"
                  name="website_url"
                  type="url"
                  required
                  defaultValue={(tool?.website_url as string) || ""}
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
                  <Select
                    value={selectedCategoryId}
                    onValueChange={setSelectedCategoryId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No category</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricing_model">Pricing Model *</Label>
                  <Select
                    value={selectedPricingModel}
                    onValueChange={setSelectedPricingModel}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="freemium">Freemium</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="open_source">Open Source</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricing_details">Pricing Details</Label>
                <Textarea
                  id="pricing_details"
                  name="pricing_details"
                  defaultValue={(tool?.pricing_details as string) || ""}
                  placeholder="e.g., Free tier: 100 requests/mo. Pro: $20/mo"
                  rows={2}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="editor_rating">Rating (0-5)</Label>
                  <Input
                    id="editor_rating"
                    name="editor_rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    defaultValue={
                      tool?.editor_rating !== null
                        ? String(tool?.editor_rating)
                        : ""
                    }
                    placeholder="4.5"
                  />
                </div>
                <div className="flex items-end gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="is_verified"
                      defaultChecked={(tool?.is_verified as boolean) || false}
                      className="h-4 w-4 rounded border-border"
                    />
                    Verified
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="is_featured"
                      defaultChecked={(tool?.is_featured as boolean) || false}
                      className="h-4 w-4 rounded border-border"
                    />
                    Featured
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content */}
        <TabsContent value="content">
          <Card>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={(tool?.description as string) || ""}
                  placeholder="Full description of the tool (supports plain text)"
                  rows={8}
                />
              </div>

              <ArrayInput
                label="Key Features"
                items={keyFeatures}
                setItems={setKeyFeatures}
                placeholder="Add a feature"
              />

              <ArrayInput
                label="Use Cases"
                items={useCases}
                setItems={setUseCases}
                placeholder="Add a use case"
              />

              <ArrayInput
                label="Pros"
                items={pros}
                setItems={setPros}
                placeholder="Add a pro"
              />

              <ArrayInput
                label="Cons"
                items={cons}
                setItems={setCons}
                placeholder="Add a con"
              />

              <ArrayInput
                label="Who It's For"
                items={whoItsFor}
                setItems={setWhoItsFor}
                placeholder="Add target audience"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media & Links */}
        <TabsContent value="media">
          <Card>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  name="logo_url"
                  type="url"
                  defaultValue={(tool?.logo_url as string) || ""}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="screenshot_url">Screenshot URL</Label>
                <Input
                  id="screenshot_url"
                  name="screenshot_url"
                  type="url"
                  defaultValue={(tool?.screenshot_url as string) || ""}
                  placeholder="https://example.com/screenshot.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliate_url">Affiliate URL</Label>
                <Input
                  id="affiliate_url"
                  name="affiliate_url"
                  type="url"
                  defaultValue={(tool?.affiliate_url as string) || ""}
                  placeholder="https://example.com/?ref=aicensus"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    defaultValue={(tool?.company_name as string) || ""}
                    placeholder="OpenAI"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded_year">Founded Year</Label>
                  <Input
                    id="founded_year"
                    name="founded_year"
                    type="number"
                    defaultValue={
                      tool?.founded_year ? String(tool.founded_year) : ""
                    }
                    placeholder="2023"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <Card>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  name="meta_title"
                  defaultValue={(tool?.meta_title as string) || ""}
                  placeholder="Custom SEO title (leave blank for auto)"
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to auto-generate from tool name
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  name="meta_description"
                  defaultValue={(tool?.meta_description as string) || ""}
                  placeholder="Custom SEO description (leave blank for auto)"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 150-160 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <input
        type="hidden"
        name="category_id"
        value={selectedCategoryId === "none" ? "" : selectedCategoryId}
      />
      <input
        type="hidden"
        name="pricing_model"
        value={selectedPricingModel}
      />

      {/* Error */}
      {error && (
        <p className="mt-4 text-sm text-destructive">{error}</p>
      )}

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3">
        <Button type="submit" data-status="draft" variant="outline" disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
        <Button type="submit" data-status="published" disabled={loading}>
          <Eye className="mr-2 h-4 w-4" />
          {isEditing ? "Update & Publish" : "Publish"}
        </Button>
        {isEditing && (
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
            className="ml-auto"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
