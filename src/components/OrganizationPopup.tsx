import type React from "react";

interface OrganizationPopupProps {
  name: string;
  sport: string[];
  address: {
    address?: string;
    town?: string;
  };
  logo_url?: string;
}

const OrganizationPopup: React.FC<OrganizationPopupProps> = ({
  name,
  sport,
  address,
  logo_url,
}) => {
  return (
    <div className="max-w-sm p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">
        {name || "Nome non disponibile"}
      </h3>
      {sport?.length > 0 && (
        <p className="mb-2">
          <strong>Sport:</strong> {sport.join(", ")}
        </p>
      )}
      {(address?.address || address?.town) && (
        <p className="mb-2">
          <strong>Indirizzo:</strong>{" "}
          {[address.address, address.town].filter(Boolean).join(", ")}
        </p>
      )}
      {logo_url ? (
        <img
          src={logo_url || "/placeholder.svg"}
          alt={`Logo ${name || ""}`}
          className="mt-2 mx-auto max-w-full h-auto"
          style={{ maxHeight: "100px" }}
        />
      ) : (
        <p className="mt-2 text-center text-gray-500 italic">
          Nessun logo disponibile
        </p>
      )}
    </div>
  );
};

export default OrganizationPopup;
