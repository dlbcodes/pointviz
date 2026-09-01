# PointViz Share Link Format (v1)

A PointViz chart can be encoded into a URL so that opening the link renders the
chart directly. Any tool (including oecd-mcp) can build these links.

## Format

The chart spec is wrapped in a versioned envelope, serialized to JSON,
compressed with lz-string (`compressToEncodedURIComponent`), and placed in the
URL **hash**:

    https://pointviz.co/#<encoded>

## Envelope

    {
      "v": 1,
      "spec": { ...ChartSpec... }
    }

- `v` — payload version. Currently `1`. Always include it; it lets old links
  keep working as the spec evolves.
- `spec` — a valid PointViz ChartSpec (see below).

## ChartSpec shape (v1)

    {
      "type": "bar" | "line" | "area",
      "orientation": "vertical" | "horizontal",   // optional, default "vertical"
      "stack": boolean,                            // optional, default false
      "title": string,                             // optional
      "subtitle": string,                          // optional
      "source": string,                            // optional
      "categories": string[],                      // required, min 1
      "series": [                                  // required, min 1
        { "name": string, "values": number[] }
      ],
      "goals": [ { "value": number, "label"?: string, "color"?: string } ],  // optional
      "style": { ... }                             // optional — see PointViz schema
    }

**Hard rule:** every `series.values` array must have exactly one number per
`categories` entry, in the same order. Links whose spec fails validation are
rejected by PointViz (it shows the empty builder rather than a broken chart).

## Building a link (reference)

    import { compressToEncodedURIComponent } from "lz-string";

    function buildShareLink(spec) {
      const payload = { v: 1, spec };
      const encoded = compressToEncodedURIComponent(JSON.stringify(payload));
      return `https://pointviz.co/#${encoded}`;
    }

## Notes for link builders (e.g. oecd-mcp)

- Use ONLY the encoding above — `{ v, spec }`, lz-string, in the hash. A raw
  base64 or query-param spec will NOT be read.
- Keep `values` aligned to `categories` or the link is rejected.
- Never invent data — encode only the numbers you actually have.
- The reference implementation is PointViz's `app/lib/shareLink.ts` (`encodeSpec`).
  Keep this doc and that file in sync; `shareLink.ts` is the source of truth.
