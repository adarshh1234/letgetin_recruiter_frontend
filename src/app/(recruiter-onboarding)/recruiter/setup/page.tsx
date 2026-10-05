"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, GraduationCap, Rocket, Loader2, Sparkles, type LucideIcon } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useRecruiterStore } from "@/features/recruiter/store/useRecruiterStore";
import { recruiterService } from "@/features/recruiter/services/recruiterService";
import { EntityType, OrgAutofillFields } from "@/features/recruiter/types";
import { AIWritingAssistant } from "@/features/aiWriting/components/AIWritingAssistant";
import { AIWritingContext } from "@/features/aiWriting/types";
import { UrlAutoSuggestInput } from "@/components/common/UrlAutoSuggestInput";

const ENTITY_TO_AI_CONTEXT: Record<EntityType, AIWritingContext> = {
  company: "company-about",
  startup: "startup-about",
  institution: "institution-about",
};

const AUTOFILLABLE_FIELDS: (keyof OrgAutofillFields)[] = [
  "name",
  "address",
  "headquarters",
  "orgType",
  "employees",
  "valuation",
  "revenue",
  "ceoName",
  "ceoEmail",
  "founded",
  "industry",
  "registrationId",
  "bio",
  "description",
  "whyJoinUs",
  "website",
];

const ENTITY_OPTIONS: { value: EntityType; label: string; icon: LucideIcon }[] = [
  { value: "company", label: "Company", icon: Building2 },
  { value: "institution", label: "Institution", icon: GraduationCap },
  { value: "startup", label: "Startup", icon: Rocket },
];

