import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { ProjectDetailView } from "@/components/realtor/ProjectDetailView";
import { resolveRole } from "@/lib/role";
import { PROJECTS, getProject } from "@/data/projects";

// =============================================================
// CHI TIẾT DỰ ÁN  (/realtor/du-an/[id])
// [id] = slug dự án trong PROJECTS. Sai slug -> 404.
// =============================================================

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const project = getProject(params.id);
  return {
    title: project ? `${project.name} | Q-Broker` : "Dự án | Q-Broker",
  };
}

export default function DuAnDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { role?: string };
}) {
  const project = getProject(params.id);
  if (!project) notFound();

  const { roleId, name } = resolveRole(searchParams.role);

  return (
    <div className="min-h-screen bg-slate-50">
      <RealtorHeader userName={name} roleId={roleId} />
      <ProjectDetailView project={project} roleId={roleId} />
      <RealtorFooter />
    </div>
  );
}
