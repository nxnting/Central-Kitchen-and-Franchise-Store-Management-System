import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";

import { adminFranchisesApi } from "@/api/admin/franchises.api";
import { adminUserFranchisesApi } from "@/api/admin/userFranchises.api";
import type {
  AdminFranchise,
  AssignedUserItem,
} from "@/types/admin/franchise.types";
import { AddUserToFranchiseModal } from "@/pages/admin/FranchiseManagement/components/AddUserToFranchiseModal";

const FranchiseDetail: React.FC = () => {
  const nav = useNavigate();
  const { franchiseId } = useParams();
  const id = Number(franchiseId);

  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [franchise, setFranchise] = useState<AdminFranchise | null>(null);

  const [users, setUsers] = useState<AssignedUserItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const loadFranchise = async () => {
    try {
      setLoading(true);
      const list = await adminFranchisesApi.list();
      const found = list.find((x) => x.franchiseId === id) || null;
      setFranchise(found);

      if (!found) {
        toast.error("Không tìm thấy cửa hàng");
        return null;
      }

      return found;
    } catch (e) {
      console.error(e);
      toast.error("Không tải được chi tiết cửa hàng");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async (currentFranchise?: AdminFranchise | null) => {
    const target = currentFranchise ?? franchise;
    if (!target) return;

    try {
      setUsersLoading(true);

      const data = await adminUserFranchisesApi.listUsersByAssignment({
        assignmentType: "FRANCHISE",
        franchiseId: target.franchiseId,
      });

      setUsers(data);
    } catch (e) {
      console.error(e);
      toast.error("Không tải được danh sách người dùng của cửa hàng");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(id)) return;

    const run = async () => {
      const found = await loadFranchise();
      if (!found) return;
      await loadUsers(found);
    };

    run();
  }, [id]);

  const subtitle = useMemo(() => {
    if (!franchise) return "Chi tiết cửa hàng";
    return `Cửa hàng • ${franchise.status === "ACTIVE" ? "Đang hoạt động" : franchise.status}`;
  }, [franchise]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={franchise?.name || "Chi tiết cửa hàng"}
        subtitle={subtitle}
        action={{ label: "Quay lại", onClick: () => nav("/admin/locations") }}
      />

      <div className="bg-card border rounded-xl p-4 mb-6">
        {loading ? (
          <div className="text-sm text-muted-foreground">Đang tải...</div>
        ) : franchise ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Khu vực:</span>{" "}
              {franchise.location}
            </div>
            <div>
              <span className="text-muted-foreground">Loại:</span> Cửa hàng
            </div>
            <div>
              <span className="text-muted-foreground">Địa chỉ:</span>{" "}
              {franchise.address}
            </div>
            <div>
              <span className="text-muted-foreground">Bếp phụ trách:</span>{" "}
              {franchise.centralKitchenName || "-"}
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-muted-foreground">
            Danh sách người dùng thuộc cửa hàng này
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => loadUsers()}
              disabled={usersLoading || !franchise}
            >
              Làm mới
            </Button>
            <Button onClick={() => setAddOpen(true)} disabled={!franchise}>
              Thêm người dùng
            </Button>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4">
          {usersLoading ? (
            <div className="text-sm text-muted-foreground">
              Đang tải danh sách người dùng...
            </div>
          ) : users.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Chưa có người dùng nào.
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((u) => (
                <div
                  key={u.userId}
                  className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0"
                >
                  <div>
                    <div className="font-medium">{u.username}</div>
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
                        await adminUserFranchisesApi.remove(u.userId);
                        toast.success("Đã gỡ người dùng khỏi cửa hàng");
                        await loadUsers();
                      } catch (e) {
                        console.error(e);
                        toast.error("Gỡ người dùng thất bại");
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
      </div>

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