import { SPORTS } from "@/utils/sports";
import type React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface OrganizationPopupProps {
  organizationId: string;
  logo_url?: string;
  name: string;
  sport: string[];
}

const OrganizationPopup: React.FC<OrganizationPopupProps> = ({
  organizationId,
  logo_url,
  name,
  sport,
}) => {
  return (
    <div className="max-w-sm bg-background flex flex-col text-foreground p-6 rounded-lg">
      <div className="w-full flex mb-2">
        <div className="flex-shrink-0 mr-4">
          {logo_url ? (
            <img
              src={logo_url || "/placeholder.svg"}
              alt={`Logo ${name}`}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-md">{name.charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col flex-grow">
          <h4 className="font-bold text-sm mb-1">
            {name || "Nome non disponibile"}
          </h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {sport && sport.length > 0 ? (
              sport.map((s, index) => (
                <Badge variant="secondary" key={index} className="text-xs">
                  {SPORTS[s]}
                </Badge>
              ))
            ) : (
              <Badge variant="secondary" className="text-xs">
                Sport non disponibile
              </Badge>
            )}
          </div>
        </div>
      </div>
      <Button
        className="mt-2 w-[100px] self-center more-info-button"
        data-organization-id={organizationId}
      >
        Scopri di più
      </Button>
    </div>
  );
};

export default OrganizationPopup;
