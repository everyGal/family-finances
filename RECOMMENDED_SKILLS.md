# Recommended Skills for Family Budget App

## What are Skills?

Skills are specialized knowledge modules that Claude Code loads on-demand. Unlike CLAUDE.md (which loads in every session), skills are applied only when relevant or when explicitly invoked.

Think of skills as expert consultants: Claude calls them in when needed, gets the specialized knowledge, and applies it to your project.

**Benefits:**
- 🎯 Precise knowledge exactly when needed
- 💾 Keeps main context clean and efficient
- 🔄 Reusable across all sessions
- 👥 Shareable with your team via git

---

## Installation

**Important:** Install these skills before starting development.

Skills are typically installed by downloading or cloning them from their GitHub repositories. Follow the installation instructions for your Claude Code setup.

---

## Required Skills for This Project (6 Skills)

### 1. frontend-design (CRITICAL) ⭐⭐⭐
**Source:** Anthropic  
**Repository:** https://github.com/anthropics/skills/tree/main/skills/frontend-design

**Purpose:** Create distinctive, production-grade frontend interfaces with high design quality

**Why you need it:**
- Your entire project is a React frontend application
- Ensures professional, polished UI/UX
- Avoids generic AI aesthetics
- Generates creative, well-structured components

**When Claude uses it:**
- Building any UI component
- Creating layouts and page structures
- Styling decisions
- Responsive design implementation

**Example usage:**
- Claude automatically applies when building components
- Creates professional designs without explicit prompting

---

### 2. react-best-practices ⭐⭐⭐
**Source:** Vercel  
**Repository:** https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices

**Purpose:** React and Next.js performance optimization guidelines from Vercel Engineering. Contains 40+ rules across 8 categories, prioritized by impact.

**Why you need it:**
- Project is built entirely with React components
- Ensures optimal performance patterns
- Eliminates waterfalls and unnecessary re-renders
- Proper hooks usage and state management
- Bundle size optimization

**Categories covered:**
- Eliminating waterfalls (Critical)
- Bundle size optimization (Critical)
- Server-side performance (High)
- Client-side data fetching (Medium-High)
- Re-render optimization (Medium)
- Rendering performance (Medium)
- JavaScript micro-optimizations (Low-Medium)

**When Claude uses it:**
- Writing new React components
- Implementing data fetching
- Reviewing code for performance issues
- Optimizing bundle size or load times
- Working with hooks (useState, useEffect, useMemo, useCallback)

**Example prompts:**
- "Review this component for performance issues"
- "Optimize this React component"
- "Help me eliminate unnecessary re-renders"

**Note:** This skill covers what would have been in separate "react-component-generator", "react-hooks-helper", and general React best practices.

---

### 3. web-design-guidelines ⭐⭐
**Source:** Vercel  
**Repository:** https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines

**Purpose:** Review UI code for compliance with web interface best practices. Audits your code for 100+ rules covering accessibility, performance, and UX.

**Why you need it:**
- Ensures accessibility compliance (ARIA labels, semantic HTML)
- RTL-specific best practices
- Touch and mobile interaction patterns
- Dark mode and theming
- Forms and validation best practices

**Categories covered:**
- Accessibility (aria-labels, semantic HTML, keyboard handlers)
- Focus States (visible focus, focus-visible patterns)
- Forms (autocomplete, validation, error handling)
- Animation (prefers-reduced-motion, compositor-friendly transforms)
- Typography (proper Hebrew typography, numbers formatting)
- Images (dimensions, lazy loading, alt text)
- Performance (virtualization, layout thrashing)
- Navigation & State (URL reflects state, deep-linking)
- Dark Mode & Theming (color-scheme, theme-color meta)
- Touch & Interaction (touch-action, tap-highlight)
- Locale & i18n (Intl.DateTimeFormat, Intl.NumberFormat - for Hebrew)

**When Claude uses it:**
- "Review my UI"
- "Check accessibility"
- "Audit design"
- "Review UX"
- "Check my site against best practices"

**Example prompts:**
- "Review my components for accessibility issues"
- "Check if my Hebrew RTL layout follows best practices"
- "Audit this form for UX best practices"

---

### 4. pdf ⭐⭐
**Source:** Anthropic  
**Repository:** https://github.com/anthropics/skills/tree/main/skills/pdf

**Purpose:** Create, manipulate, and export PDF documents

**Why you need it:**
- Export monthly budget reports to PDF
- Generate printable financial statements
- Create yearly summaries

**When Claude uses it:**
- Implementing PDF export feature
- Generating budget reports
- Creating printable documents

**Example prompts:**
- "Add a feature to export the monthly budget as PDF"
- "Create a yearly financial summary PDF with charts"
- "Generate a printable budget report"

---

### 5. xlsx ⭐⭐
**Source:** Anthropic  
**Repository:** https://github.com/anthropics/skills/tree/main/skills/xlsx

**Purpose:** Create, read, and manipulate Excel spreadsheets with formulas and formatting

**Why you need it:**
- Export budget data to Excel for analysis
- Alternative format for n8n integration (instead of JSON)
- Generate spreadsheets with formulas and conditional formatting
- Read Excel files if n8n produces them

**When Claude uses it:**
- Implementing Excel export
- Reading Excel files from n8n
- Creating formatted budget spreadsheets with formulas

**Example prompts:**
- "Export all monthly data to Excel with formulas"
- "Add support for importing Excel files from n8n"
- "Create an Excel template with budget formulas"

---

### 6. skill-creator ⭐⭐⭐
**Source:** Anthropic  
**Repository:** https://github.com/anthropics/skills/tree/main/skills/skill-creator

