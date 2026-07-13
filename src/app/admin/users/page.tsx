import { prisma } from "@/lib/db";
import { UsersClient } from "@/components/admin/UsersClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Map users mapping out sensitive credentials
  const mappedUsers = users.map(user => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
        <p className="text-gray-500 mt-1">Manage administrator access, roles, and platform permissions.</p>
      </div>

      <UsersClient initialUsers={mappedUsers} currentUserId={session.user.id} />
    </div>
  );
}
