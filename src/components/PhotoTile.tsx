import { useRef } from "react";
import { icons } from "../assets";
import { Icon } from "./Icon";

interface FilledProps {
  src: string;
  size?: number;
  onRemove?: () => void;
  label?: string;
}

/** Filled upload slot: photo with a remove button (32px visual, 44px hit area). */
export function PhotoTile({ src, size = 96, onRemove, label = "photo" }: FilledProps) {
  return (
    <div className="photo-tile" style={{ width: size, height: size }}>
      <img src={src} alt="" />
      {onRemove && (
        <button type="button" className="photo-tile__remove" aria-label={`Remove ${label}`} onClick={onRemove}>
          <span>
            <Icon src={icons.x} size={16} />
          </span>
        </button>
      )}
    </div>
  );
}

/** Empty upload slot: dashed border + camera. Opens the file picker. */
export function AddPhotoTile({ onAdd }: { onAdd: (urls: string[]) => void }) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <button type="button" className="photo-tile photo-tile--empty" onClick={() => input.current?.click()}>
        <Icon src={icons.camera} size={24} />
        <span className="t-label-small">Add photo</span>
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onAdd(files.map((f) => URL.createObjectURL(f)));
          e.target.value = "";
        }}
      />
    </>
  );
}
