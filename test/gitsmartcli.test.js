const { GitSmartCLI } = require('../src/gitsmartcli');

describe('GitSmartCLI', () => {
  let gitSmart;

  beforeEach(() => {
    gitSmart = new GitSmartCLI();
  });

  test('should initialize GitSmartCLI instance', () => {
    expect(gitSmart).toBeInstanceOf(GitSmartCLI);
    expect(gitSmart.config).toBeDefined();
  });

  test('should have default configuration', async () => {
    // Wait for config to load
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(gitSmart.config).toBeDefined();
    expect(typeof gitSmart.config).toBe('object');
    
    // Check that config has expected structure (may be empty initially)
    if (gitSmart.config.preferences) {
      expect(gitSmart.config.preferences).toHaveProperty('autoCommit');
      expect(gitSmart.config.preferences).toHaveProperty('verboseOutput');
      expect(gitSmart.config.preferences).toHaveProperty('defaultBranch');
    }
  });

  test('should generate AI commit message from diff', async () => {
    const mockDiff = `
diff --git a/test.js b/test.js
index 1234567..abcdefg 100644
--- a/test.js
+++ b/test.js
@@ -1,3 +1,6 @@
 const test = 'hello';
+const newFeature = 'world';
+
+function newFunction() {
+  return 'test';
+}
`;
    const commitMessage = await gitSmart.generateAICommitMessage(mockDiff);
    expect(commitMessage).toBeTruthy();
    expect(typeof commitMessage).toBe('string');
    expect(commitMessage.length).toBeGreaterThan(0);
  });

  test('should generate AI code suggestions', async () => {
    const mockStatus = {
      files: [
        { path: 'test.js', index: 'M' }
      ]
    };
    
    const suggestions = await gitSmart.generateAICodeSuggestions(mockStatus);
    expect(Array.isArray(suggestions)).toBe(true);
    expect(suggestions.length).toBeGreaterThan(0);
    
    if (suggestions.length > 0) {
      expect(suggestions[0]).toHaveProperty('description');
      expect(suggestions[0]).toHaveProperty('code');
    }
  });

  test('should perform repository analysis', async () => {
    const mockRepoInfo = {
      currentBranch: 'main',
      branchCount: 2,
      fileCount: 5,
      recentCommits: 10,
      mainLanguage: 'JavaScript'
    };

    const analysis = await gitSmart.performRepositoryAnalysis(mockRepoInfo);
    expect(analysis).toHaveProperty('fileCount');
    expect(analysis).toHaveProperty('branchCount');
    expect(analysis).toHaveProperty('insights');
    expect(analysis).toHaveProperty('recommendations');
    expect(Array.isArray(analysis.insights)).toBe(true);
    expect(Array.isArray(analysis.recommendations)).toBe(true);
  });

  test('should perform AI code review', async () => {
    const mockDiff = `
diff --git a/test.js b/test.js
index 1234567..abcdefg 100644
--- a/test.js
+++ b/test.js
@@ -1,5 +1,10 @@
 const test = 'hello';
+const newVar = 'world';
`;

    const review = await gitSmart.performAICodeReview(mockDiff);
    expect(review).toHaveProperty('score');
    expect(review).toHaveProperty('issues');
    expect(review).toHaveProperty('positives');
    expect(typeof review.score).toBe('number');
    expect(review.score).toBeGreaterThanOrEqual(0);
    expect(review.score).toBeLessThanOrEqual(10);
    expect(Array.isArray(review.issues)).toBe(true);
    expect(Array.isArray(review.positives)).toBe(true);
  });

  test('should perform pre-push checks', async () => {
    const checks = await gitSmart.performPrePushChecks();
    expect(checks).toHaveProperty('issues');
    expect(Array.isArray(checks.issues)).toBe(true);
  });

  test('should analyze conflicts', async () => {
    const analysis = await gitSmart.analyzeConflicts('feature-branch');
    expect(analysis).toHaveProperty('hasConflicts');
    expect(analysis).toHaveProperty('conflicts');
    expect(typeof analysis.hasConflicts).toBe('boolean');
    expect(Array.isArray(analysis.conflicts)).toBe(true);
  });
});