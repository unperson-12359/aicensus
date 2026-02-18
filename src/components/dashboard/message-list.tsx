"use client";

import { useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { ProjectMessage } from "@/lib/types/database";

interface MessageListProps {
  initialMessages: ProjectMessage[];
}

export function MessageList({ initialMessages }: MessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const supabase = createClient();

  async function toggleRead(id: string, currentlyRead: boolean) {
    const { error } = await supabase
      .from("project_messages")
      .update({ is_read: !currentlyRead })
      .eq("id", id);

    if (!error) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: !currentlyRead } : m))
      );
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;

    const { error } = await supabase.from("project_messages").delete().eq("id", id);
    if (!error) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Mail className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">No messages yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <Card
          key={msg.id}
          className={msg.is_read ? "opacity-70" : "border-primary/20"}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{msg.sender_name}</span>
                  <span className="text-sm text-muted-foreground">&lt;{msg.sender_email}&gt;</span>
                  {!msg.is_read && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <p className="mt-2 text-sm">{msg.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(msg.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleRead(msg.id, msg.is_read)}
                  title={msg.is_read ? "Mark as unread" : "Mark as read"}
                >
                  {msg.is_read ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <MailOpen className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(msg.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
