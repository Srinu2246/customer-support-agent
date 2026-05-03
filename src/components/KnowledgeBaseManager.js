import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Edit2, Plus } from "lucide-react";
import { apiClient } from "@/api/client";

export function KnowledgeBaseManager() {
  const [kbEntries, setKbEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadKB();
  }, []);

  const loadKB = async () => {
    try {
      setLoading(true);
      const entries = await apiClient.getKnowledgeBase();
      setKbEntries(entries);
    } catch (error) {
      console.error("Failed to load KB:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.category.trim()
    ) {
      alert("All fields are required");
      return;
    }

    try {
      if (editingId) {
        await apiClient.updateKBEntry(
          editingId,
          formData.title,
          formData.content,
          formData.category
        );
      } else {
        await apiClient.addKBEntry(
          formData.title,
          formData.content,
          formData.category
        );
      }

      setFormData({ title: "", content: "", category: "" });
      setEditingId(null);
      setDialogOpen(false);
      await loadKB();
    } catch (error) {
      console.error("Failed to save KB entry:", error);
      alert("Failed to save entry");
    }
  };

  const handleEdit = (entry) => {
    setFormData({
      title: entry.title,
      content: entry.content,
      category: entry.category,
    });
    setEditingId(entry.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      await apiClient.deleteKBEntry(id);
      await loadKB();
    } catch (error) {
      console.error("Failed to delete entry:", error);
      alert("Failed to delete entry");
    }
  };

  const handleNewEntry = () => {
    setFormData({ title: "", content: "", category: "" });
    setEditingId(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Knowledge Base</h2>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewEntry} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Entry
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit KB Entry" : "Add KB Entry"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Update the knowledge base entry"
                  : "Add a new entry to the knowledge base"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Entry title"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Billing, Technical, General"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Entry content..."
                  className="w-full h-32 p-2 border rounded-md text-sm font-mono"
                />
              </div>

              <Button type="submit" className="w-full">
                {editingId ? "Update" : "Add"} Entry
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : kbEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No KB entries yet. Add one to get started.
          </p>
        ) : (
          kbEntries.map((entry) => (
            <Card key={entry.id} className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">
                    {entry.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {entry.category}
                  </p>
                  <p className="text-xs mt-1 line-clamp-2">
                    {entry.content}
                  </p>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-1 hover:bg-secondary rounded-md transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1 hover:bg-destructive/10 rounded-md transition-colors text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}