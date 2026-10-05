"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Loader2,
  Pencil,
  Sparkles,
  ExternalLink,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Briefcase,
  HeartHandshake,
  X,
  AlertCircle,
  LocateFixed,
  Compass,
  Navigation,
  Rocket,
  GraduationCap,
  BookOpen,
  Award,
  Landmark,
  ShieldCheck,
  FileText,
  Activity,
  Layers,
} from "lucide-react";
import { useRecruiterStore } from "@/features/recruiter/store/useRecruiterStore";
import { recruiterService } from "@/features/recruiter/services/recruiterService";
import { EntityType, OrgProfile, OrgAutofillFields } from "@/features/recruiter/types";
import { AIWritingAssistant } from "@/features/aiWriting/components/AIWritingAssistant";
import { AIWritingContext } from "@/features/aiWriting/types";
import { UrlAutoSuggestInput } from "@/components/common/UrlAutoSuggestInput";

const ENTITY_TO_AI_CONTEXT: Record<EntityType, AIWritingContext> = {
  company: "company-about",
  startup: "startup-about",
  institution: "institution-about",
};

const DEFAULT_REALISTIC_SIZES = [
  "1–10",
  "11–50",
  "51–200",
  "201–500",
  "501–1,000",
  "1,001–5,000",
  "5,001–10,000",
  "10,000+",
];

