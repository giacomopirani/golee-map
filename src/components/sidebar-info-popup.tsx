import { fetchClubDetails } from "@/api/organization";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ClubDetails } from "@/types/types";
import { Separator } from "@radix-ui/react-select";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  organizationId,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [organization, setOrganization] = useState<ClubDetails>();

  const loadOrganization = async (organizationId: string) => {
    setIsLoading(true);

    try {
      const data = await fetchClubDetails(organizationId);
      setOrganization(data);
    } catch (error) {
      console.error("Errore nel caricamento dei dettagli del club:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && organizationId) {
      loadOrganization(organizationId);
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="overflow-y-auto w-full"
        style={{ minWidth: "30vw" }}
      >
        {isLoading ? (
          <Loader2Icon className="animate-spin h-[60px] w-[60px] mx-auto mt-96" />
        ) : (
          <>
            {organization ? (
              <SidebarContent organization={organization} />
            ) : (
              <>
                <SheetHeader className="space-y-6">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-2xl font-bold">
                      Si è verificato un errore
                    </SheetTitle>
                  </div>
                </SheetHeader>
              </>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

const SidebarContent = (props: { organization: ClubDetails }) => {
  const organization = props.organization;

  const socialNames: Record<string, string> = {
    web: "Website",
    fb: "Facebook",
    ig: "Instagram",
    tw: "Twitter",
    yt: "YouTube",
  };

  return (
    <div className="space-y-8">
      <SheetHeader>
        <div className="flex flex-col items-center space-x-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden">
            {organization.logoUrl && (
              <img
                src={organization.logoUrl || "/placeholder.svg"}
                alt={`Logo ${organization.name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden"
                  );
                }}
              />
            )}
            <div className="inset-0 bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {organization.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div>
            <SheetTitle className="text-2xl font-bold text-center mt-4">
              {organization.name}
            </SheetTitle>
            {organization.sports && organization.sports.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {organization.sports.map((sport) => (
                  <Badge key={sport} variant="secondary">
                    {sport}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetHeader>

      <Separator />

      <SheetDescription className="space-y-6">
        {organization.address && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Indirizzo</h3>
                <p className="text-sm text-muted-foreground">
                  {[
                    organization.address.address,
                    organization.address.town,
                    organization.address.postal_code,
                    organization.address.zone,
                    organization.address.region,
                    organization.address.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>

              {organization.contacts && organization.contacts.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Contatti</h3>
                  {organization.contacts.map((contact) => (
                    <div key={contact._id} className="text-sm">
                      {contact.tel && (
                        <p>
                          <span className="font-bold bg-background">Tel:</span>{" "}
                          <span className="text-muted-foreground">
                            {contact.tel}
                          </span>
                        </p>
                      )}
                      {contact.email && (
                        <p>
                          <span className="font-bold bg-background">
                            Email:
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {contact.email}
                          </span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {organization.vatNumber && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Partita IVA</h3>
                  <p className="text-sm text-muted-foreground">
                    {organization.vatNumber}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {organization.socialLinks &&
          Object.values(organization.socialLinks).some(Boolean) && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">Social</h3>
                <div className="flex gap-4">
                  {Object.entries(organization.socialLinks).map(
                    ([key, value]) =>
                      value ? (
                        <a
                          key={key}
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {socialNames[key] ||
                            key.charAt(0).toUpperCase() + key.slice(1)}
                        </a>
                      ) : null
                  )}
                </div>
              </CardContent>
            </Card>
          )}

        {organization.colors && Object.keys(organization.colors).length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">Colori</h3>
              <div className="flex gap-2">
                {Object.entries(organization.colors).map(([key, value]) => (
                  <div key={key} className="flex flex-col items-center">
                    <div
                      className="w-8 h-8 rounded-full border border-gray-200"
                      style={{ backgroundColor: value }}
                    ></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {organization.affiliate && (
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-lg">Affiliazione</h3>
              <p className="text-sm">
                <span className="font-bold bg-background">Nome del club:</span>{" "}
                <span className="text-muted-foreground">
                  {organization.affiliate.club_name}
                </span>
              </p>
              {organization.affiliate.club_logo_url && (
                <img
                  src={
                    organization.affiliate.club_logo_url || "/placeholder.svg"
                  }
                  alt={`Logo ${organization.affiliate.club_name}`}
                  className="w-16 h-16 object-contain"
                />
              )}
              {organization.affiliate.club_link && (
                <a
                  href={organization.affiliate.club_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  Visita il sito del club affiliato
                </a>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4 space-y-4">
            {organization.competitionLevel && (
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Livello di competizione
                </h3>
                <p className="text-sm text-muted-foreground">
                  {organization.competitionLevel}
                </p>
              </div>
            )}
            {organization.foundationYear && (
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Anno di fondazione
                </h3>
                <p className="text-sm text-muted-foreground">
                  {organization.foundationYear}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {organization.federations && organization.federations.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">Federazioni</h3>
              <div className="space-y-4">
                {organization.federations.map((federation, index) => (
                  <div key={index} className="text-sm">
                    <p>
                      <span className="font-bold bg-background">Nome:</span>{" "}
                      <span className="text-muted-foreground">
                        {federation.name}
                      </span>
                    </p>
                    <p>
                      <span className="font-bold bg-background">Numero:</span>{" "}
                      <span className="text-muted-foreground">
                        {federation.number}
                      </span>
                    </p>
                    <p>
                      <span className="font-bold bg-background">
                        Data di affiliazione:
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {federation.affiliationDate}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </SheetDescription>
    </div>
  );
};

export default Sidebar;
