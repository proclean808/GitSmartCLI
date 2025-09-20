#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const packageJson = require('../package.json');
const { GitSmartCLI } = require('./gitsmartcli');

program
  .name('gitsmartcli')
  .description('A smart CLI tool that integrates Microsoft Copilot and GitHub Copilot for enhanced Git workflows')
  .version(packageJson.version);

// Initialize GitSmartCLI
const gitSmart = new GitSmartCLI();

// Copilot integration commands
program
  .command('copilot')
  .description('GitHub Copilot integration commands')
  .addCommand(
    program
      .createCommand('suggestions')
      .description('Get GitHub Copilot suggestions for current changes')
      .option('-f, --file <file>', 'specific file to analyze')
      .action(async (options) => {
        try {
          await gitSmart.getCopilotSuggestions(options);
        } catch (error) {
          console.error(chalk.red('Error getting Copilot suggestions:'), error.message);
          process.exit(1);
        }
      })
  )
  .addCommand(
    program
      .createCommand('commit')
      .description('Generate AI-powered commit messages')
      .option('-a, --auto', 'automatically commit with generated message')
      .action(async (options) => {
        try {
          await gitSmart.generateCommitMessage(options);
        } catch (error) {
          console.error(chalk.red('Error generating commit message:'), error.message);
          process.exit(1);
        }
      })
  );

// Microsoft Copilot integration
program
  .command('microsoft')
  .description('Microsoft Copilot integration commands')
  .addCommand(
    program
      .createCommand('chat')
      .description('Chat with Microsoft Copilot about your Git workflow')
      .argument('[message]', 'message to send to Copilot')
      .action(async (message) => {
        try {
          await gitSmart.chatWithMicrosoftCopilot(message);
        } catch (error) {
          console.error(chalk.red('Error chatting with Microsoft Copilot:'), error.message);
          process.exit(1);
        }
      })
  )
  .addCommand(
    program
      .createCommand('analyze')
      .description('Analyze repository with Microsoft Copilot insights')
      .option('-d, --depth <depth>', 'analysis depth (shallow, normal, deep)', 'normal')
      .action(async (options) => {
        try {
          await gitSmart.analyzeWithMicrosoftCopilot(options);
        } catch (error) {
          console.error(chalk.red('Error analyzing with Microsoft Copilot:'), error.message);
          process.exit(1);
        }
      })
  );

// Smart Git commands
program
  .command('smart-push')
  .description('Smart push with AI-powered pre-push checks')
  .option('-f, --force', 'force push after checks')
  .action(async (options) => {
    try {
      await gitSmart.smartPush(options);
    } catch (error) {
      console.error(chalk.red('Error during smart push:'), error.message);
      process.exit(1);
    }
  });

program
  .command('smart-merge')
  .description('Smart merge with AI conflict resolution suggestions')
  .argument('<branch>', 'branch to merge')
  .option('-a, --auto-resolve', 'attempt automatic conflict resolution')
  .action(async (branch, options) => {
    try {
      await gitSmart.smartMerge(branch, options);
    } catch (error) {
      console.error(chalk.red('Error during smart merge:'), error.message);
      process.exit(1);
    }
  });

program
  .command('review')
  .description('AI-powered code review of changes')
  .option('-c, --compare <ref>', 'compare against specific ref (default: HEAD~1)')
  .action(async (options) => {
    try {
      await gitSmart.reviewChanges(options);
    } catch (error) {
      console.error(chalk.red('Error during code review:'), error.message);
      process.exit(1);
    }
  });

// Interactive mode
program
  .command('interactive')
  .alias('i')
  .description('Start interactive mode with AI assistance')
  .action(async () => {
    try {
      await gitSmart.startInteractiveMode();
    } catch (error) {
      console.error(chalk.red('Error in interactive mode:'), error.message);
      process.exit(1);
    }
  });

// Setup and configuration
program
  .command('setup')
  .description('Setup GitSmartCLI with API keys and configuration')
  .action(async () => {
    try {
      await gitSmart.setupConfiguration();
    } catch (error) {
      console.error(chalk.red('Error during setup:'), error.message);
      process.exit(1);
    }
  });

// Welcome message if no command provided
if (process.argv.length <= 2) {
  console.log(chalk.cyan.bold('\n🚀 Welcome to GitSmartCLI!\n'));
  console.log(chalk.gray('A smart CLI tool that integrates Microsoft Copilot and GitHub Copilot'));
  console.log(chalk.gray('for enhanced Git workflows.\n'));
  console.log(chalk.yellow('Run "gitsmartcli --help" to see available commands'));
  console.log(chalk.yellow('Run "gitsmartcli setup" to configure your API keys\n'));
  process.exit(0);
}

program.parse();