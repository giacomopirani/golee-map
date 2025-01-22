import type React from "react";
import { Button } from "./ui/button";

interface OrganizationPopupProps {
  logo_url?: string;
  name: string;
  onMoreInfo: () => void;
}

const OrganizationPopup: React.FC<OrganizationPopupProps> = ({
  logo_url,
  name,
  onMoreInfo,
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
        onClick={onMoreInfo}
        className="bg-red-600 hover:bg-red-700 text-white p-2 "
      >
        More info
      </Button>
    </div>
  );
};

export default OrganizationPopup;
