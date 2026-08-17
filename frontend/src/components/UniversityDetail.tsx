import type { University } from "../types/university";

interface UniversityDetailProps {
  university: University;
  onClose: () => void;
}

export default function UniversityDetail({ university, onClose }: UniversityDetailProps) {
  return (
    <div style={{ border: "1px solid #999", padding: 16, marginBottom: 16 }}>
      <button onClick={onClose}>Close</button>
      <h2>{university.name}</h2>
      <p>
        {university.country}
        {university.city ? ` — ${university.city}` : ""}
      </p>
      {university.website && (
        <p>
          <a href={university.website} target="_blank" rel="noreferrer">
            {university.website}
          </a>
        </p>
      )}
      {university.description && <p>{university.description}</p>}
      <p>Programs: {university.programs?.join(", ") || "N/A"}</p>
      <p>
        Tuition: {university.tuition != null ? `${university.tuition} ${university.currency ?? ""}` : "N/A"}
      </p>
      <p>Acceptance rate: {university.acceptanceRate != null ? `${(university.acceptanceRate * 100).toFixed(1)}%` : "N/A"}</p>
      <p>Ranking: {university.ranking ?? "N/A"}</p>
    </div>
  );
}
