"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Plus,
  FileText,
  Sparkles,
  Trash2,
  IndianRupee,
  Calendar,
  User,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const STAGES = [
  "DISCOVERY",
  "DEMO_SCHEDULED",
  "DEMO_DONE",
  "POC",
  "PROPOSAL",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
];

interface DealDetail {
  id: string;
  name: string;
  stage: string;
  valueINR: number;
  probability: number;
  weightedValue: number;
  expectedCloseDate?: string | null;
  actualCloseDate?: string | null;
  lossReason?: string | null;
  stageChangedAt: string;
  account: { id: string; name: string; tier: string; icp: string; domain?: string | null };
  primaryLead?: {
    id: string;
    email: string;
    firstName?: string | null;
    totalScore: number;
    stage: string;
    activities: Array<{ id: string; type: string; metadata?: unknown; createdAt: string }>;
  } | null;
  notes: Array<{ id: string; content: string; createdAt: string }>;
  proposals: Array<{ id: string; version: number; content: string; sentAt?: string | null; createdAt: string }>;
}

function formatINR(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

function formatDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function DealDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [loading, setLoading] = React.useState(true);
  const [deal, setDeal] = React.useState<DealDetail | null>(null);
  const [noteText, setNoteText] = React.useState("");
  const [noteOpen, setNoteOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [generatingProposal, setGeneratingProposal] = React.useState(false);
  const [proposalOpen, setProposalOpen] = React.useState(false);
  const [activeProposal, setActiveProposal] = React.useState<DealDetail["proposals"][number] | null>(null);

  const fetchDeal = React.useCallback(() => {
    fetch(`/api/deals/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setDeal(d);
        setLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setLoading(false);
      });
  }, [id]);

  React.useEffect(() => {
    fetchDeal();
  }, [fetchDeal]);

  async function patchDeal(patch: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/deals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Deal updated");
      fetchDeal();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function addNote() {
    if (!noteText.trim()) return;
    const res = await fetch(`/api/deals/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: noteText }),
    });
    if (res.ok) {
      toast.success("Note added");
      setNoteText("");
      setNoteOpen(false);
      fetchDeal();
    } else {
      toast.error("Failed to add note");
    }
  }

  async function generateProposal() {
    setGeneratingProposal(true);
    try {
      const res = await fetch(`/api/deals/${id}/proposals`, { method: "POST" });
      if (!res.ok) throw new Error("Proposal generation failed");
      const proposal = await res.json();
      toast.success(`Proposal v${proposal.version} generated`);
      setActiveProposal(proposal);
      setProposalOpen(true);
      fetchDeal();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setGeneratingProposal(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
      </div>
    );

  if (!deal) return <div className="text-slate-400 p-4">Deal not found</div>;

  // Merge notes + activities chronologically
  const timeline = [
    ...deal.notes.map((n) => ({
      kind: "note" as const,
      id: n.id,
      content: n.content,
      createdAt: n.createdAt,
    })),
    ...(deal.primaryLead?.activities || []).map((a) => ({
      kind: "activity" as const,
      id: a.id,
      type: a.type,
      metadata: a.metadata,
      createdAt: a.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      {/* Breadcrumb + back */}
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <button
          onClick={() => router.push("/forge/deals")}
          className="hover:text-slate-300 inline-flex items-center gap-1"
        >
          <ArrowLeft size={12} /> All Deals
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">{deal.name}</h1>
          <Link
            href={`/forge/accounts/${deal.account.id}`}
            className="text-sm text-slate-400 hover:text-teal-400 inline-flex items-center gap-1 mt-1"
          >
            <Building2 size={12} /> {deal.account.name}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNoteOpen(true)}
            className="border-white/[0.06] bg-white/[0.02] text-slate-300"
          >
            <Plus size={14} /> Add Note
          </Button>
          <Button
            size="sm"
            onClick={generateProposal}
            disabled={generatingProposal}
            className="bg-teal-600 hover:bg-teal-500 text-white"
          >
            {generatingProposal ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Generate Proposal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* LEFT: Deal facts */}
        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Deal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider">Stage</label>
              <Select
                value={deal.stage}
                onValueChange={(v) => patchDeal({ stage: v })}
              >
                <SelectTrigger className="mt-1 bg-white/[0.04] border-white/[0.06] text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 ring-white/[0.08] text-white">
                  {STAGES.map((s) => (
                    <SelectItem key={s} value={s} className="text-slate-300">
                      {s.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider">Value (INR)</label>
              <Input
                type="number"
                defaultValue={deal.valueINR}
                onBlur={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v !== deal.valueINR) patchDeal({ valueINR: v });
                }}
                disabled={saving}
                className="mt-1 bg-white/[0.04] border-white/[0.06] text-slate-200"
              />
              <p className="text-[10px] text-slate-600 mt-1">{formatINR(deal.valueINR)}</p>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider">Probability (%)</label>
              <Input
                type="number"
                min={0}
                max={100}
                defaultValue={deal.probability}
                onBlur={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v !== deal.probability) patchDeal({ probability: v });
                }}
                disabled={saving}
                className="mt-1 bg-white/[0.04] border-white/[0.06] text-slate-200"
              />
            </div>

            <div className="pt-2 border-t border-white/[0.04]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Weighted value</span>
                <span className="text-emerald-400 font-semibold tabular-nums">
                  {formatINR(deal.weightedValue)}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider">Expected Close</label>
              <Input
                type="date"
                defaultValue={deal.expectedCloseDate?.slice(0, 10) || ""}
                onBlur={(e) => {
                  if (e.target.value !== deal.expectedCloseDate?.slice(0, 10))
                    patchDeal({ expectedCloseDate: e.target.value || null });
                }}
                disabled={saving}
                className="mt-1 bg-white/[0.04] border-white/[0.06] text-slate-200"
              />
            </div>

            {deal.primaryLead && (
              <div className="pt-3 border-t border-white/[0.04]">
                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 block">
                  Primary Lead
                </label>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-slate-500" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-200 truncate">{deal.primaryLead.email}</div>
                    <div className="text-[10px] text-slate-500">
                      Score: {deal.primaryLead.totalScore} · {deal.primaryLead.stage}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* MIDDLE: Timeline */}
        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span>Activity Timeline</span>
              <span className="text-xs text-slate-500">{timeline.length} events</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
            {timeline.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No activity yet.</p>
            ) : (
              timeline.map((item) => (
                <div
                  key={`${item.kind}-${item.id}`}
                  className="flex gap-3 border-b border-white/[0.04] pb-3 last:border-0"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      item.kind === "note" ? "bg-amber-400" : "bg-teal-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    {item.kind === "note" ? (
                      <>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Note</div>
                        <div className="text-sm text-slate-300 mt-1">{item.content}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-slate-400">
                          {item.type.replace(/_/g, " ").toLowerCase()}
                        </div>
                        {item.metadata != null && (
                          <pre className="text-[10px] text-slate-500 mt-1 max-w-full overflow-x-auto">
                            {JSON.stringify(item.metadata, null, 2)}
                          </pre>
                        )}
                      </>
                    )}
                    <div className="text-[10px] text-slate-600 mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Proposals list */}
      {deal.proposals.length > 0 && (
        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText size={14} className="text-teal-400" />
              Proposals ({deal.proposals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {deal.proposals.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
                onClick={() => {
                  setActiveProposal(p);
                  setProposalOpen(true);
                }}
              >
                <div>
                  <div className="text-sm text-slate-200">Version {p.version}</div>
                  <div className="text-[10px] text-slate-500">
                    Generated {new Date(p.createdAt).toLocaleString()}
                  </div>
                </div>
                <FileText size={14} className="text-slate-500" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add Note dialog */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="bg-slate-900 ring-white/[0.08] text-white">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Call notes, meeting summary, next actions..."
            className="min-h-[150px] bg-white/[0.04] border-white/[0.06] text-slate-200"
          />
          <DialogFooter>
            <DialogClose render={<Button variant="outline" className="border-white/[0.06] text-slate-400" />}>
              Cancel
            </DialogClose>
            <Button onClick={addNote} className="bg-teal-600 hover:bg-teal-500">
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Proposal viewer */}
      <Dialog open={proposalOpen} onOpenChange={setProposalOpen}>
        <DialogContent className="bg-slate-900 ring-white/[0.08] text-white max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Proposal {activeProposal ? `v${activeProposal.version}` : ""}
            </DialogTitle>
          </DialogHeader>
          {activeProposal && (
            <>
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                {activeProposal.content}
              </pre>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!activeProposal) return;
                    navigator.clipboard.writeText(activeProposal.content);
                    toast.success("Copied to clipboard");
                  }}
                  className="border-white/[0.06]"
                >
                  Copy
                </Button>
                <DialogClose render={<Button className="bg-teal-600 hover:bg-teal-500" />}>Close</DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
