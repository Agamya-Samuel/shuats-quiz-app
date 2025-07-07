'use client';

import {
  AlertCircle,
  BarChart,
  ExternalLink,
  Info,
  LineChart,
  RefreshCw,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

// Interface for Simple Analytics data
interface SAHistogramPoint {
  date: string;
  pageviews: number;
  visitors?: number; // Changed from uniques, histogram from SA can include visitors
}

interface SAPageStat {
  path: string;
  pageviews: number;
  visitors?: number; // Changed from uniques
  seconds_on_page?: number; // Added, as SA can embed this in pages
}

interface SAReferrerStat {
  name: string;
  pageviews: number;
  // percentage?: number; // Percentage is usually calculated client-side if needed
}

interface SADeviceTypeStat {
  name: string; // e.g., desktop, mobile, tablet
  pageviews: number;
  // percentage?: number; // Percentage is usually calculated client-side if needed
}

interface SimpleAnalyticsData {
  pageviews?: number;
  visitors?: number; // Changed from uniques
  // bounce_rate?: number; // Removed, not directly available from API with these fields
  seconds_on_page?: number; // Changed from duration, this is median seconds on page
  histogram?: SAHistogramPoint[];
  pages?: SAPageStat[];
  referrers?: SAReferrerStat[];
  device_types?: SADeviceTypeStat[]; // Changed from devices
  error?: string;
  message?: string;
}

const getTimeRange = (timeframe: string): { start: string; end: string } => {
  const endDate = new Date();
  let startDate = new Date();
  switch (timeframe) {
    case '24h':
      startDate.setDate(endDate.getDate() - 1);
      break;
    case '7d':
      startDate.setDate(endDate.getDate() - 6); // 7 days including today
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 29); // 30 days including today
      break;
    case '3m':
      startDate.setMonth(endDate.getMonth() - 3);
      startDate.setDate(startDate.getDate() + 1); // Adjust to be closer to 3 months
      break;
    default:
      startDate.setDate(endDate.getDate() - 6);
      break;
  }
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  return { start: formatDate(startDate), end: formatDate(endDate) };
};

