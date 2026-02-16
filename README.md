# 📱 TaskFlow - Progressive Web App

<div align="center">
  <img src="icon-512.png" alt="TaskFlow Icon" width="150" height="150">
  
  **Your Junior College Companion for Staying Organized**
  
  ![PWA](https://img.shields.io/badge/PWA-Enabled-success)
  ![License](https://img.shields.io/badge/License-MIT-blue)
  ![React](https://img.shields.io/badge/React-18-61dafb)
</div>

## 🎯 About

TaskFlow is a Progressive Web App designed specifically for junior college students to manage their coursework, deadlines, and tutorial links. Built with React and optimized for mobile devices, it provides a native app-like experience without requiring app store downloads.

## ✨ Features

### 📚 Core Functionality
- **Subject Organization** - Color-coded subjects with unique identifiers
- **Task Management** - Add tasks with titles, due dates, and multiple tutorial links
- **Smart Reminders** - Visual indicators for tasks due in 3 days, 1 day, or overdue
- **Completion Tracking** - Mark tasks as complete/incomplete with visual feedback

### 📅 Calendar View
- **Monthly Calendar** - Visual overview of all your tasks
- **Color-Coded Days** - Red (5+ tasks), Yellow (3-4 tasks), Green (1-2 tasks)
- **Date Details** - Click any date to see all tasks due that day
- **Quick Navigation** - Previous/Next month buttons

### 🎨 User Experience
- **Color-Coded Subjects** - Each subject gets a unique color (10 color palette)
- **Responsive Design** - Works perfectly on phones, tablets, and desktops
- **Offline Support** - Works without internet after first load
- **Data Persistence** - All your data saves automatically
- **Dark Mode Ready** - Clean yellow theme optimized for readability

### 🔧 Management
- **Edit Subjects** - Delete subjects with confirmation
- **Delete Tasks** - Remove tasks from any view
- **Multiple Links** - Add optional tutorial/lecture links to each task
- **Gmail Integration** - Login system (demo mode included)

## 🚀 Quick Start

### Option 1: Deploy Immediately (Recommended)

1. **Download all files** to a folder
2. **Go to [Vercel](https://vercel.com)**
3. **Drag & drop** your folder
4. **Get your URL** in 30 seconds!

See [QUICK_START.md](QUICK_START.md) for detailed instructions.

### Option 2: Run Locally

```bash
# Serve with any static server
npx serve .

# Or use Python
python -m http.server 8000

# Or use PHP
php -S localhost:8000
```

Visit `http://localhost:8000` in your browser.

**Note:** PWA features (install, offline) only work with HTTPS in production.

## 📦 What's Included

```
taskflow/
├── index.html              # Main HTML with PWA setup
├── task-manager.jsx        # React app component
├── manifest.json           # PWA configuration
├── service-worker.js       # Offline & caching
├── icon-192.png           # App icon (192x192)
├── icon-512.png           # App icon (512x512)
├── DEPLOYMENT_GUIDE.md    # Detailed deployment instructions
├── QUICK_START.md         # 5-minute deployment guide
└── README.md              # This file
```

## 🎨 Screenshots

### Dashboard
- View all upcoming tasks sorted by due date
- Color-coded subject badges
- Visual urgency indicators (overdue, due soon)
- One-click access to tutorial links

### Calendar
- Monthly view with task indicators
- Color-coded days by workload
- Click dates for detailed task view
- Today highlighted with blue ring

### Subjects
- Expandable subject cards
- Color-coded organization
- Edit mode to delete subjects
- Quick task addition

### Completed Tasks
- Separated view for finished work
- Organized by subject
- Option to uncomplete or delete

## 🛠️ Technology Stack

- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Service Workers** - Offline functionality
- **Web Storage API** - Data persistence
- **Web App Manifest** - PWA configuration

## 📱 Installation

### For Users:

**Android (Chrome/Edge):**
1. Visit the app URL
2. Tap "Install" when prompted
3. Or: Menu (⋮) → "Add to Home screen"

**iOS (Safari):**
1. Visit the app URL
2. Tap Share button (□↑)
3. Select "Add to Home Screen"

**Desktop (Chrome/Edge):**
1. Visit the app URL
2. Click install icon (⊕) in address bar
3. Confirm installation

## 🔔 Notifications

The app includes notification support for task reminders:
- Service worker handles push notifications
- Visual indicators for upcoming deadlines
- No external dependencies required

## 🌐 Deployment Platforms

**Recommended:**
- ✅ **Vercel** - Best performance, easiest deployment
- ✅ **Netlify** - Great alternative, drag & drop
- ✅ **Firebase** - Good for future scaling

**Also Works:**
- GitHub Pages
- Cloudflare Pages
- Surge
- Any static hosting with HTTPS

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔒 Privacy & Security

- ✅ All data stored locally on user's device
- ✅ No data sent to external servers
- ✅ No tracking or analytics (unless you add them)
- ✅ HTTPS required for security
- ✅ Works offline - no constant internet needed

## 🎯 Use Cases

Perfect for:
- Junior college students managing coursework
- Anyone tracking assignments with deadlines
- Students needing quick access to tutorial links
- People who want offline task management
- Users preferring PWAs over native apps

## 🚧 Roadmap

**Current Version: 1.0.0**

Potential future enhancements:
- [ ] Push notifications for task reminders
- [ ] Data export/import (backup)
- [ ] Google Calendar integration
- [ ] Study timer feature
- [ ] Grade tracking
- [ ] Dark mode toggle
- [ ] Multiple reminder times per task
- [ ] Recurring tasks
- [ ] Task categories/tags
- [ ] Search functionality

## 🤝 Contributing

This is a student project, but suggestions welcome!

Ideas for improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use, modify, and distribute!

## 🆘 Support

**Common Issues:**

**App won't install?**
- Ensure you're using HTTPS
- Try different browser (Chrome recommended)
- Check service worker registration in DevTools

**Data not saving?**
- Check browser storage isn't full
- Ensure cookies/storage enabled
- Try clearing cache and reload

**Offline mode not working?**
- Visit app once with internet first
- Check service worker is registered
- Verify cache storage in DevTools

**Need more help?**
- Check browser console (F12) for errors
- Review DEPLOYMENT_GUIDE.md
- Test with Chrome Lighthouse for PWA issues

## 👨‍💻 Author

Built by a junior college student who needed a better way to track coursework!

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for beautiful styling
- Lucide for the icon library
- Everyone who gave feedback during development

---

<div align="center">
  
**⭐ Star this project if you find it useful!**

Made with ❤️ for students, by a student

</div>