**Purpose:** Create custom skills tailored to your specific project needs

**Why you need it:**
- Create project-specific skills as you discover patterns
- Domain knowledge that's unique to your project
- Capture tribal knowledge and best practices
- Fill gaps not covered by existing skills

**When to create custom skills:**
- RTL-specific validation patterns you use repeatedly
- Budget calculation formulas unique to your family
- n8n import troubleshooting workflows
- Hebrew Recharts configuration patterns
- JSON validation patterns specific to your data structure

**Example custom skills you might create:**

**1. Hebrew RTL Validation Skill:**
```
/skill-creator
Create a skill for validating Hebrew RTL layouts in React components.

Include:
- Common RTL patterns (start/end instead of left/right)
- Hebrew text alignment rules
- RTL-specific Tailwind classes
- Material Icons in RTL mode
- Common gotchas and solutions
- Testing checklist for RTL
```

**2. Budget Calculations Skill:**
```
/skill-creator
Create a skill for family budget calculations including:

- Total income/expense calculations with proper rounding
- Surplus/deficit tracking
- Percentage changes month-over-month
- Savings rate calculations
- Year-over-year comparisons
- Average monthly calculations

Include validation rules and edge case handling.
```

**3. n8n Import Debugging Skill:**
```
/skill-creator
Create a skill for debugging n8n JSON imports including:

- Schema validation checklist
- Common import errors and fixes
- Merge logic verification steps  
- Hebrew encoding issue detection
- Date format validation
- Amount validation (non-negative, proper precision)

Include diagnostic workflow and troubleshooting guide.
```

**4. Hebrew Recharts Configuration Skill:**
```
/skill-creator
Create a skill for configuring Recharts for Hebrew RTL display including:

- XAxis reversed configuration
- Hebrew month labels
- RTL-friendly tooltips
- Legend positioning
- Hebrew number formatting
- Color schemes
- Responsive chart sizing

Include examples for LineChart, BarChart, and common patterns.
```

**How to use skill-creator:**
```
/skill-creator
[Describe what you need]
```

Claude will guide you through creating a custom skill with proper structure, examples, and best practices.

---

## How Claude Uses Skills

### Automatic Usage
Claude automatically applies skills when they're relevant to the task:

```
You: "Create a component for displaying monthly expenses with proper React patterns"

Claude: [Uses react-best-practices + frontend-design]
→ Creates optimized, well-structured component
```

### Manual Invocation
You can explicitly call a skill if you want Claude to focus on it:

```
You: "/react-best-practices
Review this component for performance issues"

Claude: [Deep dive with react-best-practices skill]
```

### In Workflows
Skills work together in multi-step workflows:

```
You: "Create an export feature for budget reports in both PDF and Excel"

Claude: 
[Uses frontend-design to create UI]
[Uses react-best-practices for component structure]
[Uses pdf skill for PDF generation]
[Uses xlsx skill for Excel export]
[Uses web-design-guidelines to ensure accessibility]
```

---

## Important Notes

### Testing
While there's no dedicated testing skill in the available repositories, you should still write tests:

**Testing approach:**
1. Use react-best-practices skill for component testing patterns
2. Ask Claude to write tests explicitly:
   ```
   "Write comprehensive tests for the budget calculation utilities"
   "Add unit tests for JSON import validation"
   "Create component tests for MonthlyTable with various data scenarios"
   ```

3. **Critical test areas for budget app:**
   - Calculation logic (totals, percentages, averages)
   - Data validation (non-negative amounts, date formats)
   - JSON import/merge logic
   - Component rendering with edge cases
   - RTL-specific behavior

**Example test prompts:**
```
"Write tests for calculateTotalExpenses covering:
- Empty expenses object
- Mixed positive values
- Zero values
- Large numbers
- Proper rounding to 2 decimal places"

"Test the JSON import validation including:
- Invalid JSON syntax
- Missing required fields
- Negative amounts (should reject)
- Invalid date formats
- Hebrew encoding issues"
```

### Tailwind & Vite
While there are no specific Tailwind or Vite skills available:

**For Tailwind:**
- `frontend-design` skill covers general styling patterns
- `web-design-guidelines` covers responsive design and accessibility
- For RTL-specific patterns, create a custom skill using `skill-creator`

**For Vite:**
- Standard Vite configuration is straightforward
- Refer to CLAUDE.md for project-specific Vite setup
- Create custom skill if you need specialized Vite patterns

---

## Skill Installation Checklist

Before starting development, install these 6 skills:

- [ ] frontend-design (Anthropic)
- [ ] react-best-practices (Vercel)
- [ ] web-design-guidelines (Vercel)
- [ ] pdf (Anthropic)
- [ ] xlsx (Anthropic)
- [ ] skill-creator (Anthropic)

**Verify installation:**
Check with Claude that skills are available before starting development.

---

## Summary

**With these 6 skills, Claude Code has expertise in:**
- ✅ Professional UI/UX design (frontend-design)
- ✅ React performance optimization (react-best-practices)
- ✅ Web accessibility and best practices (web-design-guidelines)
- ✅ PDF document generation (pdf)
- ✅ Excel spreadsheet creation (xlsx)
- ✅ Creating custom skills for your needs (skill-creator)

**You can create custom skills for:**
- RTL validation patterns
- Budget-specific calculations
- n8n import debugging
- Recharts Hebrew configuration
- Any other project-specific patterns

---

## Resources

- **Anthropic Skills Repository:** https://github.com/anthropics/skills
- **Vercel Agent Skills Repository:** https://github.com/vercel-labs/agent-skills
- **Agent Skills Format:** https://agentskills.io/

Good luck with your family budget app! 🚀
