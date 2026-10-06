# Muziris – City At Sea
## AI Knowledge Base for Website / Chatbot

This repository uses a project-specific knowledge file so that an AI assistant or chatbot can answer questions about **Muziris – City At Sea** using approved project context.

## Knowledge File

The main knowledge source is:

```text
knowledge/muziris_master_context.md
```

It contains consolidated information about:

- Muziris – City At Sea
- Floating City Limited
- Project vision and identity
- Preliminary vessel specifications
- Residences and accommodation
- Deck 04, 26, 27, 28 and 29
- Healthcare facilities
- Retail and Duty-Free at Sea
- Entertainment and hospitality
- Aviation, eVTOL and mobility concepts
- Smart-city technology
- AI, IoT and Digital Twin concepts
- Renewable energy and sustainability
- Water-management systems
- Education and community facilities
- Business and commercial ecosystem
- Safety and regulatory considerations
- Fundraising/project-scale references
- Known inconsistencies in preliminary project data
- FAQ responses
- AI response rules and terminology

---

## Recommended Folder Structure

```text
your-website/
├── README.md
├── knowledge/
│   └── muziris_master_context.md
├── src/
├── public/
├── package.json
└── ...
```

The exact structure can be changed to match your application.

---

## Purpose

The goal is simple:

> Whenever a user asks the website AI/chatbot a question about Muziris, the assistant should use `muziris_master_context.md` as its primary project knowledge source.

The AI should not invent project specifications or present preliminary concepts as completed facts.

---

## Core AI Instruction

Use the following instruction in the system prompt of your chatbot:

```text
You are the official AI assistant for Muziris – City At Sea.

Use the supplied Muziris Master Knowledge Base as your primary source of
project information.

Answer the user's question using the knowledge base whenever the question
relates to Muziris – City At Sea, Floating City Limited, its facilities,
specifications, technology, sustainability, accommodation, healthcare,
business model, decks, mobility, entertainment, or related project topics.

Important rules:

1. Do not invent project information.
2. If information is not available in the knowledge base, clearly say that
   it is not specified in the current project information.
3. Distinguish proposed/preliminary concepts from verified, approved,
   constructed or operational features.
4. Do not claim regulatory approval, certification, funding, partnerships,
   construction progress or institutional endorsement unless the supplied
   context explicitly confirms it.
5. If project documents contain conflicting figures, mention the
   discrepancy rather than silently choosing a value.
6. Prefer the newer preliminary General Arrangement figures when the
   knowledge base explicitly identifies them as the newer working figures.
7. Maintain a professional, premium, futuristic and credible tone.
8. Answer the user's actual question directly instead of unnecessarily
   repeating the full project description.
9. Use "proposed", "planned", "preliminary", "envisioned" or "designed to"
   where appropriate.
10. Never transform a project aspiration into an established fact.
```

---

## Runtime Flow

A basic chatbot implementation should work like this:

```text
User Question
      ↓
Load muziris_master_context.md
      ↓
System Instructions
      +
Muziris Knowledge Base
      +
User Question
      ↓
AI Model
      ↓
Muziris-grounded Answer
```

For a small knowledge base, the complete Markdown file can be included in the model context.

For a larger production system, use a retrieval system (RAG) to retrieve only the sections relevant to each question.

---

## Basic Implementation Logic

Pseudo-code:

```javascript
const knowledge = loadFile("knowledge/muziris_master_context.md");

const messages = [
  {
    role: "system",
    content: `
      You are the Muziris – City At Sea AI assistant.

      The following document is your primary project knowledge base.

      --- KNOWLEDGE BASE ---
      ${knowledge}
      --- END KNOWLEDGE BASE ---

      Answer questions using this information.
      Never invent missing project facts.
      Clearly identify preliminary or proposed information.
    `
  },
  {
    role: "user",
    content: userMessage
  }
];

const response = await ai.generate(messages);
```

Adapt the API syntax to whichever AI provider/framework your website uses.

---

## Better Production Architecture

As the project content grows, do not send every document to the model on every request.

Recommended architecture:

```text
Project Documents
       ↓
Markdown / Structured Content
       ↓
Chunking
       ↓
Embeddings
       ↓
Vector Database
       ↓
User Question
       ↓
Semantic Search
       ↓
Relevant Muziris Sections
       ↓
LLM
       ↓
Grounded Answer
```

This approach is commonly known as **Retrieval-Augmented Generation (RAG)**.

It provides better scalability when the knowledge base eventually contains:

