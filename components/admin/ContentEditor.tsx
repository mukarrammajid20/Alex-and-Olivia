"use client";

import { useState } from "react";
import type { WeddingConfig } from "@/lib/types/wedding";

type ContentEditorProps = {
  data: WeddingConfig;
  onSave: (data: WeddingConfig) => Promise<void>;
};

export const ContentEditor = ({ data, onSave }: ContentEditorProps) => {
  const [form, setForm] = useState(data);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await onSave(form);
      setMessage("Saved successfully — changes are live!");
    } catch {
      setMessage("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
            Partner 1
          </label>
          <input
            value={form.couple.partner1}
            onChange={(e) =>
              setForm({ ...form, couple: { ...form.couple, partner1: e.target.value } })
            }
            className="w-full rounded-lg border border-accent/30 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
            Partner 2
          </label>
          <input
            value={form.couple.partner2}
            onChange={(e) =>
              setForm({ ...form, couple: { ...form.couple, partner2: e.target.value } })
            }
            className="w-full rounded-lg border border-accent/30 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
          Tagline
        </label>
        <input
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          className="w-full rounded-lg border border-accent/30 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
          Wedding Date
        </label>
        <input
          type="date"
          value={form.weddingDate}
          onChange={(e) => setForm({ ...form, weddingDate: e.target.value })}
          className="w-full rounded-lg border border-accent/30 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {(["primary", "accent", "background", "foreground", "muted"] as const).map((key) => (
          <div key={key}>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
              {key} color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.theme[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    theme: { ...form.theme, [key]: e.target.value },
                  })
                }
                className="h-10 w-10 cursor-pointer rounded border-0"
              />
              <input
                value={form.theme[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    theme: { ...form.theme, [key]: e.target.value },
                  })
                }
                className="flex-1 rounded-lg border border-accent/30 px-3 py-2 text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.story.enabled}
            onChange={(e) =>
              setForm({ ...form, story: { ...form.story, enabled: e.target.checked } })
            }
            className="accent-primary"
          />
          Show Our Story section
        </label>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
          Story Title
        </label>
        <input
          value={form.story.title}
          onChange={(e) =>
            setForm({ ...form, story: { ...form.story, title: e.target.value } })
          }
          className="w-full rounded-lg border border-accent/30 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
          Story Content
        </label>
        <textarea
          rows={4}
          value={form.story.content}
          onChange={(e) =>
            setForm({ ...form, story: { ...form.story, content: e.target.value } })
          }
          className="w-full resize-none rounded-lg border border-accent/30 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
            SEO Title
          </label>
          <input
            value={form.seo.title}
            onChange={(e) =>
              setForm({ ...form, seo: { ...form.seo, title: e.target.value } })
            }
            className="w-full rounded-lg border border-accent/30 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
            Brand Name
          </label>
          <input
            value={form.brand.name}
            onChange={(e) =>
              setForm({ ...form, brand: { ...form.brand, name: e.target.value } })
            }
            className="w-full rounded-lg border border-accent/30 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {message && (
        <p className={`text-sm ${message.includes("live") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="rounded-full bg-primary px-6 py-2 text-sm text-background disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Content & Theme"}
      </button>
    </div>
  );
};
