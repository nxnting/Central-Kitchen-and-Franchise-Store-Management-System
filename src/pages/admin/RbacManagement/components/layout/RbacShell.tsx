// src/pages/admin/RbacManagement/components/layout/RbacShell.tsx
import React from "react";

type Props = {
  left: React.ReactNode;
  right: React.ReactNode;
};

const RbacShell: React.FC<Props> = ({ left, right }) => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-4">{left}</div>
      <div className="col-span-12 lg:col-span-8 space-y-4">{right}</div>
    </div>
  );
};

export default RbacShell;