# 🎯 How to Use the Admin Configuration Panel

## 🚀 Quick Start Guide

### Step 1: Install Dependencies (If Needed)

If you haven't already, ensure `sonner` is installed for toast notifications:

```bash
npm install sonner
```

### Step 2: Start Your Development Server

```bash
npm run dev
```

### Step 3: Access the Admin Panel

Open your browser and navigate to:

```
http://localhost:3000/admin/config
```

Or from the admin dashboard:
- Go to: `http://localhost:3000/admin`
- Click on "Website Configuration" card

---

## 📝 Making Your First Edit

### Example: Change Couple Names

1. **Navigate to Admin Config**
   ```
   http://localhost:3000/admin/config
   ```

2. **Go to "Couple Info" Tab**
   - You'll see forms for Bride and Groom

3. **Edit Bride Information**
   ```
   First Name: Jane
   Full Name: Jane Elizabeth Smith
   Photo Path: /images/couple/bride.jpg
   ```

4. **Edit Groom Information**
   ```
   First Name: John
   Full Name: John Michael Doe
   Photo Path: /images/couple/groom.jpg
   ```

5. **Click "Save Changes"** (top right)
   - You'll see a success message
   - Orange "unsaved changes" banner disappears

6. **Preview Changes**
   - Click "Open Website" button
   - Or open `http://localhost:3000` in new tab
   - **Hard Refresh**: Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

7. **See the Magic!** ✨
   - Names updated in header
   - Names updated in hero section
   - Names updated in footer
   - Names updated in all metadata

---

## 🎨 All Configuration Sections

### 1. Couple Information Tab

**What You Can Edit:**
- Bride's first name
- Bride's full name
- Bride's photo path
- Groom's first name
- Groom's full name
- Groom's photo path

**Where It Updates:**
- Website title (browser tab)
- Header/navigation
- Hero section
- Footer
- All page metadata
- Gallery alt texts
- SEO tags

### 2. Wedding Details Tab

**What You Can Edit:**
- Wedding date and time (datetime picker)
- Venue name
- Full venue address
- GPS coordinates (latitude & longitude)

**Where It Updates:**
- Countdown timer (recalculates)
- Daily reveals (unlock schedule)
- Footer date
- Venue information
- Map location
- All metadata

### 3. Site Settings Tab

**What You Can Edit:**
- Site title
- Site description
- Website URL

**Where It Updates:**
- Browser title
- Meta description
- SEO tags
- Open Graph tags
- Twitter cards
- Social media sharing

### 4. Theme & Style Tab

**What You Can Edit:**
- Primary color (color picker + hex input)
- Secondary color
- Accent color
- Theme style (Romantic, Celestial, Modern, Classic)

**Where It Updates:**
- Entire color scheme
- Button colors
- Background colors
- Text colors
- Theme styling

---

## 💾 Import/Export Features

### Export Configuration

**Use Case**: Backup your current settings

**Steps:**
1. Click **"Export"** button (top right)
2. File downloads: `wedding-config.json`
3. Save this file in a safe place

**Best Practices:**
- Export before making major changes
- Keep version history
- Name files descriptively:
  - `config-backup-2025-12-09.json`
  - `config-romantic-theme.json`
  - `config-final.json`

### Import Configuration

**Use Case**: Restore previous settings or use a template

**Steps:**
1. Click **"Import"** button
2. Select your `.json` file
3. Review changes in the form
4. Click **"Save Changes"** to apply

**Use Cases:**
- Restore from backup
- Try different themes
- Clone config to another site
- Revert unwanted changes

---

## 🎯 Common Tasks

### Task: Update Wedding Date

**Why**: Change countdown timer and daily reveals schedule

**Steps:**
```
1. Go to "Wedding Details" tab
2. Click on date/time picker
3. Select your new date and time
4. Click "Save Changes"
5. Wait 1-2 seconds
6. Hard refresh website (Ctrl+Shift+R)
7. Countdown updates automatically!
```

**Result:**
- ✅ Countdown timer shows correct time
- ✅ Daily reveals recalculate unlock dates
- ✅ Footer shows new date
- ✅ Metadata updates

### Task: Change Theme Colors

**Why**: Match your wedding colors

**Steps:**
```
1. Go to "Theme & Style" tab
2. Click color picker for Primary Color
3. Select your color (or enter hex code)
4. Repeat for Secondary and Accent
5. Click "Save Changes"
6. Hard refresh website
7. See your new colors!
```

