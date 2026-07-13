"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  UserCheck,
  Trash
} from "lucide-react";
import { createUser, updateUser, deleteUser } from "@/app/actions/admin";

interface UserItem {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
}

interface UsersClientProps {
  initialUsers: UserItem[];
  currentUserId: string;
}

const roleOptions = [
  { label: "Super Admin", value: "SUPER_ADMIN" },
  { label: "Admin", value: "ADMIN" },
  { label: "Editor", value: "EDITOR" },
  { label: "Design Team", value: "DESIGN" }
];

export function UsersClient({ initialUsers, currentUserId }: UsersClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [password, setPassword] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // Filter users
  const filteredUsers = initialUsers.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and Password are required.");
      return;
    }

    startTransition(async () => {
      try {
        await createUser({ email, name: name || null, role, password });
        toast.success("User created successfully!");
        setIsAddOpen(false);
        resetForm();
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to create user");
      }
    });
  };

  const handleEditClick = (user: UserItem) => {
    setSelectedUser(user);
    setName(user.name || "");
    setEmail(user.email);
    setRole(user.role);
    setPassword(""); // Leave blank unless resetting
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !email) return;

    startTransition(async () => {
      try {
        await updateUser(selectedUser.id, {
          email,
          name: name || null,
          role,
          password: password || undefined,
        });
        toast.success("User updated successfully!");
        setIsEditOpen(false);
        resetForm();
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to update user");
      }
    });
  };

  const handleDeleteClick = (user: UserItem) => {
    if (user.id === currentUserId) {
      toast.error("You cannot delete your own account.");
      return;
    }
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedUser) return;

    startTransition(async () => {
      try {
        await deleteUser(selectedUser.id);
        toast.success("User deleted successfully!");
        setIsDeleteOpen(false);
        setSelectedUser(null);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete user");
      }
    });
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("ADMIN");
    setPassword("");
    setSelectedUser(null);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by name/email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-gray-200"
          />
        </div>
        <Button 
          onClick={() => {
            resetForm();
            setIsAddOpen(true);
          }}
          className="w-full sm:w-auto bg-[#FFD400] text-black hover:bg-[#e6be00] font-semibold h-10 px-4 rounded-xl flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Admin</span>
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-100">
              <TableHead className="font-semibold text-gray-700 py-4 pl-6">Name / Email</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">Role</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">Date Added</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                  No administrative users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                  <TableCell className="py-4 pl-6">
                    <div className="font-medium text-gray-900 flex items-center gap-1.5">
                      <span>{user.name || "Unnamed Account"}</span>
                      {user.id === currentUserId && (
                        <span className="text-[9px] bg-gray-900 text-white font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">You</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </TableCell>
                  <TableCell className="py-4 font-mono text-xs font-semibold text-gray-700">
                    <span className={`px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      user.role === "SUPER_ADMIN" ? "bg-red-100 text-red-800" :
                      user.role === "ADMIN" ? "bg-blue-100 text-blue-800" :
                      user.role === "EDITOR" ? "bg-purple-100 text-purple-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500 py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-500 hover:text-gray-900 rounded-lg"
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-40"
                        onClick={() => handleDeleteClick(user)}
                        disabled={user.id === currentUserId}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md bg-white text-gray-900 rounded-2xl border-none shadow-xl">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-lg font-bold">Create Admin Account</DialogTitle>
              <DialogDescription>Add a new user with dedicated role permissions.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="add-user-name">Account Name</Label>
                <Input
                  id="add-user-name"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-user-email">Email Address</Label>
                <Input
                  id="add-user-email"
                  type="email"
                  placeholder="e.g. user@magantakreasi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-user-role">Permission Role</Label>
                <select
                  id="add-user-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isPending}
                  className="w-full h-10 border border-gray-200 bg-white rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                >
                  {roleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-user-pass">Password</Label>
                <Input
                  id="add-user-pass"
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddOpen(false)}
                disabled={isPending}
                className="border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isPending}
                className="bg-[#FFD400] text-black hover:bg-[#e6be00] font-semibold"
              >
                {isPending ? "Creating..." : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md bg-white text-gray-900 rounded-2xl border-none shadow-xl">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-lg font-bold">Edit Account Details</DialogTitle>
              <DialogDescription>Modify permissions, account name, or reset the password.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-user-name">Account Name</Label>
                <Input
                  id="edit-user-name"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-user-email">Email Address</Label>
                <Input
                  id="edit-user-email"
                  type="email"
                  placeholder="e.g. user@magantakreasi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-user-role">Permission Role</Label>
                <select
                  id="edit-user-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isPending || selectedUser?.id === currentUserId}
                  className="w-full h-10 border border-gray-200 bg-white rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400] disabled:bg-gray-50"
                >
                  {roleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {selectedUser?.id === currentUserId && (
                  <p className="text-[10px] text-gray-400 mt-1 italic">You cannot demote your own Super Admin privileges.</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-user-pass">Reset Password</Label>
                <Input
                  id="edit-user-pass"
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditOpen(false)}
                disabled={isPending}
                className="border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isPending}
                className="bg-[#FFD400] text-black hover:bg-[#e6be00] font-semibold"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md bg-white text-gray-900 rounded-2xl border-none shadow-xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-bold text-red-600 flex items-center gap-2">
              <Trash className="h-5 w-5" />
              <span>Delete Admin Account</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user <strong>{selectedUser?.name || selectedUser?.email}</strong>? They will lose all dashboard access immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteOpen(false)}
              disabled={isPending}
              className="border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              variant="destructive"
              onClick={handleDeleteSubmit}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
