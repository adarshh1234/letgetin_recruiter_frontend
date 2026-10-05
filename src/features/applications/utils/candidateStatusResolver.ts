import { ApplicationItem, CandidateDisplayState, CandidateFunnelStage } from '../types';

/**
 * Resolves the candidate-facing display state deterministically from authoritative
 * application fields and dynamic funnel stages.
 *
 * Never exposes recruiter-internal metrics (compositeRank, formulas, raw scores).
 */
export function resolveCandidateStatus(
  application: ApplicationItem,
  funnelStages?: CandidateFunnelStage[]
): CandidateDisplayState {
  const {
    status,
    resumeDecision,
    resumeScreeningStatus,
    poolType,
    currentStageIndex,
    currentStageId,
    stageStatus,
    stageDeadline,
    finalShortlistDecision,
    hiredAt,
    offeredAt,
  } = application;

  const totalStages = funnelStages?.length || 0;
  const currentStage = funnelStages?.find((s) => s.stageId === currentStageId) ||
    (typeof currentStageIndex === 'number' && funnelStages?.[currentStageIndex]) ||
    null;
  const stageName = currentStage?.stageName;

  // 1. Hired / Offer Accepted
  if (finalShortlistDecision === 'hired' || hiredAt || status === ('hired' as any) || status === ('offer_accepted' as any)) {
    return {
      key: 'hired',
      label: 'Offer Accepted & Hired',
      badgeVariant: 'success',
      badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      description: 'Congratulations! Your offer has been confirmed and the hiring team is excited to welcome you aboard.',
    };
  }

  // 2. Offer Received
  if (finalShortlistDecision === 'offered' || offeredAt || status === 'offered') {
    return {
      key: 'offer_received',
      label: 'Offer Received 🎉',
      badgeVariant: 'success',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse',
      description: 'The hiring team has extended a formal job offer! Please review the details with the recruiter.',
      actionRequired: true,
      actionLabel: 'Review Offer Details',
    };
  }

  // 3. Final Shortlist / Final Consideration
  if (
    finalShortlistDecision === 'shortlisted' ||
    (totalStages > 0 && typeof currentStageIndex === 'number' && currentStageIndex >= totalStages - 1 && (stageStatus === 'passed' || stageStatus === 'completed'))
  ) {
    return {
      key: 'final_review',
      label: 'In Final Consideration',
      badgeVariant: 'info',
      badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      description: 'You have successfully passed all evaluated stages! The hiring team is conducting final selection reviews.',
    };
  }

  // 4. Stage Missed / Window Expired
  if (stageStatus === 'no_show') {
    return {
      key: 'missed_stage',
      label: 'Stage Window Expired',
      badgeVariant: 'destructive',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      description: `The deadline for ${stageName || 'this stage'} has passed. The position may have proceeded with other candidates.`,
    };
  }

  // 5. Not Selected During Stage or Finalist Review
  if (stageStatus === 'failed' || finalShortlistDecision === 'rejected') {
    return {
      key: 'not_selected_stage',
      label: 'Not Selected to Proceed',
      badgeVariant: 'secondary',
      badgeClass: 'bg-zinc-800 text-zinc-400 border-zinc-700',
      description: 'Thank you for your effort and time. The team has decided to proceed with other candidates whose profiles more closely match this role.',
    };
  }

  // 6. Active Stage In Progress
  if (stageStatus === 'started') {
    return {
      key: 'in_progress',
      label: stageName ? `${stageName} in Progress` : 'Stage in Progress',
      badgeVariant: 'warning',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      description: 'You have started this stage. Please ensure all parts are submitted before the deadline.',
      stageName,
      actionRequired: true,
      actionLabel: 'Continue Stage',
    };
  }

  // 7. Action Required: Invited to Stage
  if (stageStatus === 'invited') {
    const deadlineText = stageDeadline ? `before ${new Date(stageDeadline).toLocaleDateString()}` : 'soon';
    return {
      key: 'action_required',
      label: 'Action Required',
      badgeVariant: 'warning',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse',
      description: `You are invited to complete ${stageName || 'the next stage'} ${deadlineText}. Click below to begin.`,
      stageName,
      actionRequired: true,
      actionLabel: `Start ${stageName || 'Stage'}`,
    };
  }

  // 8. Stage Completed (Waiting Next Stage)
  if (stageStatus === 'completed' || stageStatus === 'passed') {
    return {
      key: 'stage_completed',
      label: stageName ? `${stageName} Completed` : 'Stage Completed',
      badgeVariant: 'info',
      badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      description: `Your submission for ${stageName || 'the previous stage'} is being processed. The next stage details will appear here shortly.`,
      stageName,
    };
  }

  // 9. Reserve Pool / Standby
  if (poolType === 'reserve') {
    return {
      key: 'on_standby',
      label: 'On Standby',
      badgeVariant: 'outline',
      badgeClass: 'bg-amber-500/5 text-amber-300/80 border-amber-500/20',
      description: 'Your application met qualifications and is placed on active reserve. You will be automatically invited if an opening advances.',
    };
  }

  // 10. Selected for Process (Qualified primary pool, waiting stage invite)
  if (resumeDecision === 'shortlisted' || poolType === 'primary') {
    return {
      key: 'selected_for_hiring_process',
      label: 'Selected for Hiring Process',
      badgeVariant: 'success',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      description: 'Congratulations! Your profile has qualified for this role. Invitations to upcoming stages will be issued soon.',
    };
  }

  // 11. Not Selected at Resume Shortlisting
  if (resumeDecision === 'rejected' || status === 'rejected' || poolType === 'disqualified') {
    return {
      key: 'not_selected_resume',
      label: 'Application Not Selected',
      badgeVariant: 'secondary',
      badgeClass: 'bg-zinc-800 text-zinc-400 border-zinc-700',
      description: 'Thank you for your interest. While we appreciated reviewing your profile, the team is moving forward with other applicants for this position.',
    };
  }

  // 12. Application Under Review
  if (resumeScreeningStatus === 'ai_reviewing' || status === 'reviewing') {
    return {
      key: 'application_under_review',
      label: 'Application Under Review',
      badgeVariant: 'info',
      badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      description: 'Your application is actively undergoing qualification review by our AI screening team.',
    };
  }

  // 13. Application Submitted (Default initial state)
  return {
    key: 'application_submitted',
    label: 'Application Submitted',
    badgeVariant: 'default',
    badgeClass: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    description: 'We have received your application. The review process will begin shortly.',
  };
}
