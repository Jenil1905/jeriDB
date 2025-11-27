# jeriDB - Hybrid Vector + Graph Native Database

## 🚩 The Problem
Modern AI systems need both semantic understanding and structural reasoning.
*   **Vector DBs** miss deep relationships.
*   **Graph DBs** miss semantic similarity.

**jeriDB** solves this by combining both into a single, minimal system that outperforms single-mode retrieval.

## 💡 Our Solution
A hybrid database that bridges the gap:

*   **Hybrid Ingestion**: Automatically routes data to **LanceDB** (Vector) for similarity and **Neo4j** (Graph) for relationships.
*   **Unified Retrieval**: Merges vector similarity scores with graph relationship boosts for context-aware results.
*   **Local-First**: Runs entirely locally using **Xenova Transformers** for embeddings—no external API keys required.

## ✨ Key Features
*   **Hybrid Search**: Weighted combination of vector + graph scores.
*   **Multi-hop Reasoning**: Traverses graph relationships (2-3 hops) to find indirect connections.
*   **Vector & Graph Modes**: Flexible querying for specific needs.
*   **Full CRUD**: Complete API for managing Nodes and Edges.

## 🛠️ Tech Stack
*   **Backend**: Node.js, Express
*   **Vector Store**: LanceDB
*   **Graph Store**: Neo4j
*   **Embeddings**: Xenova Transformers (Local, On-device)
*   **Frontend**: React, Vite

## 🚀 Getting Started

### 1. Backend
```bash
cd backend
npm install
# Configure .env with NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD
npm start
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

---
*Built for Devfolio Problem Statement 1: Vector + Graph Native Database for Efficient AI Retrieval*