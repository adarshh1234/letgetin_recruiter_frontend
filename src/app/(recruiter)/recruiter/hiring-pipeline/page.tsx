import { redirect } from "next/navigation";

export default function HiringPipelineIndexPage() {
  redirect("/recruiter/jobs?tab=timeline");
}
