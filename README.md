# GitSmartCLI 🚀

A smart CLI tool that integrates **Microsoft Copilot** and **GitHub Copilot** for enhanced Git workflows. GitSmartCLI brings AI-powered assistance to your daily Git operations, making version control smarter, faster, and more intuitive.

## ✨ Features

### 🤖 GitHub Copilot Integration
- **Smart Code Suggestions**: Get AI-powered code suggestions based on your current changes
- **AI Commit Messages**: Generate meaningful commit messages automatically
- **Code Review**: AI-powered analysis of your code changes

### 💬 Microsoft Copilot Integration  
- **Interactive Chat**: Chat with Microsoft Copilot about your Git workflow
- **Repository Analysis**: Get comprehensive AI insights about your repository
- **Smart Recommendations**: Receive personalized suggestions for your project

### 🎯 Smart Git Operations
- **Smart Push**: Pre-push checks with AI-powered issue detection
- **Smart Merge**: Intelligent merge conflict detection and resolution suggestions
- **Interactive Mode**: Full interactive CLI experience with AI assistance

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/proclean808/GitSmartCLI.git
cd GitSmartCLI

# Install dependencies
npm install

# Make CLI globally available
npm link

# Set up configuration
gitsmartcli setup
```

### First Run

```bash
# Start with the interactive mode
gitsmartcli interactive

# Or use specific commands
gitsmartcli copilot suggestions
gitsmartcli microsoft chat "How can I improve my Git workflow?"
```

## 🔧 Configuration

Run the setup command to configure your API keys:

```bash
gitsmartcli setup
```

You'll need:
- **GitHub Personal Access Token** (for GitHub Copilot API access)
- **Microsoft Copilot API Key** (for Microsoft Copilot integration)
- **OpenAI API Key** (optional, as fallback for AI features)

## 📚 Usage

### GitHub Copilot Commands

```bash
# Get code suggestions for current changes
gitsmartcli copilot suggestions

# Generate AI-powered commit message
gitsmartcli copilot commit

# Auto-commit with generated message
gitsmartcli copilot commit --auto
```

### Microsoft Copilot Commands

```bash
# Chat with Microsoft Copilot
gitsmartcli microsoft chat "How can I improve my code structure?"

# Analyze repository with AI insights
gitsmartcli microsoft analyze

# Deep analysis
gitsmartcli microsoft analyze --depth deep
```

### Smart Git Operations

```bash
# Smart push with AI checks
gitsmartcli smart-push

# Force push after checks
gitsmartcli smart-push --force

# Smart merge with AI conflict detection
gitsmartcli smart-merge feature-branch

# Auto-resolve conflicts (experimental)
gitsmartcli smart-merge feature-branch --auto-resolve

# AI-powered code review
gitsmartcli review

# Compare against specific ref
gitsmartcli review --compare origin/main
```

### Interactive Mode

```bash
# Start interactive mode
gitsmartcli interactive
# or
gitsmartcli i

# Available interactive commands:
# - status: Enhanced git status
# - suggest: Get AI suggestions
# - commit: Generate commit message
# - review: AI code review
# - chat <message>: Chat with Microsoft Copilot
# - help: Show help
# - exit: Exit interactive mode
```

## 🎨 Command Examples

### Generate Smart Commit Messages

```bash
# Stage your changes
git add .

# Generate AI commit message
gitsmartcli copilot commit
```

### Get Repository Insights

```bash
# Chat about your workflow
gitsmartcli microsoft chat "What are the best practices for my repository structure?"

# Get comprehensive analysis
gitsmartcli microsoft analyze --depth deep
```

### Smart Code Review

```bash
# Review current changes
gitsmartcli review

# Compare against main branch
gitsmartcli review --compare origin/main
```

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `gitsmartcli setup` | Configure API keys and preferences |
| `gitsmartcli copilot suggestions` | Get GitHub Copilot code suggestions |
| `gitsmartcli copilot commit` | Generate AI commit messages |
| `gitsmartcli microsoft chat [message]` | Chat with Microsoft Copilot |
| `gitsmartcli microsoft analyze` | AI repository analysis |
| `gitsmartcli smart-push` | Smart push with AI checks |
| `gitsmartcli smart-merge <branch>` | Smart merge with conflict detection |
| `gitsmartcli review` | AI-powered code review |
| `gitsmartcli interactive` | Start interactive mode |

## 🛠️ Development

### Prerequisites

- Node.js 14.0.0 or higher
- Git
- API keys for GitHub Copilot and Microsoft Copilot

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/proclean808/GitSmartCLI.git
cd GitSmartCLI

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

### Project Structure

```
GitSmartCLI/
├── src/
│   ├── cli.js              # Main CLI entry point
│   └── gitsmartcli.js      # Core GitSmartCLI class
├── package.json            # Project configuration
├── README.md              # This file
└── .gitignore            # Git ignore rules
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Future Enhancements

- [ ] Real GitHub Copilot API integration
- [ ] Real Microsoft Copilot API integration
- [ ] Advanced conflict resolution algorithms
- [ ] Plugin system for extensibility
- [ ] Web dashboard for repository insights
- [ ] Integration with popular IDEs
- [ ] Multi-language support
- [ ] Advanced security scanning

## 💡 Tips

- Use `gitsmartcli` or the shorter alias `gsc` for commands
- Enable verbose output in setup for detailed operation logs
- The interactive mode (`gitsmartcli i`) is great for exploring features
- Configure auto-commit in setup for faster workflows

---

**Made with ❤️ by the GitSmartCLI team**

*Bringing AI-powered intelligence to your Git workflows*
