// Testing page for UI components and features, hidden from search engines
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SearchableDropdown } from '@/components/shared/SearchableDropdown';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { VerifiedBadge } from '@/components/shared/VerifiedBadge';
import { Search, MapPin, Package, Briefcase, ShoppingBag, Wrench, Users, Sparkles, FileText, CalendarDays, MapPinned, Briefcase as BriefcaseIcon, GraduationCap, Award, Mail, Phone, Link as LinkIcon, Send, Bot, BookOpen, Plus, Edit2, Trash2, ExternalLink, CheckSquare, X, MessageCircle, Clock, UserCheck, UserPlus, UserX, ChevronLeft } from 'lucide-react';
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

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
}

const tabMap: Record<string, string> = {
  '1': 'catalog',
  '2': 'scrolling',
  '3': 'profile',
  '4': 'chat'
};

const tab2Map: Record<string, string> = {
  '1': 'posts',
  '2': 'information',
  '3': 'members',
  '4': 'ai'
};

const profile2TabMap: Record<string, string> = {
  '1': 'posts',
  '2': 'information',
  '3': 'app'
};

export function TestPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('products');
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([
    { id: '1', title: 'Community Guidelines', content: 'Our community values respect, collaboration, and innovation. All members are expected to treat each other with kindness.', category: 'Guidelines' },
    { id: '2', title: 'Product Features', content: 'Our main product features include real-time collaboration, AI-powered insights, and seamless integration with popular tools.', category: 'Products' },
    { id: '3', title: 'Company History', content: 'Founded in 2018, TechCommunity started as a small group of developers and has grown into a thriving community of 50,000+ members.', category: 'About' },
  ]);
  const [newKnowledgeTitle, setNewKnowledgeTitle] = useState('');
  const [newKnowledgeContent, setNewKnowledgeContent] = useState('');
  const [newKnowledgeCategory, setNewKnowledgeCategory] = useState('');
  const [editingKnowledge, setEditingKnowledge] = useState<KnowledgeItem | null>(null);
  const [showSaaS, setShowSaaS] = useState(false);
  const [todos, setTodos] = useState([
    { id: '1', text: 'Review community posts', completed: false },
    { id: '2', text: 'Update member guidelines', completed: true },
    { id: '3', text: 'Schedule next event', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [activeProfile2Tab, setActiveProfile2Tab] = useState('posts');

  const tabParam = searchParams.get('tab');
  const tab2Param = searchParams.get('tab2');

  const initialTab1 = tabParam ? (tabMap[tabParam] || 'catalog') : 'catalog';
  const initialTab2 = tab2Param ? (tab2Map[tab2Param] || 'posts') : 'posts';

  const [activeTab1, setActiveTab1] = useState(initialTab1);
  const [activeTab2, setActiveTab2] = useState(initialTab2);

  useEffect(() => {
    if (tabParam) {
      setActiveTab1(tabMap[tabParam] || 'catalog');
    }
  }, [tabParam]);

  useEffect(() => {
    if (tab2Param) {
      setActiveTab2(tab2Map[tab2Param] || 'posts');
    }
  }, [tab2Param]);

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


        <Tabs value={activeTab1} onValueChange={setActiveTab1} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto">
            <TabsTrigger value="catalog">Catalog Directory</TabsTrigger>
            <TabsTrigger value="scrolling">Scrolling Tabs</TabsTrigger>
            <TabsTrigger value="profile">Profile 1</TabsTrigger>
            <TabsTrigger value="chat">Profile 2</TabsTrigger>
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
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200" alt="TechCommunity" />
                      <AvatarFallback>TC</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      <Dialog open={showSaaS} onOpenChange={setShowSaaS}>
                        <DialogTrigger asChild>
                          <Button className="w-full gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Open App
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>Community Task Manager</DialogTitle>
                            <DialogDescription>
                              Manage tasks and activities for TechCommunity (Demo)
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Active Tasks</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                {todos.map((todo) => (
                                  <div key={todo.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => {
                                        setTodos(todos.map(t =>
                                          t.id === todo.id ? { ...t, completed: !t.completed } : t
                                        ));
                                      }}
                                    >
                                      {todo.completed ? (
                                        <CheckSquare className="h-4 w-4 text-blue-500" />
                                      ) : (
                                        <div className="h-4 w-4 border-2 rounded" />
                                      )}
                                    </Button>
                                    <span className={todo.completed ? 'line-through text-muted-foreground flex-1' : 'flex-1'}>
                                      {todo.text}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <div className="flex gap-2 mt-4">
                                  <Input
                                    placeholder="Add new task..."
                                    value={newTodo}
                                    onChange={(e) => setNewTodo(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && newTodo.trim()) {
                                        setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
                                        setNewTodo('');
                                      }
                                    }}
                                  />
                                  <Button
                                    onClick={() => {
                                      if (newTodo.trim()) {
                                        setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
                                        setNewTodo('');
                                      }
                                    }}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" className="w-full gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Message
                      </Button>
                      <Button variant="outline" className="w-full gap-2">
                        <Bot className="h-4 w-4" />
                        AI Message
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">TechCommunity</h2>
                        <VerifiedBadge size="md" />
                      </div>
                      <p className="text-muted-foreground">@techcommunity</p>
                    </div>

                    <p className="text-foreground">
                      A thriving community of developers, designers, and tech enthusiasts building the future together.
                      Join us to collaborate, learn, and grow in the world of technology.
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPinned className="h-4 w-4 text-muted-foreground" />
                        <span>San Francisco, CA</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>50,000+ Members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>Joined March 2020</span>
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <div><span className="font-semibold">850</span> <span className="text-muted-foreground">Following</span></div>
                      <div><span className="font-semibold">50K</span> <span className="text-muted-foreground">Followers</span></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab2} onValueChange={setActiveTab2} className="w-full">
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
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100" alt="TechCommunity" />
                          <AvatarFallback>TC</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">TechCommunity</span>
                            <VerifiedBadge size="sm" />
                            <span className="text-sm text-muted-foreground">@techcommunity</span>
                          </div>
                          <p className="text-sm text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">Excited to announce our new AI-powered learning platform! Join thousands of developers already using it to level up their skills. What topics would you like to see covered next?</p>
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
                      <FileText className="h-5 w-5 text-blue-500" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Mission</h4>
                      <p className="text-sm text-muted-foreground">Empowering tech professionals through collaboration, education, and innovation.</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold">Focus Areas</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                        <li>Web Development & Design</li>
                        <li>Artificial Intelligence & Machine Learning</li>
                        <li>Cloud Computing & DevOps</li>
                        <li>Mobile App Development</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-500" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-yellow-500 mt-1" />
                      <div>
                        <p className="font-medium">Best Tech Community 2023</p>
                        <p className="text-sm text-muted-foreground">Tech Awards</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-yellow-500 mt-1" />
                      <div>
                        <p className="font-medium">Innovation Award 2022</p>
                        <p className="text-sm text-muted-foreground">Community Excellence</p>
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
                      <span className="text-sm">hello@techcommunity.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-blue-500">tech community.com</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members" className="space-y-4">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      Admins
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Sarah Johnson', role: 'Product Manager', status: 'admin', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
                        { name: 'Michael Chen', role: 'Senior Developer', status: 'admin', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100' },
                      ].map((member, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          <Badge variant="default" className="gap-1">
                            <UserCheck className="h-3 w-3" />
                            Admin
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Emily Rodriguez', role: 'UX Researcher', status: 'member', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
                        { name: 'David Kim', role: 'Frontend Developer', status: 'member', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100' },
                        { name: 'Alex Martinez', role: 'Backend Developer', status: 'member', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100' },
                        { name: 'Jessica Lee', role: 'Data Scientist', status: 'member', avatar: 'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=100' },
                        { name: 'Ryan Thompson', role: 'DevOps Engineer', status: 'member', avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100' },
                      ].map((member, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="gap-1">
                            <Users className="h-3 w-3" />
                            Member
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Sent Invites
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Chris Anderson', email: 'chris.anderson@email.com', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100' },
                        { name: 'Nina Patel', email: 'nina.patel@email.com', avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100' },
                      ].map((person, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={person.avatar} alt={person.name} />
                              <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{person.name}</p>
                              <p className="text-sm text-muted-foreground">{person.email}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-blue-500" />
                      Join Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Tom Wilson', role: 'Mobile Developer', avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100' },
                        { name: 'Lisa Brown', role: 'UI Designer', avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=100' },
                        { name: 'Mark Davis', role: 'QA Engineer', avatar: 'https://images.pexels.com/photos/2102415/pexels-photo-2102415.jpeg?auto=compress&cs=tinysrgb&w=100' },
                      ].map((person, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={person.avatar} alt={person.name} />
                              <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{person.name}</p>
                              <p className="text-sm text-muted-foreground">{person.role}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="default">Accept</Button>
                            <Button size="sm" variant="outline">
                              <UserX className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                <Card className="shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-500" />
                          AI
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Manage information for AI to learn about the community</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Knowledge
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Knowledge Item</DialogTitle>
                            <DialogDescription>
                              Add new information for the AI to learn
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Title</label>
                              <Input
                                placeholder="e.g., Company Values"
                                value={newKnowledgeTitle}
                                onChange={(e) => setNewKnowledgeTitle(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Category</label>
                              <Input
                                placeholder="e.g., About, Guidelines, Products"
                                value={newKnowledgeCategory}
                                onChange={(e) => setNewKnowledgeCategory(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Content</label>
                              <Textarea
                                placeholder="Enter detailed information..."
                                value={newKnowledgeContent}
                                onChange={(e) => setNewKnowledgeContent(e.target.value)}
                                className="min-h-[120px]"
                              />
                            </div>
                            <Button
                              className="w-full"
                              onClick={() => {
                                if (newKnowledgeTitle && newKnowledgeContent && newKnowledgeCategory) {
                                  setKnowledgeItems([...knowledgeItems, {
                                    id: Date.now().toString(),
                                    title: newKnowledgeTitle,
                                    content: newKnowledgeContent,
                                    category: newKnowledgeCategory
                                  }]);
                                  setNewKnowledgeTitle('');
                                  setNewKnowledgeContent('');
                                  setNewKnowledgeCategory('');
                                }
                              }}
                            >
                              Add Item
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {knowledgeItems.map((item) => (
                        <Card key={item.id} className="shadow-sm">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <CardTitle className="text-base">{item.title}</CardTitle>
                                  <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingKnowledge(item)}
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Knowledge Item</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <label className="text-sm font-medium">Title</label>
                                        <Input
                                          defaultValue={item.title}
                                          onChange={(e) => {
                                            if (editingKnowledge) {
                                              setEditingKnowledge({ ...editingKnowledge, title: e.target.value });
                                            }
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Category</label>
                                        <Input
                                          defaultValue={item.category}
                                          onChange={(e) => {
                                            if (editingKnowledge) {
                                              setEditingKnowledge({ ...editingKnowledge, category: e.target.value });
                                            }
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Content</label>
                                        <Textarea
                                          defaultValue={item.content}
                                          onChange={(e) => {
                                            if (editingKnowledge) {
                                              setEditingKnowledge({ ...editingKnowledge, content: e.target.value });
                                            }
                                          }}
                                          className="min-h-[120px]"
                                        />
                                      </div>
                                      <Button
                                        className="w-full"
                                        onClick={() => {
                                          if (editingKnowledge) {
                                            setKnowledgeItems(knowledgeItems.map(k =>
                                              k.id === editingKnowledge.id ? editingKnowledge : k
                                            ));
                                            setEditingKnowledge(null);
                                          }
                                        }}
                                      >
                                        Save Changes
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setKnowledgeItems(knowledgeItems.filter(k => k.id !== item.id))}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{item.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <div className={`transition-all duration-500 ease-in-out ${isAppOpen ? 'opacity-0 -translate-y-8 h-0 overflow-hidden' : 'opacity-100 translate-y-0'}`}>
              <Card className="shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center md:items-start gap-4">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200" alt="TechCommunity" />
                        <AvatarFallback>TC</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <Button variant="outline" className="w-full gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Message
                        </Button>
                        <Button variant="outline" className="w-full gap-2">
                          <UserPlus className="h-4 w-4" />
                          Follow
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold">TechCommunity</h2>
                          <VerifiedBadge size="md" />
                        </div>
                        <p className="text-muted-foreground">@techcommunity</p>
                      </div>

                      <p className="text-foreground">
                        A thriving community of developers, designers, and tech enthusiasts building the future together.
                        Join us to collaborate, learn, and grow in the world of technology.
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPinned className="h-4 w-4 text-muted-foreground" />
                          <span>San Francisco, CA</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>50,000+ Members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span>Joined March 2020</span>
                        </div>
                      </div>

                      <div className="flex gap-4 text-sm">
                        <div><span className="font-semibold">850</span> <span className="text-muted-foreground">Following</span></div>
                        <div><span className="font-semibold">50K</span> <span className="text-muted-foreground">Followers</span></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeProfile2Tab} onValueChange={(value) => {
              setActiveProfile2Tab(value);
              if (value === 'app') {
                setIsAppOpen(true);
              } else {
                setIsAppOpen(false);
              }
            }} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="information">Information</TabsTrigger>
                <TabsTrigger value="app" className="gap-2">
                  <Package className="h-4 w-4" />
                  App
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100" alt="TechCommunity" />
                          <AvatarFallback>TC</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">TechCommunity</span>
                            <VerifiedBadge size="sm" />
                            <span className="text-sm text-muted-foreground">@techcommunity</span>
                          </div>
                          <p className="text-sm text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">Excited to announce our new AI-powered learning platform! Join thousands of developers already using it to level up their skills.</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>245 likes</span>
                        <span>32 comments</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="information" className="space-y-4">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Mission</h4>
                      <p className="text-sm text-muted-foreground">Empowering tech professionals through collaboration, education, and innovation.</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold">Focus Areas</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                        <li>Web Development & Design</li>
                        <li>Artificial Intelligence & Machine Learning</li>
                        <li>Cloud Computing & DevOps</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="app" className="space-y-4">
                <Card className="shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5 text-blue-500" />
                        Task Manager
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsAppOpen(false);
                          setActiveProfile2Tab('posts');
                        }}
                        className="gap-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Profile
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Manage your community tasks and activities</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {todos.map((todo) => (
                        <div key={todo.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              setTodos(todos.map(t =>
                                t.id === todo.id ? { ...t, completed: !t.completed } : t
                              ));
                            }}
                          >
                            {todo.completed ? (
                              <CheckSquare className="h-5 w-5 text-blue-500" />
                            ) : (
                              <div className="h-5 w-5 border-2 rounded border-muted-foreground" />
                            )}
                          </Button>
                          <span className={todo.completed ? 'line-through text-muted-foreground flex-1' : 'flex-1'}>
                            {todo.text}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new task..."
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTodo.trim()) {
                            setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
                            setNewTodo('');
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          if (newTodo.trim()) {
                            setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
                            setNewTodo('');
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Tasks</span>
                          <span className="font-semibold">{todos.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-muted-foreground">Completed</span>
                          <span className="font-semibold text-blue-500">{todos.filter(t => t.completed).length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-muted-foreground">Remaining</span>
                          <span className="font-semibold">{todos.filter(t => !t.completed).length}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
