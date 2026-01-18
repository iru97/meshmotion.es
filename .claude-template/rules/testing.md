# Testing Rules

## Dev Server Policy

**NEVER start dev servers** (`npm run dev`, `npm start`, etc.) for testing purposes.

When testing functionality:
1. Use **Playwright MCP tools** for browser-based testing
2. Use **unit tests** for logic verification
3. Use **type-check** for TypeScript validation
4. Use **lint** for code quality checks
5. Use **build** to verify production compilation

## Playwright MCP Testing

For UI/integration testing, use the Playwright MCP tools:

```typescript
// Navigate to page
mcp__plugin_playwright_playwright__browser_navigate({ url: "http://localhost:3000" })

// Take snapshot (preferred over screenshot for interactions)
mcp__plugin_playwright_playwright__browser_snapshot()

// Click elements
mcp__plugin_playwright_playwright__browser_click({ element: "description", ref: "ref-from-snapshot" })

// Fill forms
mcp__plugin_playwright_playwright__browser_type({ element: "description", ref: "ref", text: "value" })

// Wait for content
mcp__plugin_playwright_playwright__browser_wait_for({ text: "Expected text" })
```

## Test Verification Checklist

Before considering a feature complete:
- [ ] TypeScript compiles without errors
- [ ] Linter passes
- [ ] Build succeeds (if applicable)
- [ ] Unit tests pass (if tests exist)
- [ ] Manual verification via Playwright if UI changes

## Running Tests

```bash
# Run all tests
{{TEST_COMMAND}}

# Run specific test file
{{TEST_COMMAND}} -- path/to/test.ts

# Run with coverage
{{TEST_COMMAND}} -- --coverage
```
