# Still unconfirmed

Everything below is on the site but nobody on the team has verified it. Open the
site with **`?draft=1`** and each one shows a gold CONFIRM chip where it sits.

Once a line is confirmed, remove `confirm: true` from that item in
`src/content/site.ts` and the chip stops appearing.

Nothing on this list was invented. Each item is either taken from a source
document that might be out of date, or inferred from a folder name in the photo
dump. Where a source was missing entirely, the site says nothing rather than
guessing.

---

## Results and history

| # | What needs checking | Where it came from | Where it shows |
|---|---|---|---|
| 1 | **Full FKDC 2025 results.** The site says P1 acceleration and P2 skid pad, and that endurance did not go our way. It does not claim a final overall position because nobody has given one. | Brief | Hero, Career, Replay |
| 2 | **The endurance line.** "Without it, we were in the fight for the top three overall." Confirm this is fair to say. | Brief | Replay card 4 |
| 3 | **IKR 2023.** The only evidence is a folder called `IKR 2023` with photos of a kart wearing number 16. The site says an early combustion outing, number 16, no result. Confirm the event name and whether a result is worth stating. | Photo dump folder name | Career slot 1 |
| 4 | **GKDC 2024.** Same situation: a folder called `GKDC 2024`. The old website also mentions GKDC with an April 2023 photo, so the year may be wrong or there may have been two. | Photo dump, old site | Career slot 3 |
| 5 | **Innovation Award and Go Green Award.** The business plan says both were won in the IC category but names no event or year. The site says "combustion era" and nothing more. | Business plan | Hero, Career |
| 6 | **Precisio.** The old site's photos show the kart with `PRECISIO 1.0` on the nose and number 41, so the spelling is settled. What is not settled is the year the team became Apex Racing. | Old site photos | Career slot 2 |
| 7 | **The 2026 season so far.** The card says the build is underway and nothing else, because nobody has said what has actually happened. Give me a list and I will make it specific. | Nothing yet | Career slot 6 |

## The team

| # | What needs checking | Notes |
|---|---|---|
| 8 | **Department leads for 2026.** Not on the site. The 2025 design report lists a full roster but that is last year's team, so none of it is shown. | |
| 9 | **Drivers and kart numbers for 2026.** Photos show #05 and #09 on the EV kart. Only #05 appears, on the hero kart photo itself. | |
| 10 | **The two pull quotes.** Krtin's and Paul's lines were rewritten from the proposal into plain speech. They need to read and approve their own words. | Crew Select |

## Partnership

| # | What needs checking | Notes |
|---|---|---|
| 11 | **Lane names.** Front Row, Powertrain, Garage, Grid, Pit Crew, Fan & Alumni. All new. No Gold or Silver anywhere, per the brief. | |
| 12 | **Whether to show amounts.** Currently no prices anywhere, just "tell us what you want to build". The old brochure used 2L / 1L / 75k / 50k. | |
| 13 | **Workshop naming rights.** The Garage Partner lane offers naming on the workshop wall "subject to college approval". Check that is actually possible. | |
| 14 | **The three things every partner gets:** season report, memento and certificate from the college, mention in the college magazine. All from the old brochure. Confirm still offered. | |
| 15 | **Build costs.** The parts shop shows the FKDC 2025 figures from the business plan, total 3,77,000. The old brochure has a different set totalling 3.65L. The newer report wins, but 2026 numbers would be better. | Garage |
| 16 | **JM Projexive.** Their name is on the kart's nose in the 2026 proposal cover photo, but they are not in the previous sponsors list. Add them? | Paddock |

## Links and admin

| # | What needs checking | Notes |
|---|---|---|
| 17 | **Team email address.** None known, so the site has no email button anywhere. Set `links.email` in `src/content/site.ts` and the EMAIL US button appears on the Partner screen automatically. | |
| 18 | **Formula Bharat.** Paul said "Formula E Bharat". Formula Bharat is the real Indian Formula Student event and it has an EV class, so the site uses that. Confirm, and give target years for Supra and for this. | Hero, Career |
| 19 | **Photo permissions.** Thirty four photos of identifiable team members are on the site. Confirm everyone shown is happy to be there. | Photo Mode |
| 20 | **Analytics.** Event tracking is wired but sends nothing. Say the word and I will add Plausible or GoatCounter. | |

---

## Deliberately left off

- Anything about a final overall FKDC position.
- The 2025 roster of thirty plus names, since it is last year's team.
- Any sponsorship price.
- Any claim about what was fixed after endurance, because nobody has said.
