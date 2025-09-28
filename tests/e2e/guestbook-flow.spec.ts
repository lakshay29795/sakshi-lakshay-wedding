import { test, expect } from '@playwright/test';

test.describe('Guest Book Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the guest book page
    await page.goto('/guestbook');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('displays guest book page with sample messages', async ({ page }) => {
    // Check page title and heading
    await expect(page).toHaveTitle(/guest book/i);
    await expect(page.locator('h1')).toContainText('Guest Book');

    // Check that sample messages are displayed
    await expect(page.locator('[data-testid="guest-message"]')).toHaveCount.greaterThan(0);
    
    // Check that message cards contain expected content
    const firstMessage = page.locator('[data-testid="guest-message"]').first();
    await expect(firstMessage).toContainText('Emma Johnson');
    await expect(firstMessage).toContainText('Congratulations');
  });

  test('displays guest book statistics', async ({ page }) => {
    // Check that stats are displayed
    await expect(page.locator('[data-testid="guestbook-stats"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-messages"]')).toContainText('5');
    await expect(page.locator('[data-testid="approved-messages"]')).toContainText('4');
  });

  test('submits a new guest message successfully', async ({ page }) => {
    // Fill out the message form
    await page.fill('[data-testid="sender-name-input"]', 'Test User');
    await page.fill('[data-testid="message-input"]', 'This is a test message for the happy couple! Wishing you both all the best.');

    // Submit the form
    await page.click('[data-testid="submit-message-button"]');

    // Wait for success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Message submitted successfully');

    // Check that form is reset
    await expect(page.locator('[data-testid="sender-name-input"]')).toHaveValue('');
    await expect(page.locator('[data-testid="message-input"]')).toHaveValue('');
  });

  test('validates required fields in message form', async ({ page }) => {
    // Try to submit empty form
    await page.click('[data-testid="submit-message-button"]');

    // Check for validation errors
    await expect(page.locator('[data-testid="name-error"]')).toContainText('Name is required');
    await expect(page.locator('[data-testid="message-error"]')).toContainText('Message is required');
  });

  test('validates message length limits', async ({ page }) => {
    // Fill name
    await page.fill('[data-testid="sender-name-input"]', 'Test User');

    // Fill message that's too short
    await page.fill('[data-testid="message-input"]', 'Hi');
    await page.click('[data-testid="submit-message-button"]');
    await expect(page.locator('[data-testid="message-error"]')).toContainText('Message is too short');

    // Fill message that's too long
    const longMessage = 'a'.repeat(501);
    await page.fill('[data-testid="message-input"]', longMessage);
    await expect(page.locator('[data-testid="character-count"]')).toContainText('501/500');
    await expect(page.locator('[data-testid="character-count"]')).toHaveClass(/text-rose-600/);
  });

  test('displays character count for message input', async ({ page }) => {
    const testMessage = 'This is a test message';
    await page.fill('[data-testid="message-input"]', testMessage);
    
    await expect(page.locator('[data-testid="character-count"]')).toContainText(`${testMessage.length}/500`);
  });

  test('likes and unlikes messages', async ({ page }) => {
    // Find the first message and its like button
    const firstMessage = page.locator('[data-testid="guest-message"]').first();
    const likeButton = firstMessage.locator('[data-testid="like-button"]');
    const likeCount = firstMessage.locator('[data-testid="like-count"]');

    // Get initial like count
    const initialCount = await likeCount.textContent();
    
    // Click like button
    await likeButton.click();
    
    // Wait for like to be processed (in development mode, this is instant)
    await page.waitForTimeout(500);
    
    // Check that like count changed or button state changed
    const likedButton = firstMessage.locator('[data-testid="like-button"][aria-pressed="true"]');
    await expect(likedButton).toBeVisible();
  });

  test('filters messages by status', async ({ page }) => {
    // Check initial approved messages count
    const initialCount = await page.locator('[data-testid="guest-message"]').count();
    expect(initialCount).toBeGreaterThan(0);

    // Filter by pending messages
    await page.selectOption('[data-testid="status-filter"]', 'pending');
    await page.waitForTimeout(500); // Wait for filter to apply

    // Check that only pending messages are shown
    const pendingMessages = page.locator('[data-testid="guest-message"]');
    await expect(pendingMessages).toHaveCount(1);
    await expect(pendingMessages.first()).toContainText('Lisa Thompson');

    // Filter by all messages
    await page.selectOption('[data-testid="status-filter"]', 'all');
    await page.waitForTimeout(500);

    // Check that all messages are shown
    await expect(page.locator('[data-testid="guest-message"]')).toHaveCount(5);
  });

  test('sorts messages by different criteria', async ({ page }) => {
    // Get initial message order (newest first by default)
    const initialFirstMessage = await page.locator('[data-testid="guest-message"]').first().locator('[data-testid="message-author"]').textContent();

    // Sort by oldest first
    await page.selectOption('[data-testid="sort-filter"]', 'oldest');
    await page.waitForTimeout(500);

    const oldestFirstMessage = await page.locator('[data-testid="guest-message"]').first().locator('[data-testid="message-author"]').textContent();
    expect(oldestFirstMessage).toBe('Emma Johnson'); // Oldest sample message

    // Sort by most liked
    await page.selectOption('[data-testid="sort-filter"]', 'mostLiked');
    await page.waitForTimeout(500);

    const mostLikedFirstMessage = await page.locator('[data-testid="guest-message"]').first().locator('[data-testid="message-author"]').textContent();
    expect(mostLikedFirstMessage).toBe('Sarah Williams'); // Has 15 likes in sample data
  });

  test('searches messages by content', async ({ page }) => {
    // Search for specific content
    await page.fill('[data-testid="search-input"]', 'congratulations');
    await page.waitForTimeout(1000); // Wait for debounced search

    // Check that only matching messages are shown
    const searchResults = page.locator('[data-testid="guest-message"]');
    await expect(searchResults).toHaveCount(1);
    await expect(searchResults.first()).toContainText('Emma Johnson');
    await expect(searchResults.first()).toContainText('Congratulations');

    // Clear search
    await page.fill('[data-testid="search-input"]', '');
    await page.waitForTimeout(1000);

    // Check that all approved messages are shown again
    await expect(page.locator('[data-testid="guest-message"]')).toHaveCount(4);
  });

  test('displays highlighted messages with special styling', async ({ page }) => {
    // Find highlighted message (Emma Johnson's message is highlighted in sample data)
    const highlightedMessage = page.locator('[data-testid="guest-message"]').filter({ hasText: 'Emma Johnson' });
    
    // Check for highlighted styling
    await expect(highlightedMessage.locator('[data-testid="featured-badge"]')).toBeVisible();
    await expect(highlightedMessage).toHaveClass(/border-amber-200/);
  });

  test('shows loading states appropriately', async ({ page }) => {
    // Check initial loading state
    await page.goto('/guestbook');
    
    // Should show loading skeleton initially
    await expect(page.locator('[data-testid="loading-skeleton"]')).toBeVisible();
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Loading skeleton should be hidden
    await expect(page.locator('[data-testid="loading-skeleton"]')).not.toBeVisible();
    
    // Messages should be visible
    await expect(page.locator('[data-testid="guest-message"]')).toHaveCount.greaterThan(0);
  });

  test('handles form submission loading state', async ({ page }) => {
    // Fill out form
    await page.fill('[data-testid="sender-name-input"]', 'Test User');
    await page.fill('[data-testid="message-input"]', 'Test message for loading state');

    // Submit form and immediately check loading state
    await page.click('[data-testid="submit-message-button"]');
    
    // Button should show loading state
    await expect(page.locator('[data-testid="submit-message-button"]')).toContainText('Sending');
    await expect(page.locator('[data-testid="submit-message-button"]')).toBeDisabled();
  });

  test('displays proper timestamps for messages', async ({ page }) => {
    // Check that messages have timestamps
    const messageTimestamps = page.locator('[data-testid="message-timestamp"]');
    await expect(messageTimestamps.first()).toBeVisible();
    
    // Should show relative time (e.g., "2 days ago")
    await expect(messageTimestamps.first()).toContainText(/ago$/);
  });

  test('handles responsive design on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that layout adapts to mobile
    await expect(page.locator('[data-testid="guest-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="message-form"]')).toBeVisible();
    
    // Check that filters are still accessible
    await expect(page.locator('[data-testid="status-filter"]')).toBeVisible();
    await expect(page.locator('[data-testid="sort-filter"]')).toBeVisible();
  });

  test('maintains filter state during navigation', async ({ page }) => {
    // Apply filters
    await page.selectOption('[data-testid="status-filter"]', 'pending');
    await page.fill('[data-testid="search-input"]', 'Lisa');
    await page.waitForTimeout(1000);

    // Navigate away and back
    await page.goto('/');
    await page.goto('/guestbook');
    
    // Filters should be reset to defaults
    await expect(page.locator('[data-testid="status-filter"]')).toHaveValue('approved');
    await expect(page.locator('[data-testid="search-input"]')).toHaveValue('');
  });

  test('shows connection status indicator', async ({ page }) => {
    // In development mode, should show connected status
    await expect(page.locator('[data-testid="connection-status"]')).toContainText('Connected');
    
    // Should not show offline indicator
    await expect(page.locator('[data-testid="offline-indicator"]')).not.toBeVisible();
  });
});
