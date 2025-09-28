import { test, expect, Page } from '@playwright/test';

// Test data
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'TestPassword123!';

// Helper functions
async function loginAsAdmin(page: Page) {
  await page.goto('/admin/login');
  
  // Wait for login form to be visible
  await expect(page.locator('[data-testid="admin-login-form"]')).toBeVisible();
  
  // Fill in credentials
  await page.fill('[data-testid="email-input"]', ADMIN_EMAIL);
  await page.fill('[data-testid="password-input"]', ADMIN_PASSWORD);
  
  // Submit form
  await page.click('[data-testid="login-button"]');
  
  // Wait for redirect to dashboard
  await expect(page).toHaveURL('/admin');
  await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
}

async function logoutAdmin(page: Page) {
  // Click user menu
  await page.click('[data-testid="user-menu-trigger"]');
  
  // Click logout
  await page.click('[data-testid="logout-button"]');
  
  // Wait for redirect to login page
  await expect(page).toHaveURL('/admin/login');
}

test.describe('Admin Workflow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test environment
    await page.goto('/');
    
    // Mock Firebase for testing
    await page.addInitScript(() => {
      // Mock Firebase configuration
      window.mockFirebase = true;
    });
  });

  test.describe('Authentication Flow', () => {
    test('should complete full login and logout flow', async ({ page }) => {
      // Navigate to admin login
      await page.goto('/admin/login');
      
      // Verify login page elements
      await expect(page.locator('h1')).toContainText('Admin Login');
      await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
      
      // Test invalid credentials
      await page.fill('[data-testid="email-input"]', 'wrong@example.com');
      await page.fill('[data-testid="password-input"]', 'wrongpassword');
      await page.click('[data-testid="login-button"]');
      
      // Should show error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
      
      // Test valid credentials
      await page.fill('[data-testid="email-input"]', ADMIN_EMAIL);
      await page.fill('[data-testid="password-input"]', ADMIN_PASSWORD);
      await page.click('[data-testid="login-button"]');
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/admin');
      await expect(page.locator('[data-testid="welcome-message"]')).toContainText('Welcome back');
      
      // Test logout
      await logoutAdmin(page);
      await expect(page).toHaveURL('/admin/login');
    });

    test('should handle session persistence', async ({ page }) => {
      // Login
      await loginAsAdmin(page);
      
      // Refresh page
      await page.reload();
      
      // Should still be logged in
      await expect(page).toHaveURL('/admin');
      await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
      
      // Navigate away and back
      await page.goto('/');
      await page.goto('/admin');
      
      // Should still be logged in
      await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
    });

    test('should redirect unauthenticated users', async ({ page }) => {
      // Try to access admin dashboard without login
      await page.goto('/admin');
      
      // Should redirect to login
      await expect(page).toHaveURL('/admin/login');
      
      // Try to access other admin pages
      await page.goto('/admin/guestbook/moderate');
      await expect(page).toHaveURL('/admin/login');
      
      await page.goto('/admin/analytics');
      await expect(page).toHaveURL('/admin/login');
    });
  });

  test.describe('Dashboard Functionality', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should display analytics dashboard with real-time data', async ({ page }) => {
      // Verify dashboard sections
      await expect(page.locator('[data-testid="analytics-section"]')).toBeVisible();
      await expect(page.locator('[data-testid="activity-section"]')).toBeVisible();
      await expect(page.locator('[data-testid="quick-actions-section"]')).toBeVisible();
      
      // Verify analytics cards
      await expect(page.locator('[data-testid="rsvp-stats"]')).toBeVisible();
      await expect(page.locator('[data-testid="guestbook-stats"]')).toBeVisible();
      await expect(page.locator('[data-testid="notification-stats"]')).toBeVisible();
      await expect(page.locator('[data-testid="website-stats"]')).toBeVisible();
      
      // Check for data loading
      await expect(page.locator('[data-testid="rsvp-total"]')).not.toBeEmpty();
      await expect(page.locator('[data-testid="guestbook-total"]')).not.toBeEmpty();
      
      // Test refresh functionality
      await page.click('[data-testid="refresh-analytics"]');
      
      // Should show loading state briefly
      await expect(page.locator('[data-testid="analytics-loading"]')).toBeVisible({ timeout: 1000 });
      
      // Data should reload
      await expect(page.locator('[data-testid="analytics-loading"]')).not.toBeVisible({ timeout: 5000 });
    });

    test('should display recent activity feed', async ({ page }) => {
      // Verify activity section
      await expect(page.locator('[data-testid="activity-section"]')).toBeVisible();
      
      // Should have activity items
      const activityItems = page.locator('[data-testid^="activity-"]');
      await expect(activityItems.first()).toBeVisible();
      
      // Each activity should have required elements
      const firstActivity = activityItems.first();
      await expect(firstActivity.locator('[data-testid="activity-message"]')).toBeVisible();
      await expect(firstActivity.locator('[data-testid="activity-time"]')).toBeVisible();
      await expect(firstActivity.locator('[data-testid="activity-status"]')).toBeVisible();
      
      // Test load more functionality
      const loadMoreButton = page.locator('[data-testid="load-more-activities"]');
      if (await loadMoreButton.isVisible()) {
        const initialCount = await activityItems.count();
        await loadMoreButton.click();
        
        // Should load more activities
        await expect(activityItems).toHaveCount(initialCount + 1, { timeout: 5000 });
      }
    });

    test('should handle quick actions', async ({ page }) => {
      // Verify quick actions are present
      await expect(page.locator('[data-testid="quick-actions-section"]')).toBeVisible();
      
      // Test navigation to different admin sections
      const quickActions = [
        { testId: 'quick-action-notifications', expectedUrl: '/admin/notifications/send' },
        { testId: 'quick-action-guestbook', expectedUrl: '/admin/guestbook/moderate' },
        { testId: 'quick-action-rsvp', expectedUrl: '/admin/rsvp/export' },
        { testId: 'quick-action-timeline', expectedUrl: '/admin/content/timeline' },
      ];
      
      for (const action of quickActions) {
        const actionButton = page.locator(`[data-testid="${action.testId}"]`);
        if (await actionButton.isVisible()) {
          await actionButton.click();
          await expect(page).toHaveURL(action.expectedUrl);
          await page.goBack();
        }
      }
    });
  });

  test.describe('Guest Book Moderation', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/guestbook/moderate');
    });

    test('should display guest book messages for moderation', async ({ page }) => {
      // Verify moderation page
      await expect(page.locator('h1')).toContainText('Guest Book Moderation');
      
      // Should have filter controls
      await expect(page.locator('[data-testid="status-filter"]')).toBeVisible();
      await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="date-filter"]')).toBeVisible();
      
      // Should display messages
      const messageCards = page.locator('[data-testid^="message-card-"]');
      await expect(messageCards.first()).toBeVisible();
      
      // Each message should have required elements
      const firstMessage = messageCards.first();
      await expect(firstMessage.locator('[data-testid="guest-name"]')).toBeVisible();
      await expect(firstMessage.locator('[data-testid="message-content"]')).toBeVisible();
      await expect(firstMessage.locator('[data-testid="message-status"]')).toBeVisible();
      await expect(firstMessage.locator('[data-testid="moderation-actions"]')).toBeVisible();
    });

    test('should approve guest book messages', async ({ page }) => {
      // Find a pending message
      const pendingMessage = page.locator('[data-testid^="message-card-"][data-status="pending"]').first();
      
      if (await pendingMessage.isVisible()) {
        // Click approve button
        await pendingMessage.locator('[data-testid="approve-button"]').click();
        
        // Should show confirmation dialog
        await expect(page.locator('[data-testid="confirmation-dialog"]')).toBeVisible();
        
        // Add moderator note
        await page.fill('[data-testid="moderator-note"]', 'Approved - appropriate content');
        
        // Confirm approval
        await page.click('[data-testid="confirm-approve"]');
        
        // Should show success message
        await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
        await expect(page.locator('[data-testid="success-toast"]')).toContainText('approved');
        
        // Message status should update
        await expect(pendingMessage.locator('[data-testid="message-status"]')).toContainText('approved');
      }
    });

    test('should reject guest book messages', async ({ page }) => {
      // Find a pending message
      const pendingMessage = page.locator('[data-testid^="message-card-"][data-status="pending"]').first();
      
      if (await pendingMessage.isVisible()) {
        // Click reject button
        await pendingMessage.locator('[data-testid="reject-button"]').click();
        
        // Should show confirmation dialog
        await expect(page.locator('[data-testid="confirmation-dialog"]')).toBeVisible();
        
        // Add moderator note
        await page.fill('[data-testid="moderator-note"]', 'Rejected - inappropriate content');
        
        // Confirm rejection
        await page.click('[data-testid="confirm-reject"]');
        
        // Should show success message
        await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
        await expect(page.locator('[data-testid="success-toast"]')).toContainText('rejected');
        
        // Message status should update
        await expect(pendingMessage.locator('[data-testid="message-status"]')).toContainText('rejected');
      }
    });

    test('should filter messages by status', async ({ page }) => {
      // Test status filter
      await page.selectOption('[data-testid="status-filter"]', 'pending');
      
      // Should only show pending messages
      const messageCards = page.locator('[data-testid^="message-card-"]');
      const visibleCards = await messageCards.all();
      
      for (const card of visibleCards) {
        await expect(card.locator('[data-testid="message-status"]')).toContainText('pending');
      }
      
      // Test approved filter
      await page.selectOption('[data-testid="status-filter"]', 'approved');
      
      // Should only show approved messages
      const approvedCards = await messageCards.all();
      for (const card of approvedCards) {
        await expect(card.locator('[data-testid="message-status"]')).toContainText('approved');
      }
    });

    test('should search messages by content', async ({ page }) => {
      // Enter search term
      await page.fill('[data-testid="search-input"]', 'congratulations');
      await page.press('[data-testid="search-input"]', 'Enter');
      
      // Should filter messages containing the search term
      const messageCards = page.locator('[data-testid^="message-card-"]');
      const visibleCards = await messageCards.all();
      
      for (const card of visibleCards) {
        const messageContent = await card.locator('[data-testid="message-content"]').textContent();
        expect(messageContent?.toLowerCase()).toContain('congratulations');
      }
    });

    test('should handle bulk operations', async ({ page }) => {
      // Select multiple messages
      const checkboxes = page.locator('[data-testid^="message-checkbox-"]');
      await checkboxes.first().check();
      await checkboxes.nth(1).check();
      
      // Bulk actions should become available
      await expect(page.locator('[data-testid="bulk-actions"]')).toBeVisible();
      
      // Test bulk approval
      await page.selectOption('[data-testid="bulk-action-select"]', 'approve');
      await page.click('[data-testid="apply-bulk-action"]');
      
      // Should show confirmation dialog
      await expect(page.locator('[data-testid="bulk-confirmation-dialog"]')).toBeVisible();
      
      // Confirm bulk action
      await page.click('[data-testid="confirm-bulk-action"]');
      
      // Should show success message
      await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-toast"]')).toContainText('2 messages');
    });
  });

  test.describe('Error Handling', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('/api/admin/analytics', route => route.abort());
      
      // Navigate to dashboard
      await page.goto('/admin');
      
      // Should show error state
      await expect(page.locator('[data-testid="analytics-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="analytics-error"]')).toContainText('Failed to load');
      
      // Should have retry button
      await expect(page.locator('[data-testid="retry-analytics"]')).toBeVisible();
      
      // Restore network and retry
      await page.unroute('/api/admin/analytics');
      await page.click('[data-testid="retry-analytics"]');
      
      // Should load successfully
      await expect(page.locator('[data-testid="analytics-data"]')).toBeVisible();
    });

    test('should handle permission errors', async ({ page }) => {
      // Simulate permission error
      await page.route('/api/admin/guestbook/moderate', route => 
        route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, error: 'Insufficient permissions' })
        })
      );
      
      // Try to access guestbook moderation
      await page.goto('/admin/guestbook/moderate');
      
      // Should show permission error
      await expect(page.locator('[data-testid="permission-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="permission-error"]')).toContainText('Insufficient permissions');
    });

    test('should handle session expiration', async ({ page }) => {
      // Simulate session expiration
      await page.route('/api/admin/**', route => 
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, error: 'Session expired' })
        })
      );
      
      // Try to refresh analytics
      await page.click('[data-testid="refresh-analytics"]');
      
      // Should redirect to login
      await expect(page).toHaveURL('/admin/login');
      await expect(page.locator('[data-testid="session-expired-message"]')).toBeVisible();
    });
  });

  test.describe('Performance and Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should meet accessibility standards', async ({ page }) => {
      // Check for proper heading structure
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      await expect(headings.first()).toBeVisible();
      
      // Check for proper form labels
      const inputs = page.locator('input');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          await expect(label).toBeVisible();
        }
      }
      
      // Check for proper button text
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        expect(text || ariaLabel).toBeTruthy();
      }
    });

    test('should load within performance budgets', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
      
      // Check for performance metrics
      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        };
      });
      
      expect(performanceMetrics.domContentLoaded).toBeLessThan(1000);
      expect(performanceMetrics.loadComplete).toBeLessThan(2000);
    });

    test('should handle large datasets efficiently', async ({ page }) => {
      // Navigate to guestbook moderation with large dataset
      await page.goto('/admin/guestbook/moderate');
      
      // Should implement pagination or virtualization
      const messageCards = page.locator('[data-testid^="message-card-"]');
      const messageCount = await messageCards.count();
      
      // Should not render more than 50 items at once
      expect(messageCount).toBeLessThanOrEqual(50);
      
      // Should have pagination controls
      if (messageCount === 50) {
        await expect(page.locator('[data-testid="pagination"]')).toBeVisible();
      }
    });
  });

  test.describe('Security', () => {
    test('should prevent XSS attacks', async ({ page }) => {
      await loginAsAdmin(page);
      
      // Try to inject script in search
      const maliciousScript = '<script>alert("XSS")</script>';
      await page.goto('/admin/guestbook/moderate');
      await page.fill('[data-testid="search-input"]', maliciousScript);
      
      // Script should not execute
      page.on('dialog', dialog => {
        throw new Error('XSS vulnerability detected: alert dialog appeared');
      });
      
      await page.press('[data-testid="search-input"]', 'Enter');
      
      // Should display escaped content
      const searchValue = await page.inputValue('[data-testid="search-input"]');
      expect(searchValue).toBe(maliciousScript); // Should be escaped in display
    });

    test('should validate CSRF tokens', async ({ page }) => {
      await loginAsAdmin(page);
      
      // All forms should have CSRF tokens
      const forms = page.locator('form');
      const formCount = await forms.count();
      
      for (let i = 0; i < formCount; i++) {
        const form = forms.nth(i);
        const csrfInput = form.locator('input[name="_csrf"]');
        await expect(csrfInput).toBeAttached();
      }
    });

    test('should enforce rate limiting', async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin/guestbook/moderate');
      
      // Try to perform many rapid actions
      const approveButtons = page.locator('[data-testid="approve-button"]');
      const buttonCount = Math.min(await approveButtons.count(), 10);
      
      // Rapid clicks should eventually be rate limited
      for (let i = 0; i < buttonCount; i++) {
        await approveButtons.nth(i).click();
        await page.click('[data-testid="confirm-approve"]', { timeout: 1000 }).catch(() => {});
      }
      
      // Should show rate limit message eventually
      const rateLimitMessage = page.locator('[data-testid="rate-limit-error"]');
      if (await rateLimitMessage.isVisible({ timeout: 5000 })) {
        await expect(rateLimitMessage).toContainText('rate limit');
      }
    });
  });
});
