// Context provider for managing resource card expansion state across the page

import { createContext, useContext, useState, ReactNode } from "react"

interface ResourceCardContextType {
  expandedCardId: string | null
  toggleCard: (cardId: string) => void
  collapseAll: () => void
  isCardExpanded: (cardId: string) => boolean
}

const ResourceCardContext = createContext<ResourceCardContextType | undefined>(undefined)

interface ResourceCardProviderProps {
  children: ReactNode
}

export function ResourceCardProvider({ children }: ResourceCardProviderProps) {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)

  const toggleCard = (cardId: string) => {
    setExpandedCardId((current) => (current === cardId ? null : cardId))
  }

  const collapseAll = () => {
    setExpandedCardId(null)
  }

  const isCardExpanded = (cardId: string) => {
    return expandedCardId === cardId
  }

  return (
    <ResourceCardContext.Provider
      value={{
        expandedCardId,
        toggleCard,
        collapseAll,
        isCardExpanded,
      }}
    >
      {children}
    </ResourceCardContext.Provider>
  )
}

export function useResourceCard() {
  const context = useContext(ResourceCardContext)
  if (context === undefined) {
    throw new Error("useResourceCard must be used within a ResourceCardProvider")
  }
  return context
}
