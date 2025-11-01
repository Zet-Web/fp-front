// Expandable card component for displaying resource information

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, ChevronUp, ExternalLink, Globe, Phone, Mail, MapPin, Clock, Share, List } from "lucide-react"
import type { Resource, ResourceLink } from "../types/resource"
import { useToast } from "@/hooks/use-toast"

interface ResourceCardProps {
  resource: Resource
  isExpanded: boolean
  onToggle: () => void
}

export function ResourceCard({ resource, isExpanded, onToggle }: ResourceCardProps) {
  const { toast } = useToast()

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,nofollow")
  }

  const handleShare = () => {
    const baseUrl = window.location.origin + window.location.pathname
    const shareUrl = resource.slug
      ? `${baseUrl}?resource=${resource.slug}`
      : resource.websiteUrl || resource.mainUrl

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast({
            title: "Link copied",
            description: "Resource link has been copied to clipboard",
          })
        })
        .catch(() => {
          toast({
            title: "Copy failed",
            description: "Failed to copy link to clipboard",
            variant: "destructive",
          })
        })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  const organizeLinks = (links: ResourceLink[]) => {
    const official = links.filter(l => l.type === "official")
    const services = links.filter(l => l.type === "service")
    const others = links.filter(l => !l.type || l.type === "other")
    return [...official, ...services, ...others]
  }

  const sortedLinks = organizeLinks(resource.links)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            {resource.imageUrl && (
              <AvatarImage src={resource.imageUrl} alt={resource.name} />
            )}
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {getInitials(resource.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggle}>
            <CardTitle className="text-lg">{resource.name}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Button
          variant="default"
          size="sm"
          className="w-full bg-stone-600 hover:bg-stone-700 dark:bg-stone-700 dark:hover:bg-stone-800 text-white shadow-sm"
          onClick={() => handleLinkClick(resource.mainUrl)}
        >
          {resource.mainButtonLabel || 'Open'}
        </Button>

        {isExpanded && (
          <div className="space-y-4 pt-4 mt-4 border-t">
            {resource.description && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {resource.description}
                </p>
              </div>
            )}

            {sortedLinks.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Quick Links</h4>
                <div className="space-y-1">
                  {sortedLinks.map((link, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm h-auto py-2 px-3"
                      onClick={() => handleLinkClick(link.url)}
                    >
                      <ExternalLink className="h-3 w-3 mr-2 shrink-0" />
                      <span className="text-left">{link.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {(resource.websiteUrl || resource.servicesUrl) && (
              <div className="flex gap-2">
                {resource.websiteUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleLinkClick(resource.websiteUrl!)}
                  >
                    <Globe className="h-3 w-3 mr-2" />
                    Website
                  </Button>
                )}
                {resource.servicesUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleLinkClick(resource.servicesUrl!)}
                  >
                    <List className="h-3 w-3 mr-2" />
                    Services
                  </Button>
                )}
              </div>
            )}

            {resource.contacts && (
              <div>
                <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {resource.contacts.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{resource.contacts.phone}</span>
                    </div>
                  )}
                  {resource.contacts.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{resource.contacts.email}</span>
                    </div>
                  )}
                  {resource.contacts.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{resource.contacts.address}</span>
                    </div>
                  )}
                  {resource.contacts.hours && (
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{resource.contacts.hours}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="p-2 h-8 w-8"
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
