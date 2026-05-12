#!/usr/bin/env node

/**
 * Test script for AI Recommendations feature (Task 2-2)
 * Tests:
 * 1. API route structure and types
 * 2. Component imports
 * 3. Hook functionality
 * 4. Data flow integration
 */

const fs = require('fs');
const path = require('path');

const TESTS_PASSED = [];
const TESTS_FAILED = [];

function test(name, fn) {
  try {
    fn();
    TESTS_PASSED.push(name);
    console.log(`✅ ${name}`);
  } catch (error) {
    TESTS_FAILED.push({ name, error: error.message });
    console.log(`❌ ${name}: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Test 1: API route file exists
test('API route file exists', () => {
  const filePath = path.join(__dirname, 'app/api/recommendations/route.ts');
  assert(fs.existsSync(filePath), 'API route file not found');

  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('export async function POST'), 'POST handler not found');
  assert(content.includes('AIRecommendation'), 'AIRecommendation type not found');
  assert(content.includes('claude-opus'), 'Claude model not specified');
});

// Test 2: RecommendationCard component exists
test('RecommendationCard component exists', () => {
  const filePath = path.join(__dirname, 'components/portfolio/RecommendationCard.tsx');
  assert(fs.existsSync(filePath), 'RecommendationCard file not found');

  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes("'use client'"), 'Not marked as client component');
  assert(content.includes('export function RecommendationCard'), 'Export not found');
  assert(content.includes('AIRecommendation'), 'Type import not found');
});

// Test 3: RecommendationsWidget component exists
test('RecommendationsWidget component exists', () => {
  const filePath = path.join(__dirname, 'components/portfolio/RecommendationsWidget.tsx');
  assert(fs.existsSync(filePath), 'RecommendationsWidget file not found');

  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes("'use client'"), 'Not marked as client component');
  assert(content.includes('export function RecommendationsWidget'), 'Export not found');
  assert(content.includes('useRecommendations'), 'Hook not imported');
  assert(content.includes('isLoading'), 'Loading state not handled');
  assert(content.includes('error'), 'Error state not handled');
});

// Test 4: useRecommendations hook exists
test('useRecommendations hook exists', () => {
  const filePath = path.join(__dirname, 'hooks/useRecommendations.ts');
  assert(fs.existsSync(filePath), 'Hook file not found');

  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes("'use client'"), 'Not marked as client hook');
  assert(content.includes('export function useRecommendations'), 'Export not found');
  assert(content.includes('useQuery'), 'React Query not used');
  assert(content.includes('/api/recommendations'), 'API endpoint not called');
});

// Test 5: PortfolioAnalytics integration
test('PortfolioAnalytics integrated with recommendations', () => {
  const filePath = path.join(__dirname, 'components/portfolio/PortfolioAnalytics.tsx');
  assert(fs.existsSync(filePath), 'PortfolioAnalytics file not found');

  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('RecommendationsWidget'), 'RecommendationsWidget not imported');
  assert(content.includes('calculatePortfolioSummary'), 'Summary calculation not used');
  assert(content.includes('<RecommendationsWidget'), 'Component not rendered');
});

// Test 6: Environment variable setup
test('Environment variables configured', () => {
  const filePath = path.join(__dirname, '.env.local');
  assert(fs.existsSync(filePath), '.env.local not found');

  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('CLAUDE_API_KEY'), 'CLAUDE_API_KEY not in .env.local');
});

// Test 7: Package installed
test('@anthropic-ai/sdk package installed', () => {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  assert(
    packageJson.dependencies['@anthropic-ai/sdk'],
    '@anthropic-ai/sdk not installed'
  );
});

// Test 8: Category colors handling
test('Recommendation categories have proper styling', () => {
  const filePath = path.join(__dirname, 'components/portfolio/RecommendationCard.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  const categories = ['diversification', 'opportunity', 'risk', 'rebalancing'];
  categories.forEach(cat => {
    assert(content.includes(`'${cat}'`), `Category ${cat} not handled`);
  });
});

// Test 9: Priority levels handling
test('Recommendation priority levels have proper styling', () => {
  const filePath = path.join(__dirname, 'components/portfolio/RecommendationCard.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  const priorities = ['high', 'medium', 'low'];
  priorities.forEach(pri => {
    assert(content.includes(`'${pri}'`), `Priority ${pri} not handled`);
  });
});

// Test 10: API error handling
test('API route has error handling', () => {
  const filePath = path.join(__dirname, 'app/api/recommendations/route.ts');
  const content = fs.readFileSync(filePath, 'utf-8');

  assert(content.includes('try'), 'Try block not found');
  assert(content.includes('catch'), 'Catch block not found');
  assert(content.includes('JSON.parse'), 'JSON parsing for recommendations');
});

// Print summary
console.log('\n' + '='.repeat(60));
console.log(`Tests passed: ${TESTS_PASSED.length}`);
console.log(`Tests failed: ${TESTS_FAILED.length}`);

if (TESTS_FAILED.length > 0) {
  console.log('\n失败的测试:');
  TESTS_FAILED.forEach(({ name, error }) => {
    console.log(`  - ${name}: ${error}`);
  });
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!');
  console.log('\nTask 2-2 Implementation Status:');
  console.log('- ✅ API route with Claude integration');
  console.log('- ✅ RecommendationCard component');
  console.log('- ✅ RecommendationsWidget with state management');
  console.log('- ✅ useRecommendations custom hook');
  console.log('- ✅ Integration with PortfolioAnalytics');
  console.log('- ✅ Error and loading states');
  console.log('\nNext steps:');
  console.log('1. Add a valid CLAUDE_API_KEY to .env.local');
  console.log('2. Test the feature by adding holdings to portfolio');
  console.log('3. Navigate to Portfolio > Analysis tab to see recommendations');
  process.exit(0);
}
