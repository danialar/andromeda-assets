# andromeda-assets

Image host untuk sales page Andromeda / DAR Legacy.

---

## CDN: guna GitHub Pages, JANGAN jsDelivr

**URL rasmi:**

```
https://danialar.github.io/andromeda-assets/<folder>/<fail>.webp
```

Contoh: `https://danialar.github.io/andromeda-assets/minyak-tebu-hitam/hero-bersila.webp`

Pages kena aktif: repo Settings, Pages, Source "Deploy from a branch", branch `main`, folder `/ (root)`.

### Kenapa bukan jsDelivr

- Cache jsDelivr degil. Fail baru boleh 404 walaupun dah ada di GitHub, dan purge tak selalu jalan serta merta.
- Keputusan 14 Julai 2026: tukar semua sales page baru ke GitHub Pages.

### Yang BUKAN penyelesaian (jangan buang masa)

- `cdn.statically.io` dan `rawcdn.githack.com`: dua dua cuma **301 redirect** ke `raw.githubusercontent.com`. Bukan CDN, cuma tambah satu hop.
- `raw.githubusercontent.com` terus: jangan hotlink dalam production. Ada rate limit, dan `Cache-Control` cuma 300 saat.

---

## GOTCHA: detached HEAD (pernah makan masa, jangan ulang)

Repo ni pernah tersangkut dalam **detached HEAD**. Bila tu berlaku, `git commit` jadi, `git push origin main` pun kata berjaya, tapi fail **tak pernah naik** ke `main`. Semua URL jadi 404 dan nampak macam salah CDN, padahal salah git.

Semak dulu sebelum salahkan CDN:

```bash
git status -sb          # kalau nampak "## HEAD (no branch)" = detached
git rev-parse --abbrev-ref HEAD   # patut keluar "main", bukan "HEAD"
```

Kalau dah tersangkut dan commit ada di atas main:

```bash
git checkout main
git merge --ff-only <sha-commit-tadi>
git push origin main
```

Sahkan betul betul dah naik:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  https://raw.githubusercontent.com/danialar/andromeda-assets/main/<folder>/<fail>.webp
```

`200` = fail memang ada di GitHub. Kalau `404`, masalahnya git, bukan CDN.

---

## Cara publish aset baru

1. Convert ke webp (takde cwebp/magick, guna ffmpeg):
   ```bash
   ffmpeg -y -i input.png -vf "scale='min(1400,iw)':-2" -q:v 80 output.webp
   ```
2. Letak dalam folder produk: `<nama-produk>/`
3. `git add <folder>` (fail tu je, jangan `git add .`)
4. Commit, push ke `main`
5. Sahkan 200 pada URL GitHub Pages sebelum guna dalam HTML

---

## Folder sedia ada

`ginseno-coffee`, `gomen`, `growell`, `himcoffee`, `lifera-black-garlic`, `minyak-tebu-hitam`, `pam`, `sunproof-coffee`, `uai-coffee`
