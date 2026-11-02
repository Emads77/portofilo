// To add a project, add one object to this list. The first project is shown full width.
export type Project = {
  title: string;
  context: string;
  status: string;
  summary: string;
  built: string[];
  role: string;
  stack: string[];
  links?: { label: string; href: string }[];
  image?: { src: string; alt: string; width: number; height: number };
};

export const projects: Project[] = [
  {
    title: 'Sawan AI',
    context: 'My own product',
    status: 'Live',
    summary:
      'Small businesses lose leads and staff time to repetitive questions and after-hours contact. Sawan AI puts an assistant on their website with one line of code, in Dutch and English.',
    built: [
      'Multi-tenant chatbot engine with OpenAI function calling for bookings and lead capture',
      'Per-client admin dashboard and automated email alerts when a person is needed',
      'Security controls: per-client data isolation, and BSN, IBAN, and card numbers removed before storage',
      'Marketing website for the business',
    ],
    role: 'Founder, architect, and sole developer.',
    stack: ['Node.js', 'Express', 'PostgreSQL', 'Knex', 'OpenAI API', 'React', 'TanStack Start', 'Resend', 'Railway', 'Cloudflare'],
    links: [{ label: 'Visit sawan-ai.nl', href: 'https://sawan-ai.nl' }],
    image: {
      src: '/images/sawan-ai.jpg',
      alt: 'The Sawan AI homepage with the headline: Your front desk, always open.',
      width: 1536,
      height: 730,
    },
  },
  {
    title: 'Maintenance Manager System',
    context: 'Voortman Steel Machinery, Sept 2025 to Feb 2026',
    status: 'Internship',
    summary:
      'A cloud-based system that centralises preventive maintenance tracking for a global fleet of steel processing machines, built on requirements I gathered from their maintenance coordinator.',
    built: [
      'ASP.NET Core REST API with service and repository layers',
      'PostgreSQL for the main data, DynamoDB for maintenance logs and notifications',
      'Docker, Kubernetes on AWS EKS, CloudFormation, and CI/CD through GitHub',
      'Unit tests, plus functional and technical design documents',
    ],
    role: 'Owned architecture and delivery, and worked independently.',
    stack: ['C#', 'ASP.NET Core', 'Entity Framework Core', 'PostgreSQL', 'DynamoDB', 'Docker', 'Kubernetes', 'AWS EKS', 'AWS ECR', 'CloudFormation'],
  },
  {
    title: 'ShelfPal',
    context: 'Two-person team at Saxion',
    status: 'Live',
    summary: 'A full-stack app for book collectors, with barcode scanning and offline access.',
    built: [
      'OWASP and STRIDE risk analysis, JWT login, per-user access control, HTTPS, and firewall rules',
      'Failed-login alerts and Grafana monitoring',
      'CI/CD with separate acceptance and production environments',
      'Rolling updates, tested with 0 failed requests during a live deploy',
    ],
    role: 'Led deployment, server security, and zero-downtime updates.',
    stack: ['React', 'Django REST Framework', 'PostgreSQL', 'Docker', 'GitLab CI/CD', 'Playwright', 'Grafana'],
    links: [{ label: 'View the live app', href: 'https://shelfpal.saxion.college' }],
  },
];
