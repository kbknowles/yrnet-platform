{/* SPONSORS */}
<div>
  <div className="flex items-center justify-between mb-2">
    <label className="font-semibold">Sponsors</label>
    <button
      type="button"
      onClick={() =>
        update("sponsors", [
          ...form.sponsors,
          { name: "", logoUrl: "", link: "" },
        ])
      }
      className="text-sm underline"
    >
      + Add Sponsor
    </button>
  </div>

  {form.sponsors.length === 0 && (
    <p className="text-sm text-gray-500">No sponsors added.</p>
  )}

  <div className="space-y-4">
    {form.sponsors.map((sponsor, index) => (
      <div
        key={index}
        className="grid grid-cols-4 gap-2 items-center"
      >
        <input
          placeholder="Sponsor Name"
          value={sponsor.name}
          onChange={(e) => {
            const sponsors = [...form.sponsors];
            sponsors[index] = {
              ...sponsors[index],
              name: e.target.value,
            };
            update("sponsors", sponsors);
          }}
        />

        <input
          placeholder="Website URL"
          value={sponsor.link}
          onChange={(e) => {
            const sponsors = [...form.sponsors];
            sponsors[index] = {
              ...sponsors[index],
              link: e.target.value,
            };
            update("sponsors", sponsors);
          }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const data = new FormData();
            data.append("file", file);

            const res = await fetch(
              `${API_BASE}/api/admin/uploads/image`,
              { method: "POST", body: data }
            );

            const result = await res.json();

            const sponsors = [...form.sponsors];
            sponsors[index] = {
              ...sponsors[index],
              logoUrl: result.url,
            };
            update("sponsors", sponsors);
          }}
        />

        <button
          type="button"
          onClick={() =>
            update(
              "sponsors",
              form.sponsors.filter((_, i) => i !== index)
            )
          }
          className="text-sm text-red-600"
        >
          Remove
        </button>

        {sponsor.logoUrl && (
          <img
            src={sponsor.logoUrl}
            className="h-16 col-span-4 object-contain"
          />
        )}
      </div>
    ))}
  </div>
</div>
