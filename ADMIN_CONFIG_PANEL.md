# 🎨 Admin Configuration Panel - User Guide

## 🎉 What is This?

The Admin Configuration Panel allows you to **edit all website settings through a beautiful UI** instead of editing code files. Changes reflect immediately on your website!

## 🚀 Quick Start

### Access the Admin Panel

1. **Navigate to**: `https://yourwebsite.com/admin/config`
2. **Or from admin dashboard**: Click "Website Configuration"

### Making Changes

1. **Edit any setting** in the UI forms
2. **Click "Save Changes"** button
3. **Refresh your website** to see updates
4. **Done!** ✅

## 📋 What Can You Configure?

### 1. Couple Information
- Bride's name (first name and full name)
- Groom's name (first name and full name)
- Photo paths for both

**Updates:**
- Website title
- Header/navigation
- Footer
- All mentions throughout site

### 2. Wedding Details
- **Wedding Date & Time** 
  - Updates countdown timer
  - Updates daily reveals unlock schedule
  - Updates metadata
  
- **Venue Information**
  - Venue name
  - Full address
  - GPS coordinates (for map)

**Updates:**
- Countdown timer
- Daily reveals (lock/unlock logic)
- Footer
- All page metadata

### 3. Site Settings
- **Website Title** - Browser tab and SEO
- **Description** - Meta description for search engines
- **URL** - Your public website URL

**Updates:**
- SEO metadata
- Social media sharing
- Open Graph tags

### 4. Theme & Style
- **Primary Color** - Main theme color
- **Secondary Color** - Supporting color
- **Accent Color** - Highlight color
- **Theme Style** - Choose from:
  - Romantic (soft pinks, elegant)
  - Celestial (blues, starry night)
  - Modern (clean, minimalist)
  - Classic (traditional, timeless)

**Updates:**
- Color scheme throughout site
- Button colors
- Theme styling

## 🎯 Features

### Save & Load
- **Auto-Save Indicator** - See unsaved changes
- **Save Button** - Save all changes at once
- **Real-time Validation** - Checks for errors

### Import/Export
- **Export Config** - Download as JSON file
- **Import Config** - Upload JSON to restore
- **Backup** - Keep multiple versions

### Preview
- **Open Website** - View changes in new tab
- **Live Preview** - See updates after save

## 📖 Step-by-Step Guide

### Changing Couple Names

1. Go to **"Couple Info"** tab
2. Edit **Bride** section:
   - First Name: `Jane`
   - Full Name: `Jane Marie Smith`
3. Edit **Groom** section:
   - First Name: `John`
   - Full Name: `John Michael Doe`
4. Click **"Save Changes"**
5. Refresh website to see new names everywhere

**Result**: Names update in:
- Browser title
- Header/navigation
- Hero section
- Footer
- All page metadata
- Gallery alt texts

### Changing Wedding Date

1. Go to **"Wedding Details"** tab
2. Click on **"Wedding Date & Time"** field
3. Select your date and time
4. Click **"Save Changes"**

**Result**: Updates:
- Countdown timer (shows correct time remaining)
- Daily reveals (recalculates unlock dates)
- Footer date
- All metadata

### Changing Venue

1. Go to **"Wedding Details"** tab
2. Update **Venue Information**:
   - Name: Your venue name
   - Address: Full address
3. Get coordinates:
   - Open Google Maps
   - Right-click on venue location
   - Click coordinates to copy
   - Paste in Latitude/Longitude fields
4. Click **"Save Changes"**

**Result**: Updates:
- Footer venue info
- Map location
- All venue references

### Changing Colors

1. Go to **"Theme & Style"** tab
2. **Primary Color**: Click color picker or enter hex code
3. **Secondary Color**: Choose supporting color
4. **Accent Color**: Choose highlight color
5. Click **"Save Changes"**
6. Refresh to see new colors

**Result**: New color scheme throughout website

### Changing Theme Style

1. Go to **"Theme & Style"** tab
2. Choose style:
   - **Romantic**: Soft pinks, elegant design
   - **Celestial**: Blues, purples, starry theme
   - **Modern**: Clean lines, minimalist
   - **Classic**: Traditional, timeless
3. Click **"Save Changes"**

**Result**: Theme updates across all pages

## 💾 Import/Export

### Export Configuration

**Use Case**: Backup your settings

1. Click **"Export"** button (top right)
2. File downloads: `wedding-config.json`
3. Save this file safely

**When to Export:**
- Before making major changes
- Regular backups
- Before sharing with others

### Import Configuration

**Use Case**: Restore previous settings

1. Click **"Import"** button
2. Select your `.json` file
3. Review changes
4. Click **"Save Changes"**

**When to Import:**
- Restore from backup
- Use template from another site
- Revert changes

