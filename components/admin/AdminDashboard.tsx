"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { RsvpTable } from "./RsvpTable";
import { ContentEditor } from "./ContentEditor";
import { EventEditor } from "./EventEditor";
import { GalleryManager } from "./GalleryManager";
import type { WeddingConfig } from "@/lib/types/wedding";

type Tab = "rsvps" | "content" | "events" | "gallery";

type AdminDashboardProps = {
  initialData: WeddingConfig;
};

export const AdminDashboard = ({ initialData }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("rsvps");
  const [data, setData] = useState(initialData);
  const router = useRouter();

  const saveWedding = useCallback(
    async (updates: Partial<WeddingConfig>) => {
      const res = await fetch("/api/admin/wedding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Save failed");
      const updated = (await res.json()) as WeddingConfig;
      setData(updated);
    },
    []
  );

  const refreshData = useCallback(async () => {
    const res = await fetch("/api/admin/wedding");
    if (res.ok) {
      const updated = (await res.json()) as WeddingConfig;
      setData(updated);
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "rsvps", label: "RSVPs" },
    { id: "content", label: "Content & Theme" },
    { id: "events", label: "Events" },
    { id: "gallery", label: "Gallery" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-accent/20 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="font-serif text-xl text-primary">Wedding Admin</h1>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-primary"
            >
              View Site
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-muted hover:text-primary"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-6">
        <nav className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-background"
                  : "bg-primary/5 text-muted hover:bg-primary/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="rounded-2xl border border-accent/20 bg-white p-6">
          {activeTab === "rsvps" && <RsvpTable />}
          {activeTab === "content" && (
            <ContentEditor data={data} onSave={(d) => saveWedding(d)} />
          )}
          {activeTab === "events" && (
            <EventEditor events={data.events} onSave={(events) => saveWedding({ events })} />
          )}
          {activeTab === "gallery" && (
            <GalleryManager images={data.gallery.images} onUpdate={refreshData} />
          )}
        </div>
      </div>
    </div>
  );
};
