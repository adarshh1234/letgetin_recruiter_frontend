"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Gavel, Loader2 } from "lucide-react";
import { institutionService } from "@/features/institution/services/institutionService";
import { InstitutionPolicy } from "@/features/institution/types";

export default function InstitutionPolicyPage() {
  const [policy, setPolicy] = useState<InstitutionPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    institutionService
      .getPolicy()
      .then(setPolicy)
      .catch(() => setError("Unable to load policy settings. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policy) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await institutionService.updatePolicy({
        oneStudentOneJob: policy.oneStudentOneJob,
        dreamOfferOption: policy.dreamOfferOption,
        banPeriodDays: policy.banPeriodDays,
        additionalRules: policy.additionalRules,
      });
      setPolicy(updated);
      setSuccess(true);
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || "Failed to save policies.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary-glow" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink tracking-tight">Policy Engine</h1>
        <p className="text-ink-soft mt-1 text-sm">Configure placement rules for your institution.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Policies saved.
        </div>
      )}
      {error && <div className="bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive">{error}</div>}

      {policy && (
        <form onSubmit={handleSave} className="bg-surface border border-border rounded-2xl shadow-elegant p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between gap-4 py-2">
            <div>
              <div className="text-sm font-semibold text-ink">One Student, One Job</div>
              <p className="text-xs text-ink-soft mt-0.5">Limit each student to a single active application at a time.</p>
            </div>
            <button
              type="button"
              onClick={() => setPolicy({ ...policy, oneStudentOneJob: !policy.oneStudentOneJob })}
              className={`shrink-0 w-11 h-6 rounded-full transition-colors relative ${
                policy.oneStudentOneJob ? "bg-primary-glow" : "bg-surface-alt border border-border"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  policy.oneStudentOneJob ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 py-2 border-t border-border pt-5">
            <div>
              <div className="text-sm font-semibold text-ink">Dream Offer Option</div>
              <p className="text-xs text-ink-soft mt-0.5">Allow students to apply for one additional "dream" role after placement.</p>
            </div>
            <button
              type="button"
              onClick={() => setPolicy({ ...policy, dreamOfferOption: !policy.dreamOfferOption })}
              className={`shrink-0 w-11 h-6 rounded-full transition-colors relative ${
                policy.dreamOfferOption ? "bg-primary-glow" : "bg-surface-alt border border-border"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  policy.dreamOfferOption ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <label className="block border-t border-border pt-5">
            <span className="block text-sm font-medium text-ink mb-1.5">Ban Period After Rejection (days)</span>
            <input
              type="number"
              min={0}
              max={365}
              className="input-base max-w-[160px]"
              value={policy.banPeriodDays}
              onChange={(e) => setPolicy({ ...policy, banPeriodDays: Number(e.target.value) })}
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-ink mb-1.5">Additional Rules</span>
            <textarea
              className="input-base min-h-[90px]"
              placeholder="e.g. Students with backlogs may not apply to top-tier companies."
              value={policy.additionalRules || ""}
              onChange={(e) => setPolicy({ ...policy, additionalRules: e.target.value })}
            />
          </label>

          <p className="text-[11px] text-ink-soft flex items-start gap-1.5">
            <Gavel className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            These settings are saved for reference and are not yet enforced automatically in the application flow.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 text-xs font-semibold bg-gradient-brand text-primary-foreground px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Save Policies
          </button>
        </form>
      )}
    </div>
  );
}
