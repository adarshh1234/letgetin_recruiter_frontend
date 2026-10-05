import { redirect } from "next/navigation";

export default async function JobHiringPipelineRedirect({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  redirect(`/recruiter/jobs?tab=timeline&jobId=${jobId}`);
}
