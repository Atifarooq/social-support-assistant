# Architecture Documentation

## Overview

This document explains the architectural decisions, design patterns, and technical implementation details of the Social Support Application.

## Architecture Philosophy

The application follows modern React best practices with a focus on:
- **Modularity**: Components and services are self-contained and reusable
- **Separation of Concerns**: Clear boundaries between UI, business logic, and data layers
- **Type Safety**: Full TypeScript implementation for compile-time error checking
- **Accessibility First**: WCAG compliance built in from the start
- **Internationalization**: Multi-language support as a core feature, not an afterthought

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│  (React Components + Tailwind CSS + Lucide Icons)      │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────────────┐
│               Application Layer                          │
│  - State Management (React Context)                     │
│  - Form Validation                                      │
│  - Local Storage Persistence                            │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────────────┐
│               Services Layer                             │
│  - Application Service (Supabase)                       │
│  - OpenAI Service (AI Integration)                      │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────────────┐
│            External Dependencies                         │
│  - Supabase (PostgreSQL Database)                       │
│  - OpenAI API (GPT-3.5 Turbo)                          │
└─────────────────────────────────────────────────────────┘
```

## Design Decisions

### 1. Multi-Step Form Wizard

**Decision**: Separate the application into 3 distinct steps with a progress indicator.

**Rationale**:
- Reduces cognitive load by showing only relevant fields per step
- Allows for step-specific validation before proceeding
- Provides clear progress indication to users
- Enables saving partial progress without completing all steps
- Improves mobile experience with focused, smaller forms

**Implementation**:
- Each step is a separate component (`Step1PersonalInfo`, `Step2FamilyFinancial`, `Step3SituationDescriptions`)
- `ApplicationForm` component manages step state and navigation
- `ProgressBar` component visualizes current position
- Validation occurs before advancing to next step

### 2. AI Integration Pattern

**Decision**: Use modal-based AI suggestions that users can accept, edit, or discard.

**Rationale**:
- Users maintain full control over content
- AI is positioned as an assistant, not a replacement
- Modal prevents accidental overwrites of user text
- Allows users to edit AI suggestions before accepting
- Clear visual separation between user input and AI suggestions

**Implementation**:
```typescript
// Service layer handles API communication
export async function generateTextSuggestion(request: OpenAIRequest): Promise<OpenAISuggestion>

// Component handles user interaction
<AISuggestionModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  onAccept={handleAIAccept}
  fieldType={activeField}
  currentValue={data[activeField]}
/>
```

**Error Handling**:
- Network timeouts handled gracefully
- API errors displayed with actionable messages
- Fallback to manual input if AI fails
- No blocking of form submission if AI unavailable

### 3. Internationalization Architecture

**Decision**: Use React Context with a translation object pattern.

**Rationale**:
- Avoids prop drilling through multiple component levels
- Enables runtime language switching without page reload
- Centralized translation management
- RTL support built into the context
- Language preference persisted across sessions

**Implementation**:
```typescript
// Context provides translations and RTL state
const { t, isRTL, language, setLanguage } = useLanguage();

// Components use translation keys
<label>{t.name}</label>

// RTL handled automatically
<div dir={isRTL ? 'rtl' : 'ltr'}>
```

### 4. Data Persistence Strategy

**Decision**: Dual persistence with local storage and Supabase database.

**Rationale**:
- **Local Storage**: Instant save, works offline, survives page refresh
- **Database**: Permanent storage, accessible from any device, enables resume functionality
- **Combination**: Best of both worlds - fast local experience with server backup

**Implementation Flow**:
1. User fills form → Auto-save to localStorage on every change
2. User clicks "Save Progress" → Manual save to Supabase
3. User submits → Final save to Supabase + status update
4. User returns → Load from localStorage first, fallback to Supabase

### 5. Validation Architecture

**Decision**: Per-step validation with immediate feedback.

**Rationale**:
- Prevents users from advancing with invalid data
- Reduces submission errors
- Provides immediate feedback for better UX
- Validates only visible fields (current step)

**Implementation**:
```typescript
// Step-specific validators
validateStep1(data, t): ValidationErrors
validateStep2(data, t): ValidationErrors
validateStep3(data, t): ValidationErrors

