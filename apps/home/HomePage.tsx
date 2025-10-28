// Home page with feed of posts from the network

import { Feed } from "../../shared-src/components/Feed"
import { MOCK_POSTS } from "../../shared-src/lib/mock-posts"

export function HomePage() {
  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Feed
          posts={MOCK_POSTS}
          emptyMessage="No posts in your feed yet. Start following people to see their posts!"
          itemsPerPage={5}
        />
      </div>
    </div>
  )
}
