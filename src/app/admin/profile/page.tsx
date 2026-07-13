import { prisma } from "@/lib/db";
import { ProfileClient } from "@/components/admin/ProfileClient";

export const revalidate = 0;

export default async function ProfilePage() {
  let profile = await prisma.companyProfile.findFirst();

  if (!profile) {
    profile = await prisma.companyProfile.create({
      data: {
        name: "Maganta Kreasi",
        description: "Event Fabrication & Decoration Solutions.",
      }
    });
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Company Profile</h1>
        <p className="text-gray-500 mt-1">Configure your corporate information, branding description, address, and social links.</p>
      </div>

      <ProfileClient profile={profile} />
    </div>
  );
}
