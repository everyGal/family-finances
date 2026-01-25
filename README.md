# Family Budget Management Application - Complete Package

This package contains everything you need to build a Hebrew RTL family budget management application with Claude Code and n8n integration.

## 📦 Package Contents (11 files)

### Essential Files
1. **`README_HE.md`** - Main documentation in Hebrew (START HERE)
2. **`README.md`** - This file (English overview)
3. **`CLAUDE.md`** - Context file for Claude Code (CRITICAL - copy to project root)
4. **`CLAUDE_CODE_DEVELOPMENT_PLAN.md`** - Complete 10-phase development plan
5. **`RECOMMENDED_SKILLS.md`** - 9 Required skills for optimal Claude Code performance ⭐

### n8n Integration
4. **`n8n_integration_guide.md`** - How to integrate with n8n workflows
5. **`n8n_monthly_budget_schema.json`** - Schema for monthly budget updates
6. **`n8n_savings_schema.json`** - Schema for savings accounts

### Example Data
7. **`monthly_budget_data_example.json`** - 3 months of sample budget data
8. **`savings_data_example.json`** - 11 savings accounts example
9. **`categories_data_example.json`** - All expense/income categories

## 🚀 Quick Start

### 1. Open Claude Code
```bash
claude
```

### 2. Paste the Development Plan
Copy the contents of `CLAUDE_CODE_DEVELOPMENT_PLAN.md` and tell Claude:
```
Build this family budget management application following this development plan.
Start with Phase 1: Project Setup.

[paste entire plan]
```

### 3. Copy CLAUDE.md to Project Root
**IMPORTANT**: After Claude creates the project, copy `CLAUDE.md` to the project root directory. This file contains critical context about:
- Hebrew RTL requirements
- Data file locations and schemas
- Code style conventions
- Common workflows and gotchas

Without this file, Claude Code won't understand project-specific requirements.

### 4. Install Skills (REQUIRED! ⭐⭐⭐)
Before starting development, you **must** install the 6 recommended skills.

**Why this is critical:**
- Claude Code uses skills for professional-grade code
- Without skills, code quality will be lower
- Skills ensure best practices in React, UI/UX, and accessibility

**How to install:**

Open `RECOMMENDED_SKILLS.md` and follow the installation instructions for each skill.

**Skills to install:**
```
✅ frontend-design (Anthropic) - Professional UI/UX
✅ react-best-practices (Vercel) - React optimization (40+ rules)
✅ web-design-guidelines (Vercel) - Accessibility & UX (100+ rules)
✅ pdf (Anthropic) - PDF export
✅ xlsx (Anthropic) - Excel support
✅ skill-creator (Anthropic) - Create custom skills
```

**Verify installation:**
```
You: "List available skills"
Claude: [Should list all 6 skills]
```

**Usage:**

Skills work automatically! Claude picks the right skill for each task:

```
You: "Create a component for monthly summary card"
Claude: [Uses react-best-practices + frontend-design]
→ Creates professional, styled component
```

**Create custom skills when needed:**
```
"/skill-creator
Create a skill for Hebrew RTL validation patterns with examples and tests"
```

## 🎯 What You'll Build

- ✅ Dashboard with 4 summary cards
- ✅ Editable monthly budget table
- ✅ Interactive charts (income vs expenses)
- ✅ Savings accounts view
- ✅ JSON import from n8n (drag & drop)
- ✅ Full Hebrew RTL support

## 🔧 Technology Stack

- **Frontend**: Vite + React 18
- **Styling**: Tailwind CSS v3 (RTL configured)
- **Charts**: Recharts v2
- **Language**: Hebrew (RTL)
- **Data**: JSON files (no database needed)
- **Icons**: Material Symbols

## 📝 Key Files

### CLAUDE.md - The Most Important File
This file gives Claude Code persistent context about your project. It includes:
- Tech stack and dependencies
- Code style rules (ES modules, RTL patterns)
- Data file locations and schemas
- Common gotchas and solutions
- Workflow instructions

Claude Code reads this file at the start of every conversation, ensuring it always understands your project's requirements.

### Development Plan
The plan is organized into 10 phases:
1. Project Setup (with CLAUDE.md)
2. Context & Data Layer
3. Layout Components
4. Summary Cards
5. Monthly Budget Table
6. Charts
7. Savings View
8. Import Feature
9. Integration
10. Polish

Each phase is detailed with complete code examples.

## 🔗 n8n Integration

n8n generates JSON files → You download → Drag into app → Automatic merge

The app intelligently merges data:
- Existing month: Updates values (preserves other fields)
- New month: Adds to list and sorts

See `n8n_integration_guide.md` for detailed workflows.

## 📚 Additional Documentation

- **Hebrew README**: `README_HE.md` (comprehensive guide in Hebrew)
- **n8n Integration**: `n8n_integration_guide.md`
- **Schemas**: JSON schemas for validation and documentation

## 💡 Best Practices with Claude Code

1. **Use Plan Mode** for exploration, Normal Mode for implementation
2. **Course-correct early** - press `Esc` if Claude goes off track
3. **Run `/clear`** between unrelated tasks to manage context
4. **Verify as you go** - run `npm run dev` after UI changes
5. **Use CLAUDE.md** - it dramatically improves Claude's effectiveness

## 🎓 Learning Resources

If you're new to Claude Code, the development plan includes:
- Step-by-step instructions
- Complete code examples
- Common pitfalls and solutions
- Testing strategies

## ✨ Why This Approach Works

**Browser-based** (not Electron) - Simpler, faster, more maintainable
**JSON storage** (not SQLite) - Easy for n8n, human-readable, no native deps
**Vite** (not CRA) - Faster builds, better DX
**Recharts** - React-native, RTL-friendly

## 📂 File Structure After Build

```
family-budget-app/
├── CLAUDE.md                    ← Copy from this package!
├── public/
│   └── data/                    ← Copy example JSON files here
│       ├── monthly_budget.json
│       ├── savings_accounts.json
│       └── categories.json
├── src/
│   ├── components/
│   ├── context/
│   ├── utils/
│   └── ...
└── package.json
```

## 🚦 Success Criteria

You'll know it's working when:
- Dev server runs (`npm run dev`)
- Hebrew text displays correctly in RTL
- Summary cards show real data
- Tables are editable
- Charts render with Hebrew labels
- JSON import works via drag-drop

## 🤝 Support

All documentation is included in this package. If you get stuck:
1. Check `README_HE.md` for comprehensive Hebrew guide
2. Review `n8n_integration_guide.md` for integration details
3. Look at example JSON files for data format
4. Read CLAUDE.md for project conventions

## 📄 License

This is a custom development package created for your specific project.

---

**Ready to start?** Open `README_HE.md` for the full Hebrew guide, or jump straight to Claude Code with the development plan!
