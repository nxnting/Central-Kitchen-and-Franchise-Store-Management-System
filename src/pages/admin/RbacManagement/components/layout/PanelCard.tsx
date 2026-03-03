// src/pages/admin/RbacManagement/components/layout/PanelCard.tsx
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const PanelCard: React.FC<Props> = ({ children, className }) => {
  return (
    <div className={["bg-card border rounded-xl", className ?? ""].join(" ")}>
      {children}
    </div>
  );
};

export default PanelCard;