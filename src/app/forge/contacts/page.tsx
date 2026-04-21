"use client";

import * as React from "react";
import { Loader2, Contact } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatsCard } from "@/components/forge/stats-card";

interface ContactRow {
  id: string;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  title?: string | null;
  seniority?: string | null;
  department?: string | null;
  linkedinUrl?: string | null;
  account: { name: string; domain?: string | null };
}

export default function ContactsPage() {
  const [loading, setLoading] = React.useState(true);
  const [contacts, setContacts] = React.useState<ContactRow[]>([]);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");

  const fetchContacts = React.useCallback((q: string) => {
    const url = q
      ? `/api/contacts?limit=100&q=${encodeURIComponent(q)}`
      : "/api/contacts?limit=100";
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setContacts(d.contacts);
        setTotal(d.total);
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    fetchContacts("");
  }, [fetchContacts]);

  React.useEffect(() => {
    const t = setTimeout(() => fetchContacts(search), 300);
    return () => clearTimeout(t);
  }, [search, fetchContacts]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Total Contacts" value={total} icon={Contact} />
      </div>

      <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06] text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-sm font-semibold text-white">Contacts</CardTitle>
            <Input
              placeholder="Search name, email, title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 h-8 bg-white/[0.04] border-white/[0.06] text-sm text-slate-300 placeholder:text-slate-500"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs">Name</TableHead>
                <TableHead className="text-slate-400 text-xs">Title</TableHead>
                <TableHead className="text-slate-400 text-xs">Email</TableHead>
                <TableHead className="text-slate-400 text-xs">Seniority</TableHead>
                <TableHead className="text-slate-400 text-xs">Account</TableHead>
                <TableHead className="text-slate-400 text-xs">LinkedIn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.length === 0 ? (
                <TableRow className="border-white/[0.04]">
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No contacts yet. Enrich accounts or manually add contacts to populate.
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((c) => (
                  <TableRow key={c.id} className="border-white/[0.04] hover:bg-white/[0.02]">
                    <TableCell className="text-sm text-slate-200 font-medium">
                      {c.firstName} {c.lastName || ""}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">{c.title || "—"}</TableCell>
                    <TableCell className="text-xs text-slate-300 font-mono">{c.email || "—"}</TableCell>
                    <TableCell className="text-xs text-slate-400">{c.seniority || "—"}</TableCell>
                    <TableCell className="text-xs text-slate-300">{c.account.name}</TableCell>
                    <TableCell>
                      {c.linkedinUrl ? (
                        <a
                          href={c.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-400 hover:text-blue-300"
                        >
                          View ↗
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-600">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
