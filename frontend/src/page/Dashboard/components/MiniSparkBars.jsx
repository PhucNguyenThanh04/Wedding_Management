function MiniSparkBars({ values, color }) {
  const max = Math.max(...values);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 2,
        height: 40,
        marginTop: 8,
      }}
    >
      {values.map((v, i) => {
        const h = Math.round((v / max) * 36) + 4;
        const isLast = i === values.length - 1;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: h,
              background: isLast ? color : color + "55",
              borderRadius: "3px 3px 0 0",
              cursor: "pointer",
              transition: "opacity .2s",
            }}
          />
        );
      })}
    </div>
  );
}

export default MiniSparkBars;
