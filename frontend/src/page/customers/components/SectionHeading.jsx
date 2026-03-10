function SectionHeading({ label, title, subtitle, light = false }) {
  return (
    <div className="text-center mb-14">
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="w-8 h-px bg-amber-500" />
        <span className="text-amber-500 text-xs tracking-widest uppercase font-semibold">
          {label}
        </span>
        <span className="w-8 h-px bg-amber-500" />
      </div>
      <h2
        className={`font-bold leading-tight ${light ? "text-white" : "text-gray-900"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-sm leading-relaxed max-w-md mx-auto ${light ? "text-white/40" : "text-gray-400"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
