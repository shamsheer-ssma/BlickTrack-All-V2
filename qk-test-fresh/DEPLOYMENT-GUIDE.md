# 🚀 **BlickTrack Deployment Guide**

---

## 🎯 **Quick Start**

### **For Customer Wanting Landing Page:**

```bash
# 1. Edit .env.local
NEXT_PUBLIC_SHOW_LANDING_PAGE=true

# 2. Restart server
npm run dev

# 3. Visit
http://localhost:4000/
# → Shows landing page
```

---

### **For Customer Wanting Direct Login:**

```bash
# 1. Edit .env.local
NEXT_PUBLIC_SHOW_LANDING_PAGE=false

# 2. Restart server
npm run dev

# 3. Visit
http://localhost:4000/
# → Redirects to /login automatically
```

---

## 📝 **Environment Variables**

| Variable | Values | Default | Purpose |
|----------|--------|---------|---------|
| `NEXT_PUBLIC_SHOW_LANDING_PAGE` | `true` / `false` | `true` | Show landing page or redirect to login |

---

## 🔧 **How to Change**

### **Step 1: Edit Configuration**
```bash
# Open file
code .env.local

# Or create if not exists
cp .env.local.example .env.local
```

### **Step 2: Set Value**
```bash
# For landing page (marketing mode)
NEXT_PUBLIC_SHOW_LANDING_PAGE=true

# For direct login (enterprise mode)
NEXT_PUBLIC_SHOW_LANDING_PAGE=false
```

### **Step 3: Restart Server**
```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

---

## ✅ **Verification**

### **Landing Page Mode (true):**
- ✅ Visit `/` → Shows landing page
- ✅ Click "Sign In" → Goes to `/login`
- ✅ `/login` accessible directly

### **Direct Login Mode (false):**
- ✅ Visit `/` → Auto-redirects to `/login`
- ✅ `/login` accessible directly
- ✅ No landing page shown

---

## 📚 **More Info**

See: `docs/Syed-FrontEnd/CUSTOMER-CONFIGURATION.md`

---

## 🆘 **Troubleshooting**

**Q: Changes not working?**
- A: Restart the dev server (changes require restart)

**Q: Where is .env.local?**
- A: In `qk-test/` folder (root of project)

**Q: Can I use different values?**
- A: Only `true` or `false` (exactly as shown)

---

**That's it!** Simple customer configuration! 🎉

