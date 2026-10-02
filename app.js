(() => {
  "use strict";

  const ENGINE_FILES = ["engine_part_1.txt", "engine_part_2.txt", "engine_part_3.txt"];
  const EXPECTED_HASH = "4595f2bd6bc5eac7ade45a9d7fd0efbfebd261a8e38f59e2e59937fb6e535e08";
  const LINK_KEY = "chern-slope-research-lab-v1";
  const STORAGE_KEY = "chernSlopeLab.cells.v1";

  const cellsEl = document.getElementById("cells");
  const engineSourceEl = document.getElementById("engineSource");
  const hashStatusEl = document.getElementById("hashStatus");
  const addCellBtn = document.getElementById("addCellBtn");
  const addCellBottomBtn = document.getElementById("addCellBottomBtn");
  const candidateBtn = document.getElementById("candidateBtn");
  const exportBtn = document.getElementById("exportBtn");
  const importInput = document.getElementById("importInput");
  const resetBtn = document.getElementById("resetBtn");
  const toggleEngineSource = document.getElementById("toggleEngineSource");
  const engineSourceWrap = document.getElementById("engineSourceWrap");

  let engineSource = "";
  let nextId = 1;
  const cells = new Map();

  const candidateCode = `# 43/18 candidate family\n# x=i, y=j, y=x+2u, y=-x+2v\n\ndef candidate_43_18(n):\n    n = ZZ(n)\n    lines = []\n\n    for i in range(-n, n + 1):\n        lines.append((1, 0, -i))\n\n    for j in range(-n, n + 1):\n        lines.append((0, 1, -j))\n\n    for u in range(-2*n, 2*n + 1):\n        lines.append((-1, 1, -2*u))\n\n    for v in range(-2*n, 2*n + 1):\n        lines.append((1, 1, -2*v))\n\n    return [normalize_projective_vector(L) for L in lines]\n\nn = 6\nA = candidate_43_18(n)\npoints, tk = intersection_data(A)\nc1, c2 = log_chern_numbers(A, tk)\nslope = chern_slope(A, tk)\n\nprint("n =", n)\nprint("d =", len(A))\nprint("t_k =", dict(sorted(tk.items())))\nprint("c1^2 =", c1)\nprint("c2 =", c2)\nprint("slope =", slope)\nprint("decimal =", decimal(slope, 30))\nprint("target limit =", QQ(43)/18)\n`;

  function waitForSageCell() {
    return new Promise((resolve, reject) => {
      const started = Date.now();
      const timer = setInterval(() => {
        if (window.sagecell && typeof window.sagecell.makeSagecell === "function") {
          clearInterval(timer);
          resolve();
        } else if (Date.now() - started > 20000) {
          clearInterval(timer);
          reject(new Error("SageMathCell failed to load. Check your internet connection."));
        }
      }, 100);
    });
  }

  async function sha256(text) {
    if (!window.crypto || !window.crypto.subtle) return null;
    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function loadSavedCells() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function currentCode(entry) {
    const cmEl = entry.wrapper.querySelector(".CodeMirror");
    if (cmEl && cmEl.CodeMirror) return cmEl.CodeMirror.getValue();
    const textarea = entry.wrapper.querySelector("textarea");
    return textarea ? textarea.value : entry.code || "";
  }

  function saveCells() {
    const data = Array.from(cells.values())
      .sort((a, b) => a.order - b.order)
      .map(entry => ({ id: entry.id, code: currentCode(entry) }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function renumberCells() {
    Array.from(cellsEl.children).forEach((wrapper, index) => {
      const id = Number(wrapper.dataset.cellId);
      const entry = cells.get(id);
      if (!entry) return;
      entry.order = index;
      const label = wrapper.querySelector(".cell-index");
      if (label) label.textContent = `In [${index + 1}]`;
    });
    saveCells();
  }

  function attachAutosave(wrapper) {
    const cmEl = wrapper.querySelector(".CodeMirror");
    if (cmEl && cmEl.CodeMirror) {
      cmEl.CodeMirror.on("change", () => saveCells());
    }
  }

  function moveCell(id, direction) {
    const entry = cells.get(id);
    if (!entry) return;
    const wrapper = entry.wrapper;
    if (direction < 0 && wrapper.previousElementSibling) {
      cellsEl.insertBefore(wrapper, wrapper.previousElementSibling);
    } else if (direction > 0 && wrapper.nextElementSibling) {
      cellsEl.insertBefore(wrapper.nextElementSibling, wrapper);
    }
    renumberCells();
  }

  function deleteCell(id) {
    const entry = cells.get(id);
    if (!entry) return;
    if (entry.info && window.sagecell && sagecell.deleteSagecell) {
      try { sagecell.deleteSagecell(entry.info); } catch (_) {}
    }
    entry.wrapper.remove();
    cells.delete(id);
    renumberCells();
  }

  function duplicateCell(id) {
    const entry = cells.get(id);
    if (!entry) return;
    addResearchCell(currentCode(entry));
  }

  function addResearchCell(code = "") {
    const id = nextId++;
    const wrapper = document.createElement("article");
    wrapper.className = "cell-card";
    wrapper.dataset.cellId = String(id);
    wrapper.innerHTML = `
      <div class="cell-toolbar">
        <div class="cell-index">In [?]</div>
        <div class="cell-tools">
          <button class="tool-button up" title="Move up">↑</button>
          <button class="tool-button down" title="Move down">↓</button>
          <button class="tool-button duplicate" title="Duplicate cell">Duplicate</button>
          <button class="tool-button delete" title="Delete cell">Delete</button>
        </div>
      </div>
      <div class="sage-cell-host" id="sage-cell-${id}"></div>
    `;

    cellsEl.appendChild(wrapper);
    const entry = { id, wrapper, code, info: null, order: cells.size };
    cells.set(id, entry);

    wrapper.querySelector(".up").addEventListener("click", () => moveCell(id, -1));
    wrapper.querySelector(".down").addEventListener("click", () => moveCell(id, 1));
    wrapper.querySelector(".duplicate").addEventListener("click", () => duplicateCell(id));
    wrapper.querySelector(".delete").addEventListener("click", () => deleteCell(id));

    const selector = `#sage-cell-${id}`;
    entry.info = sagecell.makeSagecell({
      inputLocation: selector,
      code,
      linked: true,
      linkKey: LINK_KEY,
      languages: ["sage"],
      evalButtonText: "Run cell",
      replaceOutput: true,
      hide: ["language", "fullScreen", "permalink", "sessionFiles"],
      callback: () => {
        setTimeout(() => attachAutosave(wrapper), 80);
      }
    });

    renumberCells();
    return id;
  }

  async function initialize() {
    await waitForSageCell();

    const responses = await Promise.all(ENGINE_FILES.map(name => fetch(name, { cache: "no-store" })));
    const failed = responses.findIndex(r => !r.ok);
    if (failed !== -1) throw new Error(`Could not load ${ENGINE_FILES[failed]}`);

    const encodedParts = await Promise.all(responses.map(r => r.text()));
    const encoded = encodedParts.map(x => x.trim()).join("");
    const compressed = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));

    if (typeof DecompressionStream !== "function") {
      throw new Error("This browser does not support gzip decompression. Please use a current Firefox, Chrome, or Safari.");
    }

    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("gzip"));
    engineSource = await new Response(stream).text();
    engineSourceEl.textContent = engineSource;

    const hash = await sha256(engineSource);
    if (hash === EXPECTED_HASH) {
      hashStatusEl.textContent = "Verified unchanged";
      hashStatusEl.className = "status-value good";
    } else if (hash) {
      hashStatusEl.textContent = "Hash mismatch";
      hashStatusEl.className = "status-value bad";
    } else {
      hashStatusEl.textContent = "Hash check unavailable";
      hashStatusEl.className = "status-value pending";
    }

    sagecell.makeSagecell({
      inputLocation: "#engineCell",
      code: engineSource + "\n\nprint('ENGINE READY — core functions loaded successfully')",
      linked: true,
      linkKey: LINK_KEY,
      languages: ["sage"],
      template: sagecell.templates.minimal,
      evalButtonText: "Initialize research engine",
      replaceOutput: true,
      hide: ["language", "fullScreen", "permalink", "sessionFiles"]
    });

    const saved = loadSavedCells();
    if (saved.length) {
      saved.forEach(item => addResearchCell(item.code || ""));
    } else {
      addResearchCell(`# Start here after initializing the engine above.\n\nlist_families()`);
    }
  }

  addCellBtn.addEventListener("click", () => addResearchCell(""));
  addCellBottomBtn.addEventListener("click", () => addResearchCell(""));
  candidateBtn.addEventListener("click", () => addResearchCell(candidateCode));

  toggleEngineSource.addEventListener("click", () => {
    engineSourceWrap.classList.toggle("hidden");
    toggleEngineSource.textContent = engineSourceWrap.classList.contains("hidden") ? "View source" : "Hide source";
  });

  resetBtn.addEventListener("click", () => {
    if (confirm("Reset the live Sage session? Your cell source will be preserved, but all variables/functions currently in memory will be lost.")) {
      saveCells();
      location.reload();
    }
  });

  exportBtn.addEventListener("click", () => {
    saveCells();
    const ordered = Array.from(cells.values()).sort((a, b) => a.order - b.order);
    const body = ordered.map((entry, index) => `# ============================================================\n# Research cell ${index + 1}\n# ============================================================\n\n${currentCode(entry)}\n`).join("\n");
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chern_slope_research_cells.sage";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  importInput.addEventListener("change", async () => {
    const file = importInput.files && importInput.files[0];
    if (!file) return;
    const code = await file.text();
    addResearchCell(code);
    importInput.value = "";
  });

  window.addEventListener("beforeunload", saveCells);

  initialize().catch(err => {
    console.error(err);
    hashStatusEl.textContent = "Initialization failed";
    hashStatusEl.className = "status-value bad";
    engineSourceEl.textContent = String(err);
  });
})();
