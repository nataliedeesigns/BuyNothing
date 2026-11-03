import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { icons } from "../assets";
import { Button } from "../components/Button";
import { Chip } from "../components/Chip";
import { GivingMethodChoice } from "../components/GivingMethodOption";
import { Icon } from "../components/Icon";
import { SelectField, TextAreaField, TextField } from "../components/InputField";
import { AddPhotoTile, PhotoTile } from "../components/PhotoTile";
import { Tag } from "../components/Tag";
import { ToggleRow } from "../components/Toggle";
import { BackTopBar } from "../components/TopBar";
import { allCategories, endOptions, type Category, type Giveaway, type Method } from "../data";
import { useGiving } from "../state/giving";

const MAX_PHOTOS = 5;
const DESCRIPTION_LIMIT = 500;
const categoryOptions = allCategories.map((c) => ({ value: c, label: c }));
const endSelectOptions = endOptions.map((o) => ({ value: o.value, label: o.label }));

function newGiveaway(
  base: { title: string; category: Category; photos: string[]; description?: string; pickup?: string },
  method: Method,
  endValue: string,
): Omit<Giveaway, "id"> {
  const end = endOptions.find((o) => o.value === endValue) ?? endOptions[2];
  return {
    title: base.title.trim(),
    category: base.category,
    method,
    photos: base.photos,
    description: base.description?.trim() ?? "",
    pickup: base.pickup?.trim() || "Porch pickup",
    status: "active",
    endsLabel: `${end.day} 5 PM`,
    endsDay: end.day,
    daysLeft: end.daysLeft,
    views: 0,
    postedLabel: "Posted today",
    interested: [],
  };
}

/** M5 / M6 · Give — post one item or several. */
export function Give() {
  const [mode, setMode] = useState<"one" | "several">("one");
  return (
    <>
      <BackTopBar title="Give" fallback="/" />
      <main className="m-page narrow-page give">
        {mode === "one" ? (
          <h1 className="t-display-l">
            What are you <em>giving?</em>
          </h1>
        ) : (
          <>
            <h1 className="t-display-l">
              Clearing out a <em>closet?</em>
            </h1>
            <p className="t-body muted">Add each item once, then set the rules for all of them together.</p>
          </>
        )}
        <div className="chip-group chip-group--nowrap" role="group" aria-label="Post mode">
          <Chip label="One item" selected={mode === "one"} onClick={() => setMode("one")} />
          <Chip label="Several items" selected={mode === "several"} onClick={() => setMode("several")} />
        </div>
        {mode === "one" ? <PostOne /> : <PostSeveral />}
      </main>
    </>
  );
}

/* ================= M5 · One item ================= */

function PostOne() {
  const { add, saveDraft, draftSaved } = useGiving();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [method, setMethod] = useState<Method>("Random pick");
  const [ends, setEnds] = useState("sat");
  const [pickup, setPickup] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const post = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Give your item a name.";
    if (!category) e.category = "Choose a category.";
    if (photos.length === 0) e.photos = "Add at least one photo.";
    setErrors(e);
    if (Object.keys(e).length) return;
    const [id] = add([newGiveaway({ title, category: category as Category, photos, description, pickup }, method, ends)]);
    navigate(`/giving/${id}`);
  };

  return (
    <>
      <fieldset className="filter-group">
        <legend className="t-label">
          Photos ({photos.length} of {MAX_PHOTOS})
        </legend>
        <div className="photo-row">
          {photos.map((src, i) => (
            <PhotoTile key={src} src={src} label={`photo ${i + 1}`} onRemove={() => setPhotos((p) => p.filter((x) => x !== src))} />
          ))}
          {photos.length < MAX_PHOTOS && (
            <AddPhotoTile onAdd={(urls) => setPhotos((p) => [...p, ...urls].slice(0, MAX_PHOTOS))} />
          )}
        </div>
        {errors.photos && (
          <p className="t-body-small field__helper field__helper--error" role="alert">
            {errors.photos}
          </p>
        )}
      </fieldset>

      <TextField label="Item name" placeholder="e.g. Green velvet sofa" value={title} onChange={setTitle} error={errors.title} />
      <TextAreaField
        label="Description"
        placeholder="Condition, size, anything a neighbor should know…"
        helper={`Optional · ${DESCRIPTION_LIMIT} characters`}
        value={description}
        maxLength={DESCRIPTION_LIMIT}
        onChange={setDescription}
      />
      <SelectField
        label="Category"
        placeholder="Choose a category"
        value={category}
        options={categoryOptions}
        onChange={setCategory}
        error={errors.category}
      />
      <GivingMethodChoice name="method-one" value={method} onChange={setMethod} />
      <SelectField
        label="Giveaway ends"
        helper="We’ll notify interested neighbors 1 hour before."
        value={ends}
        options={endSelectOptions}
        onChange={setEnds}
      />
      <TextField
        label="Pickup"
        placeholder="Porch pickup near Elm & 3rd"
        helper="Exact address is only shared with the recipient."
        value={pickup}
        onChange={setPickup}
      />
      <Button icon={icons.post} fullWidth onClick={post}>
        Post giveaway
      </Button>
      <Button variant="secondary" fullWidth onClick={saveDraft}>
        {draftSaved ? "Draft saved" : "Save as draft"}
      </Button>
    </>
  );
}

