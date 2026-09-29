# 🌿 E-Setu (ई-सेतु / ई-मार्ग)
### Vernacular, Low-Literacy, Offline-Tolerant Mobile Platform Connecting Informal Scrap Collectors to the Formal E-Waste Ecosystem
> **Smart India Hackathon (SIH 2026)** • Under E-Waste (Management) Rules, 2022 & CPCB EPR Framework

---

## 📌 Problem & Context
Over **90% of India's e-waste** is collected through informal scrap dealers (*kabadiwalas*, waste-pickers, itinerant buyers) due to their unmatched last-mile reach. However, these workers are excluded from the formal recycling chain. As a result, valuable materials undergo dangerous backyard processing (open cable burning, acid leaching), releasing lethal dioxins and losing critical rare minerals (Lithium, Neodymium, Cobalt, Tantalum, Gallium, Gold).

**E-Setu** bridges this economic, informational, and institutional gap with a zero-typing, voice-first, offline-tolerant PWA designed specifically for entry-level smartphones and low-literacy users.

---

## 🌟 3 Radical Innovations (Unique & Patent-Grade)
1. **🔊 "ध्वनि से तांबा परख" (Tap-To-Test Acoustic Copper Resonance Analyzer)**:
   - Uses Web Audio API Fast Fourier Transform (FFT) to analyze sound frequency from a coin/key tap on motor or transformer coils.
   - Detects **100% Pure Copper (~3.1 kHz)** vs. cheap **Copper-Clad Aluminum (~4.9 kHz)** to protect collectors from scale and middleman fraud.
2. **🛡️ "चोरी व पुलिस से सुरक्षा कवच" (CEIR Safe-Scrap Legal Shield)**:
   - Scans IMEI/serial numbers and verifies them against the national Central Equipment Identity Register (CEIR).
   - Generates a tamper-proof digital **Legal Scrap Shield Pass** with CPCB reference, protecting the collector from false police harassment and stopping them from destroying electronics with hammers!
3. **💻 "कबाड़ से पुर्ज़ा बचाओ" (AI Cannibalization & Re-Use Radar)**:
   - Evaluates discarded electronics for reusable modular components (RAM, SSD, displays, cooling fans).
   - Compares scrap shredding value (e.g. ₹180) vs. local repair market value (e.g. ₹2,550), multiplying collector earnings.

---

## ⚡ Core Platform Capabilities
- **🎙️ "बोलके लॉट बनाओ" (Zero-Typing Vernacular Voice Assistant)**: Hindi and Marathi speech recognition extracts material, weight, and location automatically.
- **💰 Direct "EPR Green Dividend" Pass-Through**: Recyclers pass 25% of Brand EPR certificate values directly as cash bonuses to the collector (+40% higher income than backyard burning).
- **📸 AI Scrap Lens & "काँटा परख"**:
  - Classifies PCBs into Grade A (Server/RAM), Grade B (PC Motherboards), and Grade C (TV brown boards).
  - Scale OCR auto-reads spring balance needles and digital displays.
  - Sensor guard detects hidden scale magnets and unfair tilt angles.
- **📻 "दैनिक मंडी भाव" (Daily Spoken Audio Bulletin)**: 25-second morning audio radio broadcast of spot scrap prices in Hindi/Marathi.
- **📴 "दोस्त खाता" & Zero-Internet Handshake (PORH)**:
  - 100% Cash-friendly hisab-kitab.
  - Dynamic 15-second time-rotating QR codes + data-over-sound acoustic chirps for deep godowns with 0 KB internet.
- **🏢 Authorized Recycler Cockpit**: Live radar sweep of nearby lots, EV pickup routing, and 1-click CPCB Form-6 manifest generator.

---

## 📊 7 Structured Datasets (Pre-Seeded & Live)
1. `datasets/materials.json`: 7 categories, sub-tiers, densities, hazard rules, and metal compositions.
2. `datasets/prices_mandi.json`: Spot prices, daily trends, EPR bonuses, and vernacular audio scripts.
3. `datasets/authorized_recyclers.json`: CPCB/SPCB registered facilities, GPS coords, and pickup fleets.
4. `datasets/transactions_ledger.json`: Verifiable ledger with Cash and UPI tags.
5. `datasets/traceability_porh.json`: Cryptographic Proof-of-Responsible-Handover records with SHA256 hashes.
6. `datasets/collector_profiles.json`: Field personas (*Ramu from Dharavi* & *Babu Bhai from Kurla*) with Swachh Karma scores.
7. `datasets/ai_training_metadata.json`: Bounding boxes, acoustic FFT signatures, and scale OCR configs.

---

## 💰 Unit Economics: 50kg Mixed Computer Scrap Lot
| Parameter | Backyard Middleman | Via E-Setu Platform | Collector Benefit |
| :--- | :--- | :--- | :--- |
| **Material Base Realization** | ₹4,800 | ₹5,600 | **+ ₹800** |
| **Scale Cheating Loss** | - ₹350 (5% margin) | ₹0 (Scale OCR Verified) | **+ ₹350** |
| **Direct EPR Dividend** | ₹0 | + ₹650 | **+ ₹650** |
| **Net Cash in Pocket** | **₹4,450** | **₹6,250** | **+40.4% More Income!** |

---

## 🌐 Live Cloud Deployment (Render & Vercel)

### Option A: Deploy to Vercel (Frontend & Serverless Edge)
1. **Via Vercel Web Dashboard (1-Click)**:
   - Push this repo to GitHub:
     ```bash
     git remote add origin https://github.com/<YOUR_USERNAME>/e-setu.git
     git push -u origin main
     ```
   - Go to [vercel.com/new](https://vercel.com/new) -> Import your repository.
   - Vercel automatically reads `vercel.json` and deploys your PWA and serverless API endpoints instantly!
2. **Via Vercel CLI**:
   ```bash
   npx vercel
   ```

### Option B: Deploy to Render (Node.js Web Service & REST Backend)
1. **Via Render Web Dashboard (Blueprint)**:
   - Push your code to GitHub or GitLab.
   - Go to [dashboard.render.com](https://dashboard.render.com) -> Click **New +** -> **Blueprint**.
   - Select your repo: Render will automatically detect [`render.yaml`](file:///c:/Users/Raunak/OneDrive/Desktop/sih%202026/render.yaml) and configure the Node web service on port 10000 with healthcheck probes!
2. **Via Manual Web Service**:
   - Environment: `Node`
   - Build Command: `npm install --omit=dev || true`
   - Start Command: `node server.js`
   - Healthcheck Path: `/health`

---

## 🚀 How to Run Locally
1. Run PowerShell server (Windows native, zero-dependencies):
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\server.ps1 -port 8080
   ```
2. Or run Node server:
   ```bash
   node server.js
   ```
3. Open in any browser:
   ```
   http://localhost:8080
   ```

