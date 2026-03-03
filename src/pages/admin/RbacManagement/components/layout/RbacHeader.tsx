// src/pages/admin/RbacManagement/components/layout/RbacHeader.tsx
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";

const RbacHeader: React.FC = () => {
  return (
    <PageHeader
      title="Quản lý phân quyền"
      subtitle="Quản lý vai trò, quyền và gán quyền cho vai trò"
    />
  );
};

export default RbacHeader;