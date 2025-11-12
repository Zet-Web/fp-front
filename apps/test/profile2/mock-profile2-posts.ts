// Mock posts data for Profile 2 tab with status and pin functionality

export interface MockPost {
  id: number;
  title: string;
  content: string;
  images: string[];
  status: 'published' | 'draft' | 'archived';
  isPinned: boolean;
  createdAt: string;
}

export const mockProfile2Posts: MockPost[] = [
  {
    id: 1,
    title: "Introducing Our New Platform Features",
    content: "<p>We're excited to announce the latest updates to our platform! This release includes enhanced collaboration tools, improved performance, and a redesigned user interface.</p><p>Key highlights include real-time notifications, advanced search capabilities, and seamless integration with popular productivity tools.</p>",
    images: ["https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"],
    status: 'published',
    isPinned: true,
    createdAt: "2025-11-10T10:00:00Z"
  },
  {
    id: 2,
    title: "Community Spotlight: Success Stories",
    content: "<p>This month we're celebrating the incredible achievements of our community members. From startups to enterprise teams, see how they're leveraging our platform to drive innovation.</p><p>Read their stories and get inspired by their journeys!</p>",
    images: ["https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800"],
    status: 'published',
    isPinned: true,
    createdAt: "2025-11-08T14:30:00Z"
  },
  {
    id: 3,
    title: "Upcoming Webinar: Best Practices for Team Collaboration",
    content: "<p>Join us for an interactive webinar where industry experts will share proven strategies for effective team collaboration in remote and hybrid work environments.</p><p>Register now to secure your spot!</p>",
    images: [],
    status: 'published',
    isPinned: false,
    createdAt: "2025-11-07T09:15:00Z"
  },
  {
    id: 4,
    title: "Behind the Scenes: How We Build Our Products",
    content: "<p>Ever wondered how we create the features you love? Take a peek behind the curtain and discover our development process, from ideation to launch.</p><p>Learn about our agile methodology, design thinking approach, and commitment to quality.</p>",
    images: ["https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800"],
    status: 'published',
    isPinned: false,
    createdAt: "2025-11-05T16:45:00Z"
  },
  {
    id: 5,
    title: "Draft: Q4 Product Roadmap Preview",
    content: "<p>We're planning some exciting updates for Q4! This draft outlines potential new features including advanced analytics, custom workflows, and mobile app enhancements.</p><p><strong>Note:</strong> This is a draft and details are subject to change based on community feedback.</p>",
    images: [],
    status: 'draft',
    isPinned: false,
    createdAt: "2025-11-04T11:20:00Z"
  },
  {
    id: 6,
    title: "Tips for Maximizing Your Productivity",
    content: "<p>Discover 10 actionable tips to boost your productivity and get more done in less time. From time management techniques to automation strategies, we've got you covered.</p><p>Start implementing these today and see immediate results!</p>",
    images: ["https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"],
    status: 'published',
    isPinned: false,
    createdAt: "2025-11-02T13:00:00Z"
  },
  {
    id: 7,
    title: "Draft: Partnership Announcement",
    content: "<p>We're in discussions with leading technology partners to bring you even more value. Stay tuned for official announcements coming soon!</p>",
    images: [],
    status: 'draft',
    isPinned: false,
    createdAt: "2025-11-01T10:30:00Z"
  },
  {
    id: 8,
    title: "Archived: Summer 2025 Event Recap",
    content: "<p>Thank you to everyone who attended our summer event! It was an incredible experience with amazing speakers, networking opportunities, and hands-on workshops.</p><p>Check out the highlights and stay tuned for future events.</p>",
    images: ["https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800"],
    status: 'archived',
    isPinned: false,
    createdAt: "2025-08-15T15:00:00Z"
  }
];