**Tips:**
- Use color wheel for complementary colors
- Enter hex codes for exact match
- Test on both light and dark sections

### Task: Switch Theme Style

**Why**: Try different design aesthetics

**Steps:**
```
1. Go to "Theme & Style" tab
2. Click on a theme card:
   - Romantic (pink, elegant)
   - Celestial (blue, starry)
   - Modern (clean, minimal)
   - Classic (traditional)
3. Click "Save Changes"
4. Refresh and see the new style!
```

### Task: Update Venue Information

**Why**: Provide accurate location for guests

**Steps:**
```
1. Go to "Wedding Details" tab
2. Update venue name
3. Update full address
4. Get GPS coordinates:
   - Open Google Maps
   - Find your venue
   - Right-click on location
   - Click coordinates to copy
   - Paste into Lat/Lng fields
5. Click "Save Changes"
```

---

## ⚙️ Advanced Features

### Batch Editing Workflow

**Efficient for multiple changes:**

```
1. Open admin panel
2. Go through ALL tabs
3. Make ALL your changes
4. DON'T save yet
5. Review everything
6. Save ONCE at the end
7. All changes apply together
```

**Benefits:**
- Fewer saves (faster)
- Review before committing
- Test combinations

### Version Management

**Keep multiple versions:**

**Setup:**
```
1. Current config → Export → Save as "v1-original.json"
2. Make changes → Export → Save as "v2-romantic.json"
3. More changes → Export → Save as "v3-celestial.json"
4. Final version → Export → Save as "v-final.json"
```

**Use:**
```
- Want to try v2? Import "v2-romantic.json"
- Want original? Import "v1-original.json"
- Going live? Use "v-final.json"
```

### Multi-Site Management

**Clone config to different sites:**

**Example:**
```
Site A (Couple 1):
1. Export config from Site A
2. Download: couple1-config.json

Site B (Couple 2):
3. Edit couple1-config.json
   - Change names
   - Change dates
   - Update venue
4. Save as: couple2-config.json
5. Import to Site B
6. Click "Save Changes"
7. Site B fully customized!
```

---

## 🐛 Troubleshooting

### Problem: Changes Not Appearing

**Symptoms:**
- Saved successfully
- But website looks the same

**Solutions:**
1. **Hard Refresh Browser**
   ```
   Windows/Linux: Ctrl + Shift + R
   Mac: Cmd + Shift + R
   ```

2. **Wait for Cache**
   - Config is cached for 1 minute
   - Wait 60 seconds
   - Then refresh

3. **Clear Browser Cache**
   ```
   Chrome: Settings → Privacy → Clear browsing data
   Firefox: Options → Privacy → Clear Data
   Safari: Develop → Empty Caches
   ```

4. **Check Console**
   ```
   Press F12
   Look for errors in Console tab
   ```

### Problem: "Failed to Save" Error

**Possible Causes:**
- Firebase not connected
- Invalid data format
- Network issue
- Permission denied

**Solutions:**

1. **Check Firebase Connection**
   ```
   - Verify .env file has correct credentials
   - Check Firebase console is accessible
   - Ensure Firebase is initialized
   ```

2. **Validate Your Data**
   ```
   - All required fields filled?
   - Dates in correct format?
   - Numbers for lat/lng?
   - Valid hex codes for colors?
   ```

3. **Check Network**
   ```
   - Internet connected?
   - Firewall blocking?
   - VPN interfering?
   ```

4. **Review Console Errors**
   ```
   Press F12 → Console tab → Look for red errors
   ```

### Problem: Config Panel Won't Load

**Symptoms:**
- `/admin/config` shows error
- Or blank page

**Solutions:**

1. **Verify URL**
   ```
   Correct: http://localhost:3000/admin/config
   Wrong:   http://localhost:3000/admin-config
   ```

2. **Check Authentication**
   ```
   - Are you logged in as admin?
   - Try logging out and back in
   - Clear session cookies
   ```

