# SEO & Knowledge Panel — Pending Work

Tracks the gaps identified during the SEO / Google Knowledge Panel audit of `app/layout.tsx` and the site in general. Items already completed (JSON-LD `alumniOf` URLs, `sameAs` cleanup, `hasOccupation`, `worksFor` split, ORCID `identifier`, `givenName` / `additionalName` / `familyName`, `disambiguatingDescription`) are not listed here.

---

## P0 — Highest impact

### 1. Create a Wikidata item
The single biggest disambiguation lever. Wikidata feeds the Google Knowledge Graph directly.

- Create an item at https://www.wikidata.org/wiki/Special:NewItem
- Fill in: name, date of birth, occupation (software engineer), educated at (UB, Mumbai), employer (Dark Matter Technologies), ORCID `0009-0005-9209-7704`, official website `https://pratik-kubal.com` (property P856).
- Add external references (LinkedIn, GitHub, ORCID) so the entry survives notability review.
- Once the Q-ID exists, add to `app/layout.tsx`:
  ```ts
  // inside sameAs
  "https://www.wikidata.org/wiki/Q<ID>",
  // inside identifier array (convert identifier to array first)
  { "@type": "PropertyValue", propertyID: "Wikidata", value: "Q<ID>", url: "https://www.wikidata.org/wiki/Q<ID>" },
  ```

### 2. Add canonical `image` to Person JSON-LD
Google matches identities via image similarity. Use the same photo on LinkedIn, GitHub, X.

- `public/profile.jpg` already exists.
- Add to `jsonLd` in `app/layout.tsx`:
  ```ts
  image: `${siteUrl}/profile.jpg`,
  ```
- Verify the same image is the profile photo on LinkedIn, GitHub, X, and any conference bios.

### 3. OG / Twitter images
Currently `metadata.openGraph` and `metadata.twitter` have no `images` field. Social unfurls render blank, and OG image is a Google rich-result signal.

- Create `app/opengraph-image.tsx` (1200×630) or a static `app/opengraph-image.png`.
- Create `app/twitter-image.tsx` / `.png` (or reuse OG).
- Next.js auto-wires these via file conventions — no manual metadata needed.

### 4. Favicon / icons / manifest
No favicon exists, so Google SERPs render a generic globe.

- Add `app/icon.png` (any size; Next.js generates all formats).
- Add `app/apple-icon.png` (180×180) for iOS.
- Consider `app/manifest.ts` for PWA signals.
- Optionally `app/favicon.ico` for legacy browsers.

### 5. Fix email inconsistency
`app/layout.tsx:92` has `pratik-kubal@outlook.com`. `data/person.ts:67` has `pratik.kubal@outlook.com`. Pick one canonical form — inconsistent contact data weakens entity reconciliation.

---

## P1 — Should do

### 6. Twitter metadata handles
`metadata.twitter` in `app/layout.tsx` is missing:
```ts
site: "@pratik_kubal",
creator: "@pratik_kubal",
```

### 7. `rel="me"` cross-linking
IndieWeb-style identity confirmation. Ensure:
- Portfolio links to LinkedIn / GitHub / X with `rel="me"` (check `components/editorial-card.tsx` socials grid).
- Each of those platforms has `pratik-kubal.com` in the profile website field.

### 8. Add `WebSite` JSON-LD with `potentialAction`
Helps Google build sitelinks and the search box. Second `@graph` entry or standalone `<script>`:
```ts
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: siteUrl,
  name: "Pratik Kubal",
  inLanguage: "en-US",
  // potentialAction: SearchAction if a site search is added later
}
```

### 9. Google Search Console verification
Not required, but needed to actually monitor indexing and request Knowledge Panel review.

- Add site at https://search.google.com/search-console
- Verify via DNS TXT or `metadata.verification.google`.
- Submit sitemap.

### 10. Consider updating `name` to full form
Currently `name: "Pratik Kubal"` while `givenName + additionalName + familyName` expands to `Pratik Pravin Kubal`. Decide whether the canonical public name should include the middle name — if so, update `name`, `metadata.title.default`, OG/Twitter titles, and `authors`.

---

## P2 — Nice to have

### 11. Additional Person properties for disambiguation
Small but unique signals:
```ts
honorificSuffix: "M.S.",
nationality: "...",          // if comfortable disclosing
knowsLanguage: ["en", "hi", "mr"], // whichever apply
```

### 12. `subjectOf` for notable external mentions
The SR-GAN work was featured at USCAP. If there's a public presentation / abstract page, add:
```ts
subjectOf: {
  "@type": "CreativeWork",
  url: "https://...",
  name: "SR-GAN for Pathology Gigapixel Image Compression (USCAP ...)",
},
```

### 13. `memberOf` for professional associations
If you're a member of IEEE, ACM, etc., add `memberOf` entries with org URL.

---

## Off-site authority work

These aren't code changes but heavily influence whether Google treats you as a distinct entity.

### 14. Publish SR-GAN work on arXiv
Gives you a DOI, canonical author page, and feeds Google Scholar. Much stronger than a USCAP feature alone.

### 15. Google Scholar profile
Once arXiv is up, create a Scholar profile with a `@buffalo.edu` email. Link from portfolio via `sameAs`.

### 16. Consistent NAP across platforms
Audit LinkedIn headline, GitHub bio, X bio, any conference bios: same one-line description, same city, same photo, same portfolio link. Conflicting data keeps Google ambiguous.

### 17. Bylines on indexable publications
2–3 technical articles on Medium / dev.to / Substack with author bio → `pratik-kubal.com` seeds a co-citation graph.

---

## Performance / hygiene notes

### 18. Apollo tracker
`app/layout.tsx` loads `assets.apollo.io/.../tracker.iife.js` on every page via `afterInteractive`. Mild Core Web Vitals cost; not an SEO blocker but worth knowing.

### 19. `next.config.mjs`
`ignoreBuildErrors: true` and `ignoreDuringBuilds: true` mean TypeScript / ESLint errors never fail CI. Unrelated to SEO but worth fixing since SEO work touches typed metadata.
