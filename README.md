# Social Support Application

A modern, accessible web application for government social support applications with AI-powered writing assistance and bilingual support (English/Arabic).

## Features

- **Multi-step Form Wizard**: 3-step application process with progress tracking
- **AI Writing Assistant**: OpenAI GPT-3.5 integration for helping users write situation descriptions
- **Bilingual Support**: Full English and Arabic (RTL) language support
- **Auto-save**: Automatic progress saving to local storage
- **Database Persistence**: Supabase integration for storing applications
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Accessibility**: WCAG compliant with ARIA labels and keyboard navigation

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI GPT-3.5 Turbo API
- **Icons**: Lucide React
- **State Management**: React Context API

## Prerequisites

- Node.js 16+ and npm
- OpenAI API Key
- Supabase account (already configured)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up OpenAI API Key

The application requires an OpenAI API key for the AI writing assistance feature.

#### Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. **Add billing information** at [Billing Settings](https://platform.openai.com/account/billing) - **this is required even for trial credits**
4. Navigate to [API Keys](https://platform.openai.com/api-keys)
5. Click "Create new secret key"
6. Copy the key (it will only be shown once - starts with `sk-`)

#### Adding Your API Key to the Project

Open the `.env` file in the project root and replace the placeholder:

```env
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Important Notes**:
- Never commit your API key to version control
- The `.env` file is already in `.gitignore`
- You must have available credits in your OpenAI account
- New accounts receive free trial credits after adding billing info
- Check your usage at [OpenAI Usage Dashboard](https://platform.openai.com/usage)

**Common Issues**:
- **"insufficient_quota" error**: Add billing information or add credits to your account
- **401 error**: API key is invalid or not set correctly
- **429 error**: Rate limit exceeded or quota depleted

### 3. Run the Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## How to Use the Application

### Step 1: Personal Information
Fill in your basic personal details including name, national ID, date of birth, contact information, and address.

### Step 2: Family & Financial Information
Provide information about your family status, dependents, employment, income, and housing situation.

### Step 3: Situation Descriptions
Describe your circumstances in detail. Use the **"Help Me Write"** button next to each text area to get AI-powered suggestions:

1. Click "Help Me Write" button
2. AI will generate a professional description based on your situation
3. Review the suggestion in the modal
4. Accept it as-is, edit it, or discard it

### Language Toggle
Click the language button in the top-right corner to switch between English and Arabic. The entire interface, including form labels and validation messages, will update accordingly.

### Saving Progress
- Your progress is automatically saved to local storage as you fill out the form
- Click "Save Progress" to manually save to the database
- You can close the browser and return later - your progress will be preserved

### Submitting the Application
After completing all three steps, click "Submit Application" to finalize your submission. You'll receive a confirmation with your application ID.

## Project Structure

```
src/
├── components/           # React components
│   ├── ApplicationForm.tsx       # Main form wizard
│   ├── Step1PersonalInfo.tsx     # Step 1 component
│   ├── Step2FamilyFinancial.tsx  # Step 2 component
│   ├── Step3SituationDescriptions.tsx  # Step 3 with AI
│   ├── AISuggestionModal.tsx     # AI suggestion modal
│   ├── ProgressBar.tsx           # Progress indicator
│   ├── SuccessModal.tsx          # Success confirmation
│   └── LanguageToggle.tsx        # Language switcher
├── contexts/            # React contexts
│   └── LanguageContext.tsx       # i18n context
├── services/            # API services
│   ├── applicationService.ts     # Supabase operations
│   └── openai.ts                 # OpenAI API integration
├── utils/               # Utility functions
│   ├── validation.ts             # Form validation
│   └── localStorage.ts           # Local storage helpers
├── i18n/                # Internationalization
│   └── translations.ts           # English/Arabic translations
├── types/               # TypeScript types
│   └── index.ts                  # Type definitions
├── lib/                 # Third-party integrations
│   └── supabase.ts               # Supabase client
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

## Architecture & Design Decisions

### Component Architecture
- **Separation of Concerns**: Each form step is a separate component for maintainability
- **Context API**: Used for language state management to avoid prop drilling
- **Controlled Components**: All form inputs are controlled for better validation and state management

### Data Flow
1. User inputs are stored in component state
2. Changes trigger automatic local storage saves
3. Manual saves and final submission write to Supabase database
4. Validation occurs per-step before navigation

### AI Integration
- OpenAI GPT-3.5 Turbo is used for generating text suggestions
- Each field type has a custom system prompt for relevant context
- Error handling includes timeout and API failure scenarios
- Users maintain full control - AI is assistive, not prescriptive

### Internationalization
- Translation keys organized by feature area
- RTL support built into layout with Tailwind's `dir` attribute
- Language preference persisted to local storage
- All UI elements, including validation messages, are translated

### Database Schema
The `applications` table stores:
- All form fields (personal, financial, and situation data)
- Application status (draft/submitted)
- Current step for resume functionality
- Timestamps for audit trail

### Security
- Row Level Security (RLS) enabled on Supabase tables
- Anonymous users can create and update their applications
- Authenticated users have policies for viewing their own data
- API keys stored in environment variables, never committed

## API Integration Details

### OpenAI API
**Endpoint**: `https://api.openai.com/v1/chat/completions`
**Model**: `gpt-3.5-turbo`

Example prompt flow:
```javascript
{
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: "You are helping someone describe their financial situation..."
    },
    {
      role: "user",
      content: "I am unemployed with no income..."
    }
  ]
}
```

### Supabase
- **Operations**: Insert, Update, Select
- **Tables**: applications
- **Features**: Auto-timestamps, UUID generation, RLS policies

## Validation Rules

### Step 1
- All fields required
- Email must be valid format
- Date of birth must be valid date

### Step 2
- All fields required
- Dependents must be non-negative integer
- Monthly income must be non-negative number

### Step 3
- All text areas required
- Minimum length validation ensures meaningful descriptions

## Accessibility Features

- Semantic HTML elements
- ARIA labels and descriptions
- Keyboard navigation support
- Focus management in modals
- Error messages linked to form fields
- Color contrast ratios meet WCAG AA standards

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### AI Features Not Working
- Verify your OpenAI API key is correctly set in `.env`
- Check that you have API credits available in your OpenAI account
- Look for error messages in the browser console

### Form Not Saving
- Check browser console for Supabase connection errors
- Verify internet connection
- Ensure local storage is not disabled in browser settings

### Language Not Switching
- Clear browser cache and local storage
- Check that all translation keys are present in `translations.ts`

## Future Improvements

- **File Uploads**: Add ability to attach supporting documents
- **Multi-page Resume**: Allow users to access saved applications via link
- **Admin Dashboard**: Interface for reviewing and managing applications
- **Email Notifications**: Automated email updates on application status
- **Advanced AI Features**: Multi-language AI support, tone customization
- **Analytics**: Track completion rates and common drop-off points
- **Offline Support**: Progressive Web App with offline capabilities
- **Unit Tests**: Comprehensive test coverage with Jest and Testing Library
- **E2E Tests**: End-to-end testing with Playwright or Cypress

## License

This project is for demonstration purposes.

## Support

For questions or issues, please refer to the project documentation or contact the development team.
