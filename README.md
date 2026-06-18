# Probe: Intelligent Code Debugging System

Probe automates **error analysis, code fixing, and validation** through a three‑stage pipeline.  
It uses AI agents for debugging, generates fixes, and validates them safely inside Docker sandboxes.

---

## Features
- **Debug**: Root‑cause analysis via AI, runtime introspection, and retrieval.
- **Fix**: Actionable code patches with explanations.
- **Validate**: Isolated Docker execution with Jest tests.

---

## Architecture

| Stage    | Route             | Service              |
|----------|------------------|----------------------|
| Debug    | POST /api/debug   | debug.service.ts     |
| Fix      | POST /api/fix     | fix.service.ts       |
| Validate | POST /api/validate| validation.service.ts|

---

## Setup

### Prerequisites
- Node.js (>= 18), Docker
- Environment variables: `OPENAI_API_KEY`, `PINECONE_API_KEY`, `PINECONE_INDEX`, `DOCKER_IMAGE`, `PORT`

### Install & Run
```bash
git clone https://github.com/your-org/probe.git
cd probe
npm install
npm run dev
```
Live: https://probe-delta-lemon.vercel.app/
