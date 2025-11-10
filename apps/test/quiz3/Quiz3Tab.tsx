// Quiz design comparison tab showing three different design variants
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Trophy, PlayCircle, Award } from 'lucide-react';

export function Quiz3Tab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Design Variants Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="variant1" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="variant1">Variant 1</TabsTrigger>
              <TabsTrigger value="variant2">Variant 2</TabsTrigger>
              <TabsTrigger value="variant3">Variant 3</TabsTrigger>
            </TabsList>

            <TabsContent value="variant1" className="space-y-6">
              <Variant1 />
            </TabsContent>

            <TabsContent value="variant2" className="space-y-6">
              <Variant2 />
            </TabsContent>

            <TabsContent value="variant3" className="space-y-6">
              <Variant3 />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function Variant1() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center">
              <PlayCircle className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to the Quiz!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Test your knowledge with our interactive quiz
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">10</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">15</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
          </div>
          <Button className="w-full" size="lg">
            Start Quiz
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Registration Form</CardTitle>
          <p className="text-sm text-muted-foreground">
            Please provide your details before starting
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name1">Full Name</Label>
            <Input id="name1" placeholder="Enter your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone1">Phone Number</Label>
            <Input id="phone1" placeholder="+1 (555) 000-0000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="university1">University</Label>
            <Input id="university1" placeholder="Enter your university" />
          </div>
          <Button className="w-full" size="lg">
            Continue to Quiz
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
          <p className="text-muted-foreground">Great job on finishing the quiz</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg">
            <div className="text-5xl font-bold text-blue-500 mb-2">8/10</div>
            <div className="text-lg text-muted-foreground">80% Correct</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">10</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="text-center p-4 bg-red-500/10 rounded-lg">
              <div className="text-2xl font-bold text-red-600">2</div>
              <div className="text-xs text-muted-foreground">Wrong</div>
            </div>
          </div>
          <Button className="w-full" size="lg">
            View Correct Answers
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Quiz Already Completed</CardTitle>
          <p className="text-muted-foreground mt-2">
            You have already taken this quiz
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-500/10 rounded-lg text-center">
            <div className="text-sm text-muted-foreground mb-1">Your Score</div>
            <div className="text-3xl font-bold text-blue-500">8/10</div>
          </div>
          <Button className="w-full" variant="outline" size="lg">
            View Results
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Variant2() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md border-2">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <PlayCircle className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Ready to Begin?</h2>
              <p className="text-muted-foreground text-lg">
                Challenge yourself with this interactive quiz
              </p>
            </div>
            <div className="flex justify-center gap-8 py-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-1">10</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-1">15</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
            </div>
            <Button size="lg" className="px-8 shadow-md">
              Start Quiz Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-2">
        <CardContent className="pt-6 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Before You Start</h2>
            <p className="text-muted-foreground">
              We need a few details to get you started
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name2" className="text-base">
                Full Name
              </Label>
              <Input id="name2" placeholder="John Doe" className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone2" className="text-base">
                Phone Number
              </Label>
              <Input id="phone2" placeholder="+1 (555) 000-0000" className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university2" className="text-base">
                University
              </Label>
              <Input id="university2" placeholder="Your University" className="h-12" />
            </div>
          </div>
          <Button className="w-full shadow-md" size="lg">
            Proceed to Quiz
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-md border-2">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
              <p className="text-muted-foreground text-lg">
                You've completed the quiz successfully
              </p>
            </div>
            <div className="inline-block">
              <div className="text-6xl font-bold bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-transparent mb-2">
                8/10
              </div>
              <div className="text-lg text-muted-foreground">80% Success Rate</div>
            </div>
            <div className="flex justify-center gap-4">
              <div className="text-center px-6 py-4 bg-muted/50 rounded-xl">
                <div className="text-xl font-bold">10</div>
                <div className="text-xs text-muted-foreground">Questions</div>
              </div>
              <div className="text-center px-6 py-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <div className="text-xl font-bold text-green-600">8</div>
                <div className="text-xs text-muted-foreground">Correct</div>
              </div>
              <div className="text-center px-6 py-4 bg-red-500/10 rounded-xl border border-red-500/20">
                <div className="text-xl font-bold text-red-600">2</div>
                <div className="text-xs text-muted-foreground">Incorrect</div>
              </div>
            </div>
            <Button size="lg" className="px-8 shadow-md">
              Review Answers
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-2 border-blue-500/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-500 shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Already Completed</h2>
              <p className="text-muted-foreground text-lg">
                You've already taken this quiz
              </p>
            </div>
            <div className="inline-block p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl">
              <div className="text-sm text-muted-foreground mb-2">Your Final Score</div>
              <div className="text-4xl font-bold text-blue-500">8/10</div>
            </div>
            <Button variant="outline" size="lg" className="px-8 shadow-sm">
              View Your Results
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Variant3() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <PlayCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Welcome!</h2>
          <p className="text-blue-50">
            Test your knowledge with our interactive quiz
          </p>
        </div>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
              <div className="text-3xl font-bold text-blue-500 mb-1">10</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
              <div className="text-3xl font-bold text-blue-500 mb-1">15</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
          </div>
          <Button className="w-full shadow-lg" size="lg">
            Begin Quiz
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-500/5 to-transparent border-b">
          <CardTitle className="text-xl">Registration Required</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your information to continue
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name3" className="text-base font-medium">
              Full Name
            </Label>
            <Input
              id="name3"
              placeholder="Enter your full name"
              className="h-11 border-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone3" className="text-base font-medium">
              Phone Number
            </Label>
            <Input
              id="phone3"
              placeholder="+1 (555) 000-0000"
              className="h-11 border-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="university3" className="text-base font-medium">
              University
            </Label>
            <Input
              id="university3"
              placeholder="Enter your university name"
              className="h-11 border-2"
            />
          </div>
          <Button className="w-full shadow-lg" size="lg">
            Start Quiz
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <Award className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Excellent Work!</h2>
          <p className="text-blue-50">You've successfully completed the quiz</p>
        </div>
        <CardContent className="p-6 space-y-6">
          <div className="text-center py-8 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl border-2 border-blue-500/20">
            <div className="text-6xl font-bold bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-transparent mb-2">
              8/10
            </div>
            <div className="text-lg font-medium text-muted-foreground">
              80% Accuracy
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-4 rounded-xl bg-muted/30 border">
              <div className="text-2xl font-bold mb-1">10</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <div className="text-2xl font-bold text-green-600 mb-1">8</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <div className="text-2xl font-bold text-red-600 mb-1">2</div>
              <div className="text-xs text-muted-foreground">Wrong</div>
            </div>
          </div>
          <Button className="w-full shadow-lg" size="lg">
            View Detailed Results
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-2 border-blue-500/30 overflow-hidden">
        <div className="bg-blue-500/5 p-8 text-center border-b">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500 mb-4">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Quiz Completed</h2>
          <p className="text-muted-foreground">
            You have already completed this quiz
          </p>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl border-2 border-blue-500/20 text-center">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Your Score
            </div>
            <div className="text-5xl font-bold text-blue-500">8/10</div>
          </div>
          <Button variant="outline" size="lg" className="w-full shadow-sm border-2">
            Review Results
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
