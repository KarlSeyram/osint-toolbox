import type { NextApiRequest, NextApiResponse } from 'next';

interface EmailResponse {
  success: boolean;
  query: string;
  valid: boolean;
  disposable: boolean;
  domain: string;
  breaches: number;
  breachList: string[];
  socialMedia: {
    platform: string;
    found: boolean;
    url?: string;
  }[];
  timestamp: string;
}

const knownBreaches = [
  'Adobe (2013)',
  'LinkedIn (2012)',
  'Dropbox (2012)',
  'Yahoo (2013-2014)',
  'Equifax (2017)',
  'Facebook (2019)',
  'Twitter (2022)',
  'LastPass (2022)',
  'Marriott (2018)',
  'Capital One (2019)'
];

const disposableDomains = [
  '10minutemail.com',
  'tempmail.org',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email'
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmailResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const domain = email.split('@')[1];
    const username = email.split('@')[0];

    // Check if disposable
    const isDisposable = disposableDomains.includes(domain.toLowerCase());

    // Simulate email validation (in real app, use email validation service)
    const isValid = Math.random() > 0.1; // 90% chance of being valid

    // Simulate breach check (in real app, integrate with HaveIBeenPwned API)
    const breachCount = Math.floor(Math.random() * 6);
    const affectedBreaches = knownBreaches
      .sort(() => 0.5 - Math.random())
      .slice(0, breachCount);

    // Check social media presence
    const socialPlatforms = [
      { platform: 'Gravatar', baseUrl: 'https://gravatar.com/' },
      { platform: 'GitHub', baseUrl: 'https://github.com/' },
      { platform: 'Google+', baseUrl: 'https://plus.google.com/' }
    ];

    const socialMedia = socialPlatforms.map(platform => ({
      platform: platform.platform,
      found: Math.random() > 0.6,
      url: `${platform.baseUrl}${username}`
    }));

    const response: EmailResponse = {
      success: true,
      query: email,
      valid: isValid,
      disposable: isDisposable,
      domain,
      breaches: breachCount,
      breachList: affectedBreaches,
      socialMedia,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Email lookup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}