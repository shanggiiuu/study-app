import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { notesApi } from "../api/productivityApi";
import { extractErrorMessage } from "../api/client";
import type { Note } from "../types/academic";

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    )
  );
}

/** Renders the AI-generated notes markdown (headings, bullets, bold) as readable HTML. */
function renderNoteBody(body: string): ReactNode {
  const lines = body.split("\n");
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];

  function flushList() {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={`list-${blocks.length}`} className="ml-5 list-disc space-y-1">
        {listItems.map((item, i) => (
          <li key={i}>{renderInline(item, `li-${blocks.length}-${i}`)}</li>
        ))}
      </ul>
    );
    listItems = [];
  }

  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (line.startsWith("## ")) {
      flushList();
      blocks.push(<h3 key={i} className="mt-4 text-base font-semibold text-slate-800 first:mt-0">{renderInline(line.slice(3), `h-${i}`)}</h3>);
    } else if (line.startsWith("# ")) {
      flushList();
      blocks.push(<h2 key={i} className="mt-4 text-lg font-semibold text-slate-800 first:mt-0">{renderInline(line.slice(2), `h-${i}`)}</h2>);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      listItems.push(line.slice(2));
    } else if (line === "") {
      flushList();
    } else {
      flushList();
      blocks.push(<p key={i} className="leading-relaxed">{renderInline(line, `p-${i}`)}</p>);
    }
  });
  flushList();

  return <div className="space-y-2 text-sm text-slate-600">{blocks}</div>;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editing, setEditing] = useState<Note | null>(null);
  const [viewing, setViewing] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    notesApi.list().then(setNotes).catch((e) => setError(extractErrorMessage(e, "Unable to load notes")));
  }, []);

  function begin(note?: Note) {
    setViewing(null);
    setEditing(note ?? null);
    setTitle(note?.title ?? "");
    setBody(note?.body ?? "");
    setShowEditor(true);
  }

  function close() {
    setShowEditor(false);
    setEditing(null);
    setTitle("");
    setBody("");
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    try {
      const note = editing ? await notesApi.update(editing.id, { title, body }) : await notesApi.create({ title, body });
      setNotes((v) => (editing ? v.map((x) => (x.id === note.id ? note : x)) : [note, ...v]));
      close();
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to save note"));
    }
  }

  async function remove(id: number) {
    try {
      await notesApi.delete(id);
      setNotes((v) => v.filter((x) => x.id !== id));
      setViewing((v) => (v?.id === id ? null : v));
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to delete note"));
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Notes</h1>
          <p className="mt-1 text-slate-500">Keep your study ideas organized. Click a note to open it.</p>
        </div>
        <button onClick={() => begin()} className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white">
          <Plus size={16} /> New note
        </button>
      </header>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {notes.map((note) => (
          <article
            key={note.id}
            onClick={() => setViewing(note)}
            className="cursor-pointer rounded-2xl border border-cream-200 bg-white p-5 shadow-sm hover:border-brand-300"
          >
            <div className="flex justify-between gap-3">
              <h2 className="font-semibold text-slate-800">{note.title}</h2>
              <div className="flex shrink-0 gap-2">
                <button onClick={(e) => { e.stopPropagation(); begin(note); }} className="text-slate-400 hover:text-brand-600" aria-label="Edit note">
                  <Pencil size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); void remove(note.id); }} className="text-slate-400 hover:text-red-600" aria-label="Delete note">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="mt-3 line-clamp-5">{renderNoteBody(note.body)}</div>
            <p className="mt-4 text-xs text-slate-400">Updated {new Date(note.updatedAt).toLocaleDateString()}</p>
          </article>
        ))}
        {notes.length === 0 && <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-400">No notes yet.</p>}
      </div>

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4" onClick={() => setViewing(null)}>
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-800">{viewing.title}</h2>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => begin(viewing)} className="text-slate-400 hover:text-brand-600" aria-label="Edit note"><Pencil size={16} /></button>
                <button onClick={() => setViewing(null)} className="text-slate-400 hover:text-slate-700" aria-label="Close">✕</button>
              </div>
            </div>
            <div className="mt-4">{renderNoteBody(viewing.body)}</div>
          </div>
        </div>
      )}

      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
          <form onSubmit={save} className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">{editing ? "Edit note" : "New note"}</h2>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded-xl border border-slate-200 px-3 py-2" />
            <textarea required value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your note…" rows={9} className="w-full rounded-xl border border-slate-200 px-3 py-2" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={close} className="rounded-xl px-4 py-2 text-slate-500">Cancel</button>
              <button className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white">Save note</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
