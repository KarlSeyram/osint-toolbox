import type { NextApiRequest, NextApiResponse } from 'next';

interface DomainResponse {
  success: boolean;
  query: string;
  domain: string;
  registrar: string;
  created: string;
  expires: string;
  updated: string;
  status: string[];
  nameservers: string[];
  emails: string[];
  subdomains: string[];
  technologies: {
    name: string;
    category: string;
    version?: string;
  }[];
  ssl: {
    valid: boolean;
    issuer: string;
    expires: string;
    grade: string;
  };
  dns: {
    A: string[];
    AAAA: string[];
    MX: { priority: number; exchange: string }[];
    TXT: string[];
    CNAME: string[];
  };
  timestamp: string;
}

const sampleRegistrars = [
  'GoDaddy LLC',
  'Namecheap Inc.',
  'Google Domains LLC',
  'Network Solutions LLC',
  'Tucows Domains Inc.',
  'MarkMonitor Inc.',
  'Amazon Registrar Inc.',
  'Cloudflare Inc.'
];

const sampleTechnologies = [
  { name: 'Cloudflare', category: 'CDN' },
  { name: 'Nginx', category: 'Web Server', version: '1.18.0' },
  { name: 'React', category: 'JavaScript Framework', version: '18.2.0' },
  { name: 'Next.js', category: 'Web Framework', version: '13.4.0' },
  { name: 'WordPress', category: 'CMS', version: '6.2' },
  { name: 'Apache', category: 'Web Server', version: '2.4.41' },
  { name: 'PHP', category: 'Programming Language', version: '8.1' },
  { name: 'MySQL', category: 'Database', version: '8.0' }
];

function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

function generateSubdomains(domain: string): string[] {
  const commonSubdomains = ['www', 'mail', 'ftp', 'admin', 'api', 'blog', 'shop', 'dev', 'staging', 'test'];
  return commonSubdomains
    .filter(() => Math.random() > 0.6)
    .map(sub => `${sub}.${domain}`);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DomainResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { domain } = req.body;

  if (!domain || typeof domain !== 'string') {
    return res.status(400).json({ error: 'Domain is required' });
  }

  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

  if (!isValidDomain(cleanDomain)) {
    return res.status(400).json({ error: 'Invalid domain format' });
  }

  try {
    // In a real implementation, you would use services like:
    // - WHOIS API
    // - DNS lookup services
    // - SSL certificate checkers
    // - Technology detection services
    // For demo purposes, we'll simulate the response

    const registrar = sampleRegistrars[Math.floor(Math.random() * sampleRegistrars.length)];
    const createdDate = new Date(Date.now() - Math.random() * 10 * 365 * 24 * 60 * 60 * 1000);
    const expiresDate = new Date(Date.now() + Math.random() * 2 * 365 * 24 * 60 * 60 * 1000);
    const updatedDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);

    const technologies = sampleTechnologies
      .filter(() => Math.random() > 0.6)
      .slice(0, Math.floor(Math.random() * 5) + 2);

    const subdomains = generateSubdomains(cleanDomain);

    const response: DomainResponse = {
      success: true,
      query: domain,
      domain: cleanDomain,
      registrar,
      created: createdDate.toISOString().split('T')[0],
      expires: expiresDate.toISOString().split('T')[0],
      updated: updatedDate.toISOString().split('T')[0],
      status: ['clientTransferProhibited', 'clientUpdateProhibited'],
      nameservers: [
        `ns1.${cleanDomain}`,
        `ns2.${cleanDomain}`,
        'ns1.cloudflare.com',
        'ns2.cloudflare.com'
      ],
      emails: [
        `admin@${cleanDomain}`,
        `tech@${cleanDomain}`,
        `hostmaster@${cleanDomain}`
      ],
      subdomains,
      technologies,
      ssl: {
        valid: Math.random() > 0.1,
        issuer: 'Let\'s Encrypt Authority X3',
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        grade: ['A+', 'A', 'B', 'C'][Math.floor(Math.random() * 4)]
      },
      dns: {
        A: [
          `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
        ],
        AAAA: ['2606:4700:3034::ac43:bd8f'],
        MX: [
          { priority: 10, exchange: `mail.${cleanDomain}` },
          { priority: 20, exchange: `mail2.${cleanDomain}` }
        ],
        TXT: [
          'v=spf1 include:_spf.google.com ~all',
          'google-site-verification=abcd1234efgh5678'
        ],
        CNAME: [`www.${cleanDomain}`]
      },
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Domain lookup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}