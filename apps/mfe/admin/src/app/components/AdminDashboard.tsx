import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@nx-micros/ui';
import { Badge } from '@nx-micros/ui';
import { Button } from '@nx-micros/ui';
import { Separator } from '@nx-micros/ui';
import { Progress } from '@nx-micros/ui';
import {
  Database,
  Zap,
  MessageSquare,
  Activity,
  Users,
  TrendingUp,
  Server,
  HardDrive,
  RefreshCw,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// Mock data for system architecture visualization
const mockSystemData = {
  databases: {
    postgresql: {
      name: 'PostgreSQL (Cold Data)',
      status: 'healthy',
      connections: 45,
      readOps: 1250,
      writeOps: 380,
      storage: '2.4GB',
      tables: 12,
    },
    valkeyHot: {
      name: 'Valkey Hot (Redis)',
      status: 'healthy',
      connections: 89,
      hits: 9840,
      misses: 216,
      memoryUsage: '256MB',
      keys: 15420,
    },
    valkeySession: {
      name: 'Valkey Session (Redis)',
      status: 'healthy',
      connections: 67,
      activeSessions: 234,
      expiredSessions: 45,
      memoryUsage: '89MB',
      keys: 890,
    },
  },
  queues: {
    userEvents: {
      name: 'User Events Queue',
      messages: 1247,
      processed: 1240,
      failed: 7,
      pending: 0,
    },
    courseEvents: {
      name: 'Course Events Queue',
      messages: 892,
      processed: 885,
      failed: 7,
      pending: 0,
    },
  },
  api: {
    requests: 15420,
    errors: 23,
    avgResponseTime: 145,
    throughput: '89 req/sec',
  },
  microfrontends: [
    { name: 'Shell', status: 'healthy', requests: 4520, errors: 2 },
    { name: 'Dashboard', status: 'healthy', requests: 3210, errors: 1 },
    { name: 'Courses', status: 'healthy', requests: 2890, errors: 3 },
    { name: 'Learning', status: 'healthy', requests: 4120, errors: 5 },
    { name: 'Auth', status: 'healthy', requests: 1680, errors: 0 },
  ],
};

export function AdminDashboard() {
  const [systemData, setSystemData] = useState(mockSystemData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setSystemData({
        ...mockSystemData,
        api: {
          ...mockSystemData.api,
          requests:
            mockSystemData.api.requests + Math.floor(Math.random() * 100),
        },
      });
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setSystemData((prev) => ({
        ...prev,
        databases: {
          ...prev.databases,
          valkeyHot: {
            ...prev.databases.valkeyHot,
            hits:
              prev.databases.valkeyHot.hits + Math.floor(Math.random() * 10),
            memoryUsage: `${parseInt(prev.databases.valkeyHot.memoryUsage) + Math.floor(Math.random() * 2)}MB`,
          },
        },
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                System Architecture Monitor
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time visualization of data flows and system performance
              </p>
            </div>
            <Button onClick={refreshData} disabled={isRefreshing}>
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* System Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Requests
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemData.api.requests.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12.5% from last hour
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cache Hit Rate
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (systemData.databases.valkeyHot.hits /
                      (systemData.databases.valkeyHot.hits +
                        systemData.databases.valkeyHot.misses)) *
                      100,
                  )}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  {systemData.databases.valkeyHot.hits.toLocaleString()} hits
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Sessions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemData.databases.valkeySession.activeSessions}
                </div>
                <p className="text-xs text-muted-foreground">
                  {systemData.databases.valkeySession.expiredSessions} expired
                  today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Queue Health
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Healthy</div>
                <p className="text-xs text-muted-foreground">
                  All queues processing normally
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Architecture Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                System Architecture & Data Flow
              </CardTitle>
              <CardDescription>
                Real-time visualization of read/write operations across the
                system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Data Flow Visualization */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Hot Data Path */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-500" />
                      Hot Data Path (Cache Layer)
                    </h4>
                    <div className="space-y-2 pl-6 border-l-2 border-purple-200">
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">API Gateway</span>
                        <Zap className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium">Valkey Hot</span>
                        <Badge variant="outline" className="text-xs">
                          cache
                        </Badge>
                        <span className="text-xs text-purple-500 ml-auto">
                          45/sec
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">Valkey Hot</span>
                        <Activity className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">Client</span>
                        <Badge variant="outline" className="text-xs">
                          read
                        </Badge>
                        <span className="text-xs text-blue-500 ml-auto">
                          89/sec
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cold Data Path */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-500" />
                      Cold Data Path (Database)
                    </h4>
                    <div className="space-y-2 pl-6 border-l-2 border-blue-200">
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">API Gateway</span>
                        <Activity className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">PostgreSQL</span>
                        <Badge variant="outline" className="text-xs">
                          read
                        </Badge>
                        <span className="text-xs text-blue-500 ml-auto">
                          12/sec
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">API Gateway</span>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">PostgreSQL</span>
                        <Badge variant="outline" className="text-xs">
                          write
                        </Badge>
                        <span className="text-xs text-green-500 ml-auto">
                          8/sec
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Queue Processing */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-orange-500" />
                    Event Queue Processing
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(systemData.queues).map(([key, queue]) => (
                      <Card key={key}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">
                            {queue.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Total Messages</span>
                            <span className="font-medium">
                              {queue.messages}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Processed</span>
                            <span className="font-medium text-green-600">
                              {queue.processed}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Failed</span>
                            <span className="font-medium text-red-600">
                              {queue.failed}
                            </span>
                          </div>
                          <Progress
                            value={(queue.processed / queue.messages) * 100}
                            className="h-2"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Database Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Database & Cache Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {Object.entries(systemData.databases).map(([key, db]) => (
                  <Card key={key}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{db.name}</CardTitle>
                        <Badge
                          variant={
                            db.status === 'healthy' ? 'default' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {db.status === 'healthy' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {db.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {(db as any).readOps && (
                        <div className="flex justify-between text-sm">
                          <span>Read Ops/sec</span>
                          <span className="font-medium">
                            {(db as any).readOps}
                          </span>
                        </div>
                      )}
                      {(db as any).writeOps && (
                        <div className="flex justify-between text-sm">
                          <span>Write Ops/sec</span>
                          <span className="font-medium">
                            {(db as any).writeOps}
                          </span>
                        </div>
                      )}
                      {(db as any).hits && (
                        <div className="flex justify-between text-sm">
                          <span>Cache Hits</span>
                          <span className="font-medium">
                            {(db as any).hits?.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {(db as any).activeSessions && (
                        <div className="flex justify-between text-sm">
                          <span>Active Sessions</span>
                          <span className="font-medium">
                            {(db as any).activeSessions}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Storage/Memory</span>
                        <span className="font-medium">
                          {(db as any).memoryUsage || (db as any).storage}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Microfrontend Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Microfrontend Performance
              </CardTitle>
              <CardDescription>
                Request distribution and error rates across MFEs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {systemData.microfrontends.map((mfe) => (
                  <Card key={mfe.name}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center justify-between">
                        {mfe.name}
                        <Badge
                          variant={
                            mfe.status === 'healthy' ? 'default' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {mfe.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Requests</span>
                        <span className="font-medium">
                          {mfe.requests.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Error Rate</span>
                        <span className="font-medium text-red-600">
                          {((mfe.errors / mfe.requests) * 100).toFixed(2)}%
                        </span>
                      </div>
                      <Progress
                        value={(mfe.requests / systemData.api.requests) * 100}
                        className="h-2"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
