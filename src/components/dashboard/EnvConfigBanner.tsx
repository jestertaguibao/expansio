'use client';

import React, { useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { Sparkles, Terminal, ChevronDown, ChevronUp, Check, Copy } from 'lucide-react';

export default function EnvConfigBanner() {
  const configured = isSupabaseConfigured();
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (configured) return null;

  const envSnippet = `# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-amber-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Interactive Sandbox & Demo Mode Active</h4>
            <p className="text-xs text-amber-300/80">
              You can test inline editing, row creation, and metrics right now. To connect your live Supabase database, paste your credentials into <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-amber-400 font-mono">.env.local</code>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xs text-amber-300 hover:text-white p-1 rounded transition-colors"
        >
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-3 pt-3 border-t border-amber-500/20 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[11px] text-zinc-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Required variables in .env.local:
            </span>
            <button
              onClick={copyToClipboard}
              className="text-[11px] flex items-center gap-1 text-amber-300 hover:text-white"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 font-mono text-[11px] text-amber-200 overflow-x-auto">
            {envSnippet}
          </pre>
        </div>
      )}
    </div>
  );
}
