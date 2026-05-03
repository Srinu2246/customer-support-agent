const fs = require("fs/promises");
const path = require("path");
const { addToVectorDB, searchVectorDB } = require("./vector-db");

const KB_FILE = path.join(process.cwd(), "backend/src/data/knowledge-base.json");

// In-memory store
let knowledgeBase = [];

async function initializeKB() {
  try {
    const data = await fs.readFile(KB_FILE, "utf-8");
    knowledgeBase = JSON.parse(data);
    console.log(`Loaded ${knowledgeBase.length} KB entries`);
  } catch (error) {
    console.log("No existing KB file, starting fresh");
    knowledgeBase = [];
  }
}

async function getKB() {
  if (knowledgeBase.length === 0) {
    await initializeKB();
  }
  return knowledgeBase;
}

async function addKBEntry(title, content, category) {
  const id = `kb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const entry = {
    id,
    title,
    content,
    category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  knowledgeBase.push(entry);
  await saveKB();

  await addToVectorDB(id, `${title} ${content}`, { category, title });

  return entry;
}

async function updateKBEntry(id, title, content, category) {
  const index = knowledgeBase.findIndex((e) => e.id === id);

  if (index === -1) return null;

  knowledgeBase[index] = {
    ...knowledgeBase[index],
    title,
    content,
    category,
    updatedAt: new Date().toISOString(),
  };

  await saveKB();

  await addToVectorDB(id, `${title} ${content}`, { category, title });

  return knowledgeBase[index];
}

async function deleteKBEntry(id) {
  const index = knowledgeBase.findIndex((e) => e.id === id);

  if (index === -1) return false;

  knowledgeBase.splice(index, 1);
  await saveKB();

  return true;
}

async function searchKB(query) {
  // Vector search
  const vectorResults = await searchVectorDB(query, 5);

  if (vectorResults.length > 0) {
    const resultIds = vectorResults.map((r) => r.id);
    return knowledgeBase.filter((entry) => resultIds.includes(entry.id));
  }

  // Keyword fallback
  const queryLower = query.toLowerCase();

  return knowledgeBase.filter(
    (entry) =>
      entry.title.toLowerCase().includes(queryLower) ||
      entry.content.toLowerCase().includes(queryLower) ||
      entry.category.toLowerCase().includes(queryLower)
  );
}

async function getKBByCategory(category) {
  return knowledgeBase.filter(
    (e) => e.category.toLowerCase() === category.toLowerCase()
  );
}

async function saveKB() {
  try {
    await fs.mkdir(path.dirname(KB_FILE), { recursive: true });

    await fs.writeFile(
      KB_FILE,
      JSON.stringify(knowledgeBase, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error saving KB:", error);
  }
}

initializeKB();

module.exports = {
  initializeKB,
  getKB,
  addKBEntry,
  updateKBEntry,
  deleteKBEntry,
  searchKB,
  getKBByCategory,
};