import type { University } from "../types/university";

interface UniversityListProps {
  universities: University[];
  onView: (id: number) => void;
}

export default function UniversityList({ universities, onView }: UniversityListProps) {
  if (universities.length === 0) {
    return <p>No universities found.</p>;
  }

  return (
    <div>
      {universities.map((university) => (
        <div key={university.id} style={{ borderBottom: "1px solid #ccc", padding: "12px 0" }}>
          <h3 style={{ margin: 0 }}>{university.name}</h3>
          <p style={{ margin: "4px 0" }}>
            {university.country}
            {university.city ? ` — ${university.city}` : ""}
          </p>
          <p style={{ margin: "4px 0" }}>{university.programs?.join(", ")}</p>
          <button onClick={() => onView(university.id)}>View</button>
        </div>
      ))}
    </div>
  );
}
