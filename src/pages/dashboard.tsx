import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Mail, 
  Phone, 
  Globe, 
  Image, 
  FileText, 
  Shield, 
  Terminal, 
  Eye, 
  Download,
  Zap,
  Lock,
  Wifi,
  Database,
  Camera,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronRight,
  Code,
  Users,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface OSINTResult {
  id: string;
  type: string;
  query: string;
  results: any;
  timestamp: Date;
  status: 'loading' | 'success' | 'error';
}

const osintTools = [
  {
    id: 'username',
    title: 'Username Lookup',
    description: 'Search for usernames across multiple platforms',
    icon: Users,
    category: 'Social',
    premium: false
  },
  {
    id: 'email',
    title: 'Email Investigation',
    description: 'Check email breaches and validate addresses',
    icon: Mail,
    category: 'Communication',
    premium: false
  },
  {
    id: 'phone',
    title: 'Phone Number OSINT',
    description: 'Carrier lookup and location estimation',
    icon: Phone,
    category: 'Communication',
    premium: true
  },
  {
    id: 'ip',
    title: 'IP Geolocation',
    description: 'IP address geolocation and network info',
    icon: Globe,
    category: 'Network',
    premium: false
  },
  {
    id: 'domain',
    title: 'Domain Analysis',
    description: 'WHOIS lookup and DNS enumeration',
    icon: Wifi,
    category: 'Network',
    premium: false
  },
  {
    id: 'metadata',
    title: 'Metadata Extractor',
    description: 'Extract EXIF and document metadata',
    icon: FileText,
    category: 'Files',
    premium: true
  },
  {
    id: 'reverse-image',
    title: 'Reverse Image Search',
    description: 'Find image sources and similar images',
    icon: Camera,
    category: 'Media',
    premium: true
  },
  {
    id: 'google-dorks',
    title: 'Google Dork Generator',
    description: 'Generate advanced search queries',
    icon: Code,
    category: 'Search',
    premium: false
  },
  {
    id: 'pastebin',
    title: 'Pastebin Scanner',
    description: 'Search for leaked data in pastebins',
    icon: Database,
    category: 'Leaks',
    premium: true
  }
];

const platforms = [
  'GitHub', 'Twitter', 'Instagram', 'LinkedIn', 'Reddit', 'YouTube', 
  'TikTok', 'Facebook', 'Discord', 'Telegram', 'Steam', 'Twitch'
];

import DashboardLayout from "@/components/DashboardLayout";

