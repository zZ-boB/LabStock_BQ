# LabStock Laboratory Inventory System

A modern, real-time laboratory inventory management system built with React, Tailwind CSS, and Supabase.

## Features
- **Real-time Sync**: Changes are instantly reflected across all connected devices (PC, mobile) using Supabase Realtime.
- **Inventory Tracking**: Manage stock levels, batches, and expiration dates.
- **Notice Board**: Post and delete announcements for laboratory staff.
- **Responsive Design**: Optimized for both desktop and mobile viewing.
- **Export to Excel**: Generate purchase reports for accounting.

## Cloud Setup (Supabase)
To enable real-time synchronization, you **MUST** enable replication for the following tables in your Supabase dashboard:
1. Go to **Database** -> **Replication**.
2. Click on the **'supabase_realtime'** publication.
3. Ensure the following tables are toggled **ON**:
   - `inventory`
   - `vendors`
   - `history`
   - `notices`

## Local Development
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`

## Deployment
This project is ready to be pushed to GitHub.

### How to push to your repository:
```bash
git remote add origin <YOUR_GITHUB_REPO_URL>
git branch -M main
git push -u origin main
```

---
Developed by Antigravity AI.
