import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SPORTS } from "@/utils/sports";
import { Separator } from "@radix-ui/react-select";
import type React from "react";
import { Badge } from "./ui/badge";

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
      <SheetContent
        side="right"
        className="w-full sm:w-[540px] overflow-y-auto"
      >
        <SheetHeader className="space-y-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold">
              Dettagli della Società
            </SheetTitle>
          </div>
          {organization.logo_url && (
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={organization.logo_url || "/placeholder.svg"}
                alt={`Logo ${organization.name}`}
                className="w-full h-full object-contain rounded-full border-4 border-primary shadow-lg"
              />
            </div>
          )}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-primary">
              {organization.name}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {organization.sport.length > 0 ? (
                organization.sport.map((s) => (
                  <Badge key={s} variant="secondary">
                    {SPORTS[s] || s}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline">Nessuno sport specificato</Badge>
              )}
            </div>
          </div>
        </SheetHeader>
        <Separator className="my-6" />
        <SheetDescription className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Indirizzo:</h3>
              <p className="text-foreground">
                {[organization.address.address, organization.address.town]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </div>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
