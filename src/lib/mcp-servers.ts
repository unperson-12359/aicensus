// ------------------------------------------------------------
// MCP (Model Context Protocol) servers — curated directory.
// MCP is the open standard from Anthropic for connecting AI agents to
// external systems. AiCensus is staking this category early — most
// directories don't index MCP servers as first-class entities.
// ------------------------------------------------------------

export type McpTransport = "stdio" | "sse" | "streamable-http";

export type McpCategory =
  | "filesystem"
  | "git"
  | "database"
  | "search"
  | "productivity"
  | "dev-tools"
  | "web-browsing"
  | "communication"
  | "memory"
  | "design"
  | "infrastructure";

export interface McpServer {
  slug: string;
  name: string;
  tagline: string;
  /** 2-3 sentence description for the detail page */
  description: string;
  /** Maintainer org or "Community" */
  maintainer: string;
  /** Whether the maintainer is the original protocol author or a first-party vendor */
  official: boolean;
  category: McpCategory;
  /** Supported MCP transports — most stdio for local; some SSE/HTTP for remote */
  transports: McpTransport[];
  /** Source code repository (typically GitHub) */
  repoUrl: string;
  /** Optional vendor docs URL */
  docsUrl?: string;
  /** One-line install command — typically npx, uvx, or docker */
  installCommand: string;
  /** Headline features */
  features: string[];
  /** What an agent can do with this server */
  useCases: string[];
  /** Tools provided (count of MCP "tools" exposed) — for sorting and display */
  toolCount?: number;
}

export const MCP_CATEGORY_LABELS: Record<McpCategory, string> = {
  filesystem: "Filesystem",
  git: "Git & VCS",
  database: "Database",
  search: "Search",
  productivity: "Productivity",
  "dev-tools": "Dev tools",
  "web-browsing": "Web browsing",
  communication: "Communication",
  memory: "Memory",
  design: "Design",
  infrastructure: "Infrastructure",
};

export const MCP_TRANSPORT_LABELS: Record<McpTransport, string> = {
  stdio: "stdio (local)",
  sse: "SSE (remote)",
  "streamable-http": "Streamable HTTP",
};

