"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import {
  User,
  Mail,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Loader2,
  Lock,
  MessageSquare,
  Phone,
  Globe,
  Briefcase,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { StorageProviderFactory } from "@/features/resume/storage/factory";
import type { UserProfile } from "@/features/auth/services/authService";
import { UrlAutoSuggestInput } from "@/components/common/UrlAutoSuggestInput";

type Mode = "signin" | "signup";
type Step = "form" | "verify" | "done";
type VerificationMethod = "email" | "whatsapp";
type AccountRole = "user" | "recruiter";

const COUNTRY_CODES = [
  { code: "+1", country: "US/CA" },
  { code: "+91", country: "IN" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "AU" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
  { code: "+81", country: "JP" },
  { code: "+86", country: "CN" },
  { code: "+55", country: "BR" },
  { code: "+971", country: "UAE" },
  { code: "+65", country: "SG" },
];

const rawGoogleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const hasValidGoogleClientId = Boolean(
  rawGoogleClientId &&
  !rawGoogleClientId.includes("placeholder") &&
  rawGoogleClientId.trim().length > 10
);

export default function AuthPage() {
  const router = useRouter();
  const {
    login,
    googleLogin,
    sendEmailOtp,
    verifyEmailOtp,
    sendWhatsAppOtp,
    verifyWhatsAppOtp,
    error,
    clearError,
    isAuthenticated,
    isLoading,
    user,
    completeOnboarding,
  } = useAuthStore();

  const routeUserAfterAuth = async (targetUser?: UserProfile | null) => {
    const currentUser = targetUser || useAuthStore.getState().user;
    if (!currentUser) return;

    if (currentUser.role === "recruiter") {
      router.replace("/recruiter");
      return;
    }

    // 1. If user already has hasBuiltResume set to true in MongoDB, redirect to workspace
    if (currentUser.hasBuiltResume) {
      router.replace("/resume");
      return;
    }

    try {
      const provider = StorageProviderFactory.getProvider();
      const list = await provider.list();
      if (Array.isArray(list) && list.length > 0) {
        completeOnboarding().catch(() => {});
        router.replace("/resume");
      } else {
        router.replace("/demo");
      }
    } catch {
      router.replace("/resume");
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      routeUserAfterAuth(user);
    }
  }, [isAuthenticated, isLoading, user]);

  const [mode, setMode] = useState<Mode>("signup");
  const [verificationMethod, setVerificationMethod] =
    useState<VerificationMethod>("email");
  const [step, setStep] = useState<Step>("form");

  // Form fields
  const [accountRole, setAccountRole] = useState<AccountRole>("user");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [companyWebsiteUrl, setCompanyWebsiteUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Local UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = localError || error;

  const handleModeSwitch = (newMode: Mode) => {
    clearError();
    setLocalError(null);
    setMode(newMode);
    setStep("form");
  };

  // Google Login Callback
  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    clearError();
    setLocalError(null);

    if (!credentialResponse.credential) {
      setLocalError("Google failed to return a valid credential ID token.");
      return;
    }

    setIsSubmitting(true);
    try {
      const authenticatedUser = await googleLogin(credentialResponse.credential);
      await routeUserAfterAuth(authenticatedUser);
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ||
        "Google Authentication failed";
      setLocalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setLocalError("Google sign-in popup was closed or failed to initialize.");
  };

  // Validates the username/password fields that are already visible on this same form step.
  // Checked before the OTP is even dispatched (in handleSendOtp) so a bad value is caught
  // immediately, instead of only surfacing after the user has entered the OTP code and
  // submitted (handleVerifyOtp) — which wastes a real OTP send for nothing.
  const validateAccountFields = (): string | null => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return "Username is required.";
    if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      return "Username must be between 3 and 30 characters long.";
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
      return "Username can only contain letters, numbers, underscores, and hyphens (no spaces).";
    }
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  // Step 1: Send OTP for Email or WhatsApp Signup
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    const fullPhone = `${countryCode}${phone.trim()}`;

    if (verificationMethod === "email") {
      if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
        setLocalError("A valid email address is required.");
        return;
      }
    } else {
      if (!phone.trim() || phone.trim().length < 6) {
        setLocalError(
          "A valid phone number is required for WhatsApp verification.",
        );
        return;
      }
    }

    if (mode === "signup") {
      const accountFieldError = validateAccountFields();
      if (accountFieldError) {
        setLocalError(accountFieldError);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (verificationMethod === "email") {
        await sendEmailOtp(email.trim());
      } else {
        await sendWhatsAppOtp({ countryCode, phone: phone.trim() });
      }
      setStep("verify");
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ||
        "Failed to dispatch verification code.";
      setLocalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP and finalize signup registration
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setLocalError("Please enter the complete 6-digit OTP code.");
      return;
    }

    const accountFieldError = validateAccountFields();
    if (accountFieldError) {
      setLocalError(accountFieldError);
      return;
    }
    const trimmedUsername = username.trim();

    setIsSubmitting(true);

    try {
      if (verificationMethod === "email") {
        await verifyEmailOtp({
          email: email.trim(),
          username: trimmedUsername,
          password,
          confirmPassword,
          otp: otpCode,
          role: accountRole,
        });
      } else {
        await verifyWhatsAppOtp({
          username: trimmedUsername,
          countryCode,
          phone: phone.trim(),
          password,
          confirmPassword,
          otp: otpCode,
          role: accountRole,
        });
      }
      setStep("done");
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message || "Verification failed.";
      setLocalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct Sign In handler (Email/Phone + Password)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email.trim() && !phone.trim()) {
      setLocalError("Email address or Phone number is required.");
      return;
    }
    if (!password) {
      setLocalError("Password is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const identifier = email.trim() || `${countryCode}${phone.trim()}`;
      const authenticatedUser = await login({ emailOrPhone: identifier, password });
      await routeUserAfterAuth(authenticatedUser);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Sign in failed.";
      setLocalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setOtpAt = (i: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < 5) {
      const el = document.getElementById(
        `otp-${i + 1}`,
      ) as HTMLInputElement | null;
      el?.focus();
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* LEFT — Auth Form */}
      <div className="flex flex-col px-6 sm:px-10 lg:px-16 py-8 lg:py-12 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold shadow-glow">
              L
            </div>
            <span className="text-xl font-bold tracking-tight text-ink">
              Let<span className="text-primary-glow">Get</span>In
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-ink-soft hover:text-ink transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto lg:mx-0 flex-1 flex flex-col justify-center">
          {step === "form" && (
            <>
              {/* Header Title */}
              <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
                  {mode === "signup" ? (
                    <>
                      Create your{" "}
                      <span className="text-gradient-brand">Account</span>
                    </>
                  ) : (
                    <>
                      Welcome <span className="text-gradient-brand">Back</span>
                    </>
                  )}
                </h1>
                <p className="text-ink-soft mt-2 text-sm">
                  {mode === "signup"
                    ? "Get started — build & optimize your AI resume today."
                    : "Sign in to access your resumes and carrier dashboard."}
                </p>
              </div>

              {/* Toggle Sign In / Sign Up */}
              <div className="flex p-1 bg-surface rounded-xl border border-border mb-6">
                <button
                  type="button"
                  onClick={() => handleModeSwitch("signup")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                    mode === "signup"
                      ? "bg-white text-ink shadow-sm border border-border"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSwitch("signin")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                    mode === "signin"
                      ? "bg-white text-ink shadow-sm border border-border"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  Sign In
                </button>
              </div>

              {/* Official Google OAuth Component — hidden if client ID not configured or recruiter signup */}
              {hasValidGoogleClientId && !(mode === "signup" && accountRole === "recruiter") && (
                <>
                  <div className="w-full mb-6">
                    <div className="flex p-1 bg-surface rounded-xl border border-border justify-center">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="outline"
                        shape="pill"
                        size="large"
                        text={mode === "signup" ? "signup_with" : "signin_with"}
                        width="500"
                      />
                    </div>
                  </div>

                  <Divider
                    label={
                      mode === "signup"
                        ? "OR WITH OTP VERIFICATION"
                        : "OR WITH CREDENTIALS"
                    }
                  />
                </>
              )}

              {/* Sign Up Form */}
              {mode === "signup" ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {/* I am a — Candidate / Recruiter Selector */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
                      I am a
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-surface rounded-xl border border-border">
                      <button
                        type="button"
                        onClick={() => setAccountRole("user")}
                        className={`py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                          accountRole === "user"
                            ? "bg-white text-ink shadow-sm border border-border font-bold"
                            : "text-ink-soft hover:text-ink"
                        }`}
                      >
                        <User className="w-3.5 h-3.5" /> Candidate
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountRole("recruiter")}
                        className={`py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                          accountRole === "recruiter"
                            ? "bg-white text-ink shadow-sm border border-border font-bold"
                            : "text-ink-soft hover:text-ink"
                        }`}
                      >
                        <Briefcase className="w-3.5 h-3.5" /> Recruiter
                      </button>
                    </div>
                  </div>

                  {/* Verify With Selector */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
                      Verify With
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-surface rounded-xl border border-border">
                      <button
                        type="button"
                        onClick={() => {
                          clearError();
                          setLocalError(null);
                          setVerificationMethod("email");
                        }}
                        className={`py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                          verificationMethod === "email"
                            ? "bg-white text-ink shadow-sm border border-border font-bold"
                            : "text-ink-soft hover:text-ink"
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" /> Email
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          clearError();
                          setLocalError(null);
                          setVerificationMethod("whatsapp");
                        }}
                        className={`py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                          verificationMethod === "whatsapp"
                            ? "bg-white text-ink shadow-sm border border-border font-bold text-emerald-600"
                            : "text-ink-soft hover:text-ink"
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />{" "}
                        WhatsApp
                      </button>
                    </div>
                  </div>

                  {/* Username Field */}
                  <Field label="Username">
                    <div className="relative">
                      <User className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="johndoe"
                        className="input-base pl-10"
                        required
                      />
                    </div>
                  </Field>

                  {/* Conditional Email vs WhatsApp Fields */}
                  {verificationMethod === "email" ? (
                    <Field label="Email Address">
                      <div className="relative">
                        <Mail className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="input-base pl-10"
                          required
                        />
                      </div>
                    </Field>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      <Field label="Country Code">
                        <div className="relative">
                          <Globe className="w-3.5 h-3.5 text-ink-soft absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="input-base pl-8 text-xs appearance-none font-semibold cursor-pointer"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.code} ({c.country})
                              </option>
                            ))}
                          </select>
                        </div>
                      </Field>
                      <div className="col-span-2">
                        <Field label="WhatsApp Number">
                          <div className="relative">
                            <Phone className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="1234567890"
                              className="input-base pl-10"
                              required
                            />
                          </div>
                        </Field>
                      </div>
                    </div>
                  )}

                  {accountRole === "recruiter" && (
                    <Field label="Company Website URL (with auto-suggest)">
                      <UrlAutoSuggestInput
                        value={companyWebsiteUrl}
                        onChange={(url) => {
                          setCompanyWebsiteUrl(url);
                          if (typeof window !== "undefined") {
                            sessionStorage.setItem("recruiter_initial_url", url);
                          }
                        }}
                        placeholder="https://your-company.com"
                      />
                    </Field>
                  )}

                  {/* Password & Confirm Password Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Password">
                      <div className="relative">
                        <Lock className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 8 chars"
                          className="input-base pl-10"
                          required
                        />
                      </div>
                    </Field>

                    <Field label="Confirm Password">
                      <div className="relative">
                        <Lock className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter"
                          className="input-base pl-10"
                          required
                        />
                      </div>
                    </Field>
                  </div>

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
                        <Loader2 className="w-4 h-4 animate-spin" /> Sending
                        Verification Code…
                      </>
                    ) : (
                      <>
                        {verificationMethod === "email" ? (
                          <>Send Email OTP</>
                        ) : (
                          <>Send WhatsApp OTP</>
                        )}
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Sign In Form */
                <form onSubmit={handleSignIn} className="space-y-4">
                  <Field label="Email or Phone Number">
                    <div className="relative">
                      <Mail className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com or +11234567890"
                        className="input-base pl-10"
                        required
                      />
                    </div>
                  </Field>

                  <Field label="Password">
                    <div className="relative">
                      <Lock className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        className="input-base pl-10"
                        required
                      />
                    </div>
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
                        <Loader2 className="w-4 h-4 animate-spin" /> Signing In…
                      </>
                    ) : (
                      <>Sign In</>
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {step === "verify" && (
            <div className="animate-fade-up">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="text-sm text-ink-soft hover:text-ink flex items-center gap-1.5 mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Back to details
              </button>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <ShieldCheck className="w-7 h-7 text-primary-glow" />
              </div>
              <h1 className="text-3xl font-extrabold text-ink tracking-tight">
                {verificationMethod === "email"
                  ? "Verify your Email"
                  : "Verify your WhatsApp"}
              </h1>
              <p className="text-ink-soft mt-2 text-sm">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-ink">
                  {verificationMethod === "email"
                    ? email
                    : `${countryCode}${phone}`}
                </span>
                .
              </p>

              <form onSubmit={handleVerifyOtp} className="mt-8 space-y-5">
                <div className="flex gap-2 sm:gap-3 justify-between">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={(e) => setOtpAt(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[i] && i > 0) {
                          const el = document.getElementById(
                            `otp-${i - 1}`,
                          ) as HTMLInputElement | null;
                          el?.focus();
                        }
                      }}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border border-border bg-white focus:border-primary-glow focus:ring-2 focus:ring-primary/20 outline-none transition"
                    />
                  ))}
                </div>

                {displayError && (
                  <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
                    {displayError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-brand text-primary-foreground font-semibold px-6 py-3.5 rounded-xl shadow-elegant hover:shadow-glow transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Verifying
                      OTP…
                    </>
                  ) : (
                    <>Verify & Create Account</>
                  )}
                </button>

                <p className="text-sm text-ink-soft text-center">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="text-primary-glow font-medium hover:underline"
                  >
                    Resend or change details
                  </button>
                </p>
              </form>
            </div>
          )}

          {step === "done" && (
            <div className="animate-fade-up text-center py-10">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h1 className="text-3xl font-extrabold text-ink tracking-tight">
                Account Verified! 🎉
              </h1>
              <p className="text-ink-soft mt-3 max-w-sm mx-auto text-sm">
                Your account has been created and verified. You are now logged
                in.
              </p>
              <button
                type="button"
                onClick={() => routeUserAfterAuth(useAuthStore.getState().user || user)}
                className="inline-flex mt-8 bg-gradient-brand text-primary-foreground font-semibold px-8 py-3.5 rounded-xl shadow-elegant hover:shadow-glow transition"
              >
                {accountRole === "recruiter" || (useAuthStore.getState().user?.role || user?.role) === "recruiter" ? "Continue to Recruiter Dashboard" : "Continue to Resume Onboarding"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT — Decorative Brand Panel */}
      <div className="hidden lg:flex relative bg-gradient-brand overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_left,white,transparent_60%)]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary-glow/40 blur-3xl" />

        <div className="relative max-w-md text-white">
          <div className="inline-flex items-center gap-2 text-xs font-semibold bg-white/15 backdrop-blur px-3 py-1.5 rounded-full border border-white/20 mb-6">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Career Suite
          </div>
          <h2 className="text-4xl font-extrabold leading-tight">
            Production-Grade
            <br />
            Resume & Identity.
          </h2>
          <p className="mt-4 text-white/80 text-lg leading-relaxed">
            Build ATS-optimized resumes backed by robust authentication,
            real-time AI scoring, and secure cloud storage.
          </p>

          <div className="mt-10 space-y-3">
            {[
              "Real OAuth 2.0 & JWT Session Management",
              "Production MongoDB Cloud Resume Storage",
              "Instant AI Resume Import & Content Generator",
            ].map((t) => (
              <div key={t} className="flex items-center gap-3 text-white/95">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                <span className="text-sm font-medium">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs font-semibold tracking-wider text-ink-soft">
        {label}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
