import { useState } from "react";

export default function LocationPicker({
  label,
  placeholder,
  value,
  options = [],
  onSelect,
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (val) => {
    onSelect && onSelect(val);
    setOpen(false);
  };

  return (
    <div
      className="searchbox__item picker"
      role="button"
      tabIndex={0}
      onClick={() => setOpen((s) => !s)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen((s) => !s)}
    >
      <div className="searchbox__label">{label}</div>
      <div className="searchbox__value">{value || placeholder}</div>

      {open && (
        <div className="picker__menu" role="listbox">
          <div className="picker__header">Tỉnh - Thành Phố</div>
          <div className="picker__list">
            {options.map((opt) => (
              <div
                key={opt}
                className="picker__option"
                role="option"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(opt);
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

