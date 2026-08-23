import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, HelpCircle, Layers, MessageCircle, Send, StickyNote, Trash2, Upload } from "lucide-react";
import { documentsApi } from "../api/productivityApi";
import { extractErrorMessage } from "../api/client";
import type { DocumentItem } from "../types/academic";

type Message = { role: "user" | "assistant"; text: string };
type Busy = "flashcards" | "notes" | "quiz" | null;

export default function DocumentsPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [busyAction, setBusyAction] = useState<Busy>(null);
  const [chatOpenId, setChatOpenId] = useState<number | null>(null);
  const [chats, setChats] = useState<Record<number, Message[]>>({});
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { documentsApi.list().then(setDocuments).catch((e) => setError(extractErrorMessage(e, "Unable to load documents"))); }, []);

  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const document = await documentsApi.upload(file);
      setDocuments((v) => [document, ...v]);
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to upload document"));
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  }

  async function remove(id: number) {
    try {
      await documentsApi.delete(id);
      setDocuments((v) => v.filter((x) => x.id !== id));
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to delete document"));
    }
  }

  async function generateFlashcards(id: number) {
    setBusyId(id); setBusyAction("flashcards");
    try {
      const deck = await documentsApi.generateFlashcards(id);
      navigate("/flashcards");
      void deck;
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to generate flashcards"));
    } finally {
      setBusyId(null); setBusyAction(null);
    }
  }

  async function generateNotes(id: number) {
    setBusyId(id); setBusyAction("notes");
    try {
      await documentsApi.generateNotes(id);
      navigate("/notes");
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to generate notes"));
    } finally {
      setBusyId(null); setBusyAction(null);
    }
  }

  async function generateQuiz(id: number) {
    setBusyId(id); setBusyAction("quiz");
    try {
      await documentsApi.generateQuiz(id);
      navigate("/quizzes");
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to generate quiz"));
    } finally {
      setBusyId(null); setBusyAction(null);
    }
  }

  async function sendChat(id: number) {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setChats((v) => ({ ...v, [id]: [...(v[id] ?? []), { role: "user", text }] }));
    setChatInput("");
    setChatLoading(true);
    try {
      const answer = await documentsApi.chat(id, text);
      setChats((v) => ({ ...v, [id]: [...(v[id] ?? []), { role: "assistant", text: answer }] }));
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to chat about this document"));
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Documents</h1>
          <p className="mt-1 text-slate-500">
            Upload PDFs, Word docs, slides, images (like a photo of a whiteboard), audio, or video, and let AI turn
            them into flashcards, notes, and quizzes.
          </p>
        </div>
        <button onClick={() => input.current?.click()} disabled={uploading} className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white">
          <Upload size={16} /> {uploading ? "Uploading…" : "Upload file"}
        </button>
        <input
          ref={input}
          type="file"
          accept=".pdf,.txt,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.heic,.webp,.mp3,.wav,.m4a,.ogg,.mp4,.mov,.webm,application/pdf,text/plain,image/*,audio/*,video/*,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          className="hidden"
          onChange={(e) => void upload(e.target.files?.[0])}
        />
      </header>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <div className="space-y-3">
        {documents.map((document) => {
          const busy = busyId === document.id ? busyAction : null;
          const chatOpen = chatOpenId === document.id;
          return (
            <article key={document.id} className="rounded-2xl border border-cream-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-brand-100 p-3 text-brand-600"><FileText size={20} /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-800">{document.title}</p>
                  <p className="text-sm text-slate-400">{document.originalFilename} · {(document.byteSize / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => void remove(document.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={17} /></button>
              </div>

              {document.textExtracted ? (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-cream-100 pt-3">
                  <button onClick={() => void generateFlashcards(document.id)} disabled={busy !== null} className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 disabled:opacity-50">
                    <Layers size={14} /> {busy === "flashcards" ? "Generating…" : "Generate Flashcards"}
                  </button>
                  <button onClick={() => void generateNotes(document.id)} disabled={busy !== null} className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 disabled:opacity-50">
                    <StickyNote size={14} /> {busy === "notes" ? "Generating…" : "Generate Notes"}
                  </button>
                  <button onClick={() => void generateQuiz(document.id)} disabled={busy !== null} className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 disabled:opacity-50">
                    <HelpCircle size={14} /> {busy === "quiz" ? "Generating…" : "Generate Quiz"}
                  </button>
                  <button onClick={() => setChatOpenId(chatOpen ? null : document.id)} className="flex items-center gap-1.5 rounded-lg bg-cream-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-cream-200">
                    <MessageCircle size={14} /> {chatOpen ? "Close chat" : "Chat about this document"}
                  </button>
                </div>
              ) : (
                <p className="mt-3 border-t border-cream-100 pt-3 text-xs text-slate-400">
                  No text extracted yet. For images/audio/video this runs through AI and can occasionally fail or
                  take a moment — try re-uploading if this seems wrong.
                </p>
              )}

              {chatOpen && (
                <div className="mt-3 space-y-3 rounded-xl bg-cream-50 p-3">
                  <div className="max-h-64 space-y-2 overflow-y-auto">
                    {(chats[document.id] ?? []).map((m, i) => (
                      <div key={i} className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${m.role === "user" ? "ml-auto bg-brand-600 text-white" : "bg-white text-slate-700"}`}>{m.text}</div>
                    ))}
                    {chatLoading && <div className="w-fit rounded-xl bg-white px-3 py-2 text-sm text-slate-500">Thinking…</div>}
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); void sendChat(document.id); }} className="flex gap-2">
                    <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask about this document…" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm" />
                    <button disabled={chatLoading} className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60"><Send size={14} /></button>
                  </form>
                </div>
              )}
            </article>
          );
        })}
        {documents.length === 0 && <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-400">No documents uploaded yet.</p>}
      </div>
    </div>
  );
}
