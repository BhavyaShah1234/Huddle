# Huddle demo site

Scroll-driven demo for Track 2 (agent-to-agent coordination). Left: what Shreya sees in iMessage. Right: what the agents do behind the scenes, using the cards from `frontend/` (Student tab + agent chat).

Two tabs on one page:
- **Student** (default): Shreya's 7-step story, from onboarding to a confirmed swim partner.
- **Club** (`?tab=club`): a DevLabs officer's 4-step story. Anonymous demand pool, plan with a co-host club's agent, invite through each student's agent, and names revealed only for students who say yes. Uses the cards from `frontend/` Club tab.

Front end only: no backend, no API keys, no env vars.

```bash
cd demo-site
npm install
npm run dev   # http://localhost:3000
```

- Story script (all copy, timing, card content): `src/story/scenario.ts` (student), `src/story/club.ts` (club)
- Seeded swimmers: `src/story/swimmers.ts`; ranking (60% schedule + 40% level, commitment tiebreak): `src/story/ranking.ts`
- Theme and scroll technique: `THEME.md`

Stack: Next.js 16, React 19, Tailwind CSS 4, Lenis.