## ⚙️ Technical Details

### Where is Data Stored?

**Firebase Firestore**: `settings/website-config`

Changes are stored in your Firebase database, not in code files.

### How Do Changes Apply?

1. **Admin saves** → Stored in Firebase
2. **Website loads** → Reads from Firebase
3. **Cache**: 1-minute cache for performance
4. **Fallback**: Uses static config if Firebase unavailable

### Caching

- **Duration**: 1 minute
- **Why**: Improves performance
- **Clear**: Automatic after 1 minute

### Fallback Behavior

If Firebase is unavailable:
- Uses static config from `config/website.config.ts`
- Website continues working normally
- Shows message in admin panel

## 🔧 Troubleshooting

### Changes Not Appearing?

**Fix:**
1. Click **"Save Changes"** button
2. **Wait 1-2 seconds** for save to complete
3. **Hard refresh** browser (Ctrl+Shift+R or Cmd+Shift+R)
4. **Wait 1 minute** for cache to clear
5. Try again

### "Failed to save" Error

**Possible Causes:**
- Firebase connection issue
- Invalid data format
- Permission denied

**Fix:**
1. Check internet connection
2. Verify all required fields filled
3. Check Firebase configuration
4. Try exporting and importing config

### Config Not Loading

**Fix:**
1. Check Firebase connection
2. Verify Firebase is initialized
3. Check browser console for errors
4. Try refreshing page

### Colors Not Changing

**Fix:**
1. Save changes
2. Hard refresh browser
3. Clear browser cache
4. Wait 1 minute for cache

### Date Not Updating Countdown

**Fix:**
1. Save date changes
2. Wait 1 minute
3. Hard refresh browser
4. Check date format is correct

## 🎓 Best Practices

### Before Making Changes

1. **Export current config** (backup)
2. **Plan your changes** (write them down)
3. **Test one section** at a time

### Making Changes

1. **Edit one tab** at a time
2. **Save frequently**
3. **Preview after saving**
4. **Document changes** (keep notes)

### After Changes

1. **Test all pages**:
   - Home page
   - Gallery
   - Story
   - Guestbook
2. **Check mobile view**
3. **Verify countdown timer**
4. **Test daily reveals** (if applicable)

## 📊 Change Log

Keep track of your changes:

| Date | Section | Change | By |
|------|---------|--------|-----|
| Dec 9 | Couple Names | Updated to Jane & John | Admin |
| Dec 9 | Wedding Date | Changed to Jun 15, 2025 | Admin |
| Dec 9 | Theme | Changed to Modern style | Admin |

## 🔐 Security Notes

### Access Control

- Admin panel requires authentication
- Only authorized users can access
- Changes are logged

### Data Safety

- All changes backed up in Firebase
- Export regularly for offline backup
- Can revert using import

### Validation

- Form validates all inputs
- Prevents invalid data
- Shows error messages

## 💡 Tips & Tricks

### Quick Updates

- Use **Tab key** to move between fields
- **Ctrl+S** doesn't work (use Save button)
- Color picker for easy color selection

### Batch Updates

1. Make all changes in UI
2. Save once at the end
3. Refresh to see all changes together

### Testing

1. Export current config (backup)
2. Make test changes
3. If unhappy, import backup
4. Try again

### Mobile Editing

- Admin panel works on mobile
- Use landscape mode for better view
- Save frequently (mobile can disconnect)

## 📞 Support

### Need Help?

1. Check this documentation
2. Review error messages
3. Check browser console (F12)
4. Export config and review JSON

### Common Questions

**Q: How often should I save?**
A: After completing each section

**Q: Can I undo changes?**
A: Import a previous export

**Q: Do changes affect live site?**
A: Yes, after save and refresh

**Q: Can multiple admins edit?**
A: Yes, but save conflicts may occur

**Q: How to reset to default?**
A: Use initial config export or edit static files

## ✨ Advanced Usage

### Custom Styling

Edit theme colors for unique look:
1. Use color picker for experimentation
2. Export when you find good combination
3. Share with others

### Multi-Site Management

Use export/import for multiple sites:
1. Export from Site A
2. Modify JSON file
3. Import to Site B

### Version Control

Keep multiple exports:
- `config-v1-romantic.json`
- `config-v2-modern.json`
- `config-final.json`

## 🎉 Conclusion

The Admin Configuration Panel makes it easy to customize your wedding website without touching code!

**Benefits:**
- ✅ No coding required
- ✅ Visual interface
- ✅ Instant updates
- ✅ Safe backups
- ✅ Easy to use

**Perfect for:**
- Non-technical users
- Quick updates
- Testing different styles
- Managing multiple sites

---

**Happy customizing! 💒✨**

*Last updated: December 9, 2025*

