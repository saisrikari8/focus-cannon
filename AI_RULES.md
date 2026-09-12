# FOCUS CANNON — AI DEVELOPMENT RULES

FOCUS CANNON is an AI-powered student productivity and study management platform.

The goal is to help students automatically understand academic deadlines, decide what to study, protect their focus time, track performance, and improve future study plans.

## Developer Role

The user is Member 3.

Member 3 owns:
- Frontend
- UI/UX
- Dashboard
- Navigation
- Calendar interface
- Missions
- Focus Mode interface
- Analytics interface
- Achievements
- Settings
- Gamification
- XP
- Levels
- Streaks
- Badges
- Daily goals
- Frontend integration
- Product presentation

Member 1 owns:
- AI
- Smart Planner
- Google Calendar

Member 2 owns:
- Focus Engine
- Analytics backend

Do not duplicate their backend/business logic unnecessarily.

## Core Pages

1. Dashboard
2. Calendar
3. Missions
4. Focus Mode
5. Analytics
6. Achievements
7. Settings
8. SAVE ME / Recovery Mode

## Core Product Flow

Google Calendar
→ Deadline detection
→ AI prioritization
→ Study mission
→ Focus Mode
→ Distraction Protection
→ Study session
→ Mission completion
→ XP
→ Streak
→ Achievement
→ Analytics
→ AI insight
→ Improved future planning

## AI Features

The final product should support:

- AI study-plan generation
- What Should I Study?
- Deadline prioritization
- Automatic topic prioritization
- Available-time optimization
- Difficulty estimation
- Study duration estimation
- Adaptive Study Plan
- AI self-correction based on actual study duration
- Weak Topic Detection
- Syllabus Coverage Map
- Why This Mission?
- AI Study Strategy Recommendation
- I’m Behind detection
- SAVE ME Recovery Plan
- Mock-test trigger
- Study → Test → Analyze → Adapt loop
- Spaced revision
- Focus personality
- Weekly AI report

## Focus Cannon Features

- Focus Timer
- Focus Mode
- Website blocking
- Supported app blocking
- Allowlist
- Blocklist
- Exam Mode
- Controlled breaks
- Emergency Access
- Focus Preparation Checklist
- Focus Environment
- Distraction Pattern Detection
- Why Am I Distracted?
- Time Protected
- Automatic restoration after session

Do not claim universal OS-level application blocking unless it is actually implemented.

## Gamification

- XP
- Levels
- Streaks
- Streak Shield
- Badges
- Daily Goals
- Personal Best
- Personal Rewards

Gamification must look professional and productivity-focused, not childish.

## Analytics

- Daily focus
- Weekly focus
- Completed missions
- Distractions
- Streak
- Focus Score
- Focus heatmap
- Weekly AI Report
- Distraction analytics
- Personal Best
- Time Protected
- Focus Profile / Focus Personality

## Social Features

- Accountability Partner
- Lightweight Study Room
- Optional friend comparison

Do not turn the product into a social-media platform.

## Advanced Feature

- Phone distraction detection / mobile companion

This may initially be represented as a prototype/future integration if actual mobile enforcement is unavailable.

## Design

Use a modern dark productivity dashboard.

Primary background:
#0B0F14

Cards:
#121821

Use restrained electric blue/purple accents.

Use green for success, amber for warnings, red for danger.

Typography should be clean and modern.

Prefer Inter or a similar professional sans-serif.

Avoid excessive gradients.

Avoid excessive animations.

Avoid childish gaming visuals.

The application should feel like a real SaaS/productivity product.

## UX Rule

Every screen should answer:

"What should the student do next?"

The dashboard should immediately show the most important mission.

## Technical Rules

- Use reusable components.
- Do not put the entire application in one file.
- Keep components modular.
- Keep business logic separate from UI.
- Use mock data before backend integration.
- Do not hardcode API keys.
- Never expose Groq API keys in client-side code.
- Keep environment variables in .env.local.
- Do not destroy existing working features when adding new features.
- Before changing architecture, explain the change.
- Preserve existing functionality.
- Use clear variable and component names.
- Handle loading, empty, and error states.
- Make the UI responsive.
- Optimize for a hackathon demo but keep the architecture scalable.

## Integration

Expected future services:

Supabase:
- Authentication
- Database
- User profiles
- Missions
- Focus sessions
- XP
- Streaks
- Badges
- Goals
- Distractions

Groq:
- AI planning
- Recovery planning
- AI explanations
- AI recommendations
- Weekly reports

Vercel:
- Production deployment

Member 1 APIs:
- Google Calendar
- AI planner

Member 2 APIs:
- Focus engine
- Focus analytics
- Distraction protection

## Important

Do not remove features from the specification just because they are difficult.

If a feature cannot yet be fully implemented, create a clean integration interface or prototype state so it can be connected later.

Always prioritize the main product flow.