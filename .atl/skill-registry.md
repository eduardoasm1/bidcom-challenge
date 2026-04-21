# Skill Registry — bidcom-challenge

Generated: 2026-04-21

## User Skills

| Skill | Trigger |
|-------|---------|
| branch-pr | When creating a pull request, opening a PR, or preparing changes for review |
| go-testing | When writing Go tests, using teatest, or adding test coverage |
| issue-creation | When creating a GitHub issue, reporting a bug, or requesting a feature |
| judgment-day | When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" |
| nestjs-clean-architecture | When writing NestJS modules, services, controllers, or designing new features |
| skill-creator | When user asks to create a new skill, add agent instructions, or document patterns for AI |

## Project Conventions

No project-level CLAUDE.md, agents.md, or .cursorrules found. Standard NestJS conventions apply.

## Compact Rules

### branch-pr
- Always create an issue before opening a PR (issue-first enforcement)
- PR title must reference the issue number (e.g., `feat: add auth module (#12)`)
- Branch naming: `feat/`, `fix/`, `chore/` prefixes

### issue-creation
- Issues must have a clear title, description, and acceptance criteria
- Use labels: bug, feature, chore, docs

### judgment-day
- Launch two independent blind judge sub-agents simultaneously
- Synthesize findings, apply fixes, re-judge until both pass
- Escalate after 2 iterations if judges still disagree

### nestjs-clean-architecture
- **Structure**: Domain (pure logic) → Application (use cases) → Infrastructure (persistence) → Presentation (HTTP)
- **Domain**: NO framework imports; entities, interfaces, use cases only
- **Application**: Orchestrates use cases, coordinates transactions
- **Infrastructure**: Repository implementations, external integrations
- **Presentation**: Controllers delegate to services; DTOs validate input
- **SOLID**: Follow Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion
- **Clean Code**: Meaningful names, small functions, DRY principle, self-documenting code
- **Testing**: Unit (domain), Integration (repositories with in-memory DB), E2E (HTTP endpoints)
- **Every class**: Has single responsibility, depends on abstractions

### skill-creator
- Skills live in `~/.claude/skills/{skill-name}/SKILL.md`
- Must include frontmatter: name, description, license, metadata
- Include When to Use, Compact Rules, and full instructions sections
