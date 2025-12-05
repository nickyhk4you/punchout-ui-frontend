# Amp SDK CI/CD Integration Demo

## Executive Summary

This demo showcases how **Amp SDK** (by Sourcegraph) can be integrated into GitHub Actions workflows to automate software development lifecycle (SDLC) tasks using AI. The implementation adds intelligent automation to our existing CI/CD pipeline without replacing human oversight.

**Repository:** `punchout-ui-frontend` (Next.js 14 Application)

---

## What is Amp SDK?

Amp SDK is a TypeScript library that allows programmatic access to Sourcegraph's AI coding agent. It enables:

- **Automated code review** with AI-powered analysis
- **Intelligent issue triage** with automatic labeling
- **On-demand test generation** for components
- **Pre-deployment analysis** for risk assessment

Unlike traditional static analysis tools, Amp SDK uses large language models (LLMs) to understand code context and provide human-readable feedback.

---

## Demo Workflows Implemented

### Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        GitHub Events                                 │
└───────┬─────────────────┬─────────────────┬─────────────────┬───────┘
        │                 │                 │                 │
        ▼                 ▼                 ▼                 ▼
   Pull Request       New Issue       Push to Main      Manual Trigger
        │                 │                 │                 │
        ▼                 ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Amp Code      │ │ Amp Issue     │ │ CI Build +    │ │ Amp Test      │
│ Review        │ │ Triage        │ │ Deploy        │ │ Generation    │
├───────────────┤ ├───────────────┤ ├───────────────┤ ├───────────────┤
│ • Analyzes    │ │ • Auto-labels │ │ • Lint/Build  │ │ • Creates     │
│   changed     │ │   issues      │ │ • TypeCheck   │ │   unit tests  │
│   files       │ │ • Suggests    │ │ • Docker      │ │ • Opens PR    │
│ • Posts PR    │ │   priority    │ │   build       │ │   with tests  │
│   comment     │ │ • Identifies  │ │ • Amp pre-    │ │               │
│               │ │   affected    │ │   deploy      │ │               │
│               │ │   areas       │ │   check       │ │               │
└───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘
```

---

## Workflow Details

### 1. CI Pipeline (`ci.yml`)

**Trigger:** Push or PR to `main`/`develop` branches

**What it does:**
- Runs ESLint for code quality
- Performs TypeScript type checking
- Builds the Next.js application

**Purpose:** Standard CI checks (not AI-powered, but foundational)

```yaml
# Key steps
- npm run lint
- npx tsc --noEmit
- npm run build
```

---

### 2. Amp AI Code Review (`amp-code-review.yml`)

**Trigger:** Pull Request opened, synchronized, or reopened

**What it does:**
1. Identifies changed TypeScript/JavaScript files (excludes `.next/`, `node_modules/`)
2. Sends file list to Amp SDK for analysis
3. Posts AI-generated review as PR comment

**Sample Output:**
```markdown
## 🤖 Amp AI Code Review

### Summary
This PR adds new dashboard components with good TypeScript practices.

### Suggestions
1. **StatCard.tsx:45** - Consider memoizing the color lookup
2. **page.tsx:89** - The useEffect dependency array is missing `loadData`
3. **utils.ts:12** - Add explicit return type annotation

### Security
✅ No hardcoded secrets detected
✅ No SQL injection risks
```

**Value:** Provides immediate feedback before human review, catches common issues early.

---

### 3. Amp AI Issue Triage (`amp-issue-triage.yml`)

**Trigger:** New issue opened

**What it does:**
1. Analyzes issue title and body
2. Suggests appropriate labels (bug, enhancement, documentation, etc.)
3. Assesses priority level
4. Identifies potentially affected code areas
5. Posts helpful initial comment

**Sample Output:**
```markdown
## 🤖 Amp AI Analysis

**Priority:** Medium

**Summary:** User reports login button not working on mobile Safari

**Potentially affected areas:** src/components/auth/, src/app/login/

---
Thank you for reporting this issue! Based on the description, this appears 
to be a browser-specific CSS issue. A team member will investigate shortly.
```

**Value:** Reduces manual triage time, ensures consistent labeling, provides faster initial response.

---

### 4. Amp AI Test Generation (`amp-test-generation.yml`)

**Trigger:** Manual dispatch (workflow_dispatch)

**Input:** File path to generate tests for (e.g., `src/components/Button.tsx`)

**What it does:**
1. Reads the target file content
2. Sends to Amp SDK with testing requirements
3. Generates Jest + React Testing Library tests
4. Creates a PR with the generated test file

**Sample Usage:**
```
Actions → Amp AI Test Generation → Run workflow
  Target file: src/components/ui/StatCard.tsx
```

**Value:** Accelerates test coverage, provides starting point for comprehensive tests.

---

### 5. CD Pipeline with Amp Check (`deploy.yml`)

**Trigger:** Push to `main` or manual dispatch

**What it does:**
1. Standard build and lint
2. Builds Docker image
3. Pushes to GitHub Container Registry
4. **Amp pre-deployment analysis** - Reviews Dockerfile, config, environment variables
5. Deployment notification

**Amp Analysis Focus:**
- Dockerfile best practices
- Missing environment variables
- Configuration issues
- Potential deployment risks

**Value:** Catches deployment issues before they reach production.

---

## Demo Steps

### Prerequisites
1. GitHub repository with workflows configured
2. `AMP_API_KEY` secret set in repository settings
3. Sample code changes to trigger workflows

### Step 1: Show Code Review in Action
```bash
# Create a feature branch
git checkout -b demo/add-feature

