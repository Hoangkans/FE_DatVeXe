import { useState } from "react";

export default function LocationPicker(props) {
  const {
    label = "",
    placeholder = "Chọn địa điểm",
    value = "",
    options = [],
    onSelect,
  } = props || {};

  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((s) => !s);
  const handleSelect = (val) => {
    if (onSelect) onSelect(val);
    setOpen(false);
  };

  return (
    <div
      className="searchbox__item picker"
      role="button"
      tabIndex={0}
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={toggle}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggle()}
    >
      <div className="searchbox__label">{label}</div>
      <div className="searchbox__value">{value || placeholder}</div>

      {open && (
        <div className="picker__menu" role="listbox">
          <div className="picker__header">Tỉnh - Thành Phố</div>
          <div className="picker__list">
            {(options || []).map((opt) => (
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

