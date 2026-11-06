# Roadside Radio Shack: Physical Function Graph and Evidence Clamp

**Status:** source-derived engineering proposal, not a verified build procedure.  
**Domain:** salvaged electronics, bench characterization, circuit composition, operational demonstration.

## 1. Architectural role

Treat roadside and discarded electronics as a physical Source Universe. A harvested component is an identifiable source artifact. Every functional facet extracted from it becomes a Function Graph node without requiring loop closure or successful operation first.

The component's measured state, composition, and demonstrated behavior are separate evidence records. A component can be documented and characterized even when it is degraded or unusable in a particular circuit.

## 2. Physical source facets

### Passive components
- Resistors: current limiting, bias networks, dividers, sensing.
- Capacitors: charge storage, filtering, coupling, timing.
- Inductors and transformers: magnetic energy storage, filtering, coupling, voltage conversion.

### Active components
- Diodes: rectification, clamping, protection, light emission.
- BJTs and MOSFETs: switching, amplification, regulation.
- Integrated circuits: packaged functions such as linear regulation, timers, and audio amplification.

### Power sources
- Isolated, correctly rated AC/DC adapters.
- Battery cells only when chemistry, condition, and protection state are understood.

## 3. Evidence Clamp record

Suggested component record:

```json
{
  "component_id": "c:...",
  "source_artifact": "src:...",
  "board_location": "...",
  "marking": "...",
  "part_number": "...",
  "datasheet_source": "...",
  "measurements": [
    {
      "quantity": "resistance",
      "value": 1000,
      "unit": "ohm",
      "instrument": "...",
      "range": "...",
      "conditions": "...",
      "timestamp": "..."
    }
  ],
  "condition_observations": [],
  "composition_relations": [],
  "demonstrations": [],
  "scripts": []
}
```

Keep the datasheet as a prediction prior, measured values as observations, and powered circuit behavior as operational demonstration. Record uncertainty, instrument limitations, temperature, load, polarity, and test configuration where relevant.

## 4. Composition and hyperedges

A circuit assembly is naturally represented as a multi-participant relationship. For example, an oscillator may involve a transistor, bias resistor, timing capacitor, inductor, supply, and load. Preserve the participant set and pin/net connectivity. Do not flatten a multi-component circuit into unrelated binary links when the assembly-level relation matters.

A circuit hyperedge should identify:
- participating component nodes;
- assembly or circuit identity;
- each component's role;
- pin/net connectivity;
- topology or schematic reference;
- operating conditions;
- expected behavior;
- observations and demonstration records.

A proposed schema:

```json
{
  "assembly_id": "asm:...",
  "participants": [
    {"component_id": "c:...", "role": "switch"},
    {"component_id": "c:...", "role": "bias"},
    {"component_id": "c:...", "role": "timing"}
  ],
  "nets": [],
  "topology_source": "...",
  "prediction": {},
  "observations": [],
  "demonstrations": []
}
```

## 5. Three candidate bench modules

These are candidate learning projects. Exact circuits must be built from verified datasheets and measured component limits, not from generic pin-order assumptions.

### A. Regulated low-voltage DC supply
Function family: rectification or DC input conditioning, reservoir filtering, linear regulation, thermal management, output measurement.

Important distinction: a 12 V DC adapter is already rectified and regulated or semi-regulated according to its design. A transformer secondary is AC and needs a rectifier stage. Do not treat the two as interchangeable.

For a 7805-style regulator, verify input voltage under load, dropout/headroom, capacitor polarity and voltage rating, regulator pinout for the exact package, output current, heatsinking, thermal dissipation, and short-circuit behavior. A linear regulator dissipates approximately `(Vin - Vout) × Iload` as heat, plus quiescent losses. A no-load 5 V reading is not a complete supply demonstration.

### B. Low-voltage audio amplifier
Function family: signal coupling, gain, biasing, output drive, volume control, speaker coupling, supply decoupling.

Use the exact LM386 or TDA2822 datasheet and the exact package pinout. Confirm speaker impedance and power rating, supply range, electrolytic capacitor polarity, input coupling, gain configuration, and thermal behavior. Begin with a current-limited low-voltage bench supply and a small signal source.

### C. Joule thief
Function family: inductive energy storage, regenerative switching, magnetic coupling, oscillation, voltage conversion, LED drive.

Verify transistor type and pinout, winding polarity/phase, core suitability, winding insulation, base resistor, and LED current. Use a known-good low-voltage cell for initial characterization. A depleted cell is not automatically safe or suitable; do not use swollen, leaking, corroded, overheated, or physically damaged cells.

## 6. Safety boundary

This document is not permission to harvest unknown mains-connected equipment casually.

- CRT televisions, microwave ovens, camera flashes, and some power supplies can retain lethal charge after unplugging. Do not open or harvest from them without appropriate training, equipment, and a verified discharge procedure.
- Capacitor discharge requires a correctly rated discharge resistor, insulated leads, suitable meter/category rating, and voltage verification before contact. Never short a capacitor with a screwdriver.
- Mains-side circuits are not beginner projects. Prefer intact, certified, isolated low-voltage adapters and keep all mains wiring enclosed.
- Never puncture, crush, heat, solder directly to, or casually charge/discharge unknown lithium cells. Do not harvest damaged or unidentified cells.
- Use eye protection, ventilation/fume extraction, a stable fire-resistant work surface, and temperature-controlled soldering equipment.
- Use current limiting and a fuse appropriate to the supply and circuit. Confirm polarity before applying power.
- If a component's history or safety condition is unknown, leave it unpowered and treat it as an unresolved source artifact.

## 7. Evidence states

Record independently:
- source documented;
- identity inferred from marking;
- datasheet located;
- passive measurement captured;
- unpowered inspection captured;
- circuit assembled;
- low-voltage test performed;
- operational demonstration captured;
- failure observed;
- repeated test reproduced.

These are evidence descriptions, not a ranking of components or avenues. A failed test remains a useful record.

## 8. Function families to add to the graph

- component harvesting and source attribution;
- component identification and datasheet lookup;
- resistance, capacitance, inductance, diode, continuity, and transistor characterization;
- safe low-voltage power conditioning;
- rectification and reservoir filtering;
- linear regulation and thermal calculation;
- transistor switching and oscillator construction;
- audio amplification and impedance matching;
- soldering, dead-bug assembly, and wiring documentation;
- schematic capture and netlist extraction;
- current-limited bring-up and fault observation;
- instrument-calibrated measurement capture;
- photo/video evidence capture;
- circuit hyperedge and pin/net connectivity representation;
- repair, reuse, and material recovery.

## 9. Coordinate-core separation

The physical bench contributes source points, component points, function points, assembly relations, observations, and traversal records. It does not add Guardian gates, approval stages, priority scores, or best-path selection to the coordinate traversal.

A user selects which available avenue to traverse. The system exposes the components, relations, transformations, scripts, and evidence visible from the current point.
