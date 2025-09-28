import { test, expect } from '@playwright/test';

test.describe('RSVP Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rsvp');
  });

  test('completes full RSVP flow for attending guest', async ({ page }) => {
    // Step 1: Basic Information
    await expect(page.getByText('Your Information')).toBeVisible();
    
    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Email/i).fill('john.doe@example.com');
    await page.getByLabel(/Phone/i).fill('+1234567890');
    
    await page.getByRole('button', { name: /continue/i }).click();

    // Step 2: Attendance
    await expect(page.getByText(/Will you be joining us/i)).toBeVisible();
    
    // Default should be attending, click continue
    await page.getByRole('button', { name: /continue/i }).click();

    // Step 3: Guest Details
    await expect(page.getByText(/Who is attending/i)).toBeVisible();
    
    // Primary guest should be pre-filled
    await expect(page.getByText('Your Details (Primary Guest)')).toBeVisible();
    
    // Add an additional guest
    await page.getByRole('button', { name: /Add Another Guest/i }).click();
    
    // Fill guest details
    const guestNameInput = page.locator('input[placeholder="Guest Full Name"]').nth(1);
    await guestNameInput.fill('Jane Doe');
    
    // Select meal preference for additional guest
    await page.locator('select').nth(1).selectOption('vegetarian');
    
    await page.getByRole('button', { name: /continue/i }).click();

    // Step 4: Additional Information
    await expect(page.getByText(/Almost there/i)).toBeVisible();
    
    // Add message
    await page.getByPlaceholder(/Share a message/i).fill('So excited to celebrate with you!');
    
    // Add song request
    await page.getByPlaceholder(/Suggest a song/i).fill('Perfect by Ed Sheeran');
    
    // Check accommodation needed
    await page.getByLabel(/accommodation information/i).check();
    
    // Submit RSVP
    await page.getByRole('button', { name: /Submit RSVP/i }).click();

    // Verify success
    await expect(page.getByText(/Thank you for your RSVP/i)).toBeVisible();
  });

  test('completes RSVP flow for non-attending guest', async ({ page }) => {
    // Step 1: Basic Information
    await page.getByLabel(/Full Name/i).fill('Jane Smith');
    await page.getByLabel(/Email/i).fill('jane.smith@example.com');
    await page.getByRole('button', { name: /continue/i }).click();

    // Step 2: Attendance - Select No
    await expect(page.getByText(/Will you be joining us/i)).toBeVisible();
    await page.getByRole('button', { name: /can't make it/i }).click();
    await page.getByRole('button', { name: /continue/i }).click();

    // Should skip guest details and go to final step
    await expect(page.getByText(/Almost there/i)).toBeVisible();
    
    // Add a message
    await page.getByPlaceholder(/Share a message/i).fill('Sorry I cannot make it, but wishing you both the best!');
    
    // Submit RSVP
    await page.getByRole('button', { name: /Submit RSVP/i }).click();

    // Verify success
    await expect(page.getByText(/Thank you for your RSVP/i)).toBeVisible();
  });

  test('validates form fields correctly', async ({ page }) => {
    // Try to continue without filling required fields
    await page.getByRole('button', { name: /continue/i }).click();

    // Should show validation errors
    await expect(page.getByText(/full name is required/i)).toBeVisible();
    await expect(page.getByText(/Invalid email address/i)).toBeVisible();

    // Fill with invalid email
    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Email/i).fill('invalid-email');
    await page.getByRole('button', { name: /continue/i }).click();

    // Should still show email validation error
    await expect(page.getByText(/Invalid email address/i)).toBeVisible();
  });

  test('allows navigation between steps', async ({ page }) => {
    // Fill step 1
    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Email/i).fill('john@example.com');
    await page.getByRole('button', { name: /continue/i }).click();

    // Go to step 2
    await expect(page.getByText(/Will you be joining us/i)).toBeVisible();
    await page.getByRole('button', { name: /continue/i }).click();

    // Go to step 3
    await expect(page.getByText(/Who is attending/i)).toBeVisible();
    
    // Go back to step 2
    await page.getByRole('button', { name: /previous/i }).click();
    await expect(page.getByText(/Will you be joining us/i)).toBeVisible();
    
    // Go back to step 1
    await page.getByRole('button', { name: /previous/i }).click();
    await expect(page.getByText(/Your Information/i)).toBeVisible();
    
    // Verify data is preserved
    await expect(page.getByLabel(/Full Name/i)).toHaveValue('John Doe');
    await expect(page.getByLabel(/Email/i)).toHaveValue('john@example.com');
  });

  test('handles guest management correctly', async ({ page }) => {
    // Complete steps 1 and 2
    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Email/i).fill('john@example.com');
    await page.getByRole('button', { name: /continue/i }).click();
    await page.getByRole('button', { name: /continue/i }).click();

    // Step 3: Guest Details
    await expect(page.getByText(/Who is attending/i)).toBeVisible();
    
    // Add multiple guests
    await page.getByRole('button', { name: /Add Another Guest/i }).click();
    await page.getByRole('button', { name: /Add Another Guest/i }).click();
    
    // Should have 3 guest cards (primary + 2 additional)
    await expect(page.locator('.wedding-card')).toHaveCount(3);
    
    // Remove one guest
    await page.locator('button[aria-label="Remove Guest"]').first().click();
    
    // Should have 2 guest cards
    await expect(page.locator('.wedding-card')).toHaveCount(2);
  });

  test('shows step indicator correctly', async ({ page }) => {
    // Should show step 1 as active
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('1');
    
    // Complete step 1
    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Email/i).fill('john@example.com');
    await page.getByRole('button', { name: /continue/i }).click();
    
    // Should show step 2 as active
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('2');
    
    // Step 1 should be marked as complete
    await expect(page.locator('[data-testid="step-1"]')).toHaveClass(/completed/);
  });

  test('handles form submission errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('/api/rsvp', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'Server error' }),
      });
    });

    // Complete form
    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Email/i).fill('john@example.com');
    await page.getByRole('button', { name: /continue/i }).click();
    await page.getByRole('button', { name: /continue/i }).click();
    await page.getByRole('button', { name: /continue/i }).click();
    
    // Submit form
    await page.getByRole('button', { name: /Submit RSVP/i }).click();

    // Should show error message
    await expect(page.getByText(/Server error/i)).toBeVisible();
    
    // Form should still be available for retry
    await expect(page.getByRole('button', { name: /Submit RSVP/i })).toBeVisible();
  });

  test('is responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Form should be responsive
    await expect(page.locator('.wedding-card')).toBeVisible();
    
    // Navigation should work on mobile
    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Email/i).fill('john@example.com');
    await page.getByRole('button', { name: /continue/i }).click();
    
    await expect(page.getByText(/Will you be joining us/i)).toBeVisible();
  });

  test('preserves form data during navigation', async ({ page }) => {
    // Fill out multiple steps
    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Email/i).fill('john@example.com');
    await page.getByLabel(/Phone/i).fill('+1234567890');
    await page.getByRole('button', { name: /continue/i }).click();
    
    // Step 2: Select not attending
    await page.getByRole('button', { name: /can't make it/i }).click();
    await page.getByRole('button', { name: /continue/i }).click();
    
    // Step 4: Add message
    await page.getByPlaceholder(/Share a message/i).fill('Test message');
    
    // Navigate back
    await page.getByRole('button', { name: /previous/i }).click();
    await page.getByRole('button', { name: /previous/i }).click();
    
    // Verify data is preserved
    await expect(page.getByLabel(/Full Name/i)).toHaveValue('John Doe');
    await expect(page.getByLabel(/Email/i)).toHaveValue('john@example.com');
    await expect(page.getByLabel(/Phone/i)).toHaveValue('+1234567890');
    
    // Navigate forward and check message is preserved
    await page.getByRole('button', { name: /continue/i }).click();
    await page.getByRole('button', { name: /continue/i }).click();
    
    await expect(page.getByPlaceholder(/Share a message/i)).toHaveValue('Test message');
  });
});