// Real-time error clearing
if (errors[field]) {
  setErrors(prev => {
    const newErrors = { ...prev };
    delete newErrors[field];
    return newErrors;
  });
}
```

### 6. Component Structure

**Decision**: Feature-based component organization with clear responsibilities.

**Component Hierarchy**:
```
App (Provider Setup)
└── AppContent (Layout & Structure)
    ├── LanguageToggle (UI Control)
    └── ApplicationForm (Main Logic)
        ├── ProgressBar (Visual Feedback)
        ├── Step1PersonalInfo (Data Input)
        ├── Step2FamilyFinancial (Data Input)
        ├── Step3SituationDescriptions (Data Input + AI)
        │   └── AISuggestionModal (AI Interaction)
        └── SuccessModal (Completion Feedback)
```

**Responsibilities**:
- **Container Components**: State management, business logic, data fetching
- **Presentational Components**: UI rendering, event handling
- **Service Modules**: API communication, data transformation
- **Utility Modules**: Validation, storage, helpers

### 7. Database Schema Design

**Decision**: Single `applications` table with comprehensive fields.

**Schema**:
```sql
applications (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  status text,
  current_step integer,
  created_at timestamptz,
  updated_at timestamptz,
  submitted_at timestamptz,
  -- Step 1 fields
  name, national_id, date_of_birth, gender, address, city, state, country, phone, email
  -- Step 2 fields
  marital_status, dependents, employment_status, monthly_income, housing_status
  -- Step 3 fields
  financial_situation, employment_circumstances, reason_for_applying
)
```

**Rationale**:
- Single source of truth for application data
- Simple queries without joins
- Easy to extend with additional fields
- Denormalized for read performance
- `current_step` enables resume functionality
- `status` field for workflow management

### 8. Security Implementation

**Decision**: Row Level Security (RLS) with anonymous and authenticated policies.

**Security Layers**:
1. **Client-side**: Input validation, XSS prevention
2. **Transport**: HTTPS only
3. **Database**: RLS policies, prepared statements
4. **API Keys**: Environment variables only

**RLS Policies**:
```sql
-- Anyone can create applications
CREATE POLICY "Anyone can create applications"
  ON applications FOR INSERT TO public WITH CHECK (true);

-- Users view their own applications
CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Anonymous users can update their applications
CREATE POLICY "Anonymous users can update applications"
  ON applications FOR UPDATE TO anon USING (true) WITH CHECK (true);
```

### 9. State Management Choice

**Decision**: React Context API instead of Redux.

**Rationale**:
- Application state is relatively simple (language preference)
- Form state is local to ApplicationForm component
- No complex state transformations needed
- Reduces bundle size and complexity
- Built-in React feature, no additional dependencies
- Sufficient for current requirements

**Future Consideration**: If state complexity grows (e.g., multi-user support, complex workflows), consider Redux Toolkit or Zustand.

### 10. Styling Approach

**Decision**: Tailwind CSS with utility-first approach.

**Rationale**:
- Rapid prototyping and development
- Consistent design system through configuration
- Responsive design built-in
- RTL support with `dir` attribute
- Smaller production bundle with PurgeCSS
- No CSS naming conventions needed

**Custom Configuration**:
```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom colors, spacing, etc.
    }
  }
}
```

## Performance Optimizations

### 1. Code Splitting
- React.lazy() for route-level splitting (future)
- Dynamic imports for large dependencies

### 2. Memoization
- React.memo() for expensive components
- useMemo() for computed values
- useCallback() for event handlers

### 3. Debouncing
- Auto-save to localStorage debounced at 500ms
- Form validation debounced to reduce re-renders

### 4. Asset Optimization
- SVG icons from Lucide React (tree-shakeable)
- No heavy image dependencies
- Vite's automatic code optimization

## Error Handling Strategy

### Frontend Errors
```typescript
try {
  // API call
} catch (error) {
  if (error instanceof Error) {
    // Known error type
    displayError(error.message);
  } else {
    // Unknown error
    displayError('An unexpected error occurred');
  }
}
```

### AI Service Errors
- API timeout: Show retry option
- Invalid API key: Show setup instructions
- Network error: Graceful degradation
- Unexpected response: Fallback to manual input

### Database Errors
- Connection failure: Retry with exponential backoff
- Validation error: Display field-specific messages
- Constraint violation: User-friendly error messages

## Testing Strategy

### Unit Tests (Recommended)
```javascript
// Utils
- validation.test.ts (validateEmail, validateStep1, etc.)
- localStorage.test.ts (save, load, clear operations)

