// Testing page for UI components and features, hidden from search engines
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SearchableDropdown } from '@/components/shared/SearchableDropdown';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { VerifiedBadge } from '@/components/shared/VerifiedBadge';
import { Search, MapPin, Package, Briefcase, ShoppingBag, Wrench, Users, Sparkles, FileText, CalendarDays, MapPinned, Briefcase as BriefcaseIcon, GraduationCap, Award, Mail, Phone, Link as LinkIcon, Send, Bot } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

type CategoryType = 'products' | 'services' | 'goods' | 'tools';

interface CatalogItem {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  city: string;
  price: string;
  image?: string;
}

const mockItems: CatalogItem[] = [
  { id: '1', title: 'Premium Laptop', description: 'High-performance laptop for professionals', category: 'products', city: 'New York', price: '$1,299' },
  { id: '2', title: 'Web Development', description: 'Full-stack web development services', category: 'services', city: 'San Francisco', price: '$50/hr' },
  { id: '3', title: 'Office Chair', description: 'Ergonomic office chair', category: 'goods', city: 'Chicago', price: '$299' },
  { id: '4', title: 'Power Drill', description: 'Professional grade power drill', category: 'tools', city: 'Los Angeles', price: '$149' },
  { id: '5', title: 'Smartphone', description: 'Latest model smartphone', category: 'products', city: 'New York', price: '$899' },
  { id: '6', title: 'Consulting Services', description: 'Business strategy consulting', category: 'services', city: 'Boston', price: '$150/hr' },
  { id: '7', title: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness', category: 'goods', city: 'Seattle', price: '$49' },
  { id: '8', title: 'Hammer Set', description: 'Professional hammer set', category: 'tools', city: 'Denver', price: '$79' },
];

const categories = [
  { id: 'products' as CategoryType, label: 'Products', icon: Package },
  { id: 'services' as CategoryType, label: 'Services', icon: Briefcase },
  { id: 'goods' as CategoryType, label: 'Goods', icon: ShoppingBag },
  { id: 'tools' as CategoryType, label: 'Tools', icon: Wrench },
];

const cities = ['All Cities', 'New York', 'San Francisco', 'Chicago', 'Los Angeles', 'Boston', 'Seattle', 'Denver'];

export function TestPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('products');

  useEffect(() => {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    const metaGooglebot = document.createElement('meta');
    metaGooglebot.name = 'googlebot';
    metaGooglebot.content = 'noindex, nofollow';
    document.head.appendChild(metaGooglebot);

    return () => {
      document.head.removeChild(metaRobots);
      document.head.removeChild(metaGooglebot);
    };
  }, []);

  const filteredItems = mockItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'All Cities' || item.city === selectedCity;
    const matchesCategory = item.category === selectedCategory;

    return matchesSearch && matchesCity && matchesCategory;
  });

  return (
    <>

      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Test Page</CardTitle>
            <p className="text-sm text-muted-foreground">
              This page is for testing new UI components and features
            </p>
          </CardHeader>
        </Card>

        <Tabs defaultValue="catalog" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto">
            <TabsTrigger value="catalog">Catalog Directory</TabsTrigger>
            <TabsTrigger value="scrolling">Scrolling Tabs</TabsTrigger>
            <TabsTrigger value="profile">Public Profile</TabsTrigger>
            <TabsTrigger value="chat">AI Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  Catalog Directory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products, services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <div className="w-full md:w-64">
                    <SearchableDropdown
                      options={cities.map(city => ({ value: city, label: city }))}
                      value={selectedCity}
                      onChange={setSelectedCity}
                      placeholder="Filter by city"
                      icon={<MapPin className="h-4 w-4" />}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      className="justify-start gap-2"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <category.icon className="h-4 w-4" />
                      {category.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <Card
                    key={item.id}
                    className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <Badge variant="secondary" className="shrink-0">
                          {item.price}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {item.city}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full shadow-sm">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No items found matching your filters</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scrolling" className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Scrolling Tabs Variants</CardTitle>
                <p className="text-sm text-muted-foreground">Different approaches for handling many tab options</p>
              </CardHeader>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Variant 1: Horizontal Scroll with ScrollArea</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-2 pb-2">
                    {Array.from({ length: 20 }, (_, i) => (
                      <Button key={i} variant={i === 0 ? 'default' : 'outline'} className="shrink-0">
                        Tab {i + 1}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Variant 2: Native Tabs with Overflow Scroll</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="tab1" className="w-full">
                  <div className="overflow-x-auto">
                    <TabsList className="inline-flex w-auto min-w-full">
                      {Array.from({ length: 15 }, (_, i) => (
                        <TabsTrigger key={i} value={`tab${i + 1}`}>
                          Category {i + 1}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  <TabsContent value="tab1" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-muted-foreground">Content for Tab 1</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Variant 3: Compact Pills with Scroll</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <ScrollArea className="w-full">
                    <div className="flex gap-2 pb-2">
                      {Array.from({ length: 25 }, (_, i) => (
                        <Badge key={i} variant={i === 0 ? 'default' : 'secondary'} className="cursor-pointer shrink-0 px-3 py-1.5">
                          Option {i + 1}
                        </Badge>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Variant 4: Grid Layout (Wrapping)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
                  {Array.from({ length: 21 }, (_, i) => (
                    <Button key={i} variant={i === 0 ? 'default' : 'outline'} size="sm">
                      {i + 1}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center md:items-start gap-4">
                    <UserAvatar
                      src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200"
                      name="John Anderson"
                      size="xl"
                    />
                    <Button className="w-full md:w-auto">Follow</Button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">John Anderson</h2>
                        <VerifiedBadge size="md" />
                      </div>
                      <p className="text-muted-foreground">@johnanderson</p>
                    </div>

                    <p className="text-foreground">
                      Senior Product Designer | UX Enthusiast | Building digital experiences that matter.
                      Passionate about creating intuitive and beautiful interfaces.
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPinned className="h-4 w-4 text-muted-foreground" />
                        <span>San Francisco, CA</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                        <span>Tech Corp Inc.</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>Joined March 2020</span>
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <div><span className="font-semibold">2,458</span> <span className="text-muted-foreground">Following</span></div>
                      <div><span className="font-semibold">12.5K</span> <span className="text-muted-foreground">Followers</span></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="information">Information</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="ai">AI</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <UserAvatar
                          src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
                          name="John Anderson"
                          size="md"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">John Anderson</span>
                            <VerifiedBadge size="sm" />
                            <span className="text-sm text-muted-foreground">@johnanderson</span>
                          </div>
                          <p className="text-sm text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">Just shipped a new feature that I'm really excited about! The team worked incredibly hard to make this happen. Check it out and let me know what you think! 🚀</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>245 likes</span>
                        <span>32 comments</span>
                        <span>18 shares</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="information" className="space-y-4">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BriefcaseIcon className="h-5 w-5 text-blue-500" />
                      Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { title: 'Senior Product Designer', company: 'Tech Corp Inc.', period: '2021 - Present' },
                      { title: 'Product Designer', company: 'Design Studio', period: '2019 - 2021' },
                      { title: 'UX Designer', company: 'StartUp Co.', period: '2017 - 2019' },
                    ].map((exp, i) => (
                      <div key={i}>
                        {i > 0 && <Separator className="my-4" />}
                        <div>
                          <h4 className="font-semibold">{exp.title}</h4>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                          <p className="text-xs text-muted-foreground mt-1">{exp.period}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-blue-500" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Master of Design</h4>
                      <p className="text-sm text-muted-foreground">Stanford University</p>
                      <p className="text-xs text-muted-foreground mt-1">2015 - 2017</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-500" />
                      Awards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-yellow-500 mt-1" />
                      <div>
                        <p className="font-medium">Best Design Innovation 2023</p>
                        <p className="text-sm text-muted-foreground">Design Awards Conference</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">john.anderson@email.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-blue-500">johnanderson.com</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members" className="space-y-4">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Sarah Johnson', role: 'Product Manager', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
                        { name: 'Michael Chen', role: 'Senior Developer', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100' },
                        { name: 'Emily Rodriguez', role: 'UX Researcher', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
                        { name: 'David Kim', role: 'Frontend Developer', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100' },
                      ].map((member, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              src={member.avatar}
                              name={member.name}
                              size="md"
                            />
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                      AI Assistant
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Ask anything about this profile or get recommendations</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-blue-500 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <Card className="flex-1 shadow-sm">
                          <CardContent className="pt-3 pb-3">
                            <p className="text-sm">Hello! I'm here to help you learn more about John's professional background. What would you like to know?</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="flex gap-3 justify-end">
                        <Card className="max-w-[80%] shadow-sm bg-blue-500 text-white">
                          <CardContent className="pt-3 pb-3">
                            <p className="text-sm">What are John's main skills?</p>
                          </CardContent>
                        </Card>
                        <UserAvatar
                          src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
                          name="You"
                          size="sm"
                        />
                      </div>

                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-blue-500 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <Card className="flex-1 shadow-sm">
                          <CardContent className="pt-3 pb-3">
                            <p className="text-sm">Based on John's profile, his main skills include:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                              <li>Product Design & UX/UI</li>
                              <li>User Research & Testing</li>
                              <li>Design Systems</li>
                              <li>Prototyping & Wireframing</li>
                              <li>Cross-functional Team Leadership</li>
                            </ul>
                            <p className="text-sm mt-2">He has over 7 years of experience in the field and has worked with several prominent tech companies.</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Ask about experience, skills, or recommendations..."
                        className="min-h-[60px]"
                      />
                      <Button size="icon" className="shrink-0 h-auto">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-500" />
                  AI Chat Example
                </CardTitle>
                <p className="text-sm text-muted-foreground">Interactive AI assistant chat interface</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <Card className="flex-1 shadow-sm">
                        <CardContent className="pt-4 pb-4">
                          <p className="text-sm">Hello! I'm your AI assistant. How can I help you today?</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Card className="max-w-[80%] shadow-sm bg-blue-500 text-white">
                        <CardContent className="pt-4 pb-4">
                          <p className="text-sm">I need help with my business strategy</p>
                        </CardContent>
                      </Card>
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <Card className="flex-1 shadow-sm">
                        <CardContent className="pt-4 pb-4">
                          <p className="text-sm mb-3">I'd be happy to help you with your business strategy! Let me ask you a few questions to better understand your needs:</p>
                          <ol className="list-decimal list-inside space-y-2 text-sm">
                            <li>What industry is your business in?</li>
                            <li>What are your main business goals for the next year?</li>
                            <li>What challenges are you currently facing?</li>
                          </ol>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Card className="max-w-[80%] shadow-sm bg-blue-500 text-white">
                        <CardContent className="pt-4 pb-4">
                          <p className="text-sm">We're in the tech industry, focused on SaaS products. Our main goal is to increase customer retention and expand to new markets.</p>
                        </CardContent>
                      </Card>
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <Card className="flex-1 shadow-sm">
                        <CardContent className="pt-4 pb-4">
                          <p className="text-sm mb-3">Great! For a SaaS business focused on customer retention and market expansion, here are my recommendations:</p>

                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-sm mb-1">1. Customer Retention Strategy</h4>
                              <ul className="list-disc list-inside ml-2 space-y-1 text-sm text-muted-foreground">
                                <li>Implement a robust onboarding process</li>
                                <li>Create a customer success team</li>
                                <li>Develop a loyalty program</li>
                                <li>Regular check-ins and feedback loops</li>
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-semibold text-sm mb-1">2. Market Expansion</h4>
                              <ul className="list-disc list-inside ml-2 space-y-1 text-sm text-muted-foreground">
                                <li>Conduct thorough market research</li>
                                <li>Localize your product for new regions</li>
                                <li>Partner with local businesses</li>
                                <li>Adapt pricing for different markets</li>
                              </ul>
                            </div>
                          </div>

                          <p className="text-sm mt-3">Would you like me to elaborate on any of these points?</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="cursor-pointer hover:bg-accent">Tell me more about onboarding</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-accent">Market research tips</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-accent">Pricing strategies</Badge>
                    </div>
                  </div>
                </ScrollArea>

                <Separator />

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    className="min-h-[80px] resize-none"
                  />
                  <Button size="icon" className="shrink-0 h-auto">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
