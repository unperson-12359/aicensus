"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MessageList } from "@/components/dashboard/message-list";
import type { ProjectMessage } from "@/lib/types/database";

export default function MessagesPage() {
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("project_messages")
        .select("*")
        .eq("recipient_user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setMessages(data as ProjectMessage[]);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Messages</h1>
      <p className="mb-8 text-muted-foreground">Messages from visitors to your portfolio</p>
      <MessageList initialMessages={messages} />
    </div>
  );
}
