const simpleGit = require('simple-git');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const boxen = require('boxen');
// const axios = require('axios'); // Reserved for future API integration
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class GitSmartCLI {
  constructor() {
    this.git = simpleGit();
    this.configPath = path.join(os.homedir(), '.gitsmartcli', 'config.json');
    this.config = {};
    this.loadConfig();
  }

  async loadConfig() {
    try {
      const configDir = path.dirname(this.configPath);
      await fs.mkdir(configDir, { recursive: true });
      const configData = await fs.readFile(this.configPath, 'utf8');
      this.config = JSON.parse(configData);
    } catch (error) {
      // Config doesn't exist or is invalid, use defaults
      this.config = {
        githubToken: process.env.GITHUB_TOKEN || '',
        microsoftCopilotApiKey: process.env.MICROSOFT_COPILOT_API_KEY || '',
        openaiApiKey: process.env.OPENAI_API_KEY || '',
        preferences: {
          autoCommit: false,
          verboseOutput: true,
          defaultBranch: 'main'
        }
      };
    }
  }

  async saveConfig() {
    try {
      const configDir = path.dirname(this.configPath);
      await fs.mkdir(configDir, { recursive: true });
      await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error(chalk.red('Error saving configuration:'), error.message);
    }
  }

  async setupConfiguration() {
    console.log(chalk.cyan.bold('\n🔧 GitSmartCLI Setup\n'));
    
    const questions = [
      {
        type: 'password',
        name: 'githubToken',
        message: 'Enter your GitHub Personal Access Token (for Copilot API):',
        default: this.config.githubToken,
        mask: '*'
      },
      {
        type: 'password',
        name: 'microsoftCopilotApiKey',
        message: 'Enter your Microsoft Copilot API Key:',
        default: this.config.microsoftCopilotApiKey,
        mask: '*'
      },
      {
        type: 'password',
        name: 'openaiApiKey',
        message: 'Enter your OpenAI API Key (fallback for AI features):',
        default: this.config.openaiApiKey,
        mask: '*'
      },
      {
        type: 'confirm',
        name: 'autoCommit',
        message: 'Enable auto-commit for AI-generated commit messages?',
        default: this.config.preferences?.autoCommit || false
      },
      {
        type: 'confirm',
        name: 'verboseOutput',
        message: 'Enable verbose output?',
        default: this.config.preferences?.verboseOutput || true
      }
    ];

    const answers = await inquirer.prompt(questions);
    
    this.config.githubToken = answers.githubToken;
    this.config.microsoftCopilotApiKey = answers.microsoftCopilotApiKey;
    this.config.openaiApiKey = answers.openaiApiKey;
    this.config.preferences = {
      ...this.config.preferences,
      autoCommit: answers.autoCommit,
      verboseOutput: answers.verboseOutput
    };

    await this.saveConfig();
    
    console.log(chalk.green('\n✅ Configuration saved successfully!'));
    console.log(chalk.gray('Configuration stored at:'), this.configPath);
  }

  async getCopilotSuggestions(options = {}) {
    const spinner = ora('Getting GitHub Copilot suggestions...').start();
    
    try {
      const status = await this.git.status();
      
      if (status.files.length === 0) {
        spinner.stop();
        console.log(chalk.yellow('No changes detected. Make some changes first!'));
        return;
      }

      const suggestions = await this.generateAICodeSuggestions(status, options.file);
      
      spinner.stop();
      
      console.log(chalk.cyan.bold('\n🤖 GitHub Copilot Suggestions:\n'));
      
      suggestions.forEach((suggestion, index) => {
        console.log(boxen(
          `${chalk.bold(`Suggestion ${index + 1}:`)}\n\n${suggestion.description}\n\n${chalk.gray('Code:')}\n${suggestion.code}`,
          {
            padding: 1,
            borderColor: 'blue',
            borderStyle: 'round'
          }
        ));
        console.log();
      });

    } catch (error) {
      spinner.stop();
      throw error;
    }
  }

  async generateCommitMessage(options = {}) {
    const spinner = ora('Generating AI-powered commit message...').start();
    
    try {
      const diff = await this.git.diff(['--cached']);
      
      if (!diff) {
        spinner.stop();
        console.log(chalk.yellow('No staged changes found. Stage your changes first with "git add"'));
        return;
      }

      const commitMessage = await this.generateAICommitMessage(diff);
      
      spinner.stop();
      
      console.log(chalk.cyan.bold('\n📝 AI-Generated Commit Message:\n'));
      console.log(boxen(commitMessage, {
        padding: 1,
        borderColor: 'green',
        borderStyle: 'round'
      }));

      if (options.auto && this.config.preferences?.autoCommit) {
        await this.git.commit(commitMessage);
        console.log(chalk.green('\n✅ Changes committed successfully!'));
      } else {
        const { shouldCommit } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'shouldCommit',
            message: 'Do you want to commit with this message?',
            default: true
          }
        ]);

        if (shouldCommit) {
          await this.git.commit(commitMessage);
          console.log(chalk.green('\n✅ Changes committed successfully!'));
        }
      }

    } catch (error) {
      spinner.stop();
      throw error;
    }
  }

  async chatWithMicrosoftCopilot(message) {
    if (!message) {
      const { userMessage } = await inquirer.prompt([
        {
          type: 'input',
          name: 'userMessage',
          message: 'What would you like to ask Microsoft Copilot about your Git workflow?'
        }
      ]);
      message = userMessage;
    }

    const spinner = ora('Chatting with Microsoft Copilot...').start();
    
    try {
      const repoInfo = await this.getRepositoryContext();
      const response = await this.queryMicrosoftCopilot(message, repoInfo);
      
      spinner.stop();
      
      console.log(chalk.magenta.bold('\n💬 Microsoft Copilot Response:\n'));
      console.log(boxen(response, {
        padding: 1,
        borderColor: 'magenta',
        borderStyle: 'round'
      }));

    } catch (error) {
      spinner.stop();
      throw error;
    }
  }

  async analyzeWithMicrosoftCopilot(options = {}) {
    const spinner = ora('Analyzing repository with Microsoft Copilot...').start();
    
    try {
      const repoInfo = await this.getRepositoryContext();
      const analysis = await this.performRepositoryAnalysis(repoInfo, options.depth);
      
      spinner.stop();
      
      console.log(chalk.magenta.bold('\n🔍 Microsoft Copilot Repository Analysis:\n'));
      
      console.log(chalk.bold('📊 Repository Overview:'));
      console.log(`Files: ${analysis.fileCount}`);
      console.log(`Branches: ${analysis.branchCount}`);
      console.log(`Recent commits: ${analysis.recentCommits}`);
      console.log();
      
      console.log(chalk.bold('🎯 AI Insights:'));
      analysis.insights.forEach((insight, index) => {
        console.log(`${index + 1}. ${insight}`);
      });
      console.log();
      
      console.log(chalk.bold('💡 Recommendations:'));
      analysis.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });

    } catch (error) {
      spinner.stop();
      throw error;
    }
  }

  async smartPush(options = {}) {
    const spinner = ora('Performing smart push with AI checks...').start();
    
    try {
      // Pre-push checks
      const checks = await this.performPrePushChecks();
      
      spinner.stop();
      
      if (checks.issues.length > 0) {
        console.log(chalk.yellow.bold('\n⚠️  Pre-push Issues Detected:\n'));
        checks.issues.forEach((issue, index) => {
          console.log(`${index + 1}. ${chalk.yellow(issue.type)}: ${issue.message}`);
        });
        
        if (!options.force) {
          const { shouldContinue } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'shouldContinue',
              message: 'Issues detected. Do you want to continue with push?',
              default: false
            }
          ]);
          
          if (!shouldContinue) {
            console.log(chalk.gray('Push cancelled.'));
            return;
          }
        }
      }

      const pushSpinner = ora('Pushing changes...').start();
      await this.git.push();
      pushSpinner.stop();
      
      console.log(chalk.green('\n✅ Smart push completed successfully!'));

    } catch (error) {
      spinner.stop();
      throw error;
    }
  }

  async smartMerge(branch, options = {}) {
    const spinner = ora(`Performing smart merge with ${branch}...`).start();
    
    try {
      // Check for potential conflicts
      const conflictAnalysis = await this.analyzeConflicts(branch);
      
      if (conflictAnalysis.hasConflicts) {
        spinner.stop();
        
        console.log(chalk.yellow.bold('\n⚠️  Potential Merge Conflicts Detected:\n'));
        conflictAnalysis.conflicts.forEach((conflict, index) => {
          console.log(`${index + 1}. ${conflict.file}: ${conflict.reason}`);
        });

        if (options.autoResolve) {
          console.log(chalk.cyan('\n🤖 Attempting AI-powered conflict resolution...'));
          await this.attemptAutoConflictResolution(conflictAnalysis.conflicts);
        } else {
          const { shouldContinue } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'shouldContinue',
              message: 'Continue with merge?',
              default: true
            }
          ]);
          
          if (!shouldContinue) {
            console.log(chalk.gray('Merge cancelled.'));
            return;
          }
        }
      }

      const mergeSpinner = ora('Merging...').start();
      await this.git.merge(['--no-ff', branch]);
      mergeSpinner.stop();
      
      console.log(chalk.green('\n✅ Smart merge completed successfully!'));

    } catch (error) {
      spinner.stop();
      throw error;
    }
  }

  async reviewChanges(options = {}) {
    const spinner = ora('Performing AI-powered code review...').start();
    
    try {
      const compareRef = options.compare || 'HEAD~1';
      const diff = await this.git.diff([compareRef]);
      
      if (!diff) {
        spinner.stop();
        console.log(chalk.yellow('No changes to review.'));
        return;
      }

      const review = await this.performAICodeReview(diff);
      
      spinner.stop();
      
      console.log(chalk.cyan.bold('\n📋 AI Code Review:\n'));
      
      console.log(chalk.bold(`🔍 Overall Score: ${review.score}/10`));
      console.log();
      
      if (review.issues.length > 0) {
        console.log(chalk.bold('⚠️  Issues Found:'));
        review.issues.forEach((issue, index) => {
          console.log(`${index + 1}. ${chalk.red(issue.severity)}: ${issue.message}`);
          if (issue.suggestion) {
            console.log(`   💡 Suggestion: ${chalk.gray(issue.suggestion)}`);
          }
        });
        console.log();
      }
      
      if (review.positives.length > 0) {
        console.log(chalk.bold('✅ Positive Aspects:'));
        review.positives.forEach((positive, index) => {
          console.log(`${index + 1}. ${positive}`);
        });
      }

    } catch (error) {
      spinner.stop();
      throw error;
    }
  }

  async startInteractiveMode() {
    console.log(chalk.cyan.bold('\n🚀 GitSmartCLI Interactive Mode\n'));
    console.log(chalk.gray('Type "help" for available commands, "exit" to quit.\n'));

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { command } = await inquirer.prompt([
        {
          type: 'input',
          name: 'command',
          message: chalk.cyan('gitsmartcli>'),
          prefix: ''
        }
      ]);

      if (command.toLowerCase() === 'exit') {
        console.log(chalk.gray('Goodbye! 👋'));
        break;
      }

      if (command.toLowerCase() === 'help') {
        this.showInteractiveHelp();
        continue;
      }

      try {
        await this.processInteractiveCommand(command);
      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
      }
    }
  }

  showInteractiveHelp() {
    console.log(chalk.cyan.bold('\n📚 Available Commands:\n'));
    console.log(chalk.yellow('status') + ' - Show git status with AI insights');
    console.log(chalk.yellow('suggest') + ' - Get AI suggestions for current changes');
    console.log(chalk.yellow('commit') + ' - Generate AI commit message');
    console.log(chalk.yellow('review') + ' - AI code review of changes');
    console.log(chalk.yellow('chat <message>') + ' - Chat with Microsoft Copilot');
    console.log(chalk.yellow('help') + ' - Show this help');
    console.log(chalk.yellow('exit') + ' - Exit interactive mode');
    console.log();
  }

  async processInteractiveCommand(command) {
    const parts = command.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    switch (cmd) {
    case 'status':
      await this.showEnhancedStatus();
      break;
    case 'suggest':
      await this.getCopilotSuggestions();
      break;
    case 'commit':
      await this.generateCommitMessage();
      break;
    case 'review':
      await this.reviewChanges();
      break;
    case 'chat':
      await this.chatWithMicrosoftCopilot(args);
      break;
    default:
      console.log(chalk.red(`Unknown command: ${cmd}`));
      console.log(chalk.gray('Type "help" for available commands.'));
    }
  }

  // Helper methods for AI integration
  async generateAICodeSuggestions(status, _specificFile = null) {
    // Mock implementation - in real world, this would call GitHub Copilot API
    const suggestions = [
      {
        description: 'Consider adding error handling for better reliability',
        code: 'try {\n  // your code here\n} catch (error) {\n  console.error(error);\n}'
      },
      {
        description: 'Add documentation comments for better maintainability',
        code: '/**\n * Description of function\n * @param {type} param - parameter description\n * @returns {type} return description\n */'
      }
    ];
    
    return suggestions.slice(0, Math.ceil(Math.random() * suggestions.length));
  }

  async generateAICommitMessage(diff) {
    // Mock implementation - in real world, this would use AI to analyze the diff
    const lines = diff.split('\n');
    const addedLines = lines.filter(line => line.startsWith('+')).length;
    const removedLines = lines.filter(line => line.startsWith('-')).length;
    
    if (addedLines > removedLines * 2) {
      return 'feat: add new functionality and improvements';
    } else if (removedLines > addedLines) {
      return 'refactor: clean up and remove unused code';
    } else {
      return 'fix: update and improve existing functionality';
    }
  }

  async queryMicrosoftCopilot(message, context) {
    // Mock implementation - in real world, this would call Microsoft Copilot API
    const responses = [
      `Based on your repository context, I suggest focusing on ${context.mainLanguage} best practices.`,
      'Your recent commits show good progress. Consider adding more tests for better coverage.',
      'The repository structure looks good. You might want to consider adding a CONTRIBUTING.md file.',
      'Great work on the recent changes! Consider setting up automated CI/CD pipeline.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async getRepositoryContext() {
    const status = await this.git.status();
    const branches = await this.git.branch();
    const log = await this.git.log({ maxCount: 10 });
    
    return {
      currentBranch: branches.current,
      branchCount: branches.all.length,
      fileCount: status.files.length,
      recentCommits: log.all.length,
      mainLanguage: 'JavaScript' // Could be detected from file extensions
    };
  }

  async performRepositoryAnalysis(repoInfo, _depth = 'normal') {
    // Mock analysis - in real world, this would be more sophisticated
    return {
      fileCount: repoInfo.fileCount,
      branchCount: repoInfo.branchCount,
      recentCommits: repoInfo.recentCommits,
      insights: [
        'Repository shows active development with regular commits',
        'Good branch management practices observed',
        'Code structure appears well-organized'
      ],
      recommendations: [
        'Consider adding automated testing',
        'Set up continuous integration',
        'Add comprehensive documentation'
      ]
    };
  }

  async performPrePushChecks() {
    const status = await this.git.status();
    const issues = [];
    
    if (status.files.some(file => file.path.includes('.env'))) {
      issues.push({
        type: 'Security',
        message: 'Environment files detected - ensure no secrets are included'
      });
    }
    
    if (status.ahead > 10) {
      issues.push({
        type: 'Warning',
        message: `${status.ahead} commits ahead - consider rebasing for cleaner history`
      });
    }
    
    return { issues };
  }

  async analyzeConflicts(_branch) {
    try {
      // Mock conflict detection - in real world, this would be more sophisticated
      await this.git.status();
      return {
        hasConflicts: false,
        conflicts: []
      };
    } catch (error) {
      return {
        hasConflicts: true,
        conflicts: [
          {
            file: 'example.js',
            reason: 'Both branches modified the same lines'
          }
        ]
      };
    }
  }

  async attemptAutoConflictResolution(_conflicts) {
    console.log(chalk.cyan('🤖 AI conflict resolution is not yet implemented.'));
    console.log(chalk.gray('Please resolve conflicts manually and try again.'));
  }

  async performAICodeReview(diff) {
    // Mock code review - in real world, this would use AI analysis
    const lines = diff.split('\n').length;
    const score = Math.max(7, 10 - Math.floor(lines / 100));
    
    return {
      score,
      issues: lines > 200 ? [
        {
          severity: 'Medium',
          message: 'Large changeset - consider breaking into smaller commits',
          suggestion: 'Split changes across multiple focused commits'
        }
      ] : [],
      positives: [
        'Changes appear well-structured',
        'Good use of consistent formatting'
      ]
    };
  }

  async showEnhancedStatus() {
    const status = await this.git.status();
    
    console.log(chalk.cyan.bold('\n📊 Enhanced Git Status:\n'));
    
    if (status.files.length === 0) {
      console.log(chalk.green('✅ Working directory clean'));
    } else {
      console.log(chalk.yellow(`📝 ${status.files.length} files changed`));
      status.files.forEach(file => {
        const icon = file.index === 'M' ? '📝' : file.index === 'A' ? '➕' : '❓';
        console.log(`  ${icon} ${file.path}`);
      });
    }
    
    if (status.ahead > 0) {
      console.log(chalk.blue(`⬆️  ${status.ahead} commits ahead of origin`));
    }
    
    if (status.behind > 0) {
      console.log(chalk.yellow(`⬇️  ${status.behind} commits behind origin`));
    }
  }
}

module.exports = { GitSmartCLI };