3. **Restart Dev Server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   # Try again
   ```

4. **Check Console**
   ```
   F12 → Console → Look for errors
   ```

### Problem: Specific Fields Not Updating

**Example**: Changed colors but they don't apply

**Solutions:**

1. **Check CSS Priority**
   - Some hardcoded styles may override
   - Check browser DevTools → Elements → Styles

2. **Clear All Caches**
   - Hard refresh
   - Clear browser cache
   - Restart dev server

3. **Verify Theme Style**
   - Some themes have fixed colors
   - Try different theme style

---

## 🎓 Best Practices

### Before Making Changes

✅ **Do:**
- Export current config (backup)
- Plan your changes
- Test in development first

❌ **Don't:**
- Make changes on live site without backup
- Edit without planning
- Forget to save

### While Editing

✅ **Do:**
- Edit one section at a time
- Save frequently
- Preview after each major change

❌ **Don't:**
- Edit multiple sections before saving
- Forget to check all tabs
- Rush through changes

### After Saving

✅ **Do:**
- Hard refresh browser
- Test on mobile
- Verify all pages
- Export final config

❌ **Don't:**
- Assume it worked without checking
- Forget to test countdown
- Skip mobile testing

### Production Deployment

✅ **Do:**
- Test everything in development
- Export final config
- Document custom changes
- Keep backup

❌ **Don't:**
- Deploy without testing
- Lose backup files
- Forget environment variables

---

## 📊 Testing Checklist

### After Configuration Changes

Use this checklist to verify everything works:

#### Couple Names
- [ ] Header shows new names
- [ ] Hero section shows new names
- [ ] Footer shows new names
- [ ] Browser title shows new names
- [ ] All metadata updated

#### Wedding Date
- [ ] Countdown timer is accurate
- [ ] Daily reveals unlock correctly
- [ ] Footer date is correct
- [ ] Metadata shows correct date

#### Venue
- [ ] Footer shows venue name
- [ ] Address is correct
- [ ] Map shows correct location
- [ ] Metadata updated

#### Theme
- [ ] Colors applied throughout
- [ ] Buttons use new colors
- [ ] Theme style applied
- [ ] Mobile looks good

#### SEO & Metadata
- [ ] Browser title correct
- [ ] Meta description accurate
- [ ] Open Graph tags working
- [ ] Twitter cards correct

---

## 💡 Pro Tips

### Tip 1: Color Selection
Use a color palette tool:
- [Coolors.co](https://coolors.co)
- [Adobe Color](https://color.adobe.com)
- Match your wedding colors!

### Tip 2: GPS Coordinates
Easy way to get coordinates:
```
1. Google Maps → Find venue
2. Right-click on location
3. First number = Latitude
4. Second number = Longitude
5. Copy to admin panel
```

### Tip 3: Testing Themes
Try all themes before deciding:
```
1. Export current config
2. Try Romantic → Save → Preview
3. Import backup
4. Try Celestial → Save → Preview
5. Import backup
6. Try Modern → Save → Preview
7. Choose favorite!
```

### Tip 4: Keyboard Shortcuts
- **Tab**: Move between fields
- **Enter**: Next field (in forms)
- **Ctrl+S**: (Doesn't save - use button)

### Tip 5: Mobile Testing
Always check on phone:
- Smaller screen
- Different browser
- Touch interactions
- Load times

---

## 🎉 Success Metrics

**You'll know it's working when:**

✅ Changes save without errors
✅ Success toast appears
✅ Orange banner disappears
✅ Website reflects changes (after refresh)
✅ All pages updated
✅ Mobile looks good
✅ Countdown is accurate
✅ Everything feels personalized

---

## 📞 Need Help?

### Resources
1. **Full Documentation**: `ADMIN_CONFIG_PANEL.md`
2. **Quick Start**: `ADMIN_CONFIG_QUICK_START.md`
3. **Technical Details**: `CONFIG_MIGRATION_SUMMARY.md`
4. **General Setup**: `CONFIGURATION_GUIDE.md`

### Debug Steps
1. Check browser console (F12)
2. Review error messages
3. Verify Firebase connection
4. Check environment variables
5. Export and review JSON
6. Compare with working backup

### Common Solutions
- **99% of issues**: Hard refresh browser
- **Cache problems**: Wait 1 minute
- **Save fails**: Check Firebase
- **Fields not updating**: Check console errors

---

## 🎊 You're Ready!

**You now have a powerful admin panel to configure your entire wedding website!**

### What You Can Do:
✅ Edit all couple information
✅ Change wedding date (updates everything)
✅ Update venue details
✅ Customize theme colors
✅ Switch theme styles
✅ Import/Export configurations
✅ Preview changes instantly

### No Coding Required!
Everything is now manageable through the beautiful admin interface!

---

**Access your admin panel**: `http://localhost:3000/admin/config`

**Happy customizing! 💒✨**

*Last Updated: December 9, 2025*


