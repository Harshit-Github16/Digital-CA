'use client';

import {
    Home,
    Settings,
    Users,
    FileText,
    TrendingUp,
    Bell,
    Check,
    X,
    AlertTriangle,
    Info
} from 'lucide-react';
import { Button, Card, CardHeader, CardBody, CardFooter, Input, Badge } from '@/components/ui';

export default function ThemeShowcase() {
    return (
        <div className="min-h-screen bg-secondary-50/30 p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-secondary-900">Professional Theme Showcase</h1>
                    <p className="text-lg text-secondary-600">Clean, modern components with white and indigo design</p>
                </div>

                {/* Color Palette */}
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-secondary-900">Color Palette</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Primary Colors */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-secondary-700">Primary (Indigo)</h3>
                                <div className="space-y-2">
                                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                                        <div key={shade} className="flex items-center space-x-3">
                                            <div className={`w-8 h-8 rounded-lg bg-primary-${shade} shadow-sm`}></div>
                                            <span className="text-sm text-secondary-600">{shade}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Secondary Colors */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-secondary-700">Secondary (Slate)</h3>
                                <div className="space-y-2">
                                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                                        <div key={shade} className="flex items-center space-x-3">
                                            <div className={`w-8 h-8 rounded-lg bg-secondary-${shade} shadow-sm`}></div>
                                            <span className="text-sm text-secondary-600">{shade}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Success Colors */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-secondary-700">Success (Green)</h3>
                                <div className="space-y-2">
                                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                                        <div key={shade} className="flex items-center space-x-3">
                                            <div className={`w-8 h-8 rounded-lg bg-success-${shade} shadow-sm`}></div>
                                            <span className="text-sm text-secondary-600">{shade}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Error Colors */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-secondary-700">Error (Red)</h3>
                                <div className="space-y-2">
                                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                                        <div key={shade} className="flex items-center space-x-3">
                                            <div className={`w-8 h-8 rounded-lg bg-error-${shade} shadow-sm`}></div>
                                            <span className="text-sm text-secondary-600">{shade}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Buttons */}
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-secondary-900">Buttons</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-8">
                            {/* Button Variants */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-secondary-700">Variants</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="primary">Primary</Button>
                                    <Button variant="secondary">Secondary</Button>
                                    <Button variant="ghost">Ghost</Button>
                                    <Button variant="success">Success</Button>
                                    <Button variant="warning">Warning</Button>
                                    <Button variant="error">Error</Button>
                                </div>
                            </div>

                            {/* Button Sizes */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-secondary-700">Sizes</h3>
                                <div className="flex flex-wrap items-center gap-4">
                                    <Button size="sm">Small</Button>
                                    <Button size="md">Medium</Button>
                                    <Button size="lg">Large</Button>
                                </div>
                            </div>

                            {/* Button States */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-secondary-700">States</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Button>Normal</Button>
                                    <Button loading>Loading</Button>
                                    <Button disabled>Disabled</Button>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Cards */}
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-secondary-900">Cards</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Default Card */}
                            <Card>
                                <CardHeader>
                                    <h3 className="font-semibold text-secondary-900">Default Card</h3>
                                </CardHeader>
                                <CardBody>
                                    <p className="text-secondary-600">This is a default card with header, body, and footer sections.</p>
                                </CardBody>
                                <CardFooter>
                                    <Button size="sm">Action</Button>
                                </CardFooter>
                            </Card>

                            {/* Hover Card */}
                            <Card variant="hover">
                                <CardHeader>
                                    <h3 className="font-semibold text-secondary-900">Hover Card</h3>
                                </CardHeader>
                                <CardBody>
                                    <p className="text-secondary-600">This card has hover effects with enhanced shadows.</p>
                                </CardBody>
                                <CardFooter>
                                    <Button size="sm" variant="secondary">Hover Me</Button>
                                </CardFooter>
                            </Card>

                            {/* Interactive Card */}
                            <Card variant="interactive">
                                <CardHeader>
                                    <h3 className="font-semibold text-secondary-900">Interactive Card</h3>
                                </CardHeader>
                                <CardBody>
                                    <p className="text-secondary-600">This card is clickable with lift animation.</p>
                                </CardBody>
                                <CardFooter>
                                    <Button size="sm" variant="ghost">Click Me</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </CardBody>
                </Card>

                {/* Inputs */}
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-secondary-900">Form Inputs</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Default Input"
                                placeholder="Enter text here..."
                                helperText="This is a helper text"
                            />
                            <Input
                                label="Large Input"
                                inputSize="lg"
                                placeholder="Large input field..."
                            />
                            <Input
                                label="Success Input"
                                variant="success"
                                placeholder="Valid input..."
                                defaultValue="Valid data"
                            />
                            <Input
                                label="Error Input"
                                variant="error"
                                placeholder="Invalid input..."
                                error="This field is required"
                            />
                        </div>
                    </CardBody>
                </Card>

                {/* Badges */}
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-secondary-900">Badges</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-3">
                                <Badge variant="primary">Primary</Badge>
                                <Badge variant="secondary">Secondary</Badge>
                                <Badge variant="success">Success</Badge>
                                <Badge variant="warning">Warning</Badge>
                                <Badge variant="error">Error</Badge>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Badge variant="success">
                                    <Check className="w-3 h-3 mr-1" />
                                    Completed
                                </Badge>
                                <Badge variant="warning">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Pending
                                </Badge>
                                <Badge variant="error">
                                    <X className="w-3 h-3 mr-1" />
                                    Failed
                                </Badge>
                                <Badge variant="primary">
                                    <Info className="w-3 h-3 mr-1" />
                                    Info
                                </Badge>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Stats Cards Example */}
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-secondary-900">Stats Cards</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {[
                                { title: 'Total Revenue', value: '₹2,45,000', change: '+12.5%', positive: true, icon: TrendingUp, gradient: 'from-success-500 to-success-600' },
                                { title: 'Active Users', value: '1,234', change: '+8.2%', positive: true, icon: Users, gradient: 'from-primary-500 to-primary-600' },
                                { title: 'Pending Tasks', value: '23', change: '-5.1%', positive: false, icon: FileText, gradient: 'from-warning-500 to-warning-600' },
                                { title: 'Notifications', value: '12', change: '+3.2%', positive: true, icon: Bell, gradient: 'from-secondary-500 to-secondary-600' },
                            ].map((stat, index) => (
                                <Card key={index} variant="hover" className="group">
                                    <CardBody>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-3">
                                                <p className="stat-label">{stat.title}</p>
                                                <p className="stat-value">{stat.value}</p>
                                                <div className="flex items-center space-x-2">
                                                    <TrendingUp className={`w-4 h-4 ${stat.positive ? 'text-success-600' : 'text-error-600'}`} />
                                                    <span className={stat.positive ? 'stat-change-positive' : 'stat-change-negative'}>
                                                        {stat.change}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-sm group-hover:shadow-md transition-all duration-200`}>
                                                <stat.icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Navigation Example */}
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-secondary-900">Navigation Items</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-2 max-w-xs">
                            <div className="nav-item-active">
                                <Home className="w-5 h-5 mr-3" />
                                Dashboard
                            </div>
                            <div className="nav-item">
                                <Users className="w-5 h-5 mr-3" />
                                Users
                            </div>
                            <div className="nav-item">
                                <FileText className="w-5 h-5 mr-3" />
                                Documents
                            </div>
                            <div className="nav-item">
                                <Settings className="w-5 h-5 mr-3" />
                                Settings
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}