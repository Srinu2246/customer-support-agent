const { Index } = require("@upstash/vector");

let vectorIndex = null;

function initializeVectorDB() {
  if (!process.env.UPSTASH_VECTOR_URL || !process.env.UPSTASH_VECTOR_TOKEN) {
    console.warn("Upstash Vector DB not configured - using in-memory fallback");
    return null;
  }

  try {
    vectorIndex = new Index({
      url: process.env.UPSTASH_VECTOR_URL,
      token: process.env.UPSTASH_VECTOR_TOKEN,
    });

    return vectorIndex;
  } catch (error) {
    console.error("Failed to initialize Vector DB:", error);
    return null;
  }
}

async function addToVectorDB(id, text, metadata) {
  const index = initializeVectorDB();

  if (!index) {
    console.log("Vector DB not available, skipping embedding");
    return;
  }

  try {
    // Simple demo embedding
    const embedding = generateSimpleEmbedding(text);

    await index.upsert([
      {
        id: id,
        values: embedding,
        metadata: {
          ...metadata,
          text: text,
        },
      },
    ]);
  } catch (error) {
    console.error("Error adding to vector DB:", error);
  }
}

async function searchVectorDB(query, limit = 5) {
  const index = initializeVectorDB();

  if (!index) {
    console.log("Vector DB not available, returning empty results");
    return [];
  }

  try {
    const queryEmbedding = generateSimpleEmbedding(query);

    const results = await index.query(queryEmbedding, {
      topK: limit,
    });

    return results;
  } catch (error) {
    console.error("Error searching vector DB:", error);
    return [];
  }
}

// Simple embedding generator (demo)
function generateSimpleEmbedding(text) {
  const embedding = new Array(384).fill(0);

  const words = text.toLowerCase().split(/\s+/);

  for (let i = 0; i < words.length; i++) {
    const charCode = words[i].charCodeAt(0) || 0;
    const hash = (charCode * 73856093) ^ (i * 19349663);

    embedding[Math.abs(hash) % 384] += 0.1;
  }

  // Normalize vector
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0)
  );

  return magnitude > 0 ? embedding.map((v) => v / magnitude) : embedding;
}

module.exports = {
  initializeVectorDB,
  addToVectorDB,
  searchVectorDB,
  generateSimpleEmbedding,
};