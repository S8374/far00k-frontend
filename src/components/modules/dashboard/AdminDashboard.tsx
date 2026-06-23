"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useBlockToggleUserMutation,
  useCreateAdminUserMutation,
  useDeleteAdminUserMutation,
  useGetAdminUsersQuery,
  useGetPendingKycDocumentsQuery,
  useGetPendingPropertiesQuery,
  useUpdateAdminUserMutation,
  useVerifyKycDocumentByAdminMutation,
  useVerifyPropertyByAdminMutation,
} from "@/redux/api/adminApi";
import { CheckCircle2, ShieldAlert, UserRoundCog, UserRoundX, Users } from "lucide-react";

type UserPayload = {
  fullName: string;
  email: string;
  password?: string;
  role: string;
};

const defaultUserForm: UserPayload = {
  fullName: "",
  email: "",
  password: "",
  role: "BUYER",
};

const getKycDocumentId = (doc: any) =>
  doc?.documentUID ||
  doc?.documentId ||
  doc?.kycDocumentId ||
  doc?.uid ||
  doc?.id ||
  doc?._id ||
  null;

export default function AdminDashboard({ admin }: { admin: any }) {
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [createForm, setCreateForm] = useState<UserPayload>(defaultUserForm);
  const [editForm, setEditForm] = useState<UserPayload>(defaultUserForm);

  const [propertyForm, setPropertyForm] = useState<Record<string, { sakNumber: string; notes: string }>>({});
  const [kycNotes, setKycNotes] = useState<Record<string, string>>({});

  const { data: users = [], isLoading: usersLoading } = useGetAdminUsersQuery({ search, page: 1, limit: 100 });
  const { data: pendingProperties = [], isLoading: pendingPropertyLoading } = useGetPendingPropertiesQuery();
  const { data: pendingKycDocs = [], isLoading: pendingKycLoading } = useGetPendingKycDocumentsQuery();

  const [createUser, { isLoading: creating }] = useCreateAdminUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateAdminUserMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteAdminUserMutation();
  const [toggleBlock, { isLoading: blocking }] = useBlockToggleUserMutation();
  const [verifyProperty, { isLoading: verifyingProperty }] = useVerifyPropertyByAdminMutation();
  const [verifyKyc, { isLoading: verifyingKyc }] = useVerifyKycDocumentByAdminMutation();

  const blockedUsersCount = useMemo(
    () => users.filter((u: any) => Boolean(u?.isBlocked || u?.status === "BLOCKED")).length,
    [users]
  );

  const handleCreateUser = async () => {
    if (!createForm.fullName || !createForm.email || !createForm.password) {
      toast.error("Name, email and password are required");
      return;
    }

    try {
      await createUser(createForm).unwrap();
      toast.success("User created successfully");
      setCreateForm(defaultUserForm);
      setCreateOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create user");
    }
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setEditForm({
      fullName: user?.fullName || "",
      email: user?.email || "",
      role: user?.role || "BUYER",
      password: "",
    });
    setEditOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser?.id) return;

    const payload: any = {
      fullName: editForm.fullName,
      email: editForm.email,
      role: editForm.role,
    };

    if (editForm.password) {
      payload.password = editForm.password;
    }

    try {
      await updateUser({ userId: editingUser.id, payload }).unwrap();
      toast.success("User updated successfully");
      setEditOpen(false);
      setEditingUser(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const ok = window.confirm("Delete this user permanently?");
    if (!ok) return;

    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  const handleBlockToggle = async (user: any) => {
    const isBlocked = Boolean(user?.isBlocked || user?.status === "BLOCKED");
    const reason = !isBlocked ? window.prompt("Reason for blocking this user (optional):") || "" : "";

    try {
      await toggleBlock({
        userId: user.id,
        isBlocked: !isBlocked,
        reason,
      }).unwrap();
      toast.success(!isBlocked ? "User blocked" : "User unblocked");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update block status");
    }
  };

  const handlePropertyVerify = async (property: any) => {
    const rowState = propertyForm[property.id] || { sakNumber: property?.sakNumber || "", notes: "" };

    if (!rowState.sakNumber) {
      toast.error("Sak number is required before verification");
      return;
    }

    try {
      await verifyProperty({
        propertyId: property.id,
        adminId: admin?.id,
        isRegaVerified: true,
        sakNumber: rowState.sakNumber,
        notes: rowState.notes || "Property verified by admin",
      }).unwrap();
      toast.success("Property verified successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to verify property");
    }
  };

  const handleKycAction = async (doc: any, isApproved: boolean) => {
    const documentId = getKycDocumentId(doc);

    if (!documentId) {
      toast.error("KYC document id not found");
      return;
    }

    try {
      const noteText = kycNotes[documentId] || "";
      const rejectionReason = isApproved ? undefined : noteText || "Rejected by admin";

      await verifyKyc({
        documentId,
        adminId: admin?.id,
        status: isApproved ? "VERIFIED" : "REJECTED",
        notes: noteText || (isApproved ? "KYC approved" : "KYC rejected"),
        rejectionReason,
      }).unwrap();
      toast.success(isApproved ? "KYC approved" : "KYC rejected");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update KYC status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
          <p className="text-sm text-zinc-400">Manage users, verify properties, and review KYC documents.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MiniStat title="Users" value={users.length} icon={<Users className="h-4 w-4" />} />
          <MiniStat title="Blocked" value={blockedUsersCount} icon={<UserRoundX className="h-4 w-4" />} />
          <MiniStat title="Pending Property" value={pendingProperties.length} icon={<ShieldAlert className="h-4 w-4" />} />
          <MiniStat title="Pending KYC" value={pendingKycDocs.length} icon={<CheckCircle2 className="h-4 w-4" />} />
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="h-auto flex-wrap bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="properties">Property Verification</TabsTrigger>
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card className="border-zinc-800 bg-zinc-900/60 text-white">
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-lg">Users CRUD + Block/Unblock</CardTitle>
              <div className="flex flex-col gap-2 md:flex-row">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users by name/email"
                  className="w-full md:w-72"
                />
                <Button onClick={() => setCreateOpen(true)} className="bg-emerald-600 hover:bg-emerald-500">
                  <UserRoundCog className="mr-2 h-4 w-4" />
                  Create User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersLoading ? (
                    <TableRow className="border-zinc-800">
                      <TableCell colSpan={5} className="text-center text-zinc-400">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow className="border-zinc-800">
                      <TableCell colSpan={5} className="text-center text-zinc-400">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user: any) => {
                      const isBlocked = Boolean(user?.isBlocked || user?.status === "BLOCKED");

                      return (
                        <TableRow key={user?.id} className="border-zinc-800">
                          <TableCell>{user?.fullName || "N/A"}</TableCell>
                          <TableCell>{user?.email || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-zinc-700 text-zinc-200">
                              {user?.role || "USER"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={isBlocked ? "bg-red-600" : "bg-emerald-600"}>
                              {isBlocked ? "Blocked" : "Active"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => openEditModal(user)}>
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                className={isBlocked ? "bg-blue-600 hover:bg-blue-500" : "bg-amber-600 hover:bg-amber-500"}
                                onClick={() => handleBlockToggle(user)}
                                disabled={blocking}
                              >
                                {isBlocked ? "Unblock" : "Block"}
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-500"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={deleting}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="mt-4">
          <Card className="border-zinc-800 bg-zinc-900/60 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Pending Properties Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>Property</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Sak Number</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPropertyLoading ? (
                    <TableRow className="border-zinc-800">
                      <TableCell colSpan={5} className="text-center text-zinc-400">
                        Loading pending properties...
                      </TableCell>
                    </TableRow>
                  ) : pendingProperties.length === 0 ? (
                    <TableRow className="border-zinc-800">
                      <TableCell colSpan={5} className="text-center text-zinc-400">
                        No pending properties found
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingProperties.map((property: any) => {
                      const rowState = propertyForm[property.id] || {
                        sakNumber: property?.sakNumber || "",
                        notes: "",
                      };

                      return (
                        <TableRow key={property?.id} className="border-zinc-800">
                          <TableCell>{property?.title || "Untitled"}</TableCell>
                          <TableCell>{property?.user?.fullName || property?.ownerName || "N/A"}</TableCell>
                          <TableCell>
                            <Input
                              value={rowState.sakNumber}
                              onChange={(e) =>
                                setPropertyForm((prev) => ({
                                  ...prev,
                                  [property.id]: { ...rowState, sakNumber: e.target.value },
                                }))
                              }
                              placeholder="Enter sak number"
                              className="w-44"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={rowState.notes}
                              onChange={(e) =>
                                setPropertyForm((prev) => ({
                                  ...prev,
                                  [property.id]: { ...rowState, notes: e.target.value },
                                }))
                              }
                              placeholder="Verification note"
                              className="w-56"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-500"
                              onClick={() => handlePropertyVerify(property)}
                              disabled={verifyingProperty}
                            >
                              Verify Property
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="mt-4">
          <Card className="border-zinc-800 bg-zinc-900/60 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Pending KYC Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>User</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingKycLoading ? (
                    <TableRow className="border-zinc-800">
                      <TableCell colSpan={5} className="text-center text-zinc-400">
                        Loading pending KYC documents...
                      </TableCell>
                    </TableRow>
                  ) : pendingKycDocs.length === 0 ? (
                    <TableRow className="border-zinc-800">
                      <TableCell colSpan={5} className="text-center text-zinc-400">
                        No pending KYC documents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingKycDocs.map((doc: any) => {
                      const docId = getKycDocumentId(doc);

                      return (
                        <TableRow key={docId} className="border-zinc-800">
                          <TableCell>{doc?.user?.fullName || doc?.fullName || doc?.userId || "N/A"}</TableCell>
                          <TableCell>{doc?.documentType || "N/A"}</TableCell>
                          <TableCell>
                            {doc?.fileUrl ? (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-400 underline"
                              >
                                Open file
                              </a>
                            ) : (
                              "No file"
                            )}
                          </TableCell>
                          <TableCell>
                            <Textarea
                              value={kycNotes[docId] || ""}
                              onChange={(e) => setKycNotes((prev) => ({ ...prev, [docId]: e.target.value }))}
                              placeholder="Admin note"
                              className="min-h-9 w-56"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-500"
                                onClick={() => handleKycAction(doc, true)}
                                disabled={verifyingKyc}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-500"
                                onClick={() => handleKycAction(doc, false)}
                                disabled={verifyingKyc}
                              >
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-800">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>Admin can create a new buyer/agent/admin user from here.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={createForm.fullName}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Full Name"
            />
            <Input
              value={createForm.email}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
            />
            <Input
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="Password"
            />
            <Input
              value={createForm.role}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, role: e.target.value.toUpperCase() }))}
              placeholder="Role: BUYER / AGENT / ADMIN"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCreateUser} disabled={creating} className="bg-emerald-600 hover:bg-emerald-500">
              {creating ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-800">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user profile data or role.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={editForm.fullName}
              onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Full Name"
            />
            <Input
              value={editForm.email}
              onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
            />
            <Input
              value={editForm.role}
              onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value.toUpperCase() }))}
              placeholder="Role"
            />
            <Input
              type="password"
              value={editForm.password}
              onChange={(e) => setEditForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="New Password (optional)"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateUser} disabled={updating} className="bg-emerald-600 hover:bg-emerald-500">
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MiniStat({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/80 text-white">
      <CardContent className="flex items-center justify-between p-3">
        <div>
          <p className="text-xs text-zinc-400">{title}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
        <div className="rounded-lg bg-emerald-500/15 p-2 text-emerald-400">{icon}</div>
      </CardContent>
    </Card>
  );
}