/* ================= M6 · Several items ================= */

interface DraftItem {
  key: string;
  title: string;
  category: Category;
  photos: string[];
}

function PostSeveral() {
  const { add } = useGiving();
  const navigate = useNavigate();
  const [list, setList] = useState<DraftItem[]>([]);
  const [editing, setEditing] = useState<DraftItem | "new" | null>("new");
  const [method, setMethod] = useState<Method>("Random pick");
  const [onePerNeighbor, setOnePerNeighbor] = useState(true);
  const [ends, setEnds] = useState("sat");

  const save = (item: DraftItem) => {
    setList((l) => (l.some((x) => x.key === item.key) ? l.map((x) => (x.key === item.key ? item : x)) : [...l, item]));
    setEditing(null);
  };

  const post = () => {
    add(list.map((i) => newGiveaway(i, method, ends)));
    navigate("/my-items");
  };

  const count = list.length;

  return (
    <>
      <div className="list-header">
        <h2 className="t-label">Items in this post</h2>
        <Tag label={`${count} ${count === 1 ? "item" : "items"}`} tone="bright" />
      </div>

      {list.map((item) =>
        editing !== "new" && editing?.key === item.key ? (
          <ItemEditor key={item.key} initial={item} onSave={save} onCancel={() => setEditing(null)} />
        ) : (
          <div key={item.key} className="draft-item">
            <PhotoTile src={item.photos[0]} size={72} />
            <div className="draft-item__text">
              <p className="t-subheading">{item.title}</p>
              <p className="t-body-small muted">
                {item.category} · {item.photos.length} {item.photos.length === 1 ? "photo" : "photos"}
              </p>
            </div>
            <button type="button" className="round-button" aria-label={`Edit ${item.title}`} onClick={() => setEditing(item)}>
              <Icon src={icons.pen} size={24} />
            </button>
          </div>
        ),
      )}

      {editing === "new" ? (
        <ItemEditor onSave={save} onCancel={count ? () => setEditing(null) : undefined} />
      ) : (
        <Button variant="secondary" icon={icons.plusInk} fullWidth onClick={() => setEditing("new")}>
          {count ? "Add another item" : "Add an item"}
        </Button>
      )}

      <hr className="divider" />
      <h2 className="t-headline-s">
        Rules for <em>{count === 0 ? "your items" : count === 1 ? "this item" : `all ${count} items`}</em>
      </h2>
      <GivingMethodChoice name="method-several" value={method} onChange={setMethod} />
      <ToggleRow
        label="One item per neighbor"
        help="Spread the love across more households."
        checked={onePerNeighbor}
        onChange={setOnePerNeighbor}
      />
      <SelectField label="Giveaway ends" value={ends} options={endSelectOptions} onChange={setEnds} />
      <Button icon={icons.post} fullWidth variant={count ? "primary" : "disabled"} onClick={post}>
        Post {count || ""} {count === 1 ? "item" : "items"}
      </Button>
    </>
  );
}

function ItemEditor({ initial, onSave, onCancel }: { initial?: DraftItem; onSave: (i: DraftItem) => void; onCancel?: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<string>(initial?.category ?? "");
  const [photos, setPhotos] = useState<string[]>(initial?.photos ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const save = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Give your item a name.";
    if (!category) e.category = "Choose a category.";
    if (photos.length === 0) e.photos = "Add a photo.";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({ key: initial?.key ?? crypto.randomUUID(), title: title.trim(), category: category as Category, photos });
  };

  return (
    <div className="item-editor">
      <fieldset className="filter-group">
        <legend className="t-label">Photo</legend>
        <div className="photo-row">
          {photos.map((src) => (
            <PhotoTile key={src} src={src} onRemove={() => setPhotos((p) => p.filter((x) => x !== src))} />
          ))}
          {photos.length < MAX_PHOTOS && <AddPhotoTile onAdd={(urls) => setPhotos((p) => [...p, ...urls].slice(0, MAX_PHOTOS))} />}
        </div>
        {errors.photos && (
          <p className="t-body-small field__helper field__helper--error" role="alert">
            {errors.photos}
          </p>
        )}
      </fieldset>
      <TextField label="Item name" placeholder="e.g. Rolling desk chair" value={title} onChange={setTitle} error={errors.title} />
      <SelectField
        label="Category"
        placeholder="Choose a category"
        value={category}
        options={categoryOptions}
        onChange={setCategory}
        error={errors.category}
      />
      <div className="item-editor__actions">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={save}>{initial ? "Save item" : "Add to post"}</Button>
      </div>
    </div>
  );
}
