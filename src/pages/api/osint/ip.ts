import type { NextApiRequest, NextApiResponse } from 'next';

interface IPResponse {
  success: boolean;
  query: string;
  ip: string;
  country: string;
  region: string;
  city: string;
  isp: string;
  org: string;
  asn: string;
  lat: number;
  lon: number;
  timezone: string;
  vpn: boolean;
  proxy: boolean;
  tor: boolean;
  hosting: boolean;
  ports: {
    port: number;
    service: string;
    status: 'open' | 'closed' | 'filtered';
  }[];
  timestamp: string;
}

const commonPorts = [
  { port: 21, service: 'FTP' },
  { port: 22, service: 'SSH' },
  { port: 23, service: 'Telnet' },
  { port: 25, service: 'SMTP' },
  { port: 53, service: 'DNS' },
  { port: 80, service: 'HTTP' },
  { port: 110, service: 'POP3' },
  { port: 143, service: 'IMAP' },
  { port: 443, service: 'HTTPS' },
  { port: 993, service: 'IMAPS' },
  { port: 995, service: 'POP3S' }
];

const sampleLocations = [
  { country: 'United States', region: 'California', city: 'San Francisco', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles' },
  { country: 'United Kingdom', region: 'England', city: 'London', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  { country: 'Germany', region: 'Berlin', city: 'Berlin', lat: 52.5200, lon: 13.4050, timezone: 'Europe/Berlin' },
  { country: 'Japan', region: 'Tokyo', city: 'Tokyo', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
  { country: 'Canada', region: 'Ontario', city: 'Toronto', lat: 43.6532, lon: -79.3832, timezone: 'America/Toronto' },
  { country: 'Australia', region: 'New South Wales', city: 'Sydney', lat: -33.8688, lon: 151.2093, timezone: 'Australia/Sydney' }
];

const sampleISPs = [
  'Cloudflare Inc.',
  'Amazon Technologies Inc.',
  'Google LLC',
  'Microsoft Corporation',
  'Comcast Cable Communications',
  'Verizon Communications',
  'AT&T Services Inc.',
  'Deutsche Telekom AG',
  'China Telecom',
  'NTT Communications'
];

function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ip } = req.body;

  if (!ip || typeof ip !== 'string') {
    return res.status(400).json({ error: 'IP address is required' });
  }

  if (!isValidIP(ip)) {
    return res.status(400).json({ error: 'Invalid IP address format' });
  }

  try {
    // In a real implementation, you would use services like:
    // - ipapi.co
    // - ipgeolocation.io
    // - MaxMind GeoIP
    // For demo purposes, we'll simulate the response

    const location = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
    const isp = sampleISPs[Math.floor(Math.random() * sampleISPs.length)];
    
    // Simulate port scan results
    const portResults = commonPorts.map(({ port, service }) => ({
      port,
      service,
      status: Math.random() > 0.7 ? 'open' : Math.random() > 0.5 ? 'closed' : 'filtered'
    })) as { port: number; service: string; status: 'open' | 'closed' | 'filtered' }[];

    // Simulate threat detection
    const isVPN = Math.random() > 0.8;
    const isProxy = Math.random() > 0.9;
    const isTor = Math.random() > 0.95;
    const isHosting = Math.random() > 0.7;

    const response: IPResponse = {
      success: true,
      query: ip,
      ip,
      country: location.country,
      region: location.region,
      city: location.city,
      isp,
      org: isp,
      asn: `AS${Math.floor(Math.random() * 65535)}`,
      lat: location.lat,
      lon: location.lon,
      timezone: location.timezone,
      vpn: isVPN,
      proxy: isProxy,
      tor: isTor,
      hosting: isHosting,
      ports: portResults,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('IP lookup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}