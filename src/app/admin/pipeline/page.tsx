import { prisma } from "@/lib/db";
import { PipelineClient } from "@/components/admin/PipelineClient";

export const revalidate = 0;

export default async function PipelinePage() {
  const steps = await prisma.pipelineStep.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fabrication Pipeline</h1>
          <p className="text-gray-500 mt-1">Manage project steps and workflow sequence for the &quot;Fabrication Pipeline&quot; section.</p>
        </div>
      </div>
      
      <PipelineClient initialSteps={steps} />
    </div>
  );
}
