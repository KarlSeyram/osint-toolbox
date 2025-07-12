import type { NextApiRequest, NextApiResponse } from 'next';

interface GoogleDorksResponse {
  success: boolean;
  query: string;
  category: string;
  dorks: {
    query: string;
    description: string;
    risk: 'low' | 'medium' | 'high';
    category: string;
  }[];
  timestamp: string;
}

const dorkTemplates = {
  'general': [
    {
      query: 'site:{target}',
      description: 'Find all indexed pages for the target domain',
      risk: 'low' as const,
      category: 'Site Discovery'
    },
    {
      query: 'site:{target} filetype:pdf',
      description: 'Find PDF files on the target domain',
      risk: 'low' as const,
      category: 'File Discovery'
    },
    {
      query: 'site:{target} inurl:admin',
      description: 'Find admin panels and administrative pages',
      risk: 'medium' as const,
      category: 'Admin Discovery'
    },
    {
      query: 'site:{target} intitle:"index of"',
      description: 'Find directory listings and exposed directories',
      risk: 'medium' as const,
      category: 'Directory Listing'
    }
  ],
  'sensitive-files': [
    {
      query: 'site:{target} filetype:sql',
      description: 'Find SQL database files',
      risk: 'high' as const,
      category: 'Database Files'
    },
    {
      query: 'site:{target} filetype:log',
      description: 'Find log files that may contain sensitive information',
      risk: 'high' as const,
      category: 'Log Files'
    },
    {
      query: 'site:{target} filetype:bak',
      description: 'Find backup files',
      risk: 'high' as const,
      category: 'Backup Files'
    },
    {
      query: 'site:{target} ext:env',
      description: 'Find environment configuration files',
      risk: 'high' as const,
      category: 'Config Files'
    }
  ],
  'login-pages': [
    {
      query: 'site:{target} inurl:login',
      description: 'Find login pages',
      risk: 'medium' as const,
      category: 'Authentication'
    },
    {
      query: 'site:{target} intitle:"login" OR intitle:"sign in"',
      description: 'Find pages with login or sign in titles',
      risk: 'medium' as const,
      category: 'Authentication'
    },
    {
      query: 'site:{target} inurl:wp-admin',
      description: 'Find WordPress admin panels',
      risk: 'medium' as const,
      category: 'CMS Admin'
    }
  ],
  'vulnerabilities': [
    {
      query: 'site:{target} "sql syntax near" | "syntax error has occurred" | "incorrect syntax near"',
      description: 'Find potential SQL injection vulnerabilities',
      risk: 'high' as const,
      category: 'SQL Injection'
    },
    {
      query: 'site:{target} "Warning: mysql_connect()" | "Warning: mysql_query()" | "Warning: pg_connect()"',
      description: 'Find database connection errors',
      risk: 'high' as const,
      category: 'Database Errors'
    },
    {
      query: 'site:{target} "Fatal error" | "Warning:" | "Parse error"',
      description: 'Find PHP errors and warnings',
      risk: 'medium' as const,
      category: 'Application Errors'
    }
  ],
  'social-media': [
    {
      query: '"{target}" site:linkedin.com',
      description: 'Find LinkedIn profiles related to target',
      risk: 'low' as const,
      category: 'Social Discovery'
    },
    {
      query: '"{target}" site:twitter.com',
      description: 'Find Twitter mentions of target',
      risk: 'low' as const,
      category: 'Social Discovery'
    },
    {
      query: '"{target}" site:facebook.com',
      description: 'Find Facebook pages related to target',
      risk: 'low' as const,
      category: 'Social Discovery'
    }
  ],
  'documents': [
    {
      query: 'site:{target} filetype:doc OR filetype:docx',
      description: 'Find Word documents',
      risk: 'medium' as const,
      category: 'Document Discovery'
    },
    {
      query: 'site:{target} filetype:xls OR filetype:xlsx',
      description: 'Find Excel spreadsheets',
      risk: 'medium' as const,
      category: 'Document Discovery'
    },
    {
      query: 'site:{target} filetype:ppt OR filetype:pptx',
      description: 'Find PowerPoint presentations',
      risk: 'medium' as const,
      category: 'Document Discovery'
    }
  ]
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GoogleDorksResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { target, category = 'general' } = req.body;

  if (!target || typeof target !== 'string') {
    return res.status(400).json({ error: 'Target is required' });
  }

  if (!dorkTemplates[category as keyof typeof dorkTemplates]) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    const templates = dorkTemplates[category as keyof typeof dorkTemplates];
    
    const dorks = templates.map(template => ({
      query: template.query.replace(/{target}/g, target),
      description: template.description,
      risk: template.risk,
      category: template.category
    }));

    // Add some additional general dorks if category is general
    if (category === 'general') {
      const additionalDorks = [
        {
          query: `"${target}" -site:${target}`,
          description: 'Find mentions of target on other websites',
          risk: 'low' as const,
          category: 'External Mentions'
        },
        {
          query: `inurl:"${target}"`,
          description: 'Find URLs containing the target name',
          risk: 'low' as const,
          category: 'URL Discovery'
        }
      ];
      dorks.push(...additionalDorks);
    }

    const response: GoogleDorksResponse = {
      success: true,
      query: target,
      category,
      dorks,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Google Dorks generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}