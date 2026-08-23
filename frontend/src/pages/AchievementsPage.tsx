import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Clock, FileCheck, Flame, FolderOpen, HelpCircle, Layers, Lock, Moon, Sparkles, StickyNote, Sunrise, Target, Trophy } from "lucide-react";
import * as subjectsApi from "../api/subjectsApi";
import * as assignmentsApi from "../api/assignmentsApi";
import * as examsApi from "../api/examsApi";
import { goalsApi, notesApi, documentsApi, flashcardsApi, sessionsApi } from "../api/productivityApi";
import { quizApi } from "../api/quizApi";
import { extractErrorMessage } from "../api/client";
import type { Flashcard } from "../types/academic";
import { computeGamification, type Achievement, type GamificationSummary } from "../utils/achievements";

const ICONS: Record<Achievement["icon"], typeof Sparkles> = {
  sparkles: Sparkles, bookOpen: BookOpen, checkCircle: CheckCircle2, fileCheck: FileCheck, target: Target,
  stickyNote: StickyNote, folder: FolderOpen, layers: Layers, helpCircle: HelpCircle, flame: Flame, clock: Clock,
  sunrise: Sunrise, moon: Moon,
};

export default function AchievementsPage() {
  const [summary, setSummary] = useState<GamificationSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      subjectsApi.listSubjects(),
      assignmentsApi.listAssignments(),
      examsApi.listExams(),
      goalsApi.list(),
      notesApi.list(),
      documentsApi.list(),
      flashcardsApi.decks(),
      quizApi.list(),
      sessionsApi.list(),
    ])
      .then(async ([subjects, assignments, exams, goals, notes, documents, decks, quizzes, sessions]) => {
        const cardLists = await Promise.all(decks.map((d) => flashcardsApi.cards(d.id)));
        const cards: Flashcard[] = cardLists.flat();
        setSummary(computeGamification({ subjects, assignments, exams, goals, notes, documents, decks, cards, quizzes, sessions }));
      })
      .catch((e) => setError(extractErrorMessage(e, "Unable to load achievements")));
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <div className="flex items-center gap-2"><div className="rounded-xl bg-brand-600 p-2 text-white"><Trophy size={20} /></div><h1 className="text-2xl font-semibold text-slate-800">Achievements</h1></div>
        <p className="mt-2 text-slate-500">Level up by studying, staying on top of work, and using StudyDesk's tools.</p>
      </header>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {summary && (
        <section className="rounded-2xl border border-cream-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-xl font-bold text-white">{summary.level}</div>
              <div>
                <p className="text-lg font-semibold text-slate-800">Level {summary.level}</p>
                <p className="text-sm text-slate-500">{summary.xp} XP total · {summary.unlockedCount}/{summary.achievements.length} badges unlocked</p>
              </div>
            </div>
            <div className="w-full max-w-xs sm:w-56">
              <div className="flex justify-between text-xs text-slate-400"><span>{summary.xpIntoLevel} XP</span><span>{summary.xpForNextLevel} XP</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-cream-100"><div className="h-full bg-brand-500 transition-all" style={{ width: `${summary.levelProgressPercent}%` }} /></div>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summary?.achievements.map((a) => {
          const Icon = ICONS[a.icon];
          return (
            <article key={a.id} className={`rounded-2xl border p-5 shadow-sm ${a.unlocked ? "border-brand-200 bg-brand-50" : "border-cream-200 bg-white"}`}>
              <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.unlocked ? "bg-brand-600 text-white" : "bg-cream-100 text-slate-400"}`}>
                  {a.unlocked ? <Icon size={20} /> : <Lock size={18} />}
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${a.unlocked ? "bg-brand-600 text-white" : "bg-cream-100 text-slate-400"}`}>+{a.xp} XP</span>
              </div>
              <h2 className={`mt-3 font-semibold ${a.unlocked ? "text-slate-800" : "text-slate-500"}`}>{a.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{a.description}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream-100"><div className={`h-full ${a.unlocked ? "bg-brand-500" : "bg-slate-300"}`} style={{ width: `${Math.round((a.current / a.target) * 100)}%` }} /></div>
              <p className="mt-1.5 text-xs text-slate-400">{a.current}/{a.target}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
