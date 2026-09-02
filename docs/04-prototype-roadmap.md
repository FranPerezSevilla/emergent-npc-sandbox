# Prototype Roadmap — STOPPED

## Project status

**Emergent NPC Sandbox was abandoned by the human owner on 2026-09-02.**

There is no current milestone, no active bounded slice and no next implementation task. This roadmap is retained only as a final record of the experiment.

Status vocabulary for this document:

- **DONE** — the milestone's bounded hypothesis was validated before closure;
- **STOPPED** — work ended before the milestone gate passed;
- **CANCELLED** — the milestone will not be started.

## Final decision

The owner chose to **stop**, not pivot and not continue toward a production roadmap.

The decision followed the first human session with the four-person M4 testimony slice. The session confirmed that the deterministic state boundaries were useful, but also showed that unrestricted generated dialogue could semantically confirm protected information or player-invented premises without making a literal forbidden statement.

Closing that gap through phrase-specific fixtures and validators would create an open-ended maintenance problem. A more principled solution would require a substantially more constrained system—such as structured player dialogue acts, game-owned semantic response plans and controlled claim realization. The owner decided that this complexity did not justify further investment or interest.

## Final roadmap

| Stage | Final status | Result |
| --- | --- | --- |
| **BOOTSTRAP — Cloud playable loop** | **DONE** | Agent changes could reach a browser-playable GitHub Pages build. |
| **M0 — One living NPC** | **DONE** | One constrained real-AI NPC was sufficiently coherent to continue experimentation. |
| **M1 — Truth vs belief** | **DONE** | NPC-specific contradictory beliefs coexisted with stable authoritative truth. |
| **M2 — Memory & relationship** | **DONE** | Structured persistent memory and relationship state changed later behavior. |
| **M3 — Information propagation** | **DONE** | Information transferred through game-owned state with provenance preserved. |
| **M4 — Tavern mystery** | **STOPPED** | Several foundations and a four-NPC testimony scene were built, but the complete mystery and semantic-fidelity gate were not achieved. |
| **M5 — Product decision** | **CANCELLED** | No production direction or Roadmap v2 will be created. |

## Completed evidence

### Bootstrap

The repository established a PlayCanvas Engine + TypeScript + Vite, code-first, browser/cloud-first workflow with CI and GitHub Pages deployment.

### M0

Mara demonstrated constrained in-character conversation, competence boundaries, prompt-injection resistance, structured output validation, retry behavior, diegetic fallback and traceability.

### M1

Authoritative `WorldFact` data remained separate from NPC-owned `Belief` data. Mara and Iven could give contradictory testimony without dialogue mutating objective truth or synchronizing beliefs.

### M2

Compact game-owned `NpcMemory` and bounded relationship trust persisted independently of raw conversation history and could influence later responses for inspectable reasons.

### M3

A player claim could move through an explicit player → Mara → Iven chain. The resulting hearsay retained source provenance and did not become eyewitness knowledge or objective truth.

## M4 state at closure

M4's disposable case, **The Ash Letter**, established:

- one stable private objective timeline;
- an authored four-NPC knowledge/belief/lie matrix;
- fixed evidence atoms E1–E5;
- persistent discovered-evidence state controlled by game transitions;
- Mara as an uncertain first-hand source;
- Iven as a sincere but incorrect reasoner;
- Corren and Nera as distinct NPCs with isolated private case knowledge;
- game-owned testimony/cover policies;
- deterministic evidence-fidelity checks;
- a browser scene where Mara, Iven, Corren and Nera could be questioned;
- deterministic fake mode, remote-AI mode, traces and session export;
- 60 passing deterministic tests at the last playable integration merge.

M4 did **not** complete:

- robust semantic handling of arbitrary player allegations and invented sources;
- safe control of implication, presupposition and over-broad generated claims;
- Corren's lie-break and E5 path;
- Nera's trust-sensitive motive disclosure and confession path;
- physical E3/E4 inspection interactions;
- accusation and authoritative resolution;
- representative final visual/audio treatment;
- a blind 20–30 minute mystery playtest;
- the M4 fun/memorability gate.

## Closure of active work

- Issue `#30 — M4 Tavern mystery`: closed as **not planned**.
- Issue `#39 — Put Corren and Nera in the browser scene`: closed as **not planned** after recording that the deterministic implementation existed but the human semantic-quality gate was not accepted.
- Open pull requests at closure: none.
- M5 and all later work: cancelled.
- Automated or autonomous continuation: prohibited by `AGENTS.md`.

## Preserved artifacts

Historical browser snapshots remain available:

- `https://franperezsevilla.github.io/emergent-npc-sandbox/`
- `https://franperezsevilla.github.io/emergent-npc-sandbox/?provider=fake`

The repository history preserves the earlier detailed roadmap, issues, pull requests, test evidence and implementation decisions.

## Resumption rule

No agent should infer resumption from a question, code review, dependency alert or old roadmap text. Work may resume only after the human owner explicitly reverses the abandonment decision and updates both `README.md` and `AGENTS.md`.
