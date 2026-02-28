import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { adminFranchisesApi } from "@/api/admin/franchises.api";
import { adminUserFranchisesApi } from "@/api/admin/userFranchises.api";
import type { AdminFranchise } from "@/types/admin/franchise.types";
import { AddUserToFranchiseModal } from "@/pages/admin/FranchiseManagement/components/AddUserToFranchiseModal";
type FranchiseUserItem = {
  userId: number;
  username: string;
  email: string;
  roleName: string;
  assignedAt?: string;
};

const FranchiseDetail: React.FC = () => {
  const nav = useNavigate();
  const { franchiseId } = useParams();
  const id = Number(franchiseId);
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [franchise, setFranchise] = useState<AdminFranchise | null>(null);

  const [tab, setTab] = useState<"INFO" | "USERS">("USERS");
  const [users, setUsers] = useState<FranchiseUserItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const loadFranchise = async () => {
    try {
      setLoading(true);
      const list = await adminFranchisesApi.list();
      const found = list.find((x) => x.franchiseId === id) || null;
      setFranchise(found);
      if (!found) toast.error("Không tìm thấy cửa hàng/bếp");
    } catch (e) {
      console.error(e);
      toast.error("Không tải được franchise detail");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const data = await adminUserFranchisesApi.listUsersByFranchise(id);
      setUsers(data as FranchiseUserItem[]);
    } catch (e) {
      console.error(e);
      toast.error("Không tải được danh sách user của cửa hàng/bếp");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    loadFranchise();
    loadUsers();
    
  }, [id]);

  const subtitle = useMemo(() => {
    if (!franchise) return "Chi tiết cửa hàng/bếp";
    return `${franchise.type === "STORE" ? "Cửa hàng" : "Bếp trung tâm"} • ${franchise.status}`;
  }, [franchise]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={franchise?.name || "Chi tiết cửa hàng/bếp"}
        subtitle={subtitle}
        action={{ label: "Quay lại", onClick: () => nav("/admin/locations") }} 
      />

      <div className="bg-card border rounded-xl p-4 mb-6">
        {loading ? (
          <div className="text-sm text-muted-foreground">Đang tải...</div>
        ) : franchise ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">ID:</span>{" "}
              {franchise.franchiseId}
            </div>
            <div>
              <span className="text-muted-foreground">Khu vực:</span>{" "}
              {franchise.location}
            </div>
            <div>
              <span className="text-muted-foreground">Địa chỉ:</span>{" "}
              {franchise.address}
            </div>
            <div>
              <span className="text-muted-foreground">Loại:</span>{" "}
              {franchise.type}
            </div>
          </div>
        ) : null}
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as any)}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="INFO">Thông tin</TabsTrigger>
          <TabsTrigger value="USERS">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="INFO">
          <div className="text-sm text-muted-foreground">
            (chờ data kkkk)
          </div>
        </TabsContent>

        <TabsContent value="USERS">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-muted-foreground">
              Danh sách user thuộc cửa hàng/bếp này
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={loadUsers}
                disabled={usersLoading}
              >
                Refresh
              </Button>
              <Button onClick={() => setAddOpen(true)} disabled={!franchise}>
                Add User
              </Button>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-4">
            {usersLoading ? (
              <div className="text-sm text-muted-foreground">
                Đang tải users...
              </div>
            ) : users.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Chưa có user nào.
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((u) => (
                  <div
                    key={u.userId}
                    className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0"
                  >
                    <div>
                      <div className="font-medium">
                        {u.username}{" "}
                        <span className="text-xs text-muted-foreground">
                          #{u.userId}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {u.email} • {u.roleName}
                      </div>
                    </div>

                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={async () => {
                        try {
                          await adminUserFranchisesApi.remove(
                            u.userId,
                            franchise!.franchiseId,
                          );
                          toast.success("Đã gỡ user khỏi cửa hàng/bếp");
                          loadUsers();
                        } catch (e) {
                          toast.error("Gỡ user thất bại");
                        }
                      }}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      {franchise && (
        <AddUserToFranchiseModal
          open={addOpen}
          onOpenChange={setAddOpen}
          franchise={franchise}
          onAssigned={loadUsers}
        />
      )}
    </div>
  );
};

export default FranchiseDetail;
