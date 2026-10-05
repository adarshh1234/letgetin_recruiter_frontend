export interface SkillCatalogCategory {
  category: string;
  skills: string[];
}

export const TECH_SKILL_CATEGORIES: SkillCatalogCategory[] = [
  {
    category: 'Programming Languages',
    skills: [
      'Java',
      'JavaScript',
      'TypeScript',
      'Python',
      'C',
      'C++',
      'C#',
      'Go',
      'Rust',
      'PHP',
      'Kotlin',
      'Swift',
      'Scala',
      'Ruby',
      'Dart',
      'R',
    ],
  },
  {
    category: 'Frontend',
    skills: [
      'React',
      'Next.js',
      'Angular',
      'Vue.js',
      'HTML',
      'CSS',
      'Tailwind CSS',
      'Redux',
      'Svelte',
      'Sass',
      'Bootstrap',
      'Webpack',
      'Vite',
    ],
  },
  {
    category: 'Backend',
    skills: [
      'Node.js',
      'Express.js',
      'NestJS',
      'Spring',
      'Spring Boot',
      'Django',
      'Flask',
      'FastAPI',
      '.NET',
      'ASP.NET Core',
      'Ruby on Rails',
      'Laravel',
      'GraphQL',
      'REST APIs',
      'gRPC',
    ],
  },
  {
    category: 'Databases',
    skills: [
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'Redis',
      'SQLite',
      'Oracle',
      'Elasticsearch',
      'Cassandra',
      'DynamoDB',
      'MariaDB',
      'Supabase',
      'Prisma',
    ],
  },
  {
    category: 'Cloud / DevOps',
    skills: [
      'AWS',
      'Azure',
      'GCP',
      'Docker',
      'Kubernetes',
      'Terraform',
      'CI/CD',
      'Linux',
      'Jenkins',
      'Ansible',
      'GitHub Actions',
      'Helm',
      'Nginx',
      'Prometheus',
      'Grafana',
    ],
  },
  {
    category: 'Architecture & Engineering',
    skills: [
      'Git',
      'Microservices',
      'System Design',
      'Data Structures and Algorithms',
      'Object-Oriented Programming',
      'Kafka',
      'RabbitMQ',
      'Unit Testing',
      'TDD',
      'Agile / Scrum',
      'Cybersecurity',
    ],
  },
];

// Flat deduplicated list of all skills in catalogue
export const ALL_CATALOG_SKILLS: string[] = Array.from(
  new Set(TECH_SKILL_CATEGORIES.flatMap((c) => c.skills))
).sort((a, b) => a.localeCompare(b));

/**
 * Searches the local skill catalog deterministically.
 * Zero network requests. Zero Gemini calls.
 */
export function searchSkillCatalog(query: string, limit = 8): string[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const startsWithMatches: string[] = [];
  const containsMatches: string[] = [];

  for (const skill of ALL_CATALOG_SKILLS) {
    const lower = skill.toLowerCase();
    if (lower === trimmed) {
      startsWithMatches.unshift(skill);
    } else if (lower.startsWith(trimmed)) {
      startsWithMatches.push(skill);
    } else if (lower.includes(trimmed)) {
      containsMatches.push(skill);
    }
  }

  return [...startsWithMatches, ...containsMatches].slice(0, limit);
}
