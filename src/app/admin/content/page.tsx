"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Save,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Layers,
} from "lucide-react";

export default function ContentCMSPage() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    section: "story",
    content: "",
  });

  const loadBlocks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/content");
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setBlocks(json.data);
        if (!selectedBlock) {
          selectBlock(json.data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlocks();
  }, []);

  const selectBlock = (b: any) => {
    setSelectedBlock(b);
    setFormData({
      title: b.title,
      section: b.section || "story",
      content: b.content,
    });
    setSaveSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlock) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/v1/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: selectedBlock.key,
          title: formData.title,
          section: formData.section,
          content: formData.content,
          metadata: selectedBlock.metadata,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaveSuccess(true);
        loadBlocks();
      } else {
        alert(json.error || "Failed to update content block");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-[#B45309]">
            Brand Narrative & Story CMS
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
            Content & Story Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Edit server-rendered story blocks for &ldquo;Farm Story&rdquo; (/farm-story) and &ldquo;Pashmina Heritage&rdquo; (/pashmina-heritage).
          </p>
        </div>

        <button
          onClick={loadBlocks}
          className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold p-2.5 rounded-xl transition-colors self-start sm:self-auto"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: List of blocks */}
        <div className="md:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">
            Available Content Blocks
          </h3>

          {blocks.map((b) => (
            <button
              key={b.key}
              onClick={() => selectBlock(b)}
              className={`w-full text-left p-5 rounded-2xl border transition-all ${
                selectedBlock?.key === b.key
                  ? "border-[#B45309] bg-white ring-2 ring-[#B45309]/20 shadow-xs"
                  : "border-stone-200 bg-[#FAF7F2] hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-[#B45309]" />
                <span className="font-mono text-xs font-bold text-stone-900">{b.key}</span>
              </div>
              <h4 className="font-serif font-bold text-sm text-stone-900">{b.title}</h4>
              <span className="text-[10px] text-stone-500 uppercase mt-2 block font-medium">
                Section: {b.section}
              </span>
            </button>
          ))}
        </div>

        {/* Right Column: Editor */}
        <div className="md:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
          {selectedBlock ? (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Editing Block</span>
                  <h3 className="font-mono text-base font-bold text-[#1C1917]">
                    {selectedBlock.key}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  {saveSuccess && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Changes Saved!</span>
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#B45309] hover:bg-[#92400E] disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Saving..." : "Save Block"}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Page / Story Headline
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#B45309]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Story Content (Markdown & Chapters)
                </label>
                <textarea
                  rows={16}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full font-mono bg-[#FAF7F2] border border-stone-200 rounded-xl p-4 text-xs leading-relaxed focus:outline-none focus:border-[#B45309]"
                />
              </div>

              {selectedBlock.metadata && (
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200 text-xs">
                  <span className="font-bold text-stone-800 block mb-2">Block Metadata</span>
                  <pre className="text-[11px] text-stone-600 font-mono overflow-x-auto">
                    {JSON.stringify(selectedBlock.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </form>
          ) : (
            <div className="p-12 text-center text-xs text-stone-500">
              Select a content block on the left to edit its text.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