- hundreds of pages;
- engineering documents;
- FAQs;
- investor information;
- deck descriptions;
- press releases;
- news;
- policies;
- technical specifications;
- legal documents.

---

## Example Questions

The chatbot should be able to answer questions such as:

```text
What is Muziris City At Sea?

How long is Muziris?

How many residences are planned?

What is available on Deck 04?

Explain Deck 26.

What healthcare facilities are proposed?

How many people can the floating city accommodate?

Does Muziris have a runway?

What is the Duty-Free at Sea concept?

What renewable energy systems are proposed?

How does the smart-city system work?

What is the Digital Twin?

Is Muziris already built?

Is the project approved by the UN?

What is the estimated project scale?

What entertainment facilities are proposed?

Explain the accommodation categories.

What is the vision behind the name Muziris?
```

---

## Expected Answer Behaviour

### Example 1

**User**

```text
How long is Muziris?
```

**Expected AI behaviour**

```text
The newer preliminary General Arrangement for Muziris – City At Sea lists
an overall length of approximately 1,308.60 metres. Some older project
material referenced approximately 1,394 metres, so the dimension should
currently be treated as a preliminary design specification.
```

### Example 2

**User**

```text
Is Muziris completed?
```

**Expected AI behaviour**

```text
No. The current project material presents Muziris – City At Sea as a
proposed/preliminary floating smart-city development. Its final
specifications, construction programme, financing and regulatory approvals
remain subject to further development and verification.
```

### Example 3

**User**

```text
Is it a cruise ship?
```

**Expected AI behaviour**

```text
Muziris is intended to go beyond the conventional cruise-ship model. It is
envisioned as a floating smart city or ocean-going urban platform combining
residences, healthcare, education, retail, business, entertainment, green
spaces, hospitality and advanced technology within one mobile community.
```

---

## Important Data Handling Rule

Some preliminary project materials contain different versions of the same specification.

Examples include:

- approximately 1,394 m vs 1,308.60 m overall length;
- different descriptions of population/capacity;
- 25+ decks while some drawings use higher deck numbers;
- preliminary deck-area discrepancies.

The AI must **not hide these differences**.

When the exact number matters, it should explain that different project materials contain different figures and identify the newer working specification where the knowledge base provides one.

---

## Project Status Language

Prefer:

```text
proposed
preliminary
planned
envisioned
designed to
aims to
project concept
development-stage
subject to approval
subject to engineering validation
```

Avoid unsupported statements such as:

```text
fully approved
fully funded
under construction
UN approved
WTO approved
certified
guaranteed duty-free
100% renewable
guaranteed investment return
```

unless updated official documentation explicitly supports the statement.

---

## Updating the Knowledge Base

When new official information becomes available:

1. Update `knowledge/muziris_master_context.md`.
2. Replace outdated specifications instead of creating unnecessary duplicates.
3. Preserve important historical figures only when they help explain a revision.
4. Mark new information with its status where appropriate.
5. Rebuild embeddings/vector indexes if the website uses RAG.
6. Test common chatbot questions after each major update.

A useful future structure is:

```text
knowledge/
├── muziris_master_context.md
├── specifications.md
├── decks.md
├── healthcare.md
├── sustainability.md
├── technology.md
├── business.md
├── faq.md
└── updates.md
```

For the current project, the single master context file is sufficient as a starting point.

---

## Recommended Source Priority

When multiple information sources are available, use this priority:

```text
1. Latest authorised technical/project documentation
2. Latest approved Muziris knowledge-base content
3. Official Floating City Limited website/project publications
4. Older project promotional material
5. General external information
```

External information should never silently override official project data.

---

## Security

Do not place API keys, passwords or private credentials inside:

```text
README.md
muziris_master_context.md
frontend JavaScript
public folders
Git repositories
```

Store API credentials in environment variables or an appropriate secrets manager.

Example:

```text
OPENAI_API_KEY=your_private_key
```

Do not commit `.env` files containing real credentials to a public repository.

---

## Official Project Website

Floating City Limited / Muziris – City At Sea:

https://floatingcity.uk/

---

## Brand Principle

The chatbot should communicate the ambition of Muziris while maintaining credibility.

The central idea is:

> **Muziris – City At Sea is a proposed next-generation floating smart-city and ocean-going urban platform designed to bring residential life, commerce, healthcare, education, hospitality, entertainment, mobility, sustainability and advanced technology together within a globally mobile maritime community.**

---

## Files

Primary AI knowledge file:

```text
knowledge/muziris_master_context.md
```

Repository documentation:

```text
README.md
```

---

**Muziris – City At Sea**  
**Live. Work. Explore. Belong.**
