// Mock posts data for Profile 2 tab with status and pin functionality

export type PinVariant = 'top-badge' | 'inline-header' | 'corner-icon' | 'left-border' | null;

export type ImageVariant =
  | 'twitter-style'           // Variant D: Full width, natural ratio, max-h-512px
  | 'conservative-height'     // Variant A: Full width, max-h-400px
  | 'responsive-height'       // Variant C: Responsive heights
  | 'compact-square'          // Square format: 320x320
  | 'small-square'            // Smaller square: 240x240
  | 'thumbnail'               // Small thumbnail: 128x128
  | 'spaced-layout';          // Twitter style with extra spacing around

export interface MockPost {
  id: number;
  title: string;
  content: string;
  images: string[];
  status: 'published' | 'draft' | 'archived';
  isPinned: boolean;
  pinVariant: PinVariant;
  createdAt: string;
  imageVariant?: ImageVariant;
  variantLabel?: string;
}

export const mockProfile2Posts: MockPost[] = [
  {
    id: 1,
    title: "Introducing Our New Platform Features",
    content: "<p>We're excited to announce the latest updates to our platform! This release includes enhanced collaboration tools, improved performance, and a redesigned user interface.</p><p>Key highlights include real-time notifications, advanced search capabilities, and seamless integration with popular productivity tools.</p>",
    images: ["https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"],
    status: 'published',
    isPinned: true,
    pinVariant: 'inline-header',
    imageVariant: 'twitter-style',
    variantLabel: 'Variant D: Twitter Style (512px max, natural ratio)',
    createdAt: "2025-11-10T10:00:00Z"
  },
  {
    id: 2,
    title: "Community Spotlight: Success Stories",
    content: "<p>This month we're celebrating the incredible achievements of our community members. From startups to enterprise teams, see how they're leveraging our platform to drive innovation.</p><p>Read their stories and get inspired by their journeys!</p>",
    images: ["https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800"],
    status: 'published',
    isPinned: true,
    pinVariant: 'left-border',
    imageVariant: 'conservative-height',
    variantLabel: 'Variant A: Conservative Height (400px max)',
    createdAt: "2025-11-08T14:30:00Z"
  },
  {
    id: 9,
    title: "Important: Platform Maintenance Schedule",
    content: "<p>We'll be performing scheduled maintenance next week to improve system performance and security. The platform will be briefly unavailable during this time.</p><p>We appreciate your patience and understanding.</p>",
    images: [],
    status: 'published',
    isPinned: true,
    pinVariant: 'corner-icon',
    createdAt: "2025-11-09T08:00:00Z"
  },
  {
    id: 10,
    title: "Welcome to Our Community!",
    content: "<p>New to the platform? Start here! This guide will help you navigate our features, connect with other members, and make the most of your experience.</p><p>We're thrilled to have you join us!</p>",
    images: ["https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800"],
    status: 'published',
    isPinned: true,
    pinVariant: 'top-badge',
    imageVariant: 'responsive-height',
    variantLabel: 'Variant C: Responsive Heights (350px/500px)',
    createdAt: "2025-11-11T12:00:00Z"
  },
  {
    id: 3,
    title: "Upcoming Webinar: Best Practices for Team Collaboration",
    content: "<p>Join us for an interactive webinar where industry experts will share proven strategies for effective team collaboration in remote and hybrid work environments.</p><p>Register now to secure your spot!</p>",
    images: [],
    status: 'published',
    isPinned: false,
    pinVariant: null,
    createdAt: "2025-11-07T09:15:00Z"
  },
  {
    id: 4,
    title: "Behind the Scenes: How We Build Our Products",
    content: "<p>Ever wondered how we create the features you love? Take a peek behind the curtain and discover our development process, from ideation to launch.</p><p>Learn about our agile methodology, design thinking approach, and commitment to quality.</p>",
    images: ["https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800"],
    status: 'published',
    isPinned: false,
    pinVariant: null,
    imageVariant: 'compact-square',
    variantLabel: 'Compact Square (320x320px)',
    createdAt: "2025-11-05T16:45:00Z"
  },
  {
    id: 5,
    title: "Draft: Q4 Product Roadmap Preview",
    content: "<p>We're planning some exciting updates for Q4! This draft outlines potential new features including advanced analytics, custom workflows, and mobile app enhancements.</p><p><strong>Note:</strong> This is a draft and details are subject to change based on community feedback.</p>",
    images: [],
    status: 'draft',
    isPinned: false,
    pinVariant: null,
    createdAt: "2025-11-04T11:20:00Z"
  },
  {
    id: 6,
    title: "Tips for Maximizing Your Productivity",
    content: "<p>Discover 10 actionable tips to boost your productivity and get more done in less time. From time management techniques to automation strategies, we've got you covered.</p><p>Start implementing these today and see immediate results!</p>",
    images: ["https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"],
    status: 'published',
    isPinned: false,
    pinVariant: null,
    imageVariant: 'small-square',
    variantLabel: 'Small Square (240-288px responsive)',
    createdAt: "2025-11-02T13:00:00Z"
  },
  {
    id: 7,
    title: "Draft: Partnership Announcement",
    content: "<p>We're in discussions with leading technology partners to bring you even more value. Stay tuned for official announcements coming soon!</p>",
    images: [],
    status: 'draft',
    isPinned: false,
    pinVariant: null,
    createdAt: "2025-11-01T10:30:00Z"
  },
  {
    id: 8,
    title: "Archived: Summer 2025 Event Recap",
    content: "<p>Thank you to everyone who attended our summer event! It was an incredible experience with amazing speakers, networking opportunities, and hands-on workshops.</p><p>Check out the highlights and stay tuned for future events.</p>",
    images: ["https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800"],
    status: 'archived',
    isPinned: false,
    pinVariant: null,
    imageVariant: 'thumbnail',
    variantLabel: 'Thumbnail Style (128-160px)',
    createdAt: "2025-08-15T15:00:00Z"
  },
  {
    id: 11,
    title: "Tech Conference 2025: Our Biggest Event Yet",
    content: "<p>We're thrilled to announce our annual tech conference is back! Join thousands of developers, designers, and innovators for three days of inspiring talks, workshops, and networking.</p><p>Early bird tickets are now available. Don't miss this opportunity to connect with the community!</p>",
    images: ["https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800"],
    status: 'published',
    isPinned: false,
    pinVariant: null,
    imageVariant: 'spaced-layout',
    variantLabel: 'Spaced Layout (Twitter style + extra padding)',
    createdAt: "2025-11-15T09:00:00Z"
  },
  {
    id: 12,
    title: "Panoramic View: Stunning City Skyline",
    content: "<p>Check out this breathtaking panoramic view of the city skyline at sunset. This ultra-wide image (21:9 ratio) shows how the layout handles very wide images.</p><p>Notice how the natural aspect ratio is preserved while staying within the maximum height constraint.</p>",
    images: ["https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1600&h=600"],
    status: 'published',
    isPinned: false,
    pinVariant: null,
    imageVariant: 'twitter-style',
    variantLabel: 'Very Wide Image (21:9 panoramic) - Twitter Style',
    createdAt: "2025-11-16T14:00:00Z"
  },
  {
    id: 13,
    title: "Vertical Architecture: Skyscraper Photography",
    content: "<p>This vertical portrait orientation photo (9:16 ratio) demonstrates how the system handles tall images. The max-height constraint prevents it from dominating the entire feed.</p><p>The image is cropped at 512px height while maintaining full width.</p>",
    images: ["https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=600&h=1200"],
    status: 'published',
    isPinned: false,
    pinVariant: null,
    imageVariant: 'twitter-style',
    variantLabel: 'Very Tall Image (9:16 vertical) - Twitter Style',
    createdAt: "2025-11-16T15:30:00Z"
  },
  {
    id: 14,
    title: "Ultra-Wide Landscape: Mountain Range",
    content: "<p>An ultra-wide landscape image showcasing a mountain range. This demonstrates the Conservative Height variant with a 400px maximum.</p><p>Compare this to the 512px variant to see the difference in vertical space consumption.</p>",
    images: ["https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1600&h=500"],
    status: 'published',
    isPinned: false,
    pinVariant: null,
    imageVariant: 'conservative-height',
    variantLabel: 'Wide Image (3:1 ratio) - Conservative 400px max',
    createdAt: "2025-11-16T16:00:00Z"
  },
  {
    id: 15,
    title: "Portrait Photo: Professional Headshot",
    content: "<p>A tall vertical portrait image. With the Conservative Height variant (400px max), this image gets cropped earlier than the 512px variant.</p><p>This creates a more compact feed layout ideal for quick scanning.</p>",
    images: ["https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=600&h=900"],
    status: 'published',
    isPinned: false,
    pinVariant: null,
    imageVariant: 'conservative-height',
    variantLabel: 'Tall Portrait (2:3 ratio) - Conservative 400px max',
    createdAt: "2025-11-16T17:00:00Z"
  },
  {
    id: 16,
    title: "Standard Square Photo: Product Shot",
    content: "<p>A perfect square image (1:1 ratio) shown with Twitter style. Square images work beautifully with any variant since they don't stretch horizontally or vertically.</p><p>This is the most versatile aspect ratio for social media.</p>",
    images: ["https://images.pexels.com/photos/1337380/pexels-photo-1337380.jpeg?auto=compress&cs=tinysrgb&w=800&h=800"],
    status: 'published',
    isPinned: false,
    pinVariant: null,
    imageVariant: 'twitter-style',
    variantLabel: 'Perfect Square (1:1 ratio) - Twitter Style',
    createdAt: "2025-11-16T18:00:00Z"
  },
  {
    id: 17,
    title: "Extreme Vertical: Waterfall Photography",
    content: "<p>An extremely tall vertical image (9:21 ratio) simulating a full-height mobile screenshot or vertical photography.</p><p>The responsive height variant uses 350px on mobile and 500px on desktop, adapting to the viewport.</p>",
    images: ["https://images.pexels.com/photos/2259917/pexels-photo-2259917.jpeg?auto=compress&cs=tinysrgb&w=400&h=1400"],
    status: 'published',
    isPinned: false,
    pinVariant: null,
    imageVariant: 'responsive-height',
    variantLabel: 'Extremely Tall (9:21) - Responsive 350px/500px',
    createdAt: "2025-11-16T19:00:00Z"
  }
];
