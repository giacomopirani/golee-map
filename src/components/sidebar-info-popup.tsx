import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type React from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  organization: {
    name: string;
    sport: string[];
    address: {
      address?: string;
      town?: string;
    };
    logo_url?: string;
  } | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, organization }) => {
  if (!organization) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetDescription className="text-xl">
          Dettagli della Società
        </SheetDescription>
        <SheetHeader>
          {organization.logo_url && (
            <img
              src={organization.logo_url || "/placeholder.svg"}
              alt={`Logo ${organization.name}`}
              className="my-4 mx-auto max-w-full h-auto max-h-[200px]"
            />
          )}
          <h2 className="text-2xl font-semibold">Nome:</h2>
          <SheetTitle className="text-2xl font-normal">
            {organization.name}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <p className="text-lg">
            <span className="font-semibold">Sport:</span>{" "}
            {organization.sport.join(", ")}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Indirizzo:</span>{" "}
            {[organization.address.address, organization.address.town]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
