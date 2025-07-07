'use server';

import type { SimpleAnalyticsData } from '../_components/SimpleAnalyticsDashboard';

export async function getSimpleAnalyticsData(): Promise<SimpleAnalyticsData> {
  const apiKey = process.env.SIMPLE_ANALYTICS_API_KEY;
  const domainName = process.env.SIMPLE_ANALYTICS_WEBSITE_DOMAIN;

  if (!apiKey || !domainName) {
    const errorMsg =
      'Simple Analytics API key or website domain is not set in the environment variables.';
    console.error(errorMsg);
    return { error: errorMsg };
  }

  const apiUrl = `https://simpleanalytics.com/${domainName}.json?version=6&fields=pageviews,visitors,seconds_on_page,histogram,pages,referrers,device_types&apikey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Simple Analytics data: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return { ...data, domain: domainName };
  } catch (error: any) {
    console.error('Error fetching Simple Analytics data:', error);
    throw new Error(
      `Failed to fetch Simple Analytics data: ${error.message}`,
    );
  }
}