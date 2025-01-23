import type React from "react";
import { Button } from "./ui/button";

interface OrganizationPopupProps {
  organizationId: string;
  logo_url?: string;
  name: string;
}

const OrganizationPopup: React.FC<OrganizationPopupProps> = ({
  organizationId,
  logo_url,
  name,
}) => {
  return (
    <div className="max-w-sm p-4 bg-white  flex flex-col items-center">
      {logo_url ? (
        <img
          src={logo_url || "/placeholder.svg"}
          alt={`Logo ${name}`}
          className="mb-4 max-w-full h-auto"
          style={{ maxHeight: "100px" }}
        />
      ) : (
        <div className="mb-4 w-20 h-24 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-500 text-2xl">{name.charAt(0)}</span>
        </div>
      )}
      <h3 className="text-lg font-semibold">Società:</h3>
      <h3 className="text-base mb-4 text-center">
        {name || "Nome non disponibile"}
      </h3>
      <Button
        className="bg-red-600 hover:bg-red-400 text-white p-2 px-4 more-info-button"
        data-organization-id={organizationId}
      >
        Info
      </Button>
    </div>
  );
};

export default OrganizationPopup;
