"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Mail,
  Phone,
  ExternalLink,
  Building2,
  User,
  Briefcase,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface ContactDetail {
  id: string;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
  title?: string | null;
  seniority?: string | null;
  department?: string | null;
  account: {
    id: string;
    name: string;
    tier: string;
    icp: string;
    industry?: string | null;
    domain?: string | null;
  };
  lead?: {
    id: string;
    email: string;
    stage: string;
    totalScore: number;
    activities: Array<{ id: string; type: string; metadata?: unknown; createdAt: string }>;
  } | null;
  outreachProspects: Array<{
    id: string;
    status: string;
    currentStep: number;
    lastTouchAt?: string | null;
    nextTouchAt?: string | null;
    campaign: { name: string; status: string; channel: string };
  }>;
}

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [contact, setContact] = React.useState<ContactDetail | null>(null);

  React.useEffect(() => {
    fetch(`/api/contacts/${id}`)
      .then((r) => r.json())
      .then((c) => {
        if (c.error) throw new Error(c.error);
        setContact(c);
        setLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
      </div>
    );

  if (!contact) return <div className="text-slate-400 p-4">Contact not found</div>;

  const initials = (contact.firstName[0] + (contact.lastName?.[0] || "")).toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <button
          onClick={() => router.push("/forge/contacts")}
          className="hover:text-slate-300 inline-flex items-center gap-1"
        >
          <ArrowLeft size={12} /> All Contacts
        </button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center text-xl font-bold text-teal-400">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {contact.firstName} {contact.lastName || ""}
          </h1>
          {contact.title && <p className="text-sm text-slate-400">{contact.title}</p>}
          {contact.seniority && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/15 text-indigo-400 mt-1">
              {contact.seniority}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Contact info */}
        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {contact.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-slate-500" />
                <a href={`mailto:${contact.email}`} className="text-slate-300 hover:text-teal-400">
                  {contact.email}
                </a>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-slate-500" />
                <a href={`tel:${contact.phone}`} className="text-slate-300 hover:text-teal-400">
                  {contact.phone}
                </a>
              </div>
            )}
            {contact.linkedinUrl && (
              <div className="flex items-center gap-2">
                <ExternalLink size={14} className="text-slate-500" />
                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  LinkedIn profile ↗
                </a>
              </div>
            )}
            {contact.department && (
              <div className="flex items-center gap-2">
                <Briefcase size={14} className="text-slate-500" />
                <span className="text-slate-400">{contact.department}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Link
              href={`/forge/accounts/${contact.account.id}`}
              className="flex items-center gap-2 hover:text-teal-400"
            >
              <Building2 size={14} className="text-slate-500" />
              <span className="text-slate-200 font-medium">{contact.account.name}</span>
            </Link>
            {contact.account.domain && (
              <div className="text-xs text-slate-500 font-mono pl-6">{contact.account.domain}</div>
            )}
            <div className="flex gap-2 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/15 text-blue-400">
                {contact.account.tier.replace(/_/g, " ")}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/15 text-slate-400">
                {contact.account.icp.replace(/_/g, " ")}
              </span>
            </div>
            {contact.account.industry && (
              <div className="text-xs text-slate-500 mt-1">{contact.account.industry}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Linked lead */}
      {contact.lead && (
        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User size={14} className="text-teal-400" /> Linked Lead
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="text-sm text-slate-200">{contact.lead.email}</div>
                <div className="text-xs text-slate-500">
                  Stage: {contact.lead.stage} · Score: {contact.lead.totalScore}
                </div>
              </div>
            </div>
            {contact.lead.activities.length > 0 && (
              <>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">
                  Recent Activity
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {contact.lead.activities.map((a) => (
                    <div
                      key={a.id}
                      className="flex gap-2 text-xs border-b border-white/[0.04] pb-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-slate-300">
                          {a.type.replace(/_/g, " ").toLowerCase()}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {new Date(a.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Outreach campaigns enrolled */}
      {contact.outreachProspects.length > 0 && (
        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Outreach History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="text-slate-400 text-xs">Campaign</TableHead>
                  <TableHead className="text-slate-400 text-xs">Channel</TableHead>
                  <TableHead className="text-slate-400 text-xs">Step</TableHead>
                  <TableHead className="text-slate-400 text-xs">Status</TableHead>
                  <TableHead className="text-slate-400 text-xs">Last Touch</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contact.outreachProspects.map((p) => (
                  <TableRow key={p.id} className="border-white/[0.04] hover:bg-white/[0.02]">
                    <TableCell className="text-sm text-slate-200">{p.campaign.name}</TableCell>
                    <TableCell className="text-xs text-slate-400">{p.campaign.channel}</TableCell>
                    <TableCell className="text-xs text-slate-500 text-center">{p.currentStep}</TableCell>
                    <TableCell className="text-xs text-slate-400">{p.status}</TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {p.lastTouchAt ? new Date(p.lastTouchAt).toLocaleDateString() : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