// Services
- applicationService.test.ts (CRUD operations)
- openai.test.ts (API integration, error handling)
```

### Integration Tests (Recommended)
```javascript
// Components
- ApplicationForm.test.tsx (multi-step flow)
- Step1PersonalInfo.test.tsx (form validation)
- AISuggestionModal.test.tsx (AI interaction)
```

### E2E Tests (Recommended)
```javascript
// User Flows
- Complete application submission
- Save and resume functionality
- Language switching
- AI assistance usage
```

## Accessibility Implementation

### ARIA Attributes
```typescript
// Form fields
aria-required="true"
aria-invalid={!!errors.field}
aria-describedby="field-error"

// Modals
role="dialog"
aria-modal="true"
aria-labelledby="modal-title"

// Navigation
role="navigation"
aria-label="Progress"
```

### Keyboard Navigation
- Tab order follows logical flow
- Enter submits forms
- Escape closes modals
- Arrow keys for select inputs

### Screen Reader Support
- Semantic HTML elements
- Error messages linked to fields
- Loading states announced
- Success/failure feedback

## Future Scalability Considerations

### Microservices Architecture
If the application grows significantly:
```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│   Web App   │────▶│  API Gateway │────▶│ Applications  │
│   (React)   │     │              │     │   Service     │
└─────────────┘     └───────┬──────┘     └───────────────┘
                            │
                            ├───────────▶┌───────────────┐
                            │            │  AI Service   │
                            │            └───────────────┘
                            │
                            └───────────▶┌───────────────┐
                                         │ Notification  │
                                         │   Service     │
                                         └───────────────┘
```

### Caching Strategy
- Redis for session data
- CDN for static assets
- API response caching
- Database query caching

### Monitoring & Analytics
- Error tracking (Sentry)
- Performance monitoring (Web Vitals)
- User analytics (custom events)
- Database query performance

## Technology Choices Justification

### React 18
- Most popular frontend framework
- Excellent TypeScript support
- Rich ecosystem
- Concurrent rendering features

### TypeScript
- Type safety reduces runtime errors
- Better IDE support
- Self-documenting code
- Easier refactoring

### Vite
- Fast development server
- Instant HMR
- Optimized production builds
- Native ES modules

### Supabase
- PostgreSQL database (reliable, scalable)
- Built-in authentication
- Row Level Security
- Real-time capabilities (future)

### Tailwind CSS
- Rapid development
- Consistent design
- Responsive utilities
- Production optimization

### OpenAI GPT-3.5
- State-of-the-art language model
- Reasonable cost
- Good balance of quality and speed
- Extensive API documentation

## Deployment Considerations

### Environment Variables
```env
# Required
VITE_SUPABASE_URL=xxx
VITE_SUPABASE_ANON_KEY=xxx
VITE_OPENAI_API_KEY=xxx

# Optional (future)
VITE_SENTRY_DSN=xxx
VITE_GA_TRACKING_ID=xxx
```

### Build Process
```bash
npm run build          # Production build
npm run preview        # Preview production build
npm run lint          # Check code quality
npm run typecheck     # Verify TypeScript types
```

### Hosting Options
1. **Vercel**: Zero-config, automatic deployments
2. **Netlify**: Similar to Vercel, great for static sites
3. **AWS S3 + CloudFront**: Full control, scalable
4. **Supabase Hosting**: Integrated with database

## Conclusion

This architecture prioritizes user experience, maintainability, and scalability. The modular design allows for easy feature additions and modifications. The clear separation of concerns makes the codebase easy to understand and test.

Key architectural strengths:
- Type-safe implementation
- Comprehensive error handling
- Accessibility built-in
- International ready
- Performance optimized
- Security first
- Easy to extend

Areas for future enhancement:
- Comprehensive test coverage
- Advanced caching strategies
- Microservices migration path
- Real-time collaboration features
- Advanced analytics integration
