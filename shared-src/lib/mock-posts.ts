// Mock post data for testing and development

import type { PostWithAuthor } from "../types/post"

export const MOCK_POSTS: PostWithAuthor[] = [
  {
    id: "1",
    url: "Ab3X",
    slug: "new-e-commerce-platform-launch",
    title: "New E-Commerce Platform Launch",
    content: "Just finished building a new e-commerce platform with React and Node.js! The performance improvements are incredible - 40% faster load times and seamless user experience. Excited to share more details soon!",
    images: ["https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop"],
    author_id: "test-user-1",
    created_at: "2024-10-20T10:00:00Z",
    updated_at: "2024-10-20T10:00:00Z",
    author: {
      id: "test-user-1",
      name: "John Doe",
      username: "johndoe",
      avatar_url: null,
      badge: ["verified"],
      telegram_username: "johndoe"
    }
  },
  {
    id: "2",
    url: "Cd5Y",
    slug: "react-conference-2024-experience",
    title: "React Conference 2024 Experience",
    content: "Attending the React Conference 2024 was an amazing experience! Met so many talented developers and learned about the latest trends in web development. The future of React looks incredibly promising with the new concurrent features.",
    images: ["https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop"],
    author_id: "test-user-1",
    created_at: "2024-10-21T14:30:00Z",
    updated_at: "2024-10-21T14:30:00Z",
    author: {
      id: "test-user-1",
      name: "John Doe",
      username: "johndoe",
      avatar_url: null,
      badge: ["verified"],
      telegram_username: "johndoe"
    }
  },
  {
    id: "3",
    url: "Ef7Z",
    slug: "open-source-typescript-project",
    title: "Open Source TypeScript Project",
    content: "Working on a new open-source project that helps developers optimize their TypeScript configurations. It's been a challenging but rewarding journey. Looking for contributors who are passionate about developer tooling!",
    images: [],
    author_id: "test-user-1",
    created_at: "2024-10-22T09:15:00Z",
    updated_at: "2024-10-22T09:15:00Z",
    author: {
      id: "test-user-1",
      name: "John Doe",
      username: "johndoe",
      avatar_url: null,
      badge: ["verified"],
      telegram_username: "johndoe"
    }
  },
  {
    id: "4",
    url: "Gh9W",
    slug: "aws-and-docker-deployment-success",
    title: "AWS and Docker Deployment Success",
    content: "Just deployed my latest project using AWS and Docker. The scalability and performance are exactly what I was hoping for. Here's a quick overview of the architecture and deployment process.",
    images: ["https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop"],
    author_id: "test-user-1",
    created_at: "2024-10-23T16:45:00Z",
    updated_at: "2024-10-23T16:45:00Z",
    author: {
      id: "test-user-1",
      name: "John Doe",
      username: "johndoe",
      avatar_url: null,
      badge: ["verified"],
      telegram_username: "johndoe"
    }
  },
  {
    id: "5",
    url: "Ij8K",
    slug: "machine-learning-journey",
    title: "Starting My Machine Learning Journey",
    content: "Diving deep into machine learning and AI. The possibilities are endless! Currently working through TensorFlow tutorials and building my first neural network. The math is challenging but fascinating.",
    images: ["https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop"],
    author_id: "test-user-2",
    created_at: "2024-10-24T08:20:00Z",
    updated_at: "2024-10-24T08:20:00Z",
    author: {
      id: "test-user-2",
      name: "Sarah Smith",
      username: "sarahsmith",
      avatar_url: null,
      badge: null,
      telegram_username: "sarahsmith"
    }
  },
  {
    id: "6",
    url: "Kl2M",
    slug: "remote-work-productivity-tips",
    title: "Remote Work Productivity Tips",
    content: "After 3 years of remote work, I've learned what works and what doesn't. Here are my top 5 tips for staying productive while working from home. Would love to hear your experiences too!",
    images: [],
    author_id: "test-user-2",
    created_at: "2024-10-25T11:30:00Z",
    updated_at: "2024-10-25T11:30:00Z",
    author: {
      id: "test-user-2",
      name: "Sarah Smith",
      username: "sarahsmith",
      avatar_url: null,
      badge: null,
      telegram_username: "sarahsmith"
    }
  },
  {
    id: "7",
    url: "Mn4P",
    slug: "startup-funding-success",
    title: "We Just Closed Our Series A!",
    content: "Thrilled to announce that our startup just closed a $5M Series A round! It's been an incredible journey from idea to this milestone. Grateful for our amazing team and supportive investors.",
    images: ["https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop"],
    author_id: "test-user-3",
    created_at: "2024-10-26T15:45:00Z",
    updated_at: "2024-10-26T15:45:00Z",
    author: {
      id: "test-user-3",
      name: "Michael Chen",
      username: "mchen",
      avatar_url: null,
      badge: ["verified"],
      telegram_username: "michaelchen"
    }
  },
  {
    id: "8",
    url: "Op6Q",
    slug: "design-system-best-practices",
    title: "Building a Design System from Scratch",
    content: "Just published our company's design system! It took 6 months but now our entire product team is aligned. Here's what we learned about component libraries, design tokens, and documentation.",
    images: ["https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop"],
    author_id: "test-user-3",
    created_at: "2024-10-27T09:10:00Z",
    updated_at: "2024-10-27T09:10:00Z",
    author: {
      id: "test-user-3",
      name: "Michael Chen",
      username: "mchen",
      avatar_url: null,
      badge: ["verified"],
      telegram_username: "michaelchen"
    }
  }
]
