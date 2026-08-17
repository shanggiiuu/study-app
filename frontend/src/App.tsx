import { useEffect, useState } from "react";
import { getAllUniversities, getUniversityById, searchUniversities } from "./api/universityApi";
import type { University } from "./types/university";
import UniversityList from "./components/UniversityList";
import UniversityDetail from "./components/UniversityDetail";

export default function App() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<University | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUniversities();
      setUniversities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load universities");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const trimmed = query.trim();
      const data = trimmed ? await searchUniversities({ name: trimmed }) : await getAllUniversities();
      setUniversities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleView(id: number) {
    setError(null);
    try {
      const data = await getUniversityById(id);
      setSelected(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load university");
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>University Search</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search university..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, marginRight: 8, width: 260 }}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {selected && <UniversityDetail university={selected} onClose={() => setSelected(null)} />}

      <UniversityList universities={universities} onView={handleView} />
    </div>
  );
}