# Make some changes
echo "// New feature" >> src/lib/utils.ts

# Push and create PR
git add . && git commit -m "feat: add new utility"
git push origin demo/add-feature
# Create PR via GitHub UI
```

**Expected Result:** Amp posts review comment within 30-60 seconds

### Step 2: Show Issue Triage
```
# Create a new issue via GitHub UI
Title: "Dashboard crashes when clicking refresh button"
Body: "After updating to the latest version, clicking the refresh 
       button on the dashboard causes a white screen error."
```

**Expected Result:** Issue automatically labeled, priority assigned, initial comment posted

### Step 3: Show Test Generation
```
# Go to Actions → Amp AI Test Generation → Run workflow
# Input: src/components/ui/StatCard.tsx
```

**Expected Result:** New PR created with test file

### Step 4: Show Deployment Check
```bash
# Merge PR to main
# Observe deploy workflow with Amp analysis step
```

**Expected Result:** Deployment proceeds with AI-powered pre-flight check

---

## Configuration Required

### Repository Secrets

| Secret | Description | How to Get |
|--------|-------------|------------|
| `AMP_API_KEY` | Amp SDK authentication | [ampcode.com/settings](https://ampcode.com/settings) |

### Files Added

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | Standard CI pipeline |
| `.github/workflows/amp-code-review.yml` | AI code review |
| `.github/workflows/amp-issue-triage.yml` | AI issue labeling |
| `.github/workflows/amp-test-generation.yml` | AI test creation |
| `.github/workflows/deploy.yml` | CD with AI analysis |
| `AGENTS.md` | Amp agent configuration |
| `AMP_SDK_GUIDELINES.md` | Usage documentation |

---

## Benefits & ROI

### Immediate Benefits

| Benefit | Impact |
|---------|--------|
| **Faster PR feedback** | Developers get immediate suggestions, reducing wait time for human review |
| **Consistent reviews** | AI catches common issues every time, no human oversight fatigue |
| **Reduced reviewer burden** | Senior developers focus on architecture, not typos |
| **Faster issue triage** | New issues categorized in seconds, not hours |
| **Test coverage acceleration** | Scaffolded tests provide starting point |

### Quantifiable Improvements

| Metric | Before | After (Expected) |
|--------|--------|------------------|
| Time to first review comment | 2-4 hours | < 1 minute |
| Issues triaged per day | 10-15 | Unlimited |
| Test file creation time | 30-60 min | 2-5 min |
| Common issues caught in review | 60% | 90%+ |

### Cost Considerations

- **Amp SDK:** Requires paid API key (usage-based pricing)
- **GitHub Actions:** Minutes consumed per workflow run
- **ROI:** Time saved by developers × hourly rate > API costs

---

## Possible Next Steps / Enhancements

### Phase 2: Enhanced Workflows

| Enhancement | Description | Effort |
|-------------|-------------|--------|
| **Changelog Generation** | Auto-generate release notes from commit history | Low |
| **Documentation Updates** | Auto-update docs when code changes | Medium |
| **Dependency Analysis** | Review PR for dependency security issues | Low |
| **Performance Review** | Flag potential performance regressions | Medium |

### Phase 3: Advanced Integration

| Enhancement | Description | Effort |
|-------------|-------------|--------|
| **Slack Notifications** | Post Amp reviews to team channel | Low |
| **JIRA Integration** | Link issues, update tickets automatically | Medium |
| **Custom Review Rules** | Project-specific review criteria in prompts | Low |
| **Multi-repo Support** | Centralized Amp workflows across repositories | High |

### Phase 4: Metrics & Insights

| Enhancement | Description | Effort |
|-------------|-------------|--------|
| **Review Analytics** | Track common issues across PRs | Medium |
| **Code Quality Trends** | Dashboard showing improvement over time | High |
| **Developer Feedback Loop** | Collect feedback on AI suggestions | Medium |

---

## Limitations & Guardrails

### What Amp SDK Does NOT Replace

| Still Required | Why |
|----------------|-----|
| Human code review | Final approval, architecture decisions |
| Manual testing | Runtime behavior, E2E scenarios |
| Security team review | Compliance, sensitive changes |
| Production approval | Deployment gate decisions |

### Current Guardrails

- AI reviews are **comments only**, not blocking
- Deployment requires human approval
- Generated tests require human review before merge
- Issue priority can be overridden by humans

---

## Conclusion

This demo showcases how Amp SDK can augment our development workflow by:

1. **Accelerating feedback loops** - Immediate AI review on PRs
2. **Automating routine tasks** - Issue triage, test scaffolding
3. **Maintaining quality** - Consistent code review standards
4. **Preserving human oversight** - AI assists, humans decide

The implementation is **additive** (enhances existing workflows) rather than **replacement** (does not remove human control).

---

## Resources

- [Amp SDK Documentation](https://ampcode.com/manual/sdk)
- [Amp Owner's Manual](https://ampcode.com/manual)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Project Guidelines](./AMP_SDK_GUIDELINES.md)

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Author: Development Team*
