"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  bucket: string;
  userId: string;
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  bucket,
  userId,
  currentUrl,
  onUpload,
  onRemove,
  className = "",
  accept = "image/png,image/jpeg,image/webp",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File must be under ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: false,
    });

    if (error) {
      alert("Upload failed. Please try again.");
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);

    setPreview(publicUrl);
    onUpload(publicUrl);
    setUploading(false);
  }

  function handleRemove() {
    setPreview(null);
    onRemove?.();
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className={className}>
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Upload preview"
            className="h-32 w-32 rounded-lg border border-border object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary/50 hover:bg-muted/50">
          <Upload className="mb-2 h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {uploading ? "Uploading..." : "Upload"}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
