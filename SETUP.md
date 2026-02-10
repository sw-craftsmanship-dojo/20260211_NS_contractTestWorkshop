# Pre-Workshop Setup Instructions

Complete these steps **before** the workshop to ensure a smooth experience.

---

## Quick Checklist

- [ ] Node.js 18+ installed
- [ ] Git installed and configured
- [ ] Workshop repository cloned
- [ ] Dependencies installed
- [ ] Test runs successfully

---

## Step 1: Install Node.js

### Check if Node.js is installed
```bash
node --version
```

You need Node.js version **18 or higher**.

### Install Node.js (if needed)

**macOS (using Homebrew):**
```bash
brew install node@18
```

**Windows:**
Download from https://nodejs.org/ (LTS version)

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## Step 2: Install Git

### Check if Git is installed
```bash
git --version
```

### Install Git (if needed)

**macOS:**
```bash
brew install git
```

**Windows:**
Download from https://git-scm.com/

**Linux:**
```bash
sudo apt-get install git
```

---

## Step 3: Clone the Workshop Repository

```bash
git clone https://github.com/your-org/workshop-cdc-testing.git
cd workshop-cdc-testing
```

---

## Step 4: Verify Setup

Navigate to Exercise 1 and verify everything works:

```bash
cd exercises/javascript/exercise-01-login/solution
npm install
npm test
```

**Expected Output:**
```
PASS  ./auth.pact.test.js
  Auth API Contract Tests
    POST /api/v1/auth/login
      ✓ should return tokens for valid credentials (XXXms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

---

## Troubleshooting

### Issue: `npm install` fails with native module errors

**Cause:** Pact requires native binaries to be downloaded.

**Solution:**
1. Check your Node version: `node --version` (must be 18+)
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules: `rm -rf node_modules`
4. Reinstall: `npm install`

### Issue: Corporate proxy blocking downloads

**Solution:**
Set npm proxy:
```bash
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

### Issue: Permission errors on Linux/macOS

**Solution:**
Don't use `sudo` with npm. Fix permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Issue: Test timeout

**Solution:**
Increase Jest timeout in package.json:
```json
"jest": {
  "testTimeout": 60000
}
```

---

## IDE Setup (Optional but Recommended)

### VS Code
Install these extensions for the best experience:
- **ESLint** - JavaScript linting
- **Jest** - Test runner integration
- **Pact** - Syntax highlighting for Pact files

### WebStorm/IntelliJ
- Enable Jest integration: Settings > Languages & Frameworks > JavaScript > Jest
- Set Node.js interpreter: Settings > Languages & Frameworks > Node.js

---

## Fallback: GitHub Codespaces

If you have issues with local setup, you can use GitHub Codespaces:

1. Go to the repository on GitHub
2. Click "Code" > "Codespaces" > "Create codespace on main"
3. Wait for environment to build
4. Everything is pre-configured!

---

## Need Help?

If you encounter issues during setup:

1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Post in the workshop Slack channel (if available)
4. Email the workshop organizer

**Please complete setup at least 24 hours before the workshop** so we can help resolve any issues.

---

**See you at the workshop!**
