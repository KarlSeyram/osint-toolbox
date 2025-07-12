import type { NextApiRequest, NextApiResponse } from 'next';

interface PlatformResult {
  name: string;
  found: boolean;
  url: string;
  lastSeen?: string;
  profileData?: any;
}

interface UsernameResponse {
  success: boolean;
  query: string;
  platforms: PlatformResult[];
  totalFound: number;
  timestamp: string;
}

const platforms = [
  { name: 'GitHub', baseUrl: 'https://github.com/', apiUrl: 'https://api.github.com/users/' },
  { name: 'Twitter', baseUrl: 'https://twitter.com/', apiUrl: null },
  { name: 'Instagram', baseUrl: 'https://instagram.com/', apiUrl: null },
  { name: 'LinkedIn', baseUrl: 'https://linkedin.com/in/', apiUrl: null },
  { name: 'Reddit', baseUrl: 'https://reddit.com/user/', apiUrl: 'https://www.reddit.com/user/' },
  { name: 'YouTube', baseUrl: 'https://youtube.com/@', apiUrl: null },
  { name: 'TikTok', baseUrl: 'https://tiktok.com/@', apiUrl: null },
  { name: 'Discord', baseUrl: null, apiUrl: null },
  { name: 'Telegram', baseUrl: 'https://t.me/', apiUrl: null },
  { name: 'Steam', baseUrl: 'https://steamcommunity.com/id/', apiUrl: null },
  { name: 'Twitch', baseUrl: 'https://twitch.tv/', apiUrl: null },
  { name: 'Facebook', baseUrl: 'https://facebook.com/', apiUrl: null }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UsernameResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.body;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const results: PlatformResult[] = [];

    // Check each platform
    for (const platform of platforms) {
      let found = false;
      let profileData: any = null;

      // For demo purposes, we'll simulate checks with random results
      // In a real implementation, you would make actual HTTP requests
      if (platform.name === 'GitHub' && platform.apiUrl) {
        try {
          // Simulate GitHub API check
          found = Math.random() > 0.4; // 60% chance of finding
          if (found) {
            profileData = {
              followers: Math.floor(Math.random() * 1000),
              repos: Math.floor(Math.random() * 50),
              created: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
            };
          }
        } catch (error) {
          found = false;
        }
      } else {
        // Simulate other platform checks
        found = Math.random() > 0.5;
      }

      if (platform.baseUrl) {
        results.push({
          name: platform.name,
          found,
          url: `${platform.baseUrl}${username}`,
          lastSeen: found ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          profileData
        });
      }
    }

    const totalFound = results.filter(r => r.found).length;

    const response: UsernameResponse = {
      success: true,
      query: username,
      platforms: results,
      totalFound,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Username lookup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}