"use client";

import React from "react"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Radio } from "@/components/ui/radio"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tooltip } from "@/components/ui/tooltip"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Avatar } from "@/components/ui/avatar"
import { Divider } from "@/components/ui/divider"
import { HeatRiskBadge } from "@/components/heat/heat-risk-badge"
import { HeatRiskIndicator } from "@/components/heat/heat-risk-indicator"
import { HeatLegend } from "@/components/heat/heat-legend"
import { MetricCard } from "@/components/data-display/metric-card"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { Thermometer, Leaf, Activity } from "lucide-react"

export default function DesignSystemPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="HeatGuard AI Design System" 
        description="Comprehensive UI component library for Phase 2" 
      />

      <div className="flex flex-col gap-12 py-8">
        {/* Colors */}
        <section>
          <h2 className="text-h3 mb-6">Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-24 rounded-md bg-primary flex items-end p-2 text-white font-medium shadow-sm">Primary</div>
            <div className="h-24 rounded-md bg-secondary flex items-end p-2 text-white font-medium shadow-sm">Secondary</div>
            <div className="h-24 rounded-md bg-accent flex items-end p-2 text-white font-medium shadow-sm">Accent</div>
            <div className="h-24 rounded-md bg-background border flex items-end p-2 text-foreground font-medium shadow-sm">Background</div>
            
            <div className="h-24 rounded-md bg-heat-low flex items-end p-2 text-white font-medium shadow-sm">Heat Low</div>
            <div className="h-24 rounded-md bg-heat-moderate flex items-end p-2 text-white font-medium shadow-sm">Heat Moderate</div>
            <div className="h-24 rounded-md bg-heat-high flex items-end p-2 text-white font-medium shadow-sm">Heat High</div>
            <div className="h-24 rounded-md bg-heat-extreme flex items-end p-2 text-white font-medium shadow-sm">Heat Extreme</div>
          </div>
        </section>

        <Divider />

        {/* Typography */}
        <section>
          <h2 className="text-h3 mb-6">Typography</h2>
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-caption text-muted-foreground">.text-display</span>
              <p className="text-display">Display Text</p>
            </div>
            <div>
              <span className="text-caption text-muted-foreground">.text-h1</span>
              <h1 className="text-h1">Heading 1</h1>
            </div>
            <div>
              <span className="text-caption text-muted-foreground">.text-h2</span>
              <h2 className="text-h2">Heading 2</h2>
            </div>
            <div>
              <span className="text-caption text-muted-foreground">.text-h3</span>
              <h3 className="text-h3">Heading 3</h3>
            </div>
            <div>
              <span className="text-caption text-muted-foreground">.text-body-large</span>
              <p className="text-body-large">Body Large: The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div>
              <span className="text-caption text-muted-foreground">.text-body</span>
              <p className="text-body">Body: The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div>
              <span className="text-caption text-muted-foreground">.text-body-small</span>
              <p className="text-body-small">Body Small: The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div>
              <span className="text-caption text-muted-foreground">.text-metric</span>
              <p className="text-metric">1,234</p>
            </div>
          </div>
        </section>

        <Divider />

        {/* Buttons */}
        <section>
          <h2 className="text-h3 mb-6">Buttons</h2>
          <div className="flex flex-wrap gap-4 items-end mb-8">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
            <Button size="icon"><Leaf className="h-4 w-4" /></Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        <Divider />

        {/* Cards & Badges */}
        <section>
          <h2 className="text-h3 mb-6">Cards & Badges</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>This is a standard card component with subtle shadow.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Card content goes here.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="small">Action</Button>
              </CardFooter>
            </Card>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>This card uses the elevated shadow.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge variant="neutral">Neutral</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        <Divider />

        {/* Heat Intelligence */}
        <section>
          <h2 className="text-h3 mb-6">Heat Intelligence Components</h2>
          <div className="flex flex-col gap-8">
            <div>
              <h4 className="text-sm font-medium mb-3">Heat Risk Badges</h4>
              <div className="flex gap-2">
                <HeatRiskBadge level="LOW" />
                <HeatRiskBadge level="MODERATE" />
                <HeatRiskBadge level="HIGH" />
                <HeatRiskBadge level="EXTREME" />
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Heat Risk Indicators</h4>
              <div className="flex gap-6">
                <HeatRiskIndicator level="LOW" />
                <HeatRiskIndicator level="MODERATE" />
                <HeatRiskIndicator level="HIGH" />
                <HeatRiskIndicator level="EXTREME" />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Heat Legend</h4>
              <HeatLegend />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <MetricCard 
                title="Avg Temperature" 
                value="34" 
                unit="°C" 
                icon={Thermometer} 
                trend="positive"
                description="+1.2°C from yesterday"
              />
              <MetricCard 
                title="Air Quality" 
                value="112" 
                unit="AQI" 
                icon={Activity} 
                trend="negative"
                description="Moderate risk"
              />
              <MetricCard 
                title="Active Trees" 
                value="1,204" 
                icon={Leaf} 
                trend="positive"
                description="New plantation added"
              />
            </div>
          </div>
        </section>

        <Divider />

        {/* Forms */}
        <section>
          <h2 className="text-h3 mb-6">Forms</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <label className="text-label">Input Field</label>
                <Input placeholder="Enter something..." />
              </div>
              <div className="space-y-1">
                <label className="text-label">Select</label>
                <Select>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-label">Textarea</label>
                <Textarea placeholder="Type your message here." />
              </div>
            </div>
            
            <div className="flex flex-col gap-4 justify-start">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm font-medium leading-none">Accept terms and conditions</label>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Radio id="r1" name="radio" defaultChecked />
                <label htmlFor="r1" className="text-sm font-medium leading-none">Option A</label>
              </div>
              <div className="flex items-center space-x-2">
                <Radio id="r2" name="radio" />
                <label htmlFor="r2" className="text-sm font-medium leading-none">Option B</label>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Switch id="airplane-mode" />
                <label htmlFor="airplane-mode" className="text-sm font-medium leading-none">Airplane Mode</label>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* Feedback & States */}
        <section>
          <h2 className="text-h3 mb-6">Feedback & States</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col gap-4">
              <Alert variant="info">
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>Here is some info you should know.</AlertDescription>
              </Alert>
              <Alert variant="success">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Your action was completed successfully.</AlertDescription>
              </Alert>
              <Alert variant="warning">
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>Please be careful with this setting.</AlertDescription>
              </Alert>
              <Alert variant="danger">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Something went wrong with the operation.</AlertDescription>
              </Alert>
            </div>
            
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Loading States</h4>
                <div className="flex items-center gap-4 mb-4">
                  <Spinner size="small" />
                  <Spinner size="medium" />
                  <Spinner size="large" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Avatars & Tooltips</h4>
                <div className="flex items-center gap-6">
                  <Avatar fallback="AB" />
                  <Avatar src="https://github.com/shadcn.png" />
                  <Tooltip content="This is a tooltip">
                    <Button variant="outline" size="small">Hover Me</Button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <EmptyState 
              title="No Data Available"
              description="There is currently no data to display in this section. Check back later."
              actionLabel="Refresh Data"
              onAction={() => {}}
            />
            <ErrorState 
              onRetry={() => {}}
            />
          </div>
        </section>

        <Divider />

        {/* Navigation & Tabs */}
        <section>
          <h2 className="text-h3 mb-6">Tabs & Navigation</h2>
          <Tabs defaultValue="tab1" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="tab1">Overview</TabsTrigger>
              <TabsTrigger value="tab2">Details</TabsTrigger>
              <TabsTrigger value="tab3">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="p-4 border rounded-md mt-2">Overview Content</TabsContent>
            <TabsContent value="tab2" className="p-4 border rounded-md mt-2">Details Content</TabsContent>
            <TabsContent value="tab3" className="p-4 border rounded-md mt-2">Settings Content</TabsContent>
          </Tabs>
        </section>
      </div>
    </PageContainer>
  )
}
