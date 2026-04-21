"use client";

import * as React from "react";
import { Loader2, Send, Mail, MessageSquare, MessageCircle, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Campaign {
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

export default function CampaignsPage() {
  const [loading, setLoading] = React.useState(true);
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);

  React.useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((data) => {
        setCampaigns(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500">{campaigns.length} campaigns</span>
      </div>

      {campaigns.length === 0 ? (
        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
          <CardContent className="py-12 text-center text-slate-500">
            <Send size={32} className="mx-auto mb-3 text-slate-600" />
            <p className="text-sm">No campaigns yet.</p>
            <p className="text-xs mt-1">
              Run <code className="text-teal-400">npx tsx prisma/seed-outreach-campaigns.ts</code>{" "}
              on the VPS to seed 4 starter campaigns.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {campaigns.map((c) => {
            const Icon = channelIcons[c.channel] || Send;
            const replyRate =
              c.sentCount > 0 ? ((c.repliedCount / c.sentCount) * 100).toFixed(1) : "0";
            return (
              <Card
                key={c.id}
                className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white hover:ring-white/[0.12] transition-all"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={16} className="text-teal-400" />
                      <CardTitle className="text-sm font-semibold text-white leading-snug">
                        {c.name}
                      </CardTitle>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[c.status]}`}
                    >
                      {c.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">
                    Targeting: {c.targetICP.replace(/_/g, " ")}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/[0.02] rounded-lg p-2">
                      <div className="text-[10px] text-slate-500">Prospects</div>
                      <div className="text-slate-200 tabular-nums">{c._count.prospects}</div>
                    </div>
                    <div className="bg-white/[0.02] rounded-lg p-2">
                      <div className="text-[10px] text-slate-500">Sent</div>
                      <div className="text-slate-200 tabular-nums">{c.sentCount}</div>
                    </div>
                    <div className="bg-white/[0.02] rounded-lg p-2">
                      <div className="text-[10px] text-slate-500">Replied</div>
                      <div className="text-emerald-400 tabular-nums">
                        {c.repliedCount} <span className="text-[9px] text-slate-500">({replyRate}%)</span>
                      </div>
                    </div>
                    <div className="bg-white/[0.02] rounded-lg p-2">
                      <div className="text-[10px] text-slate-500">Meetings</div>
                      <div className="text-teal-400 tabular-nums">{c.meetingsBooked}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