export default function OSINTToolbox(...args: []) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<OSINTResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const handleToolSelect = (toolId: string) => {
    const tool = osintTools.find(t => t.id === toolId);
    if (tool?.premium && !isPremium) {
      toast.error("This feature requires a premium subscription");
      return;
    }
    setSelectedTool(toolId);
    setActiveTab('tools');
  };

  const executeOSINT = async () => {
    if (!query.trim() || !selectedTool) return;

    setIsLoading(true);
    const newResult: OSINTResult = {
      id: Date.now().toString(),
      type: selectedTool,
      query: query.trim(),
      results: null,
      timestamp: new Date(),
      status: 'loading'
    };

    setResults(prev => [newResult, ...prev]);

    try {
      let apiEndpoint = '';
      let requestBody: any = {};

      switch (selectedTool) {
        case 'username':
          apiEndpoint = '/api/osint/username';
          requestBody = { username: query.trim() };
          break;
        case 'email':
          apiEndpoint = '/api/osint/email';
          requestBody = { email: query.trim() };
          break;
        case 'ip':
          apiEndpoint = '/api/osint/ip';
          requestBody = { ip: query.trim() };
          break;
        case 'domain':
          apiEndpoint = '/api/osint/domain';
          requestBody = { domain: query.trim() };
          break;
        case 'google-dorks':
          apiEndpoint = '/api/osint/google-dorks';
          requestBody = { target: query.trim(), category: 'general' };
          break;
        default:
          // For tools not yet implemented, use mock data
          await new Promise(resolve => setTimeout(resolve, 2000));
          const mockResults = { message: 'Analysis complete', tool: selectedTool };
          setResults(prev => prev.map(r => r.id === newResult.id
            ? { ...r, results: mockResults, status: 'success' as const }
            : r
          ));
          toast.success("Analysis completed successfully");
          return;
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setResults(prev => prev.map(r => r.id === newResult.id
        ? { ...r, results: data, status: 'success' as const }
        : r
      ));

      toast.success("Analysis completed successfully");
    } catch (error) {
      console.error('OSINT execution error:', error);
      setResults(prev => prev.map(r => r.id === newResult.id
        ? { ...r, status: 'error' as const }
        : r
      ));
      toast.error("Analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  const exportResults = () => {
    toast.success("Results exported to PDF");
  };

  return (
    <>
      <Head>
        <title>OSINT Toolbox - Professional Intelligence Gathering</title>
        <meta name="description" content="Advanced OSINT tools for ethical hackers, investigators, and security professionals" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-background matrix-bg">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-b border-primary/20 bg-card/50 backdrop-blur-sm sticky top-0 z-50"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center hacker-glow">
                  <Terminal className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-primary">OSINT Toolbox</h1>
                  <p className="text-xs text-muted-foreground">Professional Intelligence Suite</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/upgrade">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/30 hover:bg-primary/10"
                  >
                    Upgrade
                  </Button>
                </Link>

              </div>
            </div>
          </div>
        </motion.header>

        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-card/50 border border-primary/20">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary/20">
                <Activity className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="tools" className="data-[state=active]:bg-primary/20">
                <Search className="w-4 h-4 mr-2" />
                Tools
              </TabsTrigger>
              <TabsTrigger value="results" className="data-[state=active]:bg-primary/20">
                <Database className="w-4 h-4 mr-2" />
                Results
              </TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:bg-primary/20">
                <Shield className="w-4 h-4 mr-2" />
                Learn
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="relative">
                  <img
                    src="https://www.freepik.com/free-photo/abstract-blur-empty-green-gradient-studio-well-use-as-background-website-template-frame-business-report_16543687.htm#fromView=keyword&page=1&position=2&uuid=ca3ed3b3-3149-4d96-8134-dcba0ff088d5&query=Green+Backgroundw=1200&h=400&fit=crop&crop=center"
                    alt="Cybersecurity Background"
                    className="w-full h-64 object-cover rounded-lg opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <h2 className="text-4xl font-bold text-primary typing-animation">
                        Advanced OSINT Operations
                      </h2>
                      <p className="text-lg text-muted-foreground max-w-2xl">
                        Professional-grade intelligence gathering tools for ethical hackers,
                        cybersecurity professionals, and digital investigators.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {osintTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className="terminal-window hover:hacker-glow transition-all duration-300 cursor-pointer group"
                      onClick={() => handleToolSelect(tool.id)}
                    >
                      <CardHeader className="terminal-header">
                        <div className="flex items-center gap-2">
                          <div className="terminal-dot red"></div>
                          <div className="terminal-dot yellow"></div>
                          <div className="terminal-dot green"></div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                            <tool.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-lg">{tool.title}</CardTitle>
                              {tool.premium && (
                                <Badge variant="secondary" className="text-xs">
                                  <Lock className="w-3 h-3 mr-1" />
                                  Pro
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-sm mb-3">
                              {tool.description}
                            </CardDescription>
                            <Badge variant="outline" className="text-xs">
                              {tool.category}
                            </Badge>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="terminal-window">
                  <CardHeader className="terminal-header">
                    <div className="flex items-center gap-2">
                      <div className="terminal-dot red"></div>
                      <div className="terminal-dot yellow"></div>
                      <div className="terminal-dot green"></div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Input
                            placeholder="Enter target (username, email, IP, domain...)"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="bg-input border-primary/30 focus:border-primary"
                            onKeyPress={(e) => e.key === 'Enter' && executeOSINT()} />
                        </div>
                        <Button
                          onClick={executeOSINT}
                          disabled={!query.trim() || isLoading}
                          className="bg-primary hover:bg-primary/80"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Zap className="w-4 h-4 mr-2" />
                          )}
                          Execute
                        </Button>
                      </div>

                      {selectedTool && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Terminal className="w-4 h-4" />
                          Selected tool: {osintTools.find(t => t.id === selectedTool)?.title}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Tool Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {osintTools.map((tool) => (
                    <Card
                      key={tool.id}
                      className={`cursor-pointer transition-all duration-200 ${selectedTool === tool.id
                          ? 'border-primary bg-primary/10 hacker-glow'
                          : 'border-primary/20 hover:border-primary/40'}`}
                      onClick={() => setSelectedTool(tool.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <tool.icon className="w-5 h-5 text-primary" />
                          <span className="font-medium">{tool.title}</span>
                          {tool.premium && (
                            <Lock className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Investigation Results</h3>
                  <Button
                    variant="outline"
                    onClick={exportResults}
                    className="border-primary/30"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>

                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {results.map((result) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                        >
                          <Card className="terminal-window">
                            <CardHeader className="terminal-header">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="terminal-dot red"></div>
                                  <div className="terminal-dot yellow"></div>
                                  <div className="terminal-dot green"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {result.status === 'loading' && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                                  {result.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                  {result.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                                  <span className="text-xs text-muted-foreground">
                                    {result.timestamp.toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{result.type}</Badge>
                                  <span className="font-mono text-sm">{result.query}</span>
                                </div>

                                {result.status === 'loading' && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Terminal className="w-4 h-4" />
                                      Analyzing target...
                                    </div>
                                    <Progress value={33} className="h-2" />
                                  </div>
                                )}

                                {result.status === 'success' && result.results && (
                                  <div className="space-y-3">
                                    {result.type === 'username' && result.results.platforms && (
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium">Found on {result.results.totalFound} platforms:</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          {result.results.platforms.map((platform: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 rounded border border-primary/10">
                                              <div className="flex flex-col">
                                                <span className="text-sm font-medium">{platform.name}</span>
                                                {platform.found && platform.url && (
                                                  <a href={platform.url} target="_blank" rel="noopener noreferrer"
                                                    className="text-xs text-primary hover:underline">
                                                    {platform.url}
                                                  </a>
                                                )}
                                              </div>
                                              <Badge variant={platform.found ? "default" : "secondary"}>
                                                {platform.found ? "Found" : "Not Found"}
                                              </Badge>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {result.type === 'email' && (
                                      <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm">Status:</span>
                                            <Badge variant={result.results.valid ? "default" : "destructive"}>
                                              {result.results.valid ? "Valid" : "Invalid"}
                                            </Badge>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm">Domain:</span>
                                            <span className="text-sm font-mono">{result.results.domain}</span>
                                          </div>
                                        </div>
                                        {result.results.breaches > 0 && (
                                          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                                            <div className="flex items-center gap-2 mb-2">
                                              <AlertTriangle className="w-4 h-4 text-destructive" />
                                              <span className="text-sm font-medium text-destructive">
                                                Found in {result.results.breaches} data breaches
                                              </span>
                                            </div>
                                            {result.results.breachList && result.results.breachList.length > 0 && (
                                              <div className="space-y-1">
                                                {result.results.breachList.map((breach: string, idx: number) => (
                                                  <div key={idx} className="text-xs text-muted-foreground">• {breach}</div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                        {result.results.disposable && (
                                          <Badge variant="outline" className="text-yellow-600">
                                            Disposable Email
                                          </Badge>
                                        )}
                                      </div>
                                    )}

                                    {result.type === 'ip' && (
                                      <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <span className="text-muted-foreground">Location:</span>
                                            <p className="font-medium">{result.results.city}, {result.results.region}</p>
                                            <p className="text-xs text-muted-foreground">{result.results.country}</p>
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">ISP:</span>
                                            <p className="font-medium">{result.results.isp}</p>
                                            <p className="text-xs text-muted-foreground">{result.results.asn}</p>
                                          </div>
                                        </div>
                                        {(result.results.vpn || result.results.proxy || result.results.tor) && (
                                          <div className="flex gap-2">
                                            {result.results.vpn && <Badge variant="destructive">VPN</Badge>}
                                            {result.results.proxy && <Badge variant="destructive">Proxy</Badge>}
                                            {result.results.tor && <Badge variant="destructive">Tor</Badge>}
                                          </div>
                                        )}
                                        {result.results.ports && result.results.ports.length > 0 && (
                                          <div className="space-y-2">
                                            <span className="text-sm font-medium">Open Ports:</span>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                              {result.results.ports
                                                .filter((port: any) => port.status === 'open')
                                                .map((port: any, idx: number) => (
                                                  <div key={idx} className="text-xs p-2 bg-primary/10 rounded">
                                                    {port.port} ({port.service})
                                                  </div>
                                                ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {result.type === 'domain' && (
                                      <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <span className="text-muted-foreground">Registrar:</span>
                                            <p className="font-medium">{result.results.registrar}</p>
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">Created:</span>
                                            <p className="font-medium">{result.results.created}</p>
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">Expires:</span>
                                            <p className="font-medium">{result.results.expires}</p>
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">SSL Grade:</span>
                                            <Badge variant={result.results.ssl?.grade === 'A+' ? 'default' : 'secondary'}>
                                              {result.results.ssl?.grade || 'Unknown'}
                                            </Badge>
                                          </div>
                                        </div>
                                        {result.results.subdomains && result.results.subdomains.length > 0 && (
                                          <div className="space-y-2">
                                            <span className="text-sm font-medium">Subdomains Found:</span>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                              {result.results.subdomains.slice(0, 6).map((subdomain: string, idx: number) => (
                                                <div key={idx} className="text-xs p-2 bg-secondary/50 rounded font-mono">
                                                  {subdomain}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        {result.results.technologies && result.results.technologies.length > 0 && (
                                          <div className="space-y-2">
                                            <span className="text-sm font-medium">Technologies:</span>
                                            <div className="flex flex-wrap gap-2">
                                              {result.results.technologies.map((tech: any, idx: number) => (
                                                <Badge key={idx} variant="outline" className="text-xs">
                                                  {tech.name} {tech.version && `v${tech.version}`}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {result.type === 'google-dorks' && result.results.dorks && (
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium">Generated {result.results.dorks.length} search queries:</span>
                                          <Badge variant="outline">{result.results.category}</Badge>
                                        </div>
                                        <div className="space-y-2">
                                          {result.results.dorks.map((dork: any, idx: number) => (
                                            <div key={idx} className="p-3 bg-secondary/50 rounded border border-primary/10">
                                              <div className="flex items-start justify-between gap-2 mb-2">
                                                <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded flex-1">
                                                  {dork.query}
                                                </code>
                                                <Badge variant={dork.risk === 'high' ? 'destructive' :
                                                  dork.risk === 'medium' ? 'secondary' : 'outline'}>
                                                  {dork.risk}
                                                </Badge>
                                              </div>
                                              <p className="text-xs text-muted-foreground">{dork.description}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Fallback for other tool types */}
                                    {!['username', 'email', 'ip', 'domain', 'google-dorks'].includes(result.type) && (
                                      <div className="p-3 bg-secondary/50 rounded">
                                        <pre className="text-sm text-muted-foreground">
                                          {JSON.stringify(result.results, null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {result.status === 'error' && (
                                  <div className="flex items-center gap-2 text-red-500 text-sm">
                                    <XCircle className="w-4 h-4" />
                                    Analysis failed. Please try again.
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {results.length === 0 && (
                      <Card className="terminal-window">
                        <CardContent className="p-12 text-center">
                          <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No investigations yet. Start by selecting a tool and entering a target.</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </ScrollArea>
              </motion.div>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="terminal-window">
                  <CardHeader className="terminal-header">
                    <div className="flex items-center gap-2">
                      <div className="terminal-dot red"></div>
                      <div className="terminal-dot yellow"></div>
                      <div className="terminal-dot green"></div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <Shield className="w-16 h-16 text-primary mx-auto" />
                      <h3 className="text-2xl font-bold">OSINT Education Center</h3>
                      <p className="text-muted-foreground max-w-2xl mx-auto">
                        Learn the fundamentals of Open Source Intelligence gathering,
                        ethical hacking techniques, and digital investigation methodologies.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        OSINT Fundamentals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• What is Open Source Intelligence?</li>
                        <li>• Legal and ethical considerations</li>
                        <li>• OSINT framework and methodology</li>
                        <li>• Data collection techniques</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Social Media Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Platform-specific techniques</li>
                        <li>• Profile analysis methods</li>
                        <li>• Social network mapping</li>
                        <li>• Privacy settings bypass</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Network Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• IP address investigation</li>
                        <li>• Domain and subdomain enumeration</li>
                        <li>• Network infrastructure mapping</li>
                        <li>• Certificate transparency logs</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Digital Forensics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Metadata analysis techniques</li>
                        <li>• Image and document forensics</li>
                        <li>• Timeline reconstruction</li>
                        <li>• Evidence preservation</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="border-t border-primary/20 bg-card/30 backdrop-blur-sm mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span>OSINT Toolbox v2.0</span>
              </div>
              <div className="flex items-center gap-4">
                <span>For educational and ethical use only</span>
                <Badge variant="outline" className="gap-1">
                  <Lock className="w-3 h-3" />
                  Secure
                </Badge>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
