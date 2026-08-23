import { useEffect, useState } from "react";
import { ChevronLeft, HelpCircle, Trash2 } from "lucide-react";
import { quizApi } from "../api/quizApi";
import { extractErrorMessage } from "../api/client";
import type { Quiz, QuizAttemptResult, QuizDetail } from "../types/academic";

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [detail, setDetail] = useState<QuizDetail | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { quizApi.list().then(setQuizzes).catch((e) => setError(extractErrorMessage(e, "Unable to load quizzes"))); }, []);

  async function open(quiz: Quiz) {
    try {
      const full = await quizApi.getOne(quiz.id);
      setDetail(full);
      setAnswers({});
      setResult(null);
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to load quiz"));
    }
  }

  async function remove(id: number) {
    try {
      await quizApi.delete(id);
      setQuizzes((v) => v.filter((q) => q.id !== id));
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to delete quiz"));
    }
  }

  async function submit() {
    if (!detail) return;
    setSubmitting(true);
    try {
      const attempt = await quizApi.submitAttempt(detail.quiz.id, answers);
      setResult(attempt);
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to submit quiz"));
    } finally {
      setSubmitting(false);
    }
  }

  if (detail) {
    return (
      <div className="space-y-5">
        <button onClick={() => setDetail(null)} className="flex items-center gap-1 text-sm font-medium text-brand-600">
          <ChevronLeft size={16} /> All quizzes
        </button>
        <h1 className="text-2xl font-semibold text-slate-800">{detail.quiz.title}</h1>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        {result && (
          <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
            <p className="text-lg font-semibold text-slate-800">Score: {result.score} / {result.total}</p>
          </div>
        )}
        <div className="space-y-4">
          {detail.questions.map((q, i) => {
            const r = result?.results.find((res) => res.questionId === q.id);
            return (
              <div key={q.id} className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm">
                <p className="font-medium text-slate-800">{i + 1}. {q.question}</p>
                {q.type === "MCQ" ? (
                  <div className="mt-3 space-y-2">
                    {q.options.map((opt) => (
                      <label key={opt} className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          disabled={!!result}
                          checked={answers[q.id] === opt}
                          onChange={() => setAnswers((v) => ({ ...v, [q.id]: opt }))}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    disabled={!!result}
                    value={answers[q.id] ?? ""}
                    onChange={(e) => setAnswers((v) => ({ ...v, [q.id]: e.target.value }))}
                    placeholder="Your answer"
                    className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                )}
                {r && (
                  <div className={`mt-3 rounded-xl p-3 text-sm ${r.correct ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                    <p className="font-semibold">{r.correct ? "Correct" : `Incorrect — correct answer: ${r.correctAnswer}`}</p>
                    {r.explanation && <p className="mt-1 text-slate-500">{r.explanation}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {!result && (
          <button
            onClick={() => void submit()}
            disabled={submitting}
            className="rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white disabled:opacity-60"
          >
            {submitting ? "Scoring…" : "Submit quiz"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">Quizzes</h1>
        <p className="mt-1 text-slate-500">Generate a quiz from a document to test yourself.</p>
      </header>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="flex items-start gap-4 rounded-2xl border border-cream-200 bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-brand-100 p-3 text-brand-600"><HelpCircle size={20} /></div>
            <button onClick={() => void open(quiz)} className="min-w-0 flex-1 text-left">
              <h2 className="font-semibold text-slate-800">{quiz.title}</h2>
              <p className="mt-1 text-sm text-slate-400">{quiz.questionCount} questions</p>
            </button>
            <button onClick={() => void remove(quiz.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={17} /></button>
          </div>
        ))}
        {quizzes.length === 0 && (
          <p className="col-span-2 rounded-2xl bg-white p-6 text-center text-sm text-slate-400">
            No quizzes yet — generate one from a document on the Documents page.
          </p>
        )}
      </div>
    </div>
  );
}