const DEVICE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export function SimpleAnalyticsDashboard() {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] =
    useState<SimpleAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsRefreshing(true);
    setError(null);

    const domain = process.env.NEXT_PUBLIC_SIMPLE_ANALYTICS_WEBSITE_DOMAIN;
    const apiKey = process.env.NEXT_PUBLIC_SIMPLE_ANALYTICS_API_KEY || '';

    if (!domain) {
      setError(
        'Simple Analytics domain is not configured. Please set NEXT_PUBLIC_SIMPLE_ANALYTICS_WEBSITE_DOMAIN in your environment variables.',
      );
      setIsLoading(false);
      setIsRefreshing(false);
      setAnalyticsData(null); // Clear previous data
      return;
    }

    const { start, end } = getTimeRange(timeframe);
    const fields =
      'pageviews,visitors,seconds_on_page,histogram,pages,referrers,device_types'; // Corrected fields
    // Note: Simple Analytics API uses 'start' and 'end' not 'start_date' and 'end_date' for version 5
    const apiUrl = `https://simpleanalytics.com/${domain}.json?version=5&fields=${fields}&start=${start}&end=${end}&info=true`; // info=true for messages

    const headers: HeadersInit = {
      'Api-Key': apiKey,
    };

    if (apiKey && apiKey !== '') {
      console.warn(
        'NEXT_PUBLIC_SIMPLE_ANALYTICS_API_KEY is set with a non-empty value. If this key is for private data and sensitive, fetching should be moved to a server action or API route to protect the key.',
      );
    }

    try {
      const response = await fetch(apiUrl, { headers });
      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          data.error || `Error: ${response.status} ${response.statusText}`;
        console.error('Simple Analytics API Error:', errorMsg, data);
        setError(errorMsg);
        setAnalyticsData(null);
        toast({
          title: 'Error Fetching Analytics',
          description: errorMsg,
          variant: 'destructive',
        });
      } else {
        // Check for "No data for this period" message
        if (data.message && data.histogram && data.histogram.length === 0) {
          setError(data.message); // Display the message from SA
          setAnalyticsData({ ...data, error: data.message }); // Keep other data if any, but show message
        } else {
          setAnalyticsData(data);
        }
        toast({
          title: 'Data Refreshed',
          description: 'Simple Analytics data has been updated.',
        });
      }
    } catch (e: any) {
      console.error('Failed to fetch Simple Analytics data:', e);
      const errorMessage = e.message || 'An unexpected error occurred.';
      setError(errorMessage);
      setAnalyticsData(null);
      toast({
        title: 'Fetch Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [timeframe, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
  };

  // Helper to format duration from seconds to MMm SSs
  const formatDuration = (seconds: number | undefined) => {
    if (seconds === undefined || seconds === null) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Display error message if domain is not configured
  if (!process.env.NEXT_PUBLIC_SIMPLE_ANALYTICS_WEBSITE_DOMAIN) {
    return (
      <div className="space-y-6 p-4 border border-red-500 bg-red-50 rounded-md">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-700 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-800">Configuration Error</h4>
            <p className="text-sm text-red-700">
              The Simple Analytics website domain (
              <code>NEXT_PUBLIC_SIMPLE_ANALYTICS_WEBSITE_DOMAIN</code>) is not
              set in your environment variables. Please configure it to fetch
              analytics data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Display error or "no data" message if fetch failed or returned no data
  // analyticsData might exist but with an error/message property from the API (e.g., "No data")
  if (
    error &&
    (!analyticsData ||
      !analyticsData.pageviews || // Check if core data is missing
      (analyticsData.histogram && analyticsData.histogram.length === 0))
  ) {
    return (
      <div className="space-y-6 p-4 border border-yellow-500 bg-yellow-50 rounded-md">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-yellow-700 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">
              Analytics Data Status
            </h4>
            <p className="text-sm text-yellow-700">{error}</p>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="mt-2"
              disabled={isRefreshing}>
              <RefreshCw
                className={
                  'mr-2 h-4 w-4 ' + (isRefreshing ? 'animate-spin' : '')
                }
              />{' '}
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !analyticsData && !error) {
    // Show full page loader only on initial load and no error
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Site Analytics</h2>
          <p className="text-muted-foreground">
            Key metrics from Simple Analytics for '
            <code>
              {process.env.NEXT_PUBLIC_SIMPLE_ANALYTICS_WEBSITE_DOMAIN}
            </code>
            '.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={timeframe}
            onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isRefreshing || isLoading}>
            <RefreshCw
              className={
                'mr-2 h-4 w-4 ' +
                (isRefreshing || isLoading ? 'animate-spin' : '')
              }
            />
            {isRefreshing || isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Page Views
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData?.pageviews?.toLocaleString() ?? 'N/A'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData?.visitors?.toLocaleString() ?? 'N/A'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Median Time on Page
            </CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(analyticsData?.seconds_on_page)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Page Views Over Time</CardTitle>
            <CardDescription>
              Page views in the selected timeframe.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {analyticsData?.histogram && analyticsData.histogram.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%">
                <RechartsLineChart
                  data={analyticsData.histogram.map((p) => ({
                    date: new Date(p.date).toLocaleDateString(),
                    views: p.pageviews,
                  }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground">
                {isLoading
                  ? 'Loading chart...'
                  : 'No page view data available for this period.'}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unique Visitors Over Time</CardTitle>
            <CardDescription>
              Unique visitors in the selected timeframe.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {analyticsData?.histogram && analyticsData.histogram.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%">
                <RechartsLineChart
                  data={analyticsData.histogram.map((p) => ({
                    date: new Date(p.date).toLocaleDateString(),
                    visitors:
                      p.visitors ??
                      0 /* Use visitors from histogram if available */,
                  }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground">
                {isLoading
                  ? 'Loading chart...'
                  : 'No unique visitor data available for this period.'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Pages Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most viewed pages.</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData?.pages && analyticsData.pages.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Path</TableHead>
                    <TableHead className="text-right">Page Views</TableHead>
                    {analyticsData.pages[0]?.visitors !== undefined && (
                      <TableHead className="text-right">Visitors</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.pages.slice(0, 7).map((page, index) => (
                    <TableRow key={page.path || `page-${index}`}>
                      <TableCell
                        className="truncate max-w-[150px] sm:max-w-[250px]"
                        title={page.path}>
                        {page.path}
                      </TableCell>
                      <TableCell className="text-right">
                        {page.pageviews.toLocaleString()}
                      </TableCell>
                      {page.visitors !== undefined && (
                        <TableCell className="text-right">
                          {page.visitors.toLocaleString()}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">
                {isLoading
                  ? 'Loading top pages...'
                  : 'No top pages data available.'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Referrers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>
              Where your traffic is coming from.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData?.referrers && analyticsData.referrers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Page Views</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.referrers
                    .slice(0, 7)
                    .map((referrer, index) => (
                      <TableRow key={referrer.name || `ref-${index}`}>
                        <TableCell
                          className="truncate max-w-[150px] sm:max-w-[250px]"
                          title={referrer.name}>
                          {referrer.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {referrer.pageviews.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">
                {isLoading
                  ? 'Loading referrers...'
                  : 'No referrer data available.'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Device Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Device Breakdown</CardTitle>
          <CardDescription>
            Distribution of page views by device type.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {analyticsData?.device_types &&
          analyticsData.device_types.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%">
              <RechartsPieChart>
                <Pie
                  data={analyticsData.device_types}
                  dataKey="pageviews"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label>
                  {analyticsData.device_types.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={DEVICE_COLORS[index % DEVICE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value.toLocaleString()} pageviews`,
                    name,
                  ]}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground">
              {isLoading
                ? 'Loading device data...'
                : 'No device data available.'}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-center text-muted-foreground py-4">
        Powered by Simple Analytics.
        {process.env.NEXT_PUBLIC_SIMPLE_ANALYTICS_WEBSITE_DOMAIN && (
          <a
            href={`https://simpleanalytics.com/${process.env.NEXT_PUBLIC_SIMPLE_ANALYTICS_WEBSITE_DOMAIN}?utm_source=${process.env.NEXT_PUBLIC_SIMPLE_ANALYTICS_WEBSITE_DOMAIN}&utm_content=dashboard_link`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary ml-1">
            View on Simple Analytics{' '}
            <ExternalLink className="inline h-3 w-3 ml-0.5" />
          </a>
        )}
      </div>
    </div>
  );
}
