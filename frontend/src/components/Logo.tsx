interface LogoProps {
  size?: number;
  className?: string;
}

/** StudyDesk's mark: an open book on a blue gradient badge, ringed by the "Study Well" accent ellipse. */
export default function Logo({ size = 36, className = "" }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="studydesk-logo-gradient" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#93c5fd" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#studydesk-logo-gradient)" />
      <ellipse cx="20" cy="21" rx="14.5" ry="5.5" transform="rotate(-18 20 21)" fill="none" stroke="#fde047" strokeWidth="1.6" opacity="0.9" />
      <path
        d="M20 13c-3-1.5-6.2-1.8-8.4-1.3v12.6c2.2-.5 5.4-.2 8.4 1.3 3-1.5 6.2-1.8 8.4-1.3V11.7c-2.2-.5-5.4-.2-8.4 1.3Z"
        fill="white"
        opacity="0.96"
      />
      <path d="M20 13v12.6" stroke="#1d4ed8" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M14.5 6.2l.85 1.85L17.2 8.3l-1.4 1.3.35 1.9-1.65-.95-1.65.95.35-1.9-1.4-1.3 1.85-.25.85-1.85Z" fill="#fde047" />
    </svg>
  );
}
