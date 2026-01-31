# Second Brain Architectural Concepts

This document outlines the architectural and design foundations of the Second Brain AI Knowledge System.

## Portable Architecture
The system is built with a clear separation of concerns to ensure portability:
- **Storage Layer**: MongoDB integration is abstracted via Mongoose models, allowing for a swappable database layer (e.g., PostgreSQL or Supabase) with minimal changes to the API routes.
- **AI Intelligence Layer**: Puter.js is used for AI processing (summarization, tagging, chat). This layer is abstracted into a utility module (`lib/puter-ai.ts`), allowing the underlying AI model (currently `gpt-5-nano`) to be swapped for OpenAI, Gemini, or Claude without rewriting component logic.
- **UI Component Layer**: Built with Next.js and Tailwind CSS, the components are modular and rely on a centralized utility set (`lib/utils.ts`) and global design tokens.

## Principles-Based UX
Our design is guided by these core AI interaction principles:
1. **Zero Friction Capture**: The knowledge form is optimized for speed, using AI to automate tagging so the user doesn't have to.
2. **Contextual Intelligence**: AI features like "Smart Tag" are available in-context when the user is writing, rather than after the fact.
3. **Motion for Meaning**: We use Framer Motion not just for flair, but to guide attention (e.g., skeleton loaders during fetching, smooth transitions between categories).
4. **Human-Centric AI**: AI responses use typing animations and subtle sparkles to feel like a collaborative partner rather than a static output.

## Agent Thinking
The system implements agent-like automation:
- **Auto-Refinement**: When content is added, the system can proactively suggest summaries and tags to improve the searchability of the database over time.
- **Self-Organizing Hub**: The dashboard filters and sorts knowledge autonomously based on metadata extracted during the capture phase.

## Infrastructure Mindset
We expose features beyond the main application:
- **Public API**: The `GET /api/public/brain/query` endpoint allows external systems to query the wisdom stored in the brain.
- **Widget Ready**: The dashboard and chat components are designed to be eventually modularized into embeddable widgets for external websites.
