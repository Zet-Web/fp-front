import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Search, MessageSquare, Users, TrendingUp, PanelRightClose, PanelRightOpen, Minimize2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChatItem } from "./components/ChatItem"
import { useChatsData } from "./hooks/use-chats-data"
import { useSidebar } from "@/contexts/sidebar-context"
import { useState } from "react"

export function Chats() {
  const { chats, loading, activeChat, handleChatClick, getTotalUnreadCount } = useChatsData()
  const { leftCollapsed, rightCollapsed, toggleRight, collapseAll, expandAll } = useSidebar()
  const [searchQuery, setSearchQuery] = useState("")

  const handleFocusMode = () => {
    if (leftCollapsed && rightCollapsed) {
      expandAll()
    } else {
      collapseAll()
    }
  }

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const LoadingSkeleton = () => (
    <div className="space-y-3 p-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center m-4">
      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="font-semibold text-lg mb-2">No chats yet</h3>
      <p className="text-muted-foreground text-sm">
        Start a conversation to see your chats here
      </p>
    </div>
  )

  if (rightCollapsed) {
    return (
      <Card className="h-full w-full flex flex-col lg:w-16 lg:flex-shrink-0 shadow-sm transition-all duration-300">
        <CardContent className="p-2 flex-1 min-h-0 flex flex-col">
          <TooltipProvider>
            <div className="flex flex-col items-center space-y-3 py-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Chats</p>
                </TooltipContent>
              </Tooltip>

              <div className="h-px w-8 bg-border"></div>

              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-full" />
                ))
              ) : filteredChats.length === 0 ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>No chats</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <ScrollArea className="h-full w-full">
                  <div className="flex flex-col items-center space-y-3 py-2">
                    {filteredChats.map((chat) => (
                      <Tooltip key={chat.id}>
                        <TooltipTrigger asChild>
                          <div
                            onClick={() => handleChatClick(chat.id)}
                            className={`relative cursor-pointer ${
                              activeChat === chat.id ? 'ring-2 ring-blue-500 rounded-full' : ''
                            }`}
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={chat.avatar} alt={chat.name} />
                              <AvatarFallback className="text-sm">
                                {chat.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {chat.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-semibold">
                                {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="font-medium">{chat.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {chat.lastMessage}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </ScrollArea>
              )}

              <div className="h-px w-8 bg-border mt-auto"></div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleRight}
                    className="h-8 w-8 hover:bg-accent/50"
                  >
                    <PanelRightOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Expand sidebar</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFocusMode}
                    className="h-8 w-8 hover:bg-accent/50"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{leftCollapsed && rightCollapsed ? 'Expand All' : 'Focus Mode'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full w-full flex flex-col lg:w-80 lg:flex-shrink-0 shadow-sm transition-all duration-300">
      
      <CardContent className="p-0 flex-1 min-h-0 flex flex-col">
        {/* Search */}
        <div className="border-b border-border">
          <div className="relative p-4">
            <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 min-h-0">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredChats.length === 0 ? (
            searchQuery ? (
              <div className="p-4 text-center">
                <p className="text-muted-foreground">No chats found for "{searchQuery}"</p>
              </div>
            ) : (
              <EmptyState />
            )
          ) : (
            <ScrollArea className="h-full">
              <div className="py-2">
                {filteredChats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    id={chat.id}
                    name={chat.name}
                    avatar={chat.avatar}
                    lastMessage={chat.lastMessage}
                    timestamp={chat.timestamp}
                    unreadCount={chat.unreadCount}
                    isActive={activeChat === chat.id}
                    onClick={handleChatClick}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Collapse Controls */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleRight}
                    className="flex-1 h-9 hover:bg-accent/50"
                  >
                    <PanelRightClose className="h-4 w-4 mr-2" />
                    Collapse
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Collapse this sidebar</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFocusMode}
                    className="flex-1 h-9 hover:bg-accent/50"
                  >
                    <Minimize2 className="h-4 w-4 mr-2" />
                    {leftCollapsed && rightCollapsed ? 'Expand' : 'Focus'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{leftCollapsed && rightCollapsed ? 'Expand all sidebars' : 'Focus Mode (Collapse all sidebars)'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}