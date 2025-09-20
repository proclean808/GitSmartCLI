# GitSmartCLI Demo Examples

This document provides practical examples of how to use GitSmartCLI with Microsoft Copilot and GitHub Copilot integration.

## Basic Usage Examples

### 1. Getting Started

```bash
# Install and setup
npm install -g gitsmartcli
gitsmartcli setup

# Show welcome message
gitsmartcli
```

### 2. GitHub Copilot Integration

```bash
# Get AI suggestions for your current changes
git add .
gitsmartcli copilot suggestions

# Generate smart commit messages
git add .
gitsmartcli copilot commit

# Auto-commit with AI message
git add .
gitsmartcli copilot commit --auto
```

### 3. Microsoft Copilot Integration

```bash
# Chat about your workflow
gitsmartcli microsoft chat "How can I improve my Git branching strategy?"

# Analyze your repository
gitsmartcli microsoft analyze

# Deep repository analysis
gitsmartcli microsoft analyze --depth deep
```

### 4. Smart Git Operations

```bash
# Smart push with pre-checks
gitsmartcli smart-push

# Smart merge with conflict detection
gitsmartcli smart-merge feature-branch

# AI-powered code review
gitsmartcli review
```

### 5. Interactive Mode

```bash
# Start interactive session
gitsmartcli interactive

# In interactive mode, you can use:
# - status: Enhanced git status
# - suggest: Get AI suggestions  
# - commit: Generate commit message
# - review: AI code review
# - chat <message>: Chat with Copilot
# - exit: Leave interactive mode
```

## Workflow Examples

### Daily Development Workflow

```bash
# 1. Start your day - check repository status
gitsmartcli interactive
> status

# 2. Make your changes and get AI suggestions
> suggest

# 3. Generate smart commit message
> commit

# 4. Review your changes before pushing
> review

# 5. Smart push with checks
> exit
gitsmartcli smart-push
```

### Feature Development Workflow

```bash
# 1. Analyze repository for best practices
gitsmartcli microsoft analyze

# 2. Chat about implementation approach
gitsmartcli microsoft chat "What's the best way to implement authentication in this project?"

# 3. Work on feature and get suggestions
git add new-feature.js
gitsmartcli copilot suggestions

# 4. Generate descriptive commit
gitsmartcli copilot commit

# 5. Review before merging
gitsmartcli review --compare main

# 6. Smart merge to main
git checkout main
gitsmartcli smart-merge feature-branch
```

### Code Review Workflow

```bash
# 1. Review changes before committing
gitsmartcli review

# 2. Get specific suggestions for files
gitsmartcli copilot suggestions --file src/main.js

# 3. Chat about code quality
gitsmartcli microsoft chat "How can I improve the code quality in my recent changes?"

# 4. Generate final commit message
gitsmartcli copilot commit
```

## Advanced Usage

### Troubleshooting Workflow

```bash
# When you have merge conflicts
gitsmartcli smart-merge problematic-branch --auto-resolve

# When push is rejected
gitsmartcli smart-push --force

# Chat about Git issues
gitsmartcli microsoft chat "I'm having trouble with merge conflicts, what should I do?"
```

### Team Collaboration

```bash
# Before pushing shared work
gitsmartcli review --compare origin/main
gitsmartcli smart-push

# When integrating team changes
gitsmartcli microsoft chat "What's the best practice for integrating changes from multiple team members?"
```

## Sample Outputs

### AI Commit Message Example
```
feat: add new functionality and improvements

- Implemented user authentication system
- Added input validation for forms  
- Updated error handling throughout app
- Enhanced user experience with better feedback
```

### Code Review Example
```
🔍 Overall Score: 8/10

⚠️  Issues Found:
1. Medium: Large changeset - consider breaking into smaller commits
   💡 Suggestion: Split changes across multiple focused commits

✅ Positive Aspects:
1. Changes appear well-structured
2. Good use of consistent formatting
```

### Repository Analysis Example
```
📊 Repository Overview:
Files: 23
Branches: 5
Recent commits: 15

🎯 AI Insights:
1. Repository shows active development with regular commits
2. Good branch management practices observed
3. Code structure appears well-organized

💡 Recommendations:
1. Consider adding automated testing
2. Set up continuous integration
3. Add comprehensive documentation
```

## Tips for Best Results

1. **Stage your changes first** - Many commands work better with staged changes
2. **Use descriptive branch names** - Helps AI provide better suggestions
3. **Keep commits focused** - Smaller, focused commits get better AI analysis
4. **Configure your preferences** - Run `gitsmartcli setup` to customize behavior
5. **Use interactive mode for exploration** - Great way to discover features

## Troubleshooting

### Common Issues

**Issue**: "No GitHub token configured"
**Solution**: Run `gitsmartcli setup` and add your GitHub Personal Access Token

**Issue**: "Microsoft Copilot API key missing"  
**Solution**: Get an API key from Microsoft and add it via `gitsmartcli setup`

**Issue**: "No changes detected"
**Solution**: Make sure you have staged changes with `git add`

### Getting Help

```bash
# General help
gitsmartcli --help

# Command-specific help
gitsmartcli copilot --help
gitsmartcli microsoft --help

# Interactive help
gitsmartcli interactive
> help
```