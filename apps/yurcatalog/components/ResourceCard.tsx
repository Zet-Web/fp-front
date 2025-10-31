// Expandable card component for displaying resource information

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, ExternalLink, Globe, Phone, Mail, MapPin, Clock } from "lucide-react"
import type { Resource } from "../types/resource"
import { CATEGORY_LABELS } from "../types/resource"

interface ResourceCardProps {
  resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,nofollow")
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{resource.name}</CardTitle>
            <p className="text-sm text-muted-foreground mb-3">
              {resource.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {CATEGORY_LABELS[resource.category as keyof typeof CATEGORY_LABELS]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {resource.region}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0"
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
          className="w-full mb-3"
          onClick={() => handleLinkClick(resource.mainUrl)}
        >
          <Globe className="h-4 w-4 mr-2" />
          Visit Website
          <ExternalLink className="h-3 w-3 ml-2" />
        </Button>

        {isExpanded && (
          <div className="space-y-4 pt-3 border-t">
            {resource.links.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Quick Links</h4>
                <div className="space-y-1">
                  {resource.links.map((link, index) => (
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
          </div>
        )}
      </CardContent>
    </Card>
  )
}
