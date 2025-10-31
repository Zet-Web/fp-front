// Testing page for UI components and features, hidden from search engines
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SearchableDropdown } from '@/components/shared/SearchableDropdown';
import { Search, MapPin, Package, Briefcase, ShoppingBag, Wrench } from 'lucide-react';

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
            <CardTitle className="text-2xl">Test Page - UI Components</CardTitle>
            <p className="text-sm text-muted-foreground">
              This page is for testing new UI components and features
            </p>
          </CardHeader>
        </Card>

        <Tabs defaultValue="catalog" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto">
            <TabsTrigger value="catalog">Catalog Directory</TabsTrigger>
            <TabsTrigger value="test2" disabled>Test Tab 2</TabsTrigger>
            <TabsTrigger value="test3" disabled>Test Tab 3</TabsTrigger>
            <TabsTrigger value="test4" disabled>Test Tab 4</TabsTrigger>
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
        </Tabs>
      </div>
    </>
  );
}
