import { useEffect, useState, type FormEvent } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { flashcardsApi } from "../api/productivityApi";
import { extractErrorMessage } from "../api/client";
import type { Flashcard, FlashcardDeck } from "../types/academic";

export default function FlashcardsPage() {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [deck, setDeck] = useState<FlashcardDeck | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [dueOnly, setDueOnly] = useState(true);
  const [title, setTitle] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { flashcardsApi.decks().then(setDecks).catch((e) => setError(extractErrorMessage(e, "Unable to load flashcards"))); }, []);

  async function createDeck(e: FormEvent) {
    e.preventDefault();
    try {
      const saved = await flashcardsApi.createDeck({ title });
      setDecks((v) => [...v, saved]);
      setTitle("");
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to create deck"));
    }
  }

  async function open(selected: FlashcardDeck, onlyDue = true) {
    setDeck(selected);
    setDueOnly(onlyDue);
    const loaded = onlyDue && selected.dueCount > 0 ? await flashcardsApi.dueCards(selected.id) : await flashcardsApi.cards(selected.id);
    setCards(loaded);
    setIndex(0);
    setShowBack(false);
  }

  async function addCard(e: FormEvent) {
    e.preventDefault();
    if (!deck) return;
    try {
      const saved = await flashcardsApi.addCard(deck.id, { front, back });
      setCards((v) => [...v, saved]);
      setFront("");
      setBack("");
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to add card"));
    }
  }

  async function review(quality: number) {
    if (!deck || !cards[index]) return;
    await flashcardsApi.review(deck.id, cards[index].id, quality);
    setShowBack(false);
    setIndex((v) => Math.min(v + 1, cards.length - 1));
  }

  if (deck) {
    const card = cards[index];
    return (
      <div className="space-y-5">
        <button onClick={() => setDeck(null)} className="flex items-center gap-1 text-sm font-medium text-brand-600">
          <ChevronLeft size={16} /> All decks
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">{deck.title}</h1>
          {deck.dueCount > 0 && (
            <button onClick={() => void open(deck, !dueOnly)} className="text-sm font-medium text-brand-600">
              {dueOnly ? "Review full deck instead" : "Review due cards only"}
            </button>
          )}
        </div>
        {card ? (
          <div onClick={() => setShowBack((v) => !v)} className="min-h-52 cursor-pointer rounded-2xl border border-brand-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase text-brand-500">{showBack ? "Answer" : "Question"}</p>
            <p className="mt-6 text-xl font-medium text-slate-800">{showBack ? card.back : card.front}</p>
            <p className="mt-8 text-sm text-slate-400">Click to flip</p>
          </div>
        ) : (
          <p className="text-slate-400">{dueOnly ? "Nothing due right now — nice work." : "Add a card to start studying."}</p>
        )}
        {showBack && card && (
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => void review(0)} className="rounded-xl bg-red-100 px-4 py-2 font-semibold text-red-600">Again</button>
            <button onClick={() => void review(3)} className="rounded-xl bg-amber-100 px-4 py-2 font-semibold text-amber-600">Hard</button>
            <button onClick={() => void review(4)} className="rounded-xl bg-emerald-100 px-4 py-2 font-semibold text-emerald-600">Good</button>
            <button onClick={() => void review(5)} className="rounded-xl bg-sky-100 px-4 py-2 font-semibold text-sky-600">Easy</button>
          </div>
        )}
        <form onSubmit={addCard} className="grid gap-3 rounded-2xl border border-cream-200 bg-white p-4 sm:grid-cols-3">
          <input required value={front} onChange={(e) => setFront(e.target.value)} placeholder="Question" className="rounded-xl border border-slate-200 px-3 py-2" />
          <input required value={back} onChange={(e) => setBack(e.target.value)} placeholder="Answer" className="rounded-xl border border-slate-200 px-3 py-2" />
          <button className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white">Add card</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">Flashcards</h1>
        <p className="mt-1 text-slate-500">Build decks and review them with spaced repetition.</p>
      </header>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <form onSubmit={createDeck} className="flex gap-3">
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New deck name" className="flex-1 rounded-xl border border-slate-200 px-3 py-2" />
        <button className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white"><Plus size={16} /> Create deck</button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {decks.map((item) => (
          <button key={item.id} onClick={() => void open(item)} className="rounded-2xl border border-cream-200 bg-white p-5 text-left shadow-sm hover:border-brand-300">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">{item.title}</h2>
              {item.dueCount > 0 && <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-semibold text-white">{item.dueCount} due</span>}
            </div>
            <p className="mt-2 text-sm text-slate-400">{item.cardCount} cards</p>
          </button>
        ))}
      </div>
    </div>
  );
}
