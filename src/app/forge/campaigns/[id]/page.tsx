"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  Send,
  Mail,
  MessageSquare,
  MessageCircle,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/forge/stats-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface CampaignDetail {
  id: string;
  name: string;
  description?: string | null;
  targetICP: string;
  channel: string;
  status: string;
  targetCount: number;
  sentCount: number;
  repliedCount: number;
  positiveReplies: number;
  meetingsBooked: number;
  dealsCreated: number;
  steps: Array<{
    id: string;
    order: number;
    dayOffset: number;
    channel: string;
    subject?: string | null;
    bodyTemplate: string;
  }>;
  prospects: Array<{
    id: string;
    status: string;
    currentStep: number;
    lastTouchAt?: string | null;
    nextTouchAt?: string | null;
    contact: {
      id: string;
      firstName: string;
      lastName?: string | null;
      email?: string | null;
      account: { name: string };
    };
  }>;
  _count: { prospects: number };
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-slate-500/15 text-slate-400",
  ACTIVE: "bg-emerald-500/15 text-emerald-400",
  PAUSED: "bg-amber-500/15 text-amber-400",
  COMPLETED: "bg-blue-500/15 text-blue-400",
};

const channelIcons: Record<string, React.ElementType> = {
  EMAIL: Mail,
  LINKEDIN: MessageSquare,
  WHATSAPP: MessageCircle,
  MULTI_TOUCH: Layers,
};

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [campaign, setCampaign] = React.useState<CampaignDetail | null>(null);
  const [changing, setChanging] = React.useState(false);
  const [expandedStep, setExpandedStep] = React.useState<string | null>(null);

  const fetchCampaign = React.useCallback(() => {
    fetch(`/api/campaigns/${id}`)
      .then((r) => r.json())
      .then((c) => {
        if (c.error) throw new Error(c.error);
        setCampaign(c);
        setLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setLoading(false);
      });
  }, [id]);

  React.useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  async function updateStatus(status: string) {
    setChanging(true);
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Campaign ${status.toLowerCase()}`);
      fetchCampaign();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setChanging(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
      </div>
    );

  if (!campaign) return <div className="text-slate-400 p-4">Campaign not found</div>;

  const Icon = channelIcons[campaign.channel] || Send;
  const replyRate =
    campaign.sentCount > 0 ? ((campaign.repliedCount / campaign.sentCount) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <button
          onClick={() => router.push("/forge/campaigns")}
          className="hover:text-slate-300 inline-flex items-center gap-1"
        >
          <ArrowLeft size={12} /> All Campaigns
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Icon size={24} className="text-teal-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                {campaign.channel}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                {campaign.targetICP.replace(/_/g, " ")}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[campaign.status]}`}>
                {campaign.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {campaign.status === "DRAFT" && (
            <Button
              size="sm"
              onClick={() => updateStatus("ACTIVE")}
              disabled={changing}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <Play size={14} /> Activate
            </Button>
          )}
          {campaign.status === "ACTIVE" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateStatus("PAUSED")}
                disabled={changing}
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              >
                <Pause size={14} /> Pause
              </Button>
              <Button
                size="sm"
                onClick={() => updateStatus("COMPLETED")}
                disabled={changing}
                className="bg-blue-600 hover:bg-blue-500 text-white"
              >
                <CheckCircle2 size={14} /> Complete
              </Button>
            </>
          )}
          {campaign.status === "PAUSED" && (
            <Button
              size="sm"
              onClick={() => updateStatus("ACTIVE")}
              disabled={changing}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <Play size={14} /> Resume
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatsCard title="Sent" value={campaign.sentCount} icon={Send} />
        <StatsCard
          title="Replied"
          value={campaign.repliedCount}
          icon={Mail}
          subtitle={`${replyRate}% reply rate`}
        />
        <StatsCard title="Meetings Booked" value={campaign.meetingsBooked} icon={Send} />
        <StatsCard title="Deals Created" value={campaign.dealsCreated} icon={Send} />
      </div>

      <Tabs defaultValue="steps" className="space-y-4">
        <TabsList className="bg-white/[0.03]">
          <TabsTrigger value="steps">Steps ({campaign.steps.length})</TabsTrigger>
          <TabsTrigger value="prospects">Prospects ({campaign._count.prospects})</TabsTrigger>
        </TabsList>

        <TabsContent value="steps">
          <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
            <CardContent className="pt-4 space-y-2">
              {campaign.steps.length === 0 ? (
                <p className="text-center py-8 text-slate-500 text-sm">No steps defined.</p>
              ) : (
                campaign.steps.map((s) => {
                  const StepIcon = channelIcons[s.channel] || Mail;
                  const isExpanded = expandedStep === s.id;
                  return (
                    <div
                      key={s.id}
                      className="rounded-lg bg-white/[0.02] ring-1 ring-white/[0.04] overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedStep(isExpanded ? null : s.id)}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/[0.02]"
                      >
                        <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold flex items-center justify-center">
                          {s.order}
                        </div>
                        <StepIcon size={14} className="text-slate-500" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-slate-200">
                            {s.subject || `${s.channel} touch`}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Day {s.dayOffset} · {s.channel}
                          </div>
                        </div>
                        <span className="text-xs text-slate-500">
                          {isExpanded ? "▲" : "▼"}
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="p-3 border-t border-white/[0.04]">
                          <pre className="text-[11px] text-slate-400 whitespace-pre-wrap font-mono leading-relaxed max-h-72 overflow-y-auto">
                            {s.bodyTemplate}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prospects">
          <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-slate-400 text-xs">Contact</TableHead>
                    <TableHead className="text-slate-400 text-xs">Account</TableHead>
                    <TableHead className="text-slate-400 text-xs">Step</TableHead>
                    <TableHead className="text-slate-400 text-xs">Status</TableHead>
                    <TableHead className="text-slate-400 text-xs">Last Touch</TableHead>
                    <TableHead className="text-slate-400 text-xs">Next Touch</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaign.prospects.length === 0 ? (
                    <TableRow className="border-white/[0.04]">
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        No prospects enrolled yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    campaign.prospects.map((p) => (
                      <TableRow key={p.id} className="border-white/[0.04] hover:bg-white/[0.02]">
                        <TableCell>
                          <Link
                            href={`/forge/contacts/${p.contact.id}`}
                            className="text-sm text-slate-200 hover:text-teal-400"
                          >
                            {p.contact.firstName} {p.contact.lastName || ""}
                          </Link>
                          {p.contact.email && (
                            <div className="text-[10px] text-slate-500 font-mono">{p.contact.email}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-400">{p.contact.account.name}</TableCell>
                        <TableCell className="text-xs text-slate-500 text-center">{p.currentStep}</TableCell>
                        <TableCell className="text-xs text-slate-400">{p.status}</TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {p.lastTouchAt ? new Date(p.lastTouchAt).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {p.nextTouchAt ? new Date(p.nextTouchAt).toLocaleDateString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