export const MCP_SERVERS: McpServer[] = [
  {
    slug: "filesystem",
    name: "Filesystem",
    tagline: "Read, write, and search files on the local disk.",
    description:
      "The reference MCP server for filesystem access. Lets an AI agent read directory trees, open files, search by pattern, and (with explicit allowlists) write or move files. The most common starting point for any MCP integration — every coding-adjacent agent uses this or a fork.",
    maintainer: "Anthropic",
    official: true,
    category: "filesystem",
    transports: ["stdio"],
    repoUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
    docsUrl: "https://github.com/modelcontextprotocol/servers",
    installCommand: "npx -y @modelcontextprotocol/server-filesystem /path/to/dir",
    features: [
      "Read files and directory listings",
      "Pattern-based search (glob + grep)",
      "Move and rename within allowed paths",
      "Path allowlisting at start time",
    ],
    useCases: [
      "Coding agents working on a local repo",
      "Document-summarization agents reading a folder",
      "Local-first knowledge agents",
    ],
    toolCount: 8,
  },
  {
    slug: "git",
    name: "Git",
    tagline: "Inspect, branch, commit, and review git history.",
    description:
      "MCP server that wraps the Git CLI for an agent. Status, log, diff, branch, commit, and reset operations exposed as tools. Pairs naturally with the Filesystem and GitHub servers for a complete repo workflow.",
    maintainer: "Anthropic",
    official: true,
    category: "git",
    transports: ["stdio"],
    repoUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/git",
    installCommand: "uvx mcp-server-git --repository /path/to/repo",
    features: [
      "Read git status, log, and diff",
      "Create branches and commits",
      "Show file blame",
      "Review staged vs unstaged changes",
    ],
    useCases: [
      "Code-review agents",
      "Auto-commit workflows from generated edits",
      "Repo-history Q&A",
    ],
    toolCount: 13,
  },
  {
    slug: "github",
    name: "GitHub",
    tagline: "Issues, PRs, repos, and Actions over the GitHub API.",
    description:
      "First-party MCP server for the GitHub API. Read and write issues, pull requests, comments, and repository metadata. Critical for agents that need to triage, respond, or operate on GitHub-native workflows without screen-scraping the web UI.",
    maintainer: "GitHub",
    official: true,
    category: "git",
    transports: ["streamable-http", "stdio"],
    repoUrl: "https://github.com/github/github-mcp-server",
    docsUrl: "https://github.com/github/github-mcp-server",
    installCommand: "docker run ghcr.io/github/github-mcp-server",
    features: [
      "Search and read issues, PRs, commits",
      "Open and update issues and PRs",
      "List and create branches and tags",
      "Trigger and monitor Actions",
    ],
    useCases: [
      "Triage agents that auto-label and respond to issues",
      "PR-review agents",
      "Release-management automation",
    ],
    toolCount: 41,
  },
  {
    slug: "postgres",
    name: "Postgres",
    tagline: "Read-only SQL access for any Postgres database.",
    description:
      "The reference MCP server for relational data. Exposes table schemas and read-only query execution to an agent — without giving it a write seat. The standard pattern for letting an LLM 'see' your data without risking writes.",
    maintainer: "Anthropic",
    official: true,
    category: "database",
    transports: ["stdio"],
    repoUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres",
    installCommand: "npx -y @modelcontextprotocol/server-postgres postgresql://...",
    features: [
      "List schemas and tables",
      "Read column types and constraints",
      "Execute read-only queries",
      "Connection-pooled for agent loops",
    ],
    useCases: [
      "Analytics agents over an OLAP DB",
      "Internal Q&A bots over a customer-facing schema",
      "Schema-aware report generators",
    ],
    toolCount: 4,
  },
  {
    slug: "brave-search",
    name: "Brave Search",
    tagline: "Privacy-respecting web search for agents.",
    description:
      "Web search MCP server backed by the Brave Search API. The default web-search tool for many agent stacks because it doesn't require deep Google integration and has a generous free tier for development.",
    maintainer: "Anthropic",
    official: true,
    category: "search",
    transports: ["stdio"],
    repoUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search",
    installCommand: "npx -y @modelcontextprotocol/server-brave-search",
    features: [
      "Web search with snippet results",
      "Local search for places",
      "Result ranking and freshness controls",
      "Free tier for development",
    ],
    useCases: [
      "Research agents grounded on the live web",
      "Fact-checking agents",
      "Up-to-date Q&A bots",
    ],
    toolCount: 2,
  },
  {
    slug: "puppeteer",
    name: "Puppeteer",
    tagline: "Headless browser control for scraping and automation.",
    description:
      "Puppeteer-backed MCP server giving an agent a real browser. Navigate pages, click elements, fill forms, take screenshots, evaluate JS. The right tool when an agent needs to interact with sites that don't have an API.",
    maintainer: "Anthropic",
    official: true,
    category: "web-browsing",
    transports: ["stdio"],
    repoUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer",
    installCommand: "npx -y @modelcontextprotocol/server-puppeteer",
    features: [
      "Navigate and interact with web pages",
      "Click, fill, select, and submit forms",
      "Take page screenshots",
      "Evaluate JavaScript in the page context",
    ],
    useCases: [
      "Web-scraping agents",
      "QA test-runner agents",
      "Form-filling automation",
    ],
    toolCount: 7,
  },
  {
    slug: "slack",
    name: "Slack",
    tagline: "Send, read, and react to messages across a workspace.",
    description:
      "MCP server for Slack. Read channel history, post messages, react, manage threads, and look up users. The standard integration for any agent that participates in team chat — incident response, daily standups, or ChatOps workflows.",
    maintainer: "Anthropic",
    official: true,
    category: "communication",
    transports: ["stdio"],
    repoUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/slack",
    installCommand: "npx -y @modelcontextprotocol/server-slack",
    features: [
      "Post messages and replies",
      "Read channel history",
      "React to messages",
      "Look up users and channels",
    ],
    useCases: [
      "Incident-response agents",
      "Daily standup summaries",
      "ChatOps bots",
    ],
    toolCount: 8,
  },
  {
    slug: "google-drive",
    name: "Google Drive",
    tagline: "Read and search Google Drive files.",
    description:
      "MCP server for Google Drive. List, search, and download files including Docs, Sheets, and Slides. The path of least resistance for an agent that needs to read documents living in a Workspace org.",
    maintainer: "Anthropic",
    official: true,
    category: "productivity",
    transports: ["stdio"],
    repoUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive",
    installCommand: "npx -y @modelcontextprotocol/server-gdrive",
    features: [
      "List and search Drive files",
      "Read Docs, Sheets, and Slides as text",
      "Download arbitrary files",
      "OAuth-scoped read access",
    ],
    useCases: [
      "Document Q&A agents over a team's Drive",
      "Onboarding bots that pull from Workspace",
      "Auditors and compliance tools",
    ],
    toolCount: 2,
  },
  {
    slug: "memory",
    name: "Memory",
    tagline: "Persistent knowledge graph across agent sessions.",
    description:
      "Reference implementation of long-term agent memory. Stores entities, relations, and observations between sessions. The starting point for any agent that needs to remember the user across runs without rolling your own vector store.",
    maintainer: "Anthropic",
    official: true,
    category: "memory",
    transports: ["stdio"],
    repoUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/memory",
    installCommand: "npx -y @modelcontextprotocol/server-memory",
    features: [
      "Knowledge-graph storage (entities + relations)",
      "Observation logging",
      "Search and retrieval",
      "Local JSON persistence",
    ],
    useCases: [
      "Personal-assistant agents",
      "Long-running agents that learn user preferences",
      "Multi-session research workflows",
    ],
    toolCount: 9,
  },
  {
    slug: "linear",
    name: "Linear",
    tagline: "Issues, projects, and cycles on Linear.",
    description:
      "First-party MCP server from Linear. Create, update, search, and link issues; access teams, projects, and cycles. The integration that lets an agent participate in a real engineering workflow without copy-pasting tickets.",
    maintainer: "Linear",
    official: true,
    category: "productivity",
    transports: ["streamable-http"],
    repoUrl: "https://linear.app/docs/mcp",
    docsUrl: "https://linear.app/docs/mcp",
    installCommand: "Connect via Linear's MCP endpoint with API key",
    features: [
      "Create and update issues",
      "Search across teams and projects",
      "Link issues to PRs and docs",
      "Access cycles and roadmaps",
    ],
    useCases: [
      "Engineering-triage agents",
      "Auto-ticketing from incident reports",
      "Sprint-planning copilots",
    ],
    toolCount: 30,
  },
  {
    slug: "notion",
    name: "Notion",
    tagline: "Pages, databases, and search across a Notion workspace.",
    description:
      "First-party Notion MCP server. Create and update pages, query databases, and search across the workspace. The right pick when your team's knowledge lives in Notion and you want an agent that can read and write back to it.",
    maintainer: "Notion",
    official: true,
    category: "productivity",
    transports: ["streamable-http"],
    repoUrl: "https://developers.notion.com/docs/mcp",
    docsUrl: "https://developers.notion.com/docs/mcp",
    installCommand: "Connect via Notion's MCP endpoint with integration token",
    features: [
      "Create and update pages",
      "Query database views",
      "Search across the workspace",
      "Append blocks and comments",
    ],
    useCases: [
      "Knowledge-base maintenance agents",
      "Spec-writing copilots",
      "Meeting-notes-to-Notion automation",
    ],
    toolCount: 16,
  },
  {
    slug: "sentry",
    name: "Sentry",
    tagline: "Read and triage errors from production.",
    description:
      "First-party Sentry MCP server. Lets an agent inspect errors, view stack traces, and triage issues directly from the Sentry org. Pairs with GitHub MCP for the full \"detect → diagnose → patch\" loop.",
    maintainer: "Sentry",
    official: true,
    category: "dev-tools",
    transports: ["streamable-http"],
    repoUrl: "https://docs.sentry.io/product/sentry-mcp/",
    docsUrl: "https://docs.sentry.io/product/sentry-mcp/",
    installCommand: "Connect via Sentry's MCP endpoint with auth token",
    features: [
      "List and search issues",
      "View stack traces and breadcrumbs",
      "Comment and assign issues",
      "Query event data",
    ],
    useCases: [
      "On-call triage agents",
      "Auto-PR agents from production errors",
      "Release-health summaries",
    ],
    toolCount: 18,
  },
  {
    slug: "stripe",
    name: "Stripe",
    tagline: "Customers, subscriptions, and payments via Stripe API.",
    description:
      "First-party Stripe MCP server. Look up customers, list subscriptions, refund charges, and read product configuration. The integration for any agent that needs to answer billing questions or perform back-office payment operations.",
    maintainer: "Stripe",
    official: true,
    category: "infrastructure",
    transports: ["streamable-http"],
    repoUrl: "https://github.com/stripe/agent-toolkit",
    docsUrl: "https://docs.stripe.com/agents",
    installCommand: "npx @stripe/mcp --tools=all --api-key=sk_...",
    features: [
      "Customer and subscription lookup",
      "Charge and refund inspection",
      "Product and price reads",
      "Restricted-key support for least privilege",
    ],
    useCases: [
      "Customer-support copilots",
      "Billing-question triage",
      "Internal finance Q&A bots",
    ],
    toolCount: 20,
  },
  {
    slug: "vercel",
    name: "Vercel",
    tagline: "Deployments, projects, and logs on Vercel.",
    description:
      "First-party Vercel MCP server. Inspect deployments, read logs, manage environment variables, and trigger redeploys. Where your AI agent meets your hosting platform.",
    maintainer: "Vercel",
    official: true,
    category: "infrastructure",
    transports: ["streamable-http"],
    repoUrl: "https://vercel.com/docs/mcp",
    docsUrl: "https://vercel.com/docs/mcp",
    installCommand: "Connect via Vercel's MCP endpoint with access token",
    features: [
      "List deployments and projects",
      "Read build and runtime logs",
      "Manage environment variables",
      "Trigger redeploys",
    ],
    useCases: [
      "Deploy-management agents",
      "Build-failure triage",
      "Env-var auditing automation",
    ],
    toolCount: 12,
  },
  {
    slug: "playwright",
    name: "Playwright",
    tagline: "Modern browser automation across Chromium, Firefox, and WebKit.",
    description:
      "First-party Playwright MCP server. The successor pick to Puppeteer for many agent stacks — better cross-browser coverage and accessibility-tree introspection. Use this when an agent needs to test or scrape modern web apps.",
    maintainer: "Microsoft",
    official: true,
    category: "web-browsing",
    transports: ["stdio"],
    repoUrl: "https://github.com/microsoft/playwright-mcp",
    docsUrl: "https://github.com/microsoft/playwright-mcp",
    installCommand: "npx -y @playwright/mcp@latest",
    features: [
      "Cross-browser navigation (Chromium, Firefox, WebKit)",
      "Accessibility-tree-aware actions (no screenshots needed)",
      "Network interception",
      "Multi-tab support",
    ],
    useCases: [
      "QA test-runner agents",
      "Modern-app scrapers",
      "Form-filling automation across browsers",
    ],
    toolCount: 24,
  },
  {
    slug: "cloudflare",
    name: "Cloudflare",
    tagline: "Workers, R2, KV, and DNS over the Cloudflare API.",
    description:
      "First-party Cloudflare MCP server. Inspect Workers, manage R2 buckets and KV namespaces, list DNS records, and read account-level config. Pairs naturally with deployment agents that operate at the edge.",
    maintainer: "Cloudflare",
    official: true,
    category: "infrastructure",
    transports: ["streamable-http"],
    repoUrl: "https://github.com/cloudflare/mcp-server-cloudflare",
    docsUrl: "https://developers.cloudflare.com/agents/model-context-protocol/",
    installCommand: "Connect via Cloudflare's MCP endpoint with API token",
    features: [
      "Worker and Pages inspection",
      "R2 and KV namespace ops",
      "DNS record reads",
      "Analytics queries",
    ],
    useCases: [
      "Edge-deployment agents",
      "Storage-management automation",
      "DNS auditors",
    ],
    toolCount: 32,
  },
];

/**
 * Build a ready-to-paste MCP client config (Claude Desktop / Cursor shape)
 * for servers installed via a local command. Returns null for hosted remote
 * servers that connect through a vendor endpoint instead.
 */
export function getMcpClientConfig(server: McpServer): string | null {
  const match = server.installCommand.match(/^(npx|uvx|docker)\s+(.+)$/);
  if (!match) return null;
  const [, command, rest] = match;
  const args = rest.split(/\s+/);
  return JSON.stringify(
    {
      mcpServers: {
        [server.slug]: { command, args },
      },
    },
    null,
    2
  );
}

export function getMcpBySlug(slug: string): McpServer | undefined {
  return MCP_SERVERS.find((s) => s.slug === slug);
}

export function getAllMcpSlugs(): string[] {
  return MCP_SERVERS.map((s) => s.slug);
}

export function getMcpsByCategory(category: McpCategory): McpServer[] {
  return MCP_SERVERS.filter((s) => s.category === category);
}

export const MCP_CATEGORIES_IN_USE: McpCategory[] = Array.from(
  new Set(MCP_SERVERS.map((s) => s.category))
);
