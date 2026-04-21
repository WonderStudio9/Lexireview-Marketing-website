"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Hexagon, Loader2, Eye, EyeOff, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/forge";
  const [username, setUsername] = React.useState("admin");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push(redirect);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid username or password");
      }
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-500/15">
            <Hexagon className="w-5 h-5 text-teal-400" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">LexiForge</span>
        </div>

        <Card className="bg-white/[0.03] border-0 ring-1 ring-white/[0.06]">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-base">Welcome back</CardTitle>
            <CardDescription className="text-slate-500 text-sm">
              Sign in to the LexiForge dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Username</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
                    placeholder="admin"
                    className="pl-9 bg-white/[0.04] border-white/[0.06] text-white placeholder:text-slate-600 focus-visible:border-teal-500/50 focus-visible:ring-teal-500/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter password"
                    className="pr-10 bg-white/[0.04] border-white/[0.06] text-white placeholder:text-slate-600 focus-visible:border-teal-500/50 focus-visible:ring-teal-500/20"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading || !username || !password}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-40"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-600 mt-6">
          LexiForge AI Content Pipeline
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={null}>
      <LoginForm />
    </React.Suspense>
  );
}
