[README.md](https://github.com/user-attachments/files/29492260/README.md)
# 💉 BabyVax — Newborn Vaccination Scheduler

A free, offline-ready Progressive Web App (PWA) that helps parents track and schedule their baby's vaccinations. No sign-up, no server, no cost — everything runs in the browser.

🔗 **Live App:** [james-003.github.io/babyvaccinationschedule](https://james-003.github.io/babyvaccinationschedule)

---

## ✨ Features

- 📅 **Automatic schedule calculation** — enter your baby's date of birth and get exact vaccination dates instantly
- 🌍 **Multiple country schedules** — supports India (UIP / Anakapalli district), USA (CDC/AAP), UK (NHS), Australia (NIP), Canada (NACI), and WHO generic
- 🔔 **1-day reminder notifications** — get notified the day before every vaccine, even when the app is closed (on Android)
- ✅ **Track completed vaccines** — check off each milestone as it's done
- 📤 **Export to calendar** — download a `.ics` file to add all vaccines to Google Calendar, Apple Calendar, or Outlook
- 📲 **Share via WhatsApp** — one tap to share the full schedule as a text message
- 🖨️ **Print-ready** — clean print layout for keeping a physical copy
- 🌙 **Dark mode** — automatic based on system preference, manually toggleable
- 📵 **Works offline** — fully usable without internet once loaded
- 📱 **Installable as an app** — add to home screen on Android or iOS

---



---

## 🌍 Supported Vaccination Schedules

| Country / Region | Schedule Source |
|---|---|
| Anakapalli District, Andhra Pradesh | India UIP (local PHC guidance) |
| India — National | Universal Immunisation Programme (UIP) |
| United States | CDC / AAP |
| United Kingdom | NHS / UK Health Security Agency |
| Australia | National Immunisation Program (NIP) |
| Canada | NACI (representative — check your province) |
| Other countries | WHO core childhood immunisation schedule |

---

## 🔔 How Notifications Work

When you calculate your baby's schedule, BabyVax saves all vaccination dates locally on your device and asks for notification permission.

| Platform | Background (app closed) | While app is open |
|---|---|---|
| Chrome on Android (PWA installed) | ✅ Yes — daily background check | ✅ Yes |
| Samsung Internet | ✅ Yes | ✅ Yes |
| Chrome on Desktop | ⚠️ Only while browser is running | ✅ Yes |
| Safari / iOS (PWA installed, iOS 16.4+) | ⚠️ Limited | ✅ Yes |
| Firefox | ⚠️ Only while browser is running | ✅ Yes |

**For the best experience on Android:** tap "Add to Home Screen" when prompted, then allow notifications. You'll receive a reminder the day before every vaccine automatically.

---

## 🚀 How to Use

1. Open the app at the link above
2. Enter your baby's **name** and **date of birth**
3. Select your **country / region**
4. Tap **Calculate Schedule**
5. Allow notifications when prompted
6. Done! Your schedule is saved and reminders are set

---

## 🛠️ Tech Stack

This is a **single-file PWA** — the entire app lives in one `index.html` file with no external dependencies or build tools.

- **HTML / CSS / JavaScript** — vanilla, no frameworks
- **Service Worker** — offline caching + background notifications via Periodic Background Sync API
- **IndexedDB** — stores the vaccine schedule locally for background notification access
- **Web Notifications API** — shows reminders
- **ICS format** — calendar export compatible with all major calendar apps
- **Web Share API** — native share sheet on mobile
- **GitHub Pages** — free static hosting

---

## 📁 Project Structure

```
babyvaccinationschedule/
│
└── index.html       # The entire app (HTML + CSS + JS in one file)
└── README.md        # This file
```

---

## 🤝 Contributing

Contributions are welcome! Here are some ways you can help:

- **Add a new country schedule** — open an issue with the official schedule source
- **Report a schedule error** — if a date or vaccine name is wrong, please open an issue
- **Suggest a feature** — open an issue with your idea
- **Fix a bug** — fork the repo, make your change, and open a pull request

---

## ⚠️ Disclaimer

BabyVax is a **reference tool only**. Vaccination schedules can change, and your doctor or local health centre should always be your primary source. Always confirm dates and vaccines with a qualified healthcare professional.

---

## 📄 License

This project is open source and free to use. Feel free to fork, modify, and share.

---

## 👨‍💻 Author

Made with ❤️ for parents everywhere.

Built and maintained by [@james-003](https://github.com/james-003)
