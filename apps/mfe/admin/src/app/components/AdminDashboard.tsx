import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@nx-micros/ui';
import { Badge } from '@nx-micros/ui';
import { Button } from '@nx-micros/ui';
import { Progress } from '@nx-micros/ui';

interface SystemMetrics {
  requests: number;
  cacheHitRate: number;
  activeConnections: number;
  queueSize: number;
  errorRate: number;
  responseTime: number;
}

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  uptime: string;
  version: string;
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    requests: 0,
    cacheHitRate: 85,
    activeConnections: 42,
    queueSize: 12,
    errorRate: 0.5,
    responseTime: 145,
  });

  const [services] = useState<ServiceStatus[]>([
    {
      name: 'Authentication',
      status: 'healthy',
      uptime: '99.9%',
      version: '1.2.3',
    },
    {
      name: 'Payment Service',
      status: 'healthy',
      uptime: '99.8%',
      version: '2.1.0',
    },
    { name: 'Database', status: 'healthy', uptime: '99.9%', version: '15.3' },
    {
      name: 'Cache (Valkey)',
      status: 'warning',
      uptime: '98.5%',
      version: '7.2.4',
    },
    { name: 'Queue (SQS)', status: 'healthy', uptime: '99.7%', version: 'N/A' },
  ]);

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        requests: prev.requests + Math.floor(Math.random() * 10),
        cacheHitRate: Math.max(
          80,
          Math.min(95, prev.cacheHitRate + (Math.random() - 0.5) * 2),
        ),
        activeConnections: Math.max(
          20,
          Math.min(
            80,
            prev.activeConnections + Math.floor(Math.random() * 6 - 3),
          ),
        ),
        queueSize: Math.max(
          0,
          Math.min(50, prev.queueSize + Math.floor(Math.random() * 4 - 2)),
        ),
        errorRate: Math.max(
          0,
          Math.min(2, prev.errorRate + (Math.random() - 0.5) * 0.1),
        ),
        responseTime: Math.max(
          100,
          Math.min(
            300,
            prev.responseTime + Math.floor(Math.random() * 20 - 10),
          ),
        ),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              System Administration
            </h1>
            <p className="text-muted-foreground">
              Real-time monitoring and management dashboard
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Data
          </Button>
        </div>

        {/* System Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Requests
              </CardTitle>
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.requests.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last hour
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cache Hit Rate
              </CardTitle>
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.cacheHitRate.toFixed(1)}%
              </div>
              <Progress value={metrics.cacheHitRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Connections
              </CardTitle>
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.activeConnections}
              </div>
              <p className="text-xs text-muted-foreground">Real-time users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Queue Size</CardTitle>
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.queueSize}</div>
              <p className="text-xs text-muted-foreground">Messages pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.errorRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">System stability</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Response Time
              </CardTitle>
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.responseTime}ms</div>
              <p className="text-xs text-muted-foreground">API performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Service Status */}
        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>
              Health status of all platform services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`}
                    />
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        v{service.version}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {service.uptime} uptime
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Flow Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Data Flow Architecture</CardTitle>
            <CardDescription>
              Real-time data flow between services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Hot Data Path */}
              <div className="space-y-2">
                <h4 className="font-medium text-orange-600">
                  🔥 Hot Data Path
                </h4>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div>Client → API Gateway → Cache → Database</div>
                    <div className="text-muted-foreground">
                      Fast access, high frequency
                    </div>
                    <div className="font-medium">
                      {metrics.requests} req/min
                    </div>
                  </div>
                </div>
              </div>

              {/* Cold Data Path */}
              <div className="space-y-2">
                <h4 className="font-medium text-blue-600">🧊 Cold Data Path</h4>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div>Analytics → Queue → Batch Processing → Storage</div>
                    <div className="text-muted-foreground">
                      Background processing, low priority
                    </div>
                    <div className="font-medium">
                      {metrics.queueSize} items queued
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Processing */}
              <div className="space-y-2">
                <h4 className="font-medium text-green-600">
                  ⚡ Real-time Processing
                </h4>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div>WebSocket → Event Stream → Live Updates</div>
                    <div className="text-muted-foreground">
                      Instant notifications, live data
                    </div>
                    <div className="font-medium">
                      {metrics.activeConnections} active connections
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
