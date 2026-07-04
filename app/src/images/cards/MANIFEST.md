# Dragon Bomb — Card images

Extracted from the print PDFs (`Oka Luda / Dragon Bomb`), cropped to the trim box
(print/crop marks removed) and exported as JPEG at 254 DPI:
- Dragon deck cards: **660 × 1000 px** (66 × 100 mm)
- Firecracker cards: **630 × 880 px** (63 × 88 mm, standard)

All 68 faces are unique (verified by pixel signature). The two card backs exist
once each and are shared by every card of their deck (`DragonBack`, `FirecrackerBack`).

## Dragon deck — `cards/dragon/` (21 fronts + 1 back)

Big number = **Vitality points**. Top lanterns = **Victory points** (crossed lanterns = points lost).

| File | Vitality | Victory pts | Notes |
|------|----------|-------------|-------|
| `DragonHead` | — | — | Head card (deck end) |
| `DragonTail` | — | — | Tail card (deck start) |
| `DragonBody3` | 3 | 3 | |
| `DragonBody4a` / `DragonBody4b` | 4 | −3 | Special: taking it makes you **lose 3 points** (4 = bad luck) |
| `DragonBody5` | 5 | 3 | |
| `DragonBody11a` / `DragonBody11b` | 11 | 3 | |
| `DragonBody12a` / `DragonBody12b` | 12 | 3 | |
| `DragonBody13` | 13 | 3 | Special: **hand limit +1** until end of round |
| `DragonBody15a` | 15 | 3 | |
| `DragonBody15b` | 15 | 4 | |
| `DragonBody16a` / `DragonBody16b` | 16 | 4 | |
| `DragonBody17a` / `DragonBody17b` | 17 | 4 | |
| `DragonBody18a` | 18 | 4 | |
| `DragonBody18b` | 18 | 5 | |
| `DragonBody23` | 23 | 5 | |
| `DragonBody25` | 25 | 5 | |

The a/b suffix distinguishes two cards that share the same stats but have distinct artwork.

## Firecracker deck — `cards/firecracker/` (45 fronts + 1 back)

`Firecracker{power}_{lanterns}` — corner number = **Power value**, side lanterns = tiebreak (1–5).

| Files | Power | Lanterns | Effect |
|-------|-------|----------|--------|
| `Firecracker5_1` … `Firecracker5_5` | 5 | 1–5 | — |
| `Firecracker6_1` … `Firecracker6_5` | 6 | 1–5 | — |
| `Firecracker7_1` … `Firecracker7_5` | 7 | 1–5 | — |
| `Firecracker8_1` … `Firecracker8_5` | 8 | 1–5 | — |
| `Firecracker9_1` … `Firecracker9_5` | 9 | 1–5 | — |
| `Firecracker10_1` … `Firecracker10_5` | 10 | 1–5 | — |
| `StringOfFirecrackers_1` … `_5` | 1 | 1–5 | Draw 1 firecracker and **add its power** (special card drawn is ignored) |
| `Rocket_1` … `_5` | 2 | 1–5 | Place it **last** under any Dragon Body card |
| `DoubleFirecracker_1` … `_5` | 3 | 1–5 | If vitality reached: take the card and **double its Victory points** (placed face down) |

The `_{n}` suffix is the lantern count (used only to break ties).
