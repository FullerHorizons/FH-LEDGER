# Fuller Horizons Ledger System

A Next.js application for creating and managing invoices and expense entries with Google OAuth authentication and Notion database integration.

## Features

- **Google OAuth Authentication** - Secure login with email whitelist (jonathan@fullerhorizons.net)
- **Dual Entry Types**:
  - **Consulting Entry** - For billable consulting work (saved to Notion database)
  - **Expense Entry** - For expense reimbursements (saved to Notion database)
- **Automatic Calculations** - Amount due calculated from hourly rate × billable hours
- **Invoice Number Auto-Generation** - Suggests next sequential invoice number (FH-YYYY-####)
- **Professional UI** - Fuller Horizons branding with navy (#1e3a8a) and gold (#f59e0b) colors
- **Real-time Validation** - Client-side form validation with Zod
- **Notion Integration** - Data persists directly to your Notion databases
- **Make.com Webhooks** - Automatic webhook notifications after invoice creation

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Authentication**: NextAuth v4 with Google OAuth
- **Database**: Notion API
- **Styling**: Tailwind CSS + shadcn/ui components
- **Validation**: Zod + React Hook Form
- **Notifications**: Sonner

## Prerequisites

- Node.js 18+ installed
- Notion account with API access
- Google Cloud Console account (for OAuth)
- Make.com account (optional, for webhooks)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Name it "Fuller Horizons Ledger"
4. Select the workspace where your databases are located
5. Copy the "Internal Integration Token" (starts with `secret_`)
6. Share your Notion databases with the integration:
   - Open your Consulting Entry database in Notion
   - Click "..." (three dots) → "Connections" → Add your integration
   - Repeat for your Expense Entry database

Your Notion Database IDs are already configured:
- Consulting: `ebc910eed9b04b94a630ed2047589ab9`
- Expense: `2c694b016c9d80e498c2eac009fe5c91`

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen:
   - User Type: External
   - Add test user: jonathan@fullerhorizons.net
6. Create OAuth Client ID:
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the Client ID and Client Secret

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### 5. Set Up Make.com Webhook (Optional)

1. Create a new scenario in Make.com
2. Add a "Webhooks" module as the first step
3. Create a new webhook
4. Copy the webhook URL

### 6. Update Environment Variables

Update the `.env` file with your credentials:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# NextAuth
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000

# Notion
NOTION_API_KEY=secret_your-notion-integration-token-here

# Make.com (Optional)
MAKE_WEBHOOK_URL=https://hook.us1.make.com/your-webhook-id-here
```

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
fuller-horizons-invoicing/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts    # NextAuth configuration
│   │   ├── create-invoice/route.ts        # Invoice creation API
│   │   └── get-next-invoice/route.ts      # Invoice number generator
│   ├── invoice-create/
│   │   └── page.tsx                       # Main invoice form page
│   ├── unauthorized/
│   │   └── page.tsx                       # Unauthorized access page
│   ├── layout.tsx                         # Root layout with providers
│   └── page.tsx                           # Landing page
├── components/
│   ├── InvoiceForm.tsx                    # Main invoice form component
│   ├── Header.tsx                         # Navigation header
│   ├── Providers.tsx                      # NextAuth + Toast providers
│   └── ui/                                # shadcn/ui components
├── lib/
│   ├── notion-client.ts                   # Notion API client
│   ├── validators.ts                      # Zod validation schemas
│   └── utils.ts                           # Utility functions
└── middleware.ts                          # Route protection
```

## Notion Database Schemas

### Consulting Entry Database

**Required Properties:**
- **Invoice #** (Title) - e.g., "FH-2025-0001"
- **Ticket #/Opp #** (Number)
- **CW - Category** (Select: Project/Ticket/Opportunity)
- **CW - Client Name** (Text)
- **Category** (Select: Consulting/Sales/Project Management)
- **Billable Time (Hrs.)** (Number)
- **Client Hourly Rate** (Number, formatted as dollar)
- **Commission Rate (%)** (Number, formatted as percent)
- **Amount Due** (Number, formatted as dollar)
- **Date Submitted** (Date)
- **Date Performed** (Date)
- **Date Expected** (Date)
- **TWC Invoice #** (Text)
- **TWC Invoice Sent Date** (Date)
- **TWC Invoice Paid Date** (Date)
- **Required Field** (Multi-select: Yes/No)

### Expense Entry Database

**Required Properties:**
- **""** (Title, empty string - displays as "JRF - Invoice #")
- **Entry Type** (Select: Expense Reimbursement/Billable Hours)
- **CW - Category** (Select: Opportunity/Ticket/Project)
- **CW - Client Name** (Text)
- **CW - Identifier** (Text)
- **Category** (Select: Consulting/Sales/Networking/Project Management)
- **Billable Time (Hrs.)** (Number)
- **Client Hourly Rate** (Number, formatted as dollar)
- **Commission Rate (%)** (Number, formatted as percent)
- **Amount Due** (Number, formatted as dollar)
- **Date Submitted** (Date)
- **Date Performed** (Date)
- **Date Expected** (Date)
- **TWC Invoice #** (Text)
- **TWC Invoice Sent Date** (Date)
- **TWC Invoice Paid Date** (Date)

## Make.com Webhook Data

When an invoice is created, the following data is sent to your Make.com webhook:

```json
{
  "entryType": "consulting" | "expense",
  "pageId": "notion-page-id",
  "properties": {
    // All form data
  }
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)
   - `NOTION_API_KEY`
   - `MAKE_WEBHOOK_URL` (optional)
5. Deploy

### Custom Domain (ledger.fullerhorizons.net)

1. In Vercel project settings, go to "Domains"
2. Add custom domain: `ledger.fullerhorizons.net`
3. Update DNS records as instructed by Vercel
4. Update Google OAuth authorized redirect URIs:
   - `https://ledger.fullerhorizons.net/api/auth/callback/google`
5. Update `NEXTAUTH_URL` environment variable in Vercel:
   - `https://ledger.fullerhorizons.net`

## Usage

1. **Sign In**: Click "Sign in with Google" on the home page
2. **Select Entry Type**: Choose between "Consulting Entry" or "Expense Entry"
3. **Fill Form**: Complete the required and optional fields
4. **Auto-Calculate**: Amount due is calculated automatically from rate × hours
5. **Submit**: Click "Create Invoice" to save to Notion database
6. **Success**: View confirmation with invoice details

The form will automatically suggest the next invoice number and calculate amounts in real-time.

## Security

- Only `jonathan@fullerhorizons.net` can access the system
- All routes protected with NextAuth middleware
- JWT session strategy for stateless authentication
- Environment variables for sensitive credentials
- Direct integration with Notion API (no intermediate database)

## Troubleshooting

### Invoice number not auto-generating
- Check that your Notion integration has access to the Consulting database
- Verify NOTION_API_KEY is correct
- Check browser console for errors

### Cannot create invoices
- Verify Notion integration has write access to both databases
- Check that all required Notion properties exist
- Review API logs for specific errors

### Google OAuth not working
- Verify redirect URIs match exactly
- Check that test user is added in OAuth consent screen
- Confirm CLIENT_ID and SECRET are correct

## Support

For questions or issues, contact Fuller Horizons IT support.

## License

Proprietary - Fuller Horizons © 2025