export default function RecruiterSetupPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { orgFormMeta, loadOrgProfile, loadOrgFormMeta, saveOrgProfile, error, clearError } = useRecruiterStore();

  const [entity, setEntity] = useState<EntityType>(user?.entityType || "company");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [orgType, setOrgType] = useState("");
  const [industry, setIndustry] = useState("");
  const [employees, setEmployees] = useState("");
  const [valuation, setValuation] = useState("");
  const [revenue, setRevenue] = useState("");
  const [ceoName, setCeoName] = useState("");
  const [ceoEmail, setCeoEmail] = useState("");
  const [founded, setFounded] = useState("");
  const [website, setWebsite] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [bio, setBio] = useState("");
  const [whyJoinUs, setWhyJoinUs] = useState("");
  // Startup Specific States
  const [founders, setFounders] = useState("");
  const [foundingTheme, setFoundingTheme] = useState("");
  const [sector, setSector] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [productLink, setProductLink] = useState("");
  const [fundraiser, setFundraiser] = useState("");
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const whyJoinUsRef = useRef<HTMLTextAreaElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [autofillUrl, setAutofillUrl] = useState("");
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [autofilledKeys, setAutofilledKeys] = useState<Set<string>>(new Set());

  const fieldSetters: Record<keyof OrgAutofillFields, (v: string) => void> = {
    name: setName,
    address: setAddress,
    headquarters: setHeadquarters,
    orgType: setOrgType,
    industry: setIndustry,
    employees: setEmployees,
    valuation: setValuation,
    revenue: setRevenue,
    ceoName: setCeoName,
    ceoEmail: setCeoEmail,
    founded: setFounded,
    website: setWebsite,
    registrationId: setRegistrationId,
    bio: setBio,
    description: setBio,
    whyJoinUs: setWhyJoinUs,
    founders: setFounders,
    foundingTheme: setFoundingTheme,
    sector: setSector,
    productDetails: setProductDetails,
    productLink: setProductLink,
    fundraiser: setFundraiser,
  };
  const fieldValues: Record<keyof OrgAutofillFields, string> = {
    name,
    address,
    headquarters,
    orgType,
    industry,
    employees,
    valuation,
    revenue,
    ceoName,
    ceoEmail,
    founded,
    website,
    registrationId,
    bio,
    description: bio,
    whyJoinUs,
    founders,
    foundingTheme,
    sector,
    productDetails,
    productLink,
    fundraiser,
  };

  const meta = orgFormMeta[entity];

  const handleAutofill = async () => {
    clearError();
    setLocalError(null);

    const trimmedUrl = autofillUrl.trim();
    if (!trimmedUrl || !/^https?:\/\//i.test(trimmedUrl)) {
      setLocalError("Please enter a valid website URL.");
      return;
    }

    setIsAutofilling(true);
    try {
      const fields = await recruiterService.autofillOrgProfile(trimmedUrl, entity);
      const appliedKeys = new Set<string>();

      for (const key of AUTOFILLABLE_FIELDS) {
        const aiValue = fields[key];
        // Existing user-entered values always win — only fill fields that are still empty.
        if (aiValue && !fieldValues[key]?.trim()) {
          fieldSetters[key]?.(aiValue);
          appliedKeys.add(key);
        }
      }

      if (!website.trim()) {
        setWebsite(trimmedUrl);
      }

      setAutofilledKeys(appliedKeys);
      if (appliedKeys.size === 0) {
        setLocalError("No information could be confidently extracted from this page. Please fill in the details manually.");
      }
    } catch (err: unknown) {
      setLocalError(
        (err as { message?: string })?.message || "Unable to access this website. Please enter the details manually."
      );
    } finally {
      setIsAutofilling(false);
    }
  };

  useEffect(() => {
    loadOrgFormMeta(entity).catch(() => {});
  }, [entity, loadOrgFormMeta]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUrl = sessionStorage.getItem("recruiter_initial_url");
      if (savedUrl) {
        setAutofillUrl((prev) => prev || savedUrl);
        setWebsite((prev) => prev || savedUrl);
      }
    }

    loadOrgProfile()
      .then((profile) => {
        if (profile) {
          setEntity(profile.entity);
          setName(profile.name || "");
          setAddress(profile.address || "");
          setHeadquarters(profile.headquarters || profile.address || "");
          setOrgType(profile.orgType || "");
          setIndustry(profile.industry || "");
          setEmployees(profile.employees || "");
          setValuation(profile.valuation || "");
          setRevenue(profile.revenue || "");
          setCeoName(profile.ceoName || "");
          setCeoEmail(profile.ceoEmail || "");
          setFounded(profile.founded || "");
          setWebsite(profile.website || "");
          setRegistrationId(profile.registrationId || "");
          setBio(profile.bio || profile.description || "");
          setWhyJoinUs(profile.whyJoinUs || "");
          setFounders(profile.founders || "");
          setFoundingTheme(profile.foundingTheme || "");
          setSector(profile.sector || "");
          setProductDetails(profile.productDetails || "");
          setProductLink(profile.productLink || "");
          setFundraiser(profile.fundraiser || "");
        }
      })
      .finally(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayError = localError || error;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!name.trim()) {
      setLocalError(`${meta?.label || "Organization"} name is required.`);
      return;
    }
    if (ceoEmail.trim() && !/^\S+@\S+\.\S+$/.test(ceoEmail.trim())) {
      setLocalError("Enter a valid contact email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await saveOrgProfile({
        entity,
        name: name.trim(),
        address: address.trim() || headquarters.trim(),
        headquarters: headquarters.trim() || address.trim(),
        orgType,
        industry: industry.trim(),
        employees,
        valuation: valuation.trim(),
        revenue: revenue.trim(),
        ceoName: ceoName.trim(),
        ceoEmail: ceoEmail.trim(),
        founded: founded.trim(),
        website: website.trim(),
        registrationId: registrationId.trim(),
        bio: bio.trim(),
        description: bio.trim(),
        whyJoinUs: whyJoinUs.trim(),
        founders: founders.trim(),
        foundingTheme: foundingTheme.trim(),
        sector: sector.trim(),
        productDetails: productDetails.trim(),
        productLink: productLink.trim(),
        fundraiser: fundraiser.trim(),
      });
      router.replace("/recruiter/dashboard");
    } catch (err: unknown) {
      setLocalError((err as { message?: string })?.message || "Failed to save organization profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-ink-soft">
        <Loader2 className="w-8 h-8 animate-spin text-primary-glow mb-4" />
        <p className="text-sm font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
            Set up your <span className="text-gradient-brand">{meta?.label || "Organization"}</span>
          </h1>
          <p className="text-ink-soft mt-2 text-sm">
            Tell us about your {meta?.label.toLowerCase() || "organization"} so candidates know who is hiring.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 sm:p-8">
          {/* Entity Selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
              Organization Type
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-background rounded-xl border border-border">
              {ENTITY_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setEntity(value)}
                  className={`py-2 text-xs font-semibold rounded-lg transition flex flex-col items-center justify-center gap-1 ${
                    entity === value
                      ? "bg-white text-ink shadow-sm border border-border font-bold"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Autofill with AI */}
          <div className="mb-6 p-4 rounded-xl border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Autofill with AI</span>
            </div>
            <p className="text-xs text-ink-soft mb-3">
              Paste your {meta?.label.toLowerCase() || "organization"}&apos;s website or about page URL and we&apos;ll
              suggest values for the fields below. You can review and edit everything before saving.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <div className="flex-1 w-full">
                <UrlAutoSuggestInput
                  value={autofillUrl}
                  onChange={setAutofillUrl}
                  placeholder={meta?.urlPlaceholder || "https://example.com/about"}
                  disabled={isAutofilling}
                />
              </div>
              <button
                type="button"
                onClick={handleAutofill}
                disabled={isAutofilling || !autofillUrl.trim()}
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 text-xs font-semibold border border-primary/30 text-primary-glow bg-white hover:bg-primary/10 px-4 py-2.5 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isAutofilling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing website...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Autofill with AI
                  </>
                )}
              </button>
            </div>
          </div>

          {autofilledKeys.size > 0 && (
            <div className="mb-4 flex items-center gap-2 text-xs font-medium text-primary-glow bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              AI-filled fields — please review before submitting.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label={meta?.label ? `${meta.label} name` : "Organization name"}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={meta?.urlPlaceholder ? `e.g. ${meta.label}` : "Organization name"}
                className="input-base"
                required
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Headquarters">
                <input
                  type="text"
                  value={headquarters}
                  onChange={(e) => setHeadquarters(e.target.value)}
                  placeholder="e.g. San Francisco, CA, USA"
                  className="input-base"
                />
              </Field>
              <Field label="Industry">
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Software, FinTech, Healthcare"
                  className="input-base"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={meta?.typeLabel || "Type"}>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="input-base"
                >
                  <option value="">Select...</option>
                  {meta?.typeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={meta?.sizeLabel || "Company Size"}>
                <select
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  className="input-base"
                >
                  <option value="">Select realistic employee range...</option>
                  {meta?.sizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={meta?.leaderLabel || "CEO / Leader"}>
                <input
                  type="text"
                  value={ceoName}
                  onChange={(e) => setCeoName(e.target.value)}
                  placeholder="Full name"
                  className="input-base"
                />
              </Field>
              <Field label="Contact email">
                <input
                  type="email"
                  value={ceoEmail}
                  onChange={(e) => setCeoEmail(e.target.value)}
                  placeholder="contact@example.com"
                  className="input-base"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Founded">
                <input
                  type="text"
                  value={founded}
                  onChange={(e) => setFounded(e.target.value)}
                  placeholder="e.g. 2018"
                  className="input-base"
                />
              </Field>
              <Field label={meta?.valuationLabel || "Revenue / Valuation"}>
                <input
                  type="text"
                  value={revenue || valuation}
                  onChange={(e) => {
                    setRevenue(e.target.value);
                    setValuation(e.target.value);
                  }}
                  placeholder="e.g. $10M - $50M"
                  className="input-base"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company Website URL (with auto-suggest)">
                <UrlAutoSuggestInput
                  value={website}
                  onChange={setWebsite}
                  placeholder={meta?.urlPlaceholder || "https://example.com"}
                />
              </Field>
              <Field label={meta?.regLabel || "Registration ID"}>
                <input
                  type="text"
                  value={registrationId}
                  onChange={(e) => setRegistrationId(e.target.value)}
                  placeholder="Registration / license number"
                  className="input-base"
                />
              </Field>
            </div>

            {/* Startup Specific Fields */}
            {entity === "startup" && (
              <div className="p-4 sm:p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary-glow flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Startup Venture & Product Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Founders & Co-Founders">
                    <input
                      type="text"
                      value={founders}
                      onChange={(e) => setFounders(e.target.value)}
                      placeholder="e.g. Maya Lin, Alex Chen"
                      className="input-base"
                    />
                  </Field>
                  <Field label="Sector (Edtech, Fintech, etc.)">
                    <input
                      type="text"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      placeholder="e.g. Edtech, Healthtech, AI"
                      className="input-base"
                    />
                  </Field>
                  <Field label="Fundraiser Status">
                    <input
                      type="text"
                      value={fundraiser}
                      onChange={(e) => setFundraiser(e.target.value)}
                      placeholder="e.g. Pre-Seed, Seed, Series A, Bootstrapped"
                      className="input-base"
                    />
                  </Field>
                </div>
                <Field label="Founding Theme / Core Problem">
                  <textarea
                    rows={2}
                    value={foundingTheme}
                    onChange={(e) => setFoundingTheme(e.target.value)}
                    placeholder="What core problem does your startup solve and why was it founded?"
                    className="input-base"
                  />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Product Details">
                    <textarea
                      rows={2}
                      value={productDetails}
                      onChange={(e) => setProductDetails(e.target.value)}
                      placeholder="Brief description of your product or MVP..."
                      className="input-base"
                    />
                  </Field>
                  <Field label="Product Link / Live Demo URL">
                    <input
                      type="text"
                      value={productLink}
                      onChange={(e) => setProductLink(e.target.value)}
                      placeholder="https://yourproduct.com"
                      className="input-base"
                    />
                  </Field>
                </div>
              </div>
            )}

            <Field label="About the Company Description">
              <textarea
                ref={bioRef}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={`A comprehensive description of your ${meta?.label.toLowerCase() || "organization"}`}
                className="input-base min-h-[96px] resize-y"
              />
              {bio.trim().length > 0 && (
                <div className="mt-2">
                  <AIWritingAssistant
                    value={bio}
                    context={ENTITY_TO_AI_CONTEXT[entity]}
                    metadata={{ companyName: name, industry: orgType }}
                    textareaRef={bioRef}
                    onApply={setBio}
                    label="AI Improve"
                  />
                </div>
              )}
            </Field>

            <Field label="Why Join Us">
              <textarea
                ref={whyJoinUsRef}
                value={whyJoinUs}
                onChange={(e) => setWhyJoinUs(e.target.value)}
                placeholder="Highlight your company culture, mission, benefits, and why great talent should join you"
                className="input-base min-h-[80px] resize-y"
              />
              {whyJoinUs.trim().length > 0 && (
                <div className="mt-2">
                  <AIWritingAssistant
                    value={whyJoinUs}
                    context={ENTITY_TO_AI_CONTEXT[entity]}
                    metadata={{ companyName: name, industry: orgType }}
                    textareaRef={whyJoinUsRef}
                    onApply={setWhyJoinUs}
                    label="AI Improve"
                  />
                </div>
              )}
            </Field>

            {displayError && (
              <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
                {displayError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-brand text-primary-foreground font-semibold px-6 py-3.5 rounded-xl shadow-elegant hover:shadow-glow transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>Continue to Dashboard</>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>
      {children}
    </label>
  );
}