export default function RecruiterProfilePage() {
  const { orgProfile, orgFormMeta, loadOrgProfile, loadOrgFormMeta, saveOrgProfile } = useRecruiterStore();

  const [loaded, setLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<OrgProfile>>({});
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const whyJoinUsRef = useRef<HTMLTextAreaElement>(null);

  // Auto Apply AI Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiUrl, setAiUrl] = useState("");
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [extractedPreview, setExtractedPreview] = useState<OrgAutofillFields | null>(null);

  const [detectingLocation, setDetectingLocation] = useState(false);

  const getMapsEmbedQuery = (url?: string, hq?: string) => {
    if (url && url.trim()) {
      const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) {
        return `${coordMatch[1]},${coordMatch[2]}`;
      }
      return url.trim();
    }
    return hq?.trim() || "";
  };

  const getMapsExternalUrl = (url?: string, hq?: string) => {
    if (url && url.trim()) {
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
      }
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(url.trim())}`;
    }
    if (hq && hq.trim()) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hq.trim())}`;
    }
    return "https://maps.google.com";
  };

  const handleDetectLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coordsStr = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setForm((prev) => ({
          ...prev,
          googleMapsUrl: coordsStr,
        }));
        setDetectingLocation(false);
      },
      (error) => {
        console.error("GPS detection error:", error);
        setDetectingLocation(false);
        alert("Could not detect GPS position automatically. Please enter your location or address.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    loadOrgProfile().finally(() => setLoaded(true));
  }, [loadOrgProfile]);

  useEffect(() => {
    if (orgProfile?.entity) {
      loadOrgFormMeta(orgProfile.entity).catch(() => {});
    }
  }, [orgProfile?.entity, loadOrgFormMeta]);

  const meta = orgProfile?.entity ? orgFormMeta[orgProfile.entity] : undefined;
  const entityLabel = meta?.label ?? "Organization";

  // Calculate Profile Completion Progress
  const profileCompletion = useMemo(() => {
    if (!orgProfile) return { percentage: 0, completedCount: 0, totalCount: 10, missingFields: [] };

    const checklist: { key: string; label: string; done: boolean }[] = [
      { key: "name", label: "Company Name", done: !!orgProfile.name?.trim() },
      { key: "website", label: "Company Website URL", done: !!orgProfile.website?.trim() },
      { key: "industry", label: "Industry", done: !!orgProfile.industry?.trim() },
      { key: "employees", label: "Company Size (Employees)", done: !!orgProfile.employees?.trim() },
      { key: "headquarters", label: "Headquarters", done: !!(orgProfile.headquarters?.trim() || orgProfile.address?.trim()) },
      { key: "ceoName", label: "CEO / Leader", done: !!orgProfile.ceoName?.trim() },
      { key: "founded", label: "Founded Year", done: !!orgProfile.founded?.trim() },
      { key: "revenue", label: "Revenue / Valuation", done: !!(orgProfile.revenue?.trim() || orgProfile.valuation?.trim()) },
      { key: "description", label: "About Description", done: !!(orgProfile.bio?.trim() || orgProfile.description?.trim()) },
      { key: "whyJoinUs", label: "Why Join Us", done: !!orgProfile.whyJoinUs?.trim() },
    ];

    const completedCount = checklist.filter((item) => item.done).length;
    const totalCount = checklist.length;
    const percentage = Math.round((completedCount / totalCount) * 100);
    const missingFields = checklist.filter((item) => !item.done);

    return { percentage, completedCount, totalCount, missingFields };
  }, [orgProfile]);

  const startEditing = () => {
    setLocalError(null);
    setSuccessMessage(null);
    setForm({
      name: orgProfile?.name || "",
      industry: orgProfile?.industry || "",
      orgType: orgProfile?.orgType || "",
      employees: orgProfile?.employees || "",
      headquarters: orgProfile?.headquarters || orgProfile?.address || "",
      address: orgProfile?.address || orgProfile?.headquarters || "",
      googleMapsUrl: orgProfile?.googleMapsUrl || "",
      ceoName: orgProfile?.ceoName || "",
      ceoEmail: orgProfile?.ceoEmail || "",
      phone: orgProfile?.phone || "",
      founded: orgProfile?.founded || "",
      valuation: orgProfile?.valuation || "",
      revenue: orgProfile?.revenue || orgProfile?.valuation || "",
      website: orgProfile?.website || "",
      registrationId: orgProfile?.registrationId || "",
      bio: orgProfile?.bio || orgProfile?.description || "",
      description: orgProfile?.description || orgProfile?.bio || "",
      whyJoinUs: orgProfile?.whyJoinUs || "",
      founders: orgProfile?.founders || "",
      foundingTheme: orgProfile?.foundingTheme || "",
      sector: orgProfile?.sector || "",
      productDetails: orgProfile?.productDetails || "",
      productLink: orgProfile?.productLink || "",
      fundraiser: orgProfile?.fundraiser || "",
      // Institution specific fields
      mission: orgProfile?.mission || "",
      vision: orgProfile?.vision || "",
      values: orgProfile?.values || "",
      campusContext: orgProfile?.campusContext || "",
      legalStatus: orgProfile?.legalStatus || "",
      governingBody: orgProfile?.governingBody || "",
      executiveLeadership: orgProfile?.executiveLeadership || "",
      orgStructure: orgProfile?.orgStructure || "",
      academicPrograms: orgProfile?.academicPrograms || "",
      academicCalendar: orgProfile?.academicCalendar || "",
      gradingScale: orgProfile?.gradingScale || "",
      graduationRequirements: orgProfile?.graduationRequirements || "",
      totalEnrollment: orgProfile?.totalEnrollment || "",
      averageClassSize: orgProfile?.averageClassSize || "",
      graduationRate: orgProfile?.graduationRate || "",
      placementRate: orgProfile?.placementRate || "",
      internationalStudents: orgProfile?.internationalStudents || "",
      scholarshipRecipients: orgProfile?.scholarshipRecipients || "",
      diversityInclusion: orgProfile?.diversityInclusion || "",
      testScores: orgProfile?.testScores || "",
      totalFaculty: orgProfile?.totalFaculty || "",
      facultyAdvancedDegrees: orgProfile?.facultyAdvancedDegrees || "",
      studentTeacherRatio: orgProfile?.studentTeacherRatio || "",
      supportStaffCount: orgProfile?.supportStaffCount || "",
      facultyExperience: orgProfile?.facultyExperience || "",
      professionalDevelopment: orgProfile?.professionalDevelopment || "",
      campusArea: orgProfile?.campusArea || "",
      laboratories: orgProfile?.laboratories || "",
      libraryResources: orgProfile?.libraryResources || "",
      artsRecreation: orgProfile?.artsRecreation || "",
      itInfrastructure: orgProfile?.itInfrastructure || "",
      campusAccessibility: orgProfile?.campusAccessibility || "",
      accreditations: orgProfile?.accreditations || "",
      awardsHonors: orgProfile?.awardsHonors || "",
      membershipsAffiliations: orgProfile?.membershipsAffiliations || "",
      tuitionFeeSchedule: orgProfile?.tuitionFeeSchedule || "",
      financialAidAvailable: orgProfile?.financialAidAvailable || "",
      endowmentBudget: orgProfile?.endowmentBudget || "",
      academicSupportServices: orgProfile?.academicSupportServices || "",
      wellnessSocialSupport: orgProfile?.wellnessSocialSupport || "",
      extracurricularClubs: orgProfile?.extracurricularClubs || "",
      transportationHousing: orgProfile?.transportationHousing || "",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setLocalError(null);
  };

  const updateField = (key: keyof OrgProfile, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!orgProfile) return;
    setLocalError(null);

    if (!form.name?.trim()) {
      setLocalError(`${entityLabel} name is required.`);
      return;
    }
    if (form.ceoEmail?.trim() && !/^\S+@\S+\.\S+$/.test(form.ceoEmail.trim())) {
      setLocalError("Enter a valid contact email address.");
      return;
    }

    setIsSaving(true);
    try {
      await saveOrgProfile({
        entity: orgProfile.entity,
        name: form.name!.trim(),
        industry: (form.industry || "").trim(),
        orgType: form.orgType || "",
        employees: (form.employees || "").trim(),
        valuation: (form.valuation || form.revenue || "").trim(),
        revenue: (form.revenue || form.valuation || "").trim(),
        ceoName: (form.ceoName || "").trim(),
        ceoEmail: (form.ceoEmail || "").trim(),
        phone: (form.phone || "").trim(),
        founded: (form.founded || "").trim(),
        headquarters: (form.headquarters || form.address || "").trim(),
        address: (form.address || form.headquarters || "").trim(),
        googleMapsUrl: (form.googleMapsUrl || "").trim(),
        website: (form.website || "").trim(),
        registrationId: (form.registrationId || "").trim(),
        bio: (form.bio || form.description || "").trim(),
        description: (form.description || form.bio || "").trim(),
        whyJoinUs: (form.whyJoinUs || "").trim(),
        founders: (form.founders || "").trim(),
        foundingTheme: (form.foundingTheme || "").trim(),
        sector: (form.sector || "").trim(),
        productDetails: (form.productDetails || "").trim(),
        productLink: (form.productLink || "").trim(),
        fundraiser: (form.fundraiser || "").trim(),
        // Institution fields
        mission: (form.mission || "").trim(),
        vision: (form.vision || "").trim(),
        values: (form.values || "").trim(),
        campusContext: (form.campusContext || "").trim(),
        legalStatus: (form.legalStatus || "").trim(),
        governingBody: (form.governingBody || "").trim(),
        executiveLeadership: (form.executiveLeadership || "").trim(),
        orgStructure: (form.orgStructure || "").trim(),
        academicPrograms: (form.academicPrograms || "").trim(),
        academicCalendar: (form.academicCalendar || "").trim(),
        gradingScale: (form.gradingScale || "").trim(),
        graduationRequirements: (form.graduationRequirements || "").trim(),
        totalEnrollment: (form.totalEnrollment || "").trim(),
        averageClassSize: (form.averageClassSize || "").trim(),
        graduationRate: (form.graduationRate || "").trim(),
        placementRate: (form.placementRate || "").trim(),
        internationalStudents: (form.internationalStudents || "").trim(),
        scholarshipRecipients: (form.scholarshipRecipients || "").trim(),
        diversityInclusion: (form.diversityInclusion || "").trim(),
        testScores: (form.testScores || "").trim(),
        totalFaculty: (form.totalFaculty || "").trim(),
        facultyAdvancedDegrees: (form.facultyAdvancedDegrees || "").trim(),
        studentTeacherRatio: (form.studentTeacherRatio || "").trim(),
        supportStaffCount: (form.supportStaffCount || "").trim(),
        facultyExperience: (form.facultyExperience || "").trim(),
        professionalDevelopment: (form.professionalDevelopment || "").trim(),
        campusArea: (form.campusArea || "").trim(),
        laboratories: (form.laboratories || "").trim(),
        libraryResources: (form.libraryResources || "").trim(),
        artsRecreation: (form.artsRecreation || "").trim(),
        itInfrastructure: (form.itInfrastructure || "").trim(),
        campusAccessibility: (form.campusAccessibility || "").trim(),
        accreditations: (form.accreditations || "").trim(),
        awardsHonors: (form.awardsHonors || "").trim(),
        membershipsAffiliations: (form.membershipsAffiliations || "").trim(),
        tuitionFeeSchedule: (form.tuitionFeeSchedule || "").trim(),
        financialAidAvailable: (form.financialAidAvailable || "").trim(),
        endowmentBudget: (form.endowmentBudget || "").trim(),
        academicSupportServices: (form.academicSupportServices || "").trim(),
        wellnessSocialSupport: (form.wellnessSocialSupport || "").trim(),
        extracurricularClubs: (form.extracurricularClubs || "").trim(),
        transportationHousing: (form.transportationHousing || "").trim(),
      });
      setSuccessMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (err: unknown) {
      setLocalError((err as { message?: string })?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAiAutoApply = () => {
    setAiError(null);
    setExtractedPreview(null);
    setAiUrl(orgProfile?.website || "");
    setIsAiModalOpen(true);
  };

  const handleAnalyzeUrlWithAi = async () => {
    if (!aiUrl.trim() || !orgProfile) return;
    setAiError(null);
    setIsAiAnalyzing(true);

    try {
      const extracted = await recruiterService.autofillOrgProfile(aiUrl.trim(), orgProfile.entity);
      if (Object.keys(extracted).length === 0) {
        setAiError("No company details could be confidently extracted. Please verify the URL or enter manually.");
      } else {
        setExtractedPreview(extracted);
      }
    } catch (err: unknown) {
      setAiError((err as { message?: string })?.message || "Failed to analyze URL with AI. Please check the URL.");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleApplyExtractedToProfile = async () => {
    if (!extractedPreview || !orgProfile) return;
    setIsSaving(true);
    setAiError(null);

    try {
      await saveOrgProfile({
        entity: orgProfile.entity,
        name: extractedPreview.name || orgProfile.name || "",
        industry: extractedPreview.industry || orgProfile.industry || "",
        orgType: extractedPreview.orgType || orgProfile.orgType || "",
        employees: extractedPreview.employees || orgProfile.employees || "",
        valuation: extractedPreview.valuation || orgProfile.valuation || "",
        revenue: extractedPreview.revenue || orgProfile.revenue || extractedPreview.valuation || "",
        ceoName: extractedPreview.ceoName || orgProfile.ceoName || "",
        ceoEmail: extractedPreview.ceoEmail || orgProfile.ceoEmail || "",
        phone: orgProfile.phone || "",
        founded: extractedPreview.founded || orgProfile.founded || "",
        headquarters: extractedPreview.headquarters || extractedPreview.address || orgProfile.headquarters || orgProfile.address || "",
        address: extractedPreview.address || extractedPreview.headquarters || orgProfile.address || "",
        website: extractedPreview.website || aiUrl.trim() || orgProfile.website || "",
        registrationId: extractedPreview.registrationId || orgProfile.registrationId || "",
        bio: extractedPreview.bio || extractedPreview.description || orgProfile.bio || "",
        description: extractedPreview.description || extractedPreview.bio || orgProfile.description || "",
        whyJoinUs: extractedPreview.whyJoinUs || orgProfile.whyJoinUs || "",
      });

      setSuccessMessage("Company profile updated successfully with Gemini AI!");
      setIsAiModalOpen(false);
      setExtractedPreview(null);
    } catch (err: unknown) {
      setAiError((err as { message?: string })?.message || "Failed to save extracted company data.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-ink-soft">
        <Loader2 className="w-6 h-6 animate-spin text-primary-glow" />
      </div>
    );
  }

  if (!orgProfile) {
    return (
      <div className="p-6 sm:p-10 max-w-2xl mx-auto text-center">
        <div className="bg-surface border border-border rounded-2xl shadow-elegant p-10">
          <Building2 className="w-10 h-10 text-primary-glow mx-auto mb-4" />
          <h1 className="text-lg font-bold text-ink">Complete your organization setup</h1>
          <p className="text-sm text-ink-soft mt-1.5">
            Set up your organization profile before viewing it here.
          </p>
          <Link
            href="/recruiter/setup"
            className="inline-flex items-center gap-2 mt-6 text-xs font-semibold bg-gradient-brand text-primary-foreground px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition-all"
          >
            Set up organization
          </Link>
        </div>
      </div>
    );
  }

  const employeeOptions = meta?.sizeOptions && meta.sizeOptions.length > 0 ? meta.sizeOptions : DEFAULT_REALISTIC_SIZES;

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            {entityLabel} Profile
          </h1>
          <p className="text-ink-soft mt-1 text-sm">
            {isEditing
              ? `Update your ${entityLabel.toLowerCase()}'s details below.`
              : `View and manage your ${entityLabel.toLowerCase()}'s information and employer branding.`}
          </p>
        </div>

        {!isEditing && (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenAiAutoApply}
              className="inline-flex items-center gap-2 text-xs font-semibold border border-primary/30 text-primary-glow bg-white hover:bg-primary/10 px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Auto Apply using URL (AI)
            </button>
            <button
              type="button"
              onClick={startEditing}
              className="inline-flex items-center gap-2 text-xs font-semibold bg-gradient-brand text-primary-foreground px-4 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {successMessage && !isEditing && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Profile Completion Progress UI */}
      <div className="bg-surface border border-border rounded-2xl shadow-elegant p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary-glow font-bold text-xs">
              {profileCompletion.percentage}%
            </div>
            <div>
              <div className="text-sm font-bold text-ink">Profile Completion</div>
              <div className="text-xs text-ink-soft">
                {profileCompletion.completedCount} of {profileCompletion.totalCount} details completed
              </div>
            </div>
          </div>

          {profileCompletion.percentage < 100 && (
            <button
              type="button"
              onClick={handleOpenAiAutoApply}
              className="text-xs font-semibold text-primary-glow hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Auto-fill missing with Gemini
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="h-2 rounded-full bg-surface-alt overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              profileCompletion.percentage === 100
                ? "bg-emerald-500"
                : profileCompletion.percentage >= 60
                ? "bg-gradient-brand"
                : "bg-amber-500"
            }`}
            style={{ width: `${profileCompletion.percentage}%` }}
          />
        </div>

        {profileCompletion.missingFields.length > 0 ? (
          <div className="flex items-center gap-2 flex-wrap text-[11px] text-ink-soft">
            <span className="font-semibold text-ink">Missing:</span>
            {profileCompletion.missingFields.slice(0, 5).map((f) => (
              <span
                key={f.key}
                onClick={startEditing}
                className="bg-surface-alt hover:bg-primary/10 hover:text-primary-glow transition px-2 py-0.5 rounded-md border border-border cursor-pointer"
              >
                + {f.label}
              </span>
            ))}
            {profileCompletion.missingFields.length > 5 && (
              <span>+{profileCompletion.missingFields.length - 5} more</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Your company profile is 100% complete!
          </div>
        )}
      </div>

      {/* Main Profile View / Edit Card */}
      <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 sm:p-8">
        {!isEditing ? (
          <div className="space-y-8">
            {/* Overview Section */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-4 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Company Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-6">
                <ViewField label={`${entityLabel} Name`} value={orgProfile.name} />
                <ViewField label="Industry" value={orgProfile.industry} />
                <ViewField label={meta?.typeLabel || "Type"} value={orgProfile.orgType} />
                <ViewField label="Company Size (Employees)" value={orgProfile.employees} icon={Users} />
                <ViewField label="Founded" value={orgProfile.founded} icon={Calendar} />
                <ViewField label={meta?.leaderLabel || "CEO / Leader"} value={orgProfile.ceoName} />
                <ViewField label="Headquarters" value={orgProfile.headquarters || orgProfile.address} icon={MapPin} />
                <ViewField
                  label="Website URL"
                  value={orgProfile.website}
                  isLink
                  className="sm:col-span-2 md:col-span-1 truncate"
                />
                <ViewField
                  label={meta?.valuationLabel || "Revenue / Valuation"}
                  value={orgProfile.revenue || orgProfile.valuation}
                  icon={DollarSign}
                />
              </div>
            </div>

            {/* Startup Specific Venture & Product Highlights (Startup Only) */}
            {orgProfile.entity === "startup" && (
              <div className="border-t border-border pt-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-primary-glow mb-4 flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5" /> Startup Venture & Product Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-6">
                  <ViewField label="Founders & Co-Founders" value={orgProfile.founders} icon={Users} />
                  <ViewField label="Sector" value={orgProfile.sector} />
                  <ViewField label="Fundraiser Status" value={orgProfile.fundraiser} icon={DollarSign} />
                  <ViewField
                    label="Founding Theme / Core Problem"
                    value={orgProfile.foundingTheme}
                    className="sm:col-span-2 md:col-span-3"
                  />
                  <ViewField
                    label="Product Details"
                    value={orgProfile.productDetails}
                    className="sm:col-span-2"
                  />
                  <ViewField
                    label="Product Link / Live Demo"
                    value={orgProfile.productLink}
                    isLink
                    className="sm:col-span-2 md:col-span-1 truncate"
                  />
                </div>
              </div>
            )}

            {/* Institution Specific Dossier (Institution Only - HTML Specification) */}
            {orgProfile.entity === "institution" && (
              <div className="space-y-6 border-t border-border pt-6">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-primary-glow flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" /> Institutional Accreditation & Academic Dossier
                  </h2>
                  <span className="text-[10px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                    Higher Education & Placement Node
                  </span>
                </div>

                {/* 1. Identity & Context */}
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-alt/40 border border-border space-y-3">
                  <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-primary-glow" /> 1. Institutional Identity & Mission
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-surface border border-border/80 text-xs">
                      <span className="text-ink-soft block text-[10px] font-bold">Mission</span>
                      <p className="text-ink mt-0.5 font-medium">{orgProfile.mission || "Not specified"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border/80 text-xs">
                      <span className="text-ink-soft block text-[10px] font-bold">Vision</span>
                      <p className="text-ink mt-0.5 font-medium">{orgProfile.vision || "Not specified"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border/80 text-xs">
                      <span className="text-ink-soft block text-[10px] font-bold">Core Values</span>
                      <p className="text-ink mt-0.5 font-medium">{orgProfile.values || "Not specified"}</p>
                    </div>
                  </div>
                  {orgProfile.campusContext && (
                    <p className="text-xs text-ink-soft">
                      <strong className="text-ink">Community & Campus Context:</strong> {orgProfile.campusContext}
                    </p>
                  )}
                </div>

                {/* 2. Governance & Administration */}
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-alt/40 border border-border space-y-3">
                  <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-primary-glow" /> 2. Governance & Administration
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
                      <span className="text-[10px] font-bold text-ink-soft uppercase">Legal Status</span>
                      <p className="text-xs text-ink font-medium">{orgProfile.legalStatus || "Accredited Educational Institution"}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
                      <span className="text-[10px] font-bold text-ink-soft uppercase">Organizational Model</span>
                      <p className="text-xs text-ink font-medium">{orgProfile.orgStructure || "Autonomous Academic Departments & Centers"}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1 sm:col-span-2">
                      <span className="text-[10px] font-bold text-ink-soft uppercase">Board of Directors / Governing Council</span>
                      <p className="text-xs text-ink font-medium whitespace-pre-line">{orgProfile.governingBody || "Governing Council, Syndicate & Academic Advisory Board"}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1 sm:col-span-2">
                      <span className="text-[10px] font-bold text-ink-soft uppercase">Executive Leadership</span>
                      <p className="text-xs text-ink font-medium whitespace-pre-line">{orgProfile.executiveLeadership || "Chancellor, Vice-Chancellor, Deans & Placement Directorate"}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Academic Programs & Curriculum */}
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-alt/40 border border-border space-y-3">
                  <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-primary-glow" /> 3. Academic Programs & Curriculum
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-surface border border-border/80">
                      <span className="text-ink-soft block text-[10px] font-bold">Calendar</span>
                      <span className="text-ink font-semibold">{orgProfile.academicCalendar || "Semester Scheme"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border/80">
                      <span className="text-ink-soft block text-[10px] font-bold">Grading Scale</span>
                      <span className="text-ink font-semibold">{orgProfile.gradingScale || "10-Point CGPA"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border/80 sm:col-span-2">
                      <span className="text-ink-soft block text-[10px] font-bold">Graduation & Placement Req.</span>
                      <span className="text-ink font-semibold truncate block">{orgProfile.graduationRequirements || "Full Credits & Mandatory Summer Capstone/Internship"}</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface border border-border">
                    <span className="text-[10px] font-bold text-ink-soft uppercase block mb-1">Programs & Degrees Offered</span>
                    <p className="text-xs text-ink whitespace-pre-line font-medium">{orgProfile.academicPrograms || "Undergraduate (B.Tech / B.Sc), Postgraduate (M.Tech / MBA), Doctoral / PhD Research"}</p>
                  </div>
                </div>

                {/* 4. Student Body & Demographics */}
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-alt/40 border border-border space-y-3">
                  <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-primary-glow" /> 4. Student Body & Demographics
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-surface border border-border text-center">
                      <span className="text-ink-soft block text-[10px]">Enrollment</span>
                      <span className="text-lg font-black text-ink">{orgProfile.totalEnrollment || "2,500+"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border text-center">
                      <span className="text-ink-soft block text-[10px]">Avg Class Size</span>
                      <span className="text-lg font-black text-ink">{orgProfile.averageClassSize || "30"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border text-center">
                      <span className="text-ink-soft block text-[10px]">Graduation Rate</span>
                      <span className="text-lg font-black text-emerald-500">{orgProfile.graduationRate || "96%"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border text-center">
                      <span className="text-ink-soft block text-[10px]">Placement Rate</span>
                      <span className="text-lg font-black text-primary-glow">{orgProfile.placementRate || "88%"}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-surface border border-border/80">
                      <span className="text-ink-soft text-[10px] block">International Students</span>
                      <span className="font-semibold text-ink">{orgProfile.internationalStudents || "12%"}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface border border-border/80">
                      <span className="text-ink-soft text-[10px] block">Scholarships / Aid</span>
                      <span className="font-semibold text-ink">{orgProfile.scholarshipRecipients || "35% of cohort"}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface border border-border/80">
                      <span className="text-ink-soft text-[10px] block">Inclusion / Support</span>
                      <span className="font-semibold text-ink">{orgProfile.diversityInclusion || "Full Accessibility Support"}</span>
                    </div>
                  </div>
                  {orgProfile.testScores && (
                    <p className="text-xs text-ink-soft">
                      <strong className="text-ink">Test Scores & Accolades:</strong> {orgProfile.testScores}
                    </p>
                  )}
                </div>

                {/* 5. Faculty & Staff */}
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-alt/40 border border-border space-y-3">
                  <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-primary-glow" /> 5. Faculty & Staff
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-surface border border-border">
                      <span className="text-ink-soft block text-[10px]">Total Faculty</span>
                      <span className="text-base font-bold text-ink">{orgProfile.totalFaculty || "160"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border">
                      <span className="text-ink-soft block text-[10px]">PhD / Masters</span>
                      <span className="text-base font-bold text-emerald-500">{orgProfile.facultyAdvancedDegrees || "82%"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border">
                      <span className="text-ink-soft block text-[10px]">Teacher-Student Ratio</span>
                      <span className="text-base font-bold text-primary-glow">{orgProfile.studentTeacherRatio || "1:15"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border">
                      <span className="text-ink-soft block text-[10px]">Support Staff</span>
                      <span className="text-base font-bold text-ink">{orgProfile.supportStaffCount || "65"}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-surface border border-border/80">
                      <span className="text-ink-soft text-[10px] block">Experience & Tenure</span>
                      <span className="font-semibold text-ink">{orgProfile.facultyExperience || "Avg 12 years teaching"}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface border border-border/80">
                      <span className="text-ink-soft text-[10px] block">Faculty Training</span>
                      <span className="font-semibold text-ink">{orgProfile.professionalDevelopment || "40+ hours/year professional development"}</span>
                    </div>
                  </div>
                </div>

                {/* 6. Facilities & Infrastructure */}
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-alt/40 border border-border space-y-3">
                  <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-primary-glow" /> 6. Facilities & Infrastructure
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-surface border border-border/80 space-y-1">
                      <span className="font-bold text-ink block">🏛️ Campus & Sports</span>
                      <p className="text-ink-soft">{orgProfile.campusArea || "35-Acre Smart Green Campus with Sports Complex"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border/80 space-y-1">
                      <span className="font-bold text-ink block">🔬 Labs & Makerspace</span>
                      <p className="text-ink-soft">{orgProfile.laboratories || "12 Research Labs, AI Sandbox & Robotics Makerspace"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border/80 space-y-1">
                      <span className="font-bold text-ink block">📖 Digital Library</span>
                      <p className="text-ink-soft">{orgProfile.libraryResources || "40,000+ Titles, IEEE Subscriptions, Digital LMS"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border/80 space-y-1">
                      <span className="font-bold text-ink block">🎭 Arts & Auditorium</span>
                      <p className="text-ink-soft">{orgProfile.artsRecreation || "800-seat Auditorium, Amphitheatre & Studios"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border/80 space-y-1">
                      <span className="font-bold text-ink block">💻 IT Infrastructure</span>
                      <p className="text-ink-soft">{orgProfile.itInfrastructure || "10 Gbps Fiber Backbone & Campus Wi-Fi 6"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border/80 space-y-1">
                      <span className="font-bold text-ink block">♿ Accessibility</span>
                      <p className="text-ink-soft">{orgProfile.campusAccessibility || "Wheelchair-Accessible Elevators, Ramps & Braille"}</p>
                    </div>
                  </div>
                </div>

                {/* 7. Accreditations, Honors & Affiliations */}
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-alt/40 border border-border space-y-3">
                  <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-primary-glow" /> 7. Accreditations, Honors & Affiliations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-surface border border-border/80">
                      <span className="text-[10px] font-bold text-ink-soft uppercase block mb-1">Accreditations</span>
                      <p className="text-ink font-semibold">{orgProfile.accreditations || "NAAC A++, NBA Accredited, NIRF Ranked"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border/80">
                      <span className="text-[10px] font-bold text-ink-soft uppercase block mb-1">Honors & Awards</span>
                      <p className="text-ink font-semibold">{orgProfile.awardsHonors || "National Education Excellence Award 2025"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border/80">
                      <span className="text-[10px] font-bold text-ink-soft uppercase block mb-1">Memberships</span>
                      <p className="text-ink font-semibold">{orgProfile.membershipsAffiliations || "Association of Indian Universities (AIU), IEEE, ACM"}</p>
                    </div>
                  </div>
                </div>

                {/* 8. Financials */}
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-alt/40 border border-border space-y-3">
                  <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-primary-glow" /> 8. Financial Information & Scholarships
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-surface border border-border/80">
                      <span className="text-[10px] font-bold text-ink-soft uppercase block mb-1">Tuition & Fee Schedule</span>
                      <p className="text-ink font-medium">{orgProfile.tuitionFeeSchedule || "Structured per semester with instalment plans"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border/80">
                      <span className="text-[10px] font-bold text-ink-soft uppercase block mb-1">Scholarships & Grants</span>
                      <p className="text-ink font-medium">{orgProfile.financialAidAvailable || "Merit concessions, sports quotas & need-based aid"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border/80">
                      <span className="text-[10px] font-bold text-ink-soft uppercase block mb-1">Endowment & Budget</span>
                      <p className="text-ink font-medium">{orgProfile.endowmentBudget || "Audited financial stability & research trust"}</p>
                    </div>
                  </div>
                </div>

                {/* 9. Student Support & Services */}
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-alt/40 border border-border space-y-3">
                  <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-primary-glow" /> 9. Student Support & Placement Services
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-surface border border-border/80">
                      <span className="font-bold text-ink block text-[11px]">Academic & TPO</span>
                      <p className="text-ink-soft mt-0.5">{orgProfile.academicSupportServices || "Training & Placement Cell, Mock Interviews"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border/80">
                      <span className="font-bold text-ink block text-[11px]">Wellness & Counseling</span>
                      <p className="text-ink-soft mt-0.5">{orgProfile.wellnessSocialSupport || "Campus Health Clinic & Mentorship Support"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border/80">
                      <span className="font-bold text-ink block text-[11px]">Clubs & Sports</span>
                      <p className="text-ink-soft mt-0.5">{orgProfile.extracurricularClubs || "25+ Student Guilds, Sports Teams & Hackathons"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-border/80">
                      <span className="font-bold text-ink block text-[11px]">Housing & Transit</span>
                      <p className="text-ink-soft mt-0.5">{orgProfile.transportationHousing || "Hostels on Campus & Bus Fleets"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Company Location (Google Maps) */}
            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-ink-soft flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-primary-glow" /> Company Location (Google Maps)
                </h2>
                {(orgProfile.googleMapsUrl || orgProfile.headquarters || orgProfile.address) && (
                  <a
                    href={getMapsExternalUrl(orgProfile.googleMapsUrl, orgProfile.headquarters || orgProfile.address)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-glow hover:underline bg-primary/5 hover:bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl transition"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Open in Google Maps
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                )}
              </div>

              {getMapsEmbedQuery(orgProfile.googleMapsUrl, orgProfile.headquarters || orgProfile.address) ? (
                <div className="rounded-2xl overflow-hidden border border-border bg-surface-alt/50 shadow-sm">
                  <div className="p-3.5 bg-surface border-b border-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-ink font-medium truncate">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="truncate">
                        {orgProfile.headquarters || orgProfile.address || orgProfile.googleMapsUrl}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Pinned on Map
                    </span>
                  </div>
                  <div className="relative w-full h-64 bg-surface-alt">
                    <iframe
                      title="Company Google Maps Location"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        getMapsEmbedQuery(orgProfile.googleMapsUrl, orgProfile.headquarters || orgProfile.address)
                      )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-surface-alt/40 border border-border border-dashed rounded-2xl p-6 text-center">
                  <MapPin className="w-6 h-6 text-ink-soft mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-ink-soft">
                    No Google Maps location specified yet. Click &quot;Edit Profile&quot; to pin your headquarters on Google Maps.
                  </p>
                </div>
              )}
            </div>

            {/* About the Company Description */}
            <div className="border-t border-border pt-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-2">
                About the Company Description
              </h2>
              <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">
                {orgProfile.bio || orgProfile.description || (
                  <span className="text-ink-soft italic">No company description provided yet.</span>
                )}
              </p>
            </div>

            {/* Why Join Us */}
            <div className="border-t border-border pt-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-2 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-500" /> Why Join Us
              </h2>
              <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">
                {orgProfile.whyJoinUs ? (
                  orgProfile.whyJoinUs
                ) : (
                  <span className="text-ink-soft italic">
                    Tell prospective candidates about your culture, mission, benefits, and why they should join.
                  </span>
                )}
              </p>
            </div>

            {/* Contact & Registration */}
            <div className="border-t border-border pt-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-4">
                Contact &amp; Registration
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
                <ViewField label="Contact Email" value={orgProfile.ceoEmail} />
                <ViewField label="Phone" value={orgProfile.phone} />
                <ViewField label={meta?.regLabel || "Registration ID"} value={orgProfile.registrationId} />
              </div>
            </div>
          </div>
        ) : (
          /* Edit Form Mode */
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-ink mb-2">Edit {entityLabel} Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={`${entityLabel} Name`}>
                <input
                  type="text"
                  value={form.name || ""}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="input-base"
                  required
                />
              </Field>

              <Field label="Industry">
                <input
                  type="text"
                  value={form.industry || ""}
                  onChange={(e) => updateField("industry", e.target.value)}
                  placeholder="e.g. Software, FinTech, E-Commerce"
                  className="input-base"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label={meta?.typeLabel || "Type"}>
                {meta?.typeOptions?.length ? (
                  <select
                    value={form.orgType || ""}
                    onChange={(e) => updateField("orgType", e.target.value)}
                    className="input-base"
                  >
                    <option value="">Select...</option>
                    {meta.typeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={form.orgType || ""}
                    onChange={(e) => updateField("orgType", e.target.value)}
                    className="input-base"
                  />
                )}
              </Field>

              <Field label="Company Size (Employees)">
                <select
                  value={form.employees || ""}
                  onChange={(e) => updateField("employees", e.target.value)}
                  className="input-base"
                >
                  <option value="">Select realistic range...</option>
                  {employeeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt} employees
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Founded Year">
                <input
                  type="text"
                  value={form.founded || ""}
                  onChange={(e) => updateField("founded", e.target.value)}
                  placeholder="e.g. 2018"
                  className="input-base"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={meta?.leaderLabel || "CEO / Leader"}>
                <input
                  type="text"
                  value={form.ceoName || ""}
                  onChange={(e) => updateField("ceoName", e.target.value)}
                  placeholder="e.g. Satya Nadella"
                  className="input-base"
                />
              </Field>

              <Field label="Headquarters">
                <input
                  type="text"
                  value={form.headquarters || form.address || ""}
                  onChange={(e) => {
                    updateField("headquarters", e.target.value);
                    updateField("address", e.target.value);
                  }}
                  placeholder="e.g. San Francisco, CA, USA"
                  className="input-base"
                />
              </Field>
            </div>

            {/* Startup Specific Fields in Edit Mode */}
            {orgProfile.entity === "startup" && (
              <div className="p-4 sm:p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary-glow flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5" /> Startup Venture & Product Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Founders & Co-Founders">
                    <input
                      type="text"
                      value={form.founders || ""}
                      onChange={(e) => updateField("founders", e.target.value)}
                      placeholder="e.g. Maya Lin, Alex Chen"
                      className="input-base"
                    />
                  </Field>
                  <Field label="Sector">
                    <input
                      type="text"
                      value={form.sector || ""}
                      onChange={(e) => updateField("sector", e.target.value)}
                      placeholder="e.g. Edtech, Fintech, Healthtech, AI"
                      className="input-base"
                    />
                  </Field>
                  <Field label="Fundraiser Status">
                    <input
                      type="text"
                      value={form.fundraiser || ""}
                      onChange={(e) => updateField("fundraiser", e.target.value)}
                      placeholder="e.g. Pre-Seed, Seed, Series A, Bootstrapped"
                      className="input-base"
                    />
                  </Field>
                </div>
                <Field label="Founding Theme / Core Problem">
                  <textarea
                    rows={2}
                    value={form.foundingTheme || ""}
                    onChange={(e) => updateField("foundingTheme", e.target.value)}
                    placeholder="What core problem does your startup solve and why was it founded?"
                    className="input-base"
                  />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Product Details">
                    <textarea
                      rows={2}
                      value={form.productDetails || ""}
                      onChange={(e) => updateField("productDetails", e.target.value)}
                      placeholder="Brief overview of your core product or platform..."
                      className="input-base"
                    />
                  </Field>
                  <Field label="Product Link / Live Demo URL">
                    <input
                      type="text"
                      value={form.productLink || ""}
                      onChange={(e) => updateField("productLink", e.target.value)}
                      placeholder="https://yourproduct.com or demo link"
                      className="input-base"
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* Institution Specific Dossier in Edit Mode */}
            {orgProfile.entity === "institution" && (
              <div className="p-4 sm:p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary-glow flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" /> Institution Accreditation & Academic Dossier
                  </h3>
                  <span className="text-[10px] font-semibold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    Comprehensive Institutional Catalog
                  </span>
                </div>

                {/* 1. Identity, Mission, Vision, Values */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider block">1. Identity, Mission & Values</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field label="Mission Statement">
                      <textarea
                        rows={2}
                        value={form.mission || ""}
                        onChange={(e) => updateField("mission", e.target.value)}
                        placeholder="Core mission and pedagogical philosophy..."
                        className="input-base"
                      />
                    </Field>
                    <Field label="Vision Statement">
                      <textarea
                        rows={2}
                        value={form.vision || ""}
                        onChange={(e) => updateField("vision", e.target.value)}
                        placeholder="Long-term academic vision..."
                        className="input-base"
                      />
                    </Field>
                    <Field label="Core Values">
                      <textarea
                        rows={2}
                        value={form.values || ""}
                        onChange={(e) => updateField("values", e.target.value)}
                        placeholder="e.g. Integrity, Research Excellence, Inclusivity"
                        className="input-base"
                      />
                    </Field>
                  </div>
                  <Field label="Community & Campus Context">
                    <input
                      type="text"
                      value={form.campusContext || ""}
                      onChange={(e) => updateField("campusContext", e.target.value)}
                      placeholder="e.g. Urban campus serving diverse student population from 30+ countries"
                      className="input-base"
                    />
                  </Field>
                </div>

                {/* 2. Governance & Leadership */}
                <div className="space-y-3 pt-2 border-t border-primary/10">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider block">2. Governance & Administration</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Legal Status">
                      <input
                        type="text"
                        value={form.legalStatus || ""}
                        onChange={(e) => updateField("legalStatus", e.target.value)}
                        placeholder="e.g. Private Non-Profit 501(c)(3) / State Autonomous"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Organizational Model">
                      <input
                        type="text"
                        value={form.orgStructure || ""}
                        onChange={(e) => updateField("orgStructure", e.target.value)}
                        placeholder="e.g. Decentralized academic departments reporting to Chancellor"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Board of Directors / Governing Council">
                      <textarea
                        rows={2}
                        value={form.governingBody || ""}
                        onChange={(e) => updateField("governingBody", e.target.value)}
                        placeholder="List chairpersons, trustees, and governing council members..."
                        className="input-base"
                      />
                    </Field>
                    <Field label="Executive Leadership">
                      <textarea
                        rows={2}
                        value={form.executiveLeadership || ""}
                        onChange={(e) => updateField("executiveLeadership", e.target.value)}
                        placeholder="President, Vice-Chancellor, Deans of Academics & Placement..."
                        className="input-base"
                      />
                    </Field>
                  </div>
                </div>

                {/* 3. Academic Programs & Curriculum */}
                <div className="space-y-3 pt-2 border-t border-primary/10">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider block">3. Academic Programs & Curriculum</span>
                  <Field label="Programs & Degree Offerings">
                    <textarea
                      rows={2}
                      value={form.academicPrograms || ""}
                      onChange={(e) => updateField("academicPrograms", e.target.value)}
                      placeholder="e.g. Undergraduate (B.Tech, B.Sc), Postgraduate (M.Tech, MBA), Doctoral / PhD"
                      className="input-base"
                    />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field label="Academic Calendar">
                      <input
                        type="text"
                        value={form.academicCalendar || ""}
                        onChange={(e) => updateField("academicCalendar", e.target.value)}
                        placeholder="e.g. Two Semesters (Fall / Spring) + Summer"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Grading Scale">
                      <input
                        type="text"
                        value={form.gradingScale || ""}
                        onChange={(e) => updateField("gradingScale", e.target.value)}
                        placeholder="e.g. 10-point CGPA / 4.0 Scale"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Graduation / Placement Criteria">
                      <input
                        type="text"
                        value={form.graduationRequirements || ""}
                        onChange={(e) => updateField("graduationRequirements", e.target.value)}
                        placeholder="e.g. 160 Credits, Mandatory Internship & Capstone"
                        className="input-base"
                      />
                    </Field>
                  </div>
                </div>

                {/* 4. Student Demographics */}
                <div className="space-y-3 pt-2 border-t border-primary/10">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider block">4. Student Demographics & Performance</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Field label="Total Enrollment">
                      <input
                        type="text"
                        value={form.totalEnrollment || ""}
                        onChange={(e) => updateField("totalEnrollment", e.target.value)}
                        placeholder="e.g. 2,500"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Average Class Size">
                      <input
                        type="text"
                        value={form.averageClassSize || ""}
                        onChange={(e) => updateField("averageClassSize", e.target.value)}
                        placeholder="e.g. 24"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Graduation Rate">
                      <input
                        type="text"
                        value={form.graduationRate || ""}
                        onChange={(e) => updateField("graduationRate", e.target.value)}
                        placeholder="e.g. 96%"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Placement Rate">
                      <input
                        type="text"
                        value={form.placementRate || ""}
                        onChange={(e) => updateField("placementRate", e.target.value)}
                        placeholder="e.g. 88%"
                        className="input-base"
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field label="International Students %">
                      <input
                        type="text"
                        value={form.internationalStudents || ""}
                        onChange={(e) => updateField("internationalStudents", e.target.value)}
                        placeholder="e.g. 15% (35 countries)"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Scholarship Recipients %">
                      <input
                        type="text"
                        value={form.scholarshipRecipients || ""}
                        onChange={(e) => updateField("scholarshipRecipients", e.target.value)}
                        placeholder="e.g. 35%"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Diversity & Special Needs">
                      <input
                        type="text"
                        value={form.diversityInclusion || ""}
                        onChange={(e) => updateField("diversityInclusion", e.target.value)}
                        placeholder="e.g. Dedicated accessibility labs"
                        className="input-base"
                      />
                    </Field>
                  </div>
                  <Field label="Standardized Test Scores & Accolades">
                    <input
                      type="text"
                      value={form.testScores || ""}
                      onChange={(e) => updateField("testScores", e.target.value)}
                      placeholder="e.g. Average SAT: 1350; GATE top 100 ranks"
                      className="input-base"
                    />
                  </Field>
                </div>

                {/* 5. Faculty & Staff */}
                <div className="space-y-3 pt-2 border-t border-primary/10">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider block">5. Faculty & Staff</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Field label="Total Faculty">
                      <input
                        type="text"
                        value={form.totalFaculty || ""}
                        onChange={(e) => updateField("totalFaculty", e.target.value)}
                        placeholder="e.g. 150"
                        className="input-base"
                      />
                    </Field>
                    <Field label="PhD / Master's Degree %">
                      <input
                        type="text"
                        value={form.facultyAdvancedDegrees || ""}
                        onChange={(e) => updateField("facultyAdvancedDegrees", e.target.value)}
                        placeholder="e.g. 80%"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Student-Teacher Ratio">
                      <input
                        type="text"
                        value={form.studentTeacherRatio || ""}
                        onChange={(e) => updateField("studentTeacherRatio", e.target.value)}
                        placeholder="e.g. 15:1"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Support Staff Count">
                      <input
                        type="text"
                        value={form.supportStaffCount || ""}
                        onChange={(e) => updateField("supportStaffCount", e.target.value)}
                        placeholder="e.g. 60"
                        className="input-base"
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Average Faculty Experience / Tenure">
                      <input
                        type="text"
                        value={form.facultyExperience || ""}
                        onChange={(e) => updateField("facultyExperience", e.target.value)}
                        placeholder="e.g. 12 years avg experience"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Professional Development / Training">
                      <input
                        type="text"
                        value={form.professionalDevelopment || ""}
                        onChange={(e) => updateField("professionalDevelopment", e.target.value)}
                        placeholder="e.g. 40+ hours/year per faculty"
                        className="input-base"
                      />
                    </Field>
                  </div>
                </div>

                {/* 6. Facilities & Infrastructure */}
                <div className="space-y-3 pt-2 border-t border-primary/10">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider block">6. Facilities & Infrastructure</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field label="Campus & Grounds">
                      <input
                        type="text"
                        value={form.campusArea || ""}
                        onChange={(e) => updateField("campusArea", e.target.value)}
                        placeholder="e.g. 35 acres, athletic track & courts"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Laboratories & Makerspaces">
                      <input
                        type="text"
                        value={form.laboratories || ""}
                        onChange={(e) => updateField("laboratories", e.target.value)}
                        placeholder="e.g. 12 science & computer labs"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Library & Digital Resources">
                      <input
                        type="text"
                        value={form.libraryResources || ""}
                        onChange={(e) => updateField("libraryResources", e.target.value)}
                        placeholder="e.g. 30k volumes, digital subscriptions"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Arts & Recreation">
                      <input
                        type="text"
                        value={form.artsRecreation || ""}
                        onChange={(e) => updateField("artsRecreation", e.target.value)}
                        placeholder="e.g. 800-seat auditorium, gymnasium"
                        className="input-base"
                      />
                    </Field>
                    <Field label="IT Infrastructure & Bandwidth">
                      <input
                        type="text"
                        value={form.itInfrastructure || ""}
                        onChange={(e) => updateField("itInfrastructure", e.target.value)}
                        placeholder="e.g. 1 Gbps fiber, 1:1 devices, Canvas LMS"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Accessibility & Inclusion">
                      <input
                        type="text"
                        value={form.campusAccessibility || ""}
                        onChange={(e) => updateField("campusAccessibility", e.target.value)}
                        placeholder="e.g. Elevators, wheelchair ramps"
                        className="input-base"
                      />
                    </Field>
                  </div>
                </div>

                {/* 7. Accreditations & Honors */}
                <div className="space-y-3 pt-2 border-t border-primary/10">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider block">7. Accreditations & Affiliations</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field label="Accreditations">
                      <input
                        type="text"
                        value={form.accreditations || ""}
                        onChange={(e) => updateField("accreditations", e.target.value)}
                        placeholder="e.g. NAAC A++, NBA, NIRF Top 50"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Awards & Recognitions">
                      <input
                        type="text"
                        value={form.awardsHonors || ""}
                        onChange={(e) => updateField("awardsHonors", e.target.value)}
                        placeholder="e.g. National Blue Ribbon 2024"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Institutional Memberships">
                      <input
                        type="text"
                        value={form.membershipsAffiliations || ""}
                        onChange={(e) => updateField("membershipsAffiliations", e.target.value)}
                        placeholder="e.g. AIU, IEEE, Global Education Coalition"
                        className="input-base"
                      />
                    </Field>
                  </div>
                </div>

                {/* 8. Financials */}
                <div className="space-y-3 pt-2 border-t border-primary/10">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider block">8. Financial Information</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field label="Tuition & Fee Structure">
                      <input
                        type="text"
                        value={form.tuitionFeeSchedule || ""}
                        onChange={(e) => updateField("tuitionFeeSchedule", e.target.value)}
                        placeholder="e.g. Semester-wise structure"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Financial Aid & Scholarships">
                      <input
                        type="text"
                        value={form.financialAidAvailable || ""}
                        onChange={(e) => updateField("financialAidAvailable", e.target.value)}
                        placeholder="e.g. Up to 50% tuition waiver grants"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Endowment & Operating Budget">
                      <input
                        type="text"
                        value={form.endowmentBudget || ""}
                        onChange={(e) => updateField("endowmentBudget", e.target.value)}
                        placeholder="e.g. $20M Endowment, audited financials"
                        className="input-base"
                      />
                    </Field>
                  </div>
                </div>

                {/* 9. Student Support & Services */}
                <div className="space-y-3 pt-2 border-t border-primary/10">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider block">9. Student Support & Placement Services</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <Field label="Academic Support & TPO">
                      <input
                        type="text"
                        value={form.academicSupportServices || ""}
                        onChange={(e) => updateField("academicSupportServices", e.target.value)}
                        placeholder="Placement cell, writing lab, tutoring"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Wellness & Social Care">
                      <input
                        type="text"
                        value={form.wellnessSocialSupport || ""}
                        onChange={(e) => updateField("wellnessSocialSupport", e.target.value)}
                        placeholder="Counseling, peer mentoring, clinic"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Extracurricular Clubs">
                      <input
                        type="text"
                        value={form.extracurricularClubs || ""}
                        onChange={(e) => updateField("extracurricularClubs", e.target.value)}
                        placeholder="30+ clubs, sports leagues, fests"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Transit & Housing">
                      <input
                        type="text"
                        value={form.transportationHousing || ""}
                        onChange={(e) => updateField("transportationHousing", e.target.value)}
                        placeholder="Campus hostels, dedicated bus fleet"
                        className="input-base"
                      />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {/* Google Maps Location Configuration in Edit Mode */}
            <div className="p-4 bg-surface-alt/40 border border-border rounded-2xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-primary-glow" /> Company Location (Google Maps)
                </label>
                <div className="flex items-center gap-2">
                  {(form.headquarters || form.address) && (
                    <button
                      type="button"
                      onClick={() => updateField("googleMapsUrl", form.headquarters || form.address || "")}
                      className="text-[11px] font-semibold text-ink-soft hover:text-primary-glow border border-border px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-alt transition cursor-pointer"
                    >
                      Use Headquarters
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={detectingLocation}
                    className="text-[11px] font-semibold text-primary-glow border border-primary/20 bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {detectingLocation ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <LocateFixed className="w-3 h-3" />
                    )}
                    Detect GPS
                  </button>
                  {getMapsExternalUrl(form.googleMapsUrl, form.headquarters || form.address) && (
                    <a
                      href={getMapsExternalUrl(form.googleMapsUrl, form.headquarters || form.address)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-ink-soft hover:text-ink inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Preview Link
                    </a>
                  )}
                </div>
              </div>

              <input
                type="text"
                value={form.googleMapsUrl || ""}
                onChange={(e) => updateField("googleMapsUrl", e.target.value)}
                placeholder="Enter Google Maps URL, pin coordinates (lat,lng), or physical location"
                className="input-base text-xs"
              />

              {getMapsEmbedQuery(form.googleMapsUrl, form.headquarters || form.address) && (
                <div className="rounded-xl overflow-hidden border border-border mt-2">
                  <div className="relative w-full h-52 bg-surface-alt">
                    <iframe
                      title="Edit Google Maps Preview"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        getMapsEmbedQuery(form.googleMapsUrl, form.headquarters || form.address)
                      )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company Website URL (with auto-suggest)">
                <UrlAutoSuggestInput
                  value={form.website || ""}
                  onChange={(val) => updateField("website", val)}
                  placeholder="https://your-company.com"
                />
              </Field>

              <Field label={meta?.valuationLabel || "Revenue / Valuation"}>
                <input
                  type="text"
                  value={form.revenue || form.valuation || ""}
                  onChange={(e) => {
                    updateField("revenue", e.target.value);
                    updateField("valuation", e.target.value);
                  }}
                  placeholder="e.g. $10M - $50M"
                  className="input-base"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Contact Email">
                <input
                  type="email"
                  value={form.ceoEmail || ""}
                  onChange={(e) => updateField("ceoEmail", e.target.value)}
                  placeholder="contact@company.com"
                  className="input-base"
                />
              </Field>

              <Field label="Phone">
                <input
                  type="tel"
                  value={form.phone || ""}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="input-base"
                />
              </Field>

              <Field label={meta?.regLabel || "Registration ID"}>
                <input
                  type="text"
                  value={form.registrationId || ""}
                  onChange={(e) => updateField("registrationId", e.target.value)}
                  placeholder="Registration / CIN"
                  className="input-base"
                />
              </Field>
            </div>

            <Field label="About the Company Description">
              <textarea
                ref={bioRef}
                value={form.bio || form.description || ""}
                onChange={(e) => {
                  updateField("bio", e.target.value);
                  updateField("description", e.target.value);
                }}
                placeholder={`A comprehensive description of your ${entityLabel.toLowerCase()}`}
                className="input-base min-h-[100px] resize-y"
              />
              {(form.bio || form.description || "").trim().length > 0 && orgProfile?.entity && (
                <div className="mt-2">
                  <AIWritingAssistant
                    value={form.bio || form.description || ""}
                    context={ENTITY_TO_AI_CONTEXT[orgProfile.entity]}
                    metadata={{ companyName: form.name || "", industry: form.industry || "" }}
                    textareaRef={bioRef}
                    onApply={(next) => {
                      updateField("bio", next);
                      updateField("description", next);
                    }}
                    label="AI Improve"
                  />
                </div>
              )}
            </Field>

            <Field label="Why Join Us">
              <textarea
                ref={whyJoinUsRef}
                value={form.whyJoinUs || ""}
                onChange={(e) => updateField("whyJoinUs", e.target.value)}
                placeholder="Highlight your company culture, team benefits, mission, and why candidates should join"
                className="input-base min-h-[90px] resize-y"
              />
              {(form.whyJoinUs || "").trim().length > 0 && orgProfile?.entity && (
                <div className="mt-2">
                  <AIWritingAssistant
                    value={form.whyJoinUs || ""}
                    context={ENTITY_TO_AI_CONTEXT[orgProfile.entity]}
                    metadata={{ companyName: form.name || "", industry: form.industry || "" }}
                    textareaRef={whyJoinUsRef}
                    onApply={(next) => updateField("whyJoinUs", next)}
                    label="AI Improve"
                  />
                </div>
              )}
            </Field>

            {localError && (
              <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
                {localError}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 text-xs font-semibold bg-gradient-brand text-primary-foreground px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition-all disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                disabled={isSaving}
                className="text-xs font-semibold text-ink-soft hover:text-ink px-4 py-2.5 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Auto Apply Using URL Modal (Gemini AI) */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-surface border border-border rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary-glow">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">Auto Apply using URL with AI</h3>
                  <p className="text-xs text-ink-soft">
                    Gemini AI will analyze the company website and extract all profile fields.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-alt flex items-center justify-center text-ink-soft hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <Field label="Enter Company Website URL">
                <UrlAutoSuggestInput
                  value={aiUrl}
                  onChange={setAiUrl}
                  placeholder="https://stripe.com"
                  disabled={isAiAnalyzing}
                />
              </Field>

              <button
                type="button"
                onClick={handleAnalyzeUrlWithAi}
                disabled={isAiAnalyzing || !aiUrl.trim()}
                className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold bg-gradient-brand text-primary-foreground py-3 rounded-xl shadow-elegant hover:shadow-glow transition-all disabled:opacity-60"
              >
                {isAiAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing company website with Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Extract Details with Gemini
                  </>
                )}
              </button>

              {aiError && (
                <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {aiError}
                </div>
              )}

              {/* Extracted Preview */}
              {extractedPreview && (
                <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary-glow" /> Extracted Information
                    </span>
                    <span className="text-[10px] text-primary-glow font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
                      Ready to apply
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {extractedPreview.name && (
                      <div className="col-span-2">
                        <span className="text-ink-soft font-medium">Name: </span>
                        <span className="font-semibold text-ink">{extractedPreview.name}</span>
                      </div>
                    )}
                    {extractedPreview.industry && (
                      <div>
                        <span className="text-ink-soft font-medium">Industry: </span>
                        <span className="font-semibold text-ink">{extractedPreview.industry}</span>
                      </div>
                    )}
                    {extractedPreview.employees && (
                      <div>
                        <span className="text-ink-soft font-medium">Size: </span>
                        <span className="font-semibold text-ink">{extractedPreview.employees}</span>
                      </div>
                    )}
                    {extractedPreview.headquarters && (
                      <div>
                        <span className="text-ink-soft font-medium">HQ: </span>
                        <span className="font-semibold text-ink">{extractedPreview.headquarters}</span>
                      </div>
                    )}
                    {extractedPreview.ceoName && (
                      <div>
                        <span className="text-ink-soft font-medium">CEO: </span>
                        <span className="font-semibold text-ink">{extractedPreview.ceoName}</span>
                      </div>
                    )}
                    {extractedPreview.founded && (
                      <div>
                        <span className="text-ink-soft font-medium">Founded: </span>
                        <span className="font-semibold text-ink">{extractedPreview.founded}</span>
                      </div>
                    )}
                    {(extractedPreview.revenue || extractedPreview.valuation) && (
                      <div>
                        <span className="text-ink-soft font-medium">Revenue: </span>
                        <span className="font-semibold text-ink">{extractedPreview.revenue || extractedPreview.valuation}</span>
                      </div>
                    )}
                    {extractedPreview.description && (
                      <div className="col-span-2 text-[11px] text-ink-soft line-clamp-2 mt-1">
                        <span className="font-semibold text-ink">Description: </span>
                        {extractedPreview.description}
                      </div>
                    )}
                    {extractedPreview.whyJoinUs && (
                      <div className="col-span-2 text-[11px] text-ink-soft line-clamp-2">
                        <span className="font-semibold text-ink">Why Join Us: </span>
                        {extractedPreview.whyJoinUs}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyExtractedToProfile}
                    disabled={isSaving}
                    className="w-full mt-3 bg-gradient-brand text-primary-foreground font-semibold py-2.5 rounded-xl shadow-sm text-xs hover:shadow-glow transition flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Applying to Profile...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Apply &amp; Save to Profile
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ViewField({
  label,
  value,
  className,
  isLink,
  icon: Icon,
}: {
  label: string;
  value?: string;
  className?: string;
  isLink?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className={className}>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft mb-1 flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3 text-ink-soft/70" />}
        {label}
      </div>
      <div className="text-sm text-ink">
        {value?.trim() ? (
          isLink ? (
            <a
              href={value.startsWith("http") ? value : `https://${value}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary-glow font-medium hover:underline inline-flex items-center gap-1"
            >
              {value} <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          ) : (
            value
          )
        ) : (
          <span className="text-ink-soft italic">Not set</span>
        )}
      </div>
    </div>
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
