interface Props {
  title: string;
  phase: string;
}

export default function PlaceholderPage({ title, phase }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
      <div className="mt-6 rounded-2xl border border-dashed border-lavender-300 bg-white p-10 text-center">
        <p className="text-slate-500">
          {title} isn't built yet — it lands in <span className="font-medium text-lavender-700">{phase}</span> of
          the build plan.
        </p>
      </div>
    </div>
  );
}
