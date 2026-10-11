(function () {
  "use strict";

  var IMAGE_BASE = "https://min-poke.github.io/cardlist-aikatsu-encore/";
  var STORAGE_KEY = "aikatsu-trade-selections-v1";
  var STORAGE_KEY_OWNED = "aikatsu-trade-owned-v1";
  var RARITIES = ["PR", "ER", "R", "N"];
  var MAX_QTY = 99;
  var MAX_OWNED = 99;

  var MODES = { OWN: "own", TRADE: "trade" };

  var MANAGE_CHIPS = {
    trade: [
      { value: "all", label: "すべて" },
      { value: "want", label: "求" },
      { value: "yield", label: "譲" },
      { value: "want_pending", label: "もらう予定" },
      { value: "yield_pending", label: "あげる予定" }
    ],
    own: [
      { value: "all", label: "すべて" },
      { value: "owned", label: "所持" },
      { value: "unowned", label: "未所持" }
    ]
  };

  var CARD_BY_ID = new Map(CARDS.map(function (c) { return [c.id, c]; }));
  var DISPLAY_ORDER = buildDisplayOrder(CARDS);
  var DISPLAY_INDEX = new Map(DISPLAY_ORDER.map(function (c, i) { return [c.id, i]; }));
  var AVAILABLE_SERIES = getAvailableSeries(CARDS);

  var mode = MODES.TRADE;
  var selections = loadSelections();
  saveSelections(); // 旧status:pendingを無印に戻した移行結果を保存しておく
  var owned = loadOwned();
  var filters = {
    series: "all",
    rarities: new Set(RARITIES),
    showParallel: false,
    query: "",
    ownManage: "all",
    tradeManage: "all"
  };

  var els = {};
  var clearArmed = false;
  var clearArmTimer = null;
  var toastTimer = null;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    els.modeSwitch = document.getElementById("modeSwitch");
    els.searchInput = document.getElementById("searchInput");
    els.seriesTabs = document.getElementById("seriesTabs");
    els.rarityChips = document.getElementById("rarityChips");
    els.manageChips = document.getElementById("manageChips");
    els.parallelToggle = document.getElementById("parallelToggle");
    els.resultCount = document.getElementById("resultCount");
    els.cardGrid = document.getElementById("cardGrid");
    els.summaryWant = document.getElementById("summaryWant");
    els.summaryYield = document.getElementById("summaryYield");
    els.summaryPending = document.getElementById("summaryPending");
    els.summaryOwned = document.getElementById("summaryOwned");
    els.clearBtn = document.getElementById("clearBtn");
    els.generateBtn = document.getElementById("generateBtn");
    els.ownImageBtn = document.getElementById("ownImageBtn");
    els.html2canvasWarning = document.getElementById("html2canvasWarning");
    els.exportStage = document.getElementById("exportStage");
    els.toast = document.getElementById("toast");

    renderSeriesTabs();
    renderManageChips();
    renderGrid();
    renderSummary();
    checkHtml2canvasAvailability();
    updateActionButtons();
    bindEvents();
  }

  function updateActionButtons() {
    var own = mode === MODES.OWN;
    els.ownImageBtn.hidden = !own;
    els.generateBtn.hidden = own;
    els.clearBtn.hidden = own;
  }

  // ---- カードデータの並び順・弾一覧 ----

  function buildDisplayOrder(cards) {
    var parallelsByBase = new Map();
    var base = [];

    cards.forEach(function (c) {
      if (c.parallel) {
        var m = c.id.match(/^(.*)_p\d+$/);
        var baseId = m ? m[1] : c.id;
        if (!parallelsByBase.has(baseId)) parallelsByBase.set(baseId, []);
        parallelsByBase.get(baseId).push(c);
      } else {
        base.push(c);
      }
    });

    var ordered = [];
    base.forEach(function (c) {
      ordered.push(c);
      var ps = parallelsByBase.get(c.id);
      if (ps) {
        ps.sort(function (a, b) { return a.id.localeCompare(b.id); });
        ordered = ordered.concat(ps);
      }
    });

    var usedIds = new Set(ordered.map(function (c) { return c.id; }));
    cards.forEach(function (c) {
      if (!usedIds.has(c.id)) ordered.push(c);
    });

    return ordered;
  }

  function getAvailableSeries(cards) {
    var set = new Set(cards.map(function (c) { return c.series; }));
    var numeric = Array.from(set)
      .filter(function (s) { return s !== "promo"; })
      .sort(function (a, b) { return Number(a) - Number(b); });
    if (set.has("promo")) numeric.push("promo");
    return numeric;
  }

  // ---- 永続化 ----

  function loadSelections() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return {};
      // 旧データ構造では status:"pending" が求/譲と独立した第3状態だったが、
      // 方向（もらう/あげる）を記録していないため推測できない。無印に戻す。
      var migrated = {};
      Object.keys(parsed).forEach(function (id) {
        var sel = parsed[id];
        if (!sel || typeof sel !== "object") return;
        if (sel.status === "want" || sel.status === "yield") {
          migrated[id] = {
            status: sel.status,
            qty: typeof sel.qty === "number" ? sel.qty : 1,
            pending: !!sel.pending
          };
        }
      });
      return migrated;
    } catch (e) {
      console.warn("[aikatsu-trade] 選択状態の読み込みに失敗しました", e);
      return {};
    }
  }

  function saveSelections() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
    } catch (e) {
      console.warn("[aikatsu-trade] 選択状態の保存に失敗しました", e);
    }
  }

  function loadOwned() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_OWNED);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return (parsed && typeof parsed === "object") ? parsed : {};
    } catch (e) {
      console.warn("[aikatsu-trade] 所持枚数の読み込みに失敗しました", e);
      return {};
    }
  }

  function saveOwned() {
    try {
      localStorage.setItem(STORAGE_KEY_OWNED, JSON.stringify(owned));
    } catch (e) {
      console.warn("[aikatsu-trade] 所持枚数の保存に失敗しました", e);
    }
  }

  function getOwned(id) {
    return owned.hasOwnProperty(id) ? owned[id] : 0;
  }

  function setOwned(id, value) {
    owned[id] = Math.min(MAX_OWNED, Math.max(0, value));
    saveOwned();
    updateCardCellUI(id);
    renderSummary();
  }

  // ---- フィルタ UI ----

  function renderSeriesTabs() {
    els.seriesTabs.innerHTML = "";
    els.seriesTabs.appendChild(makeTabButton("all", "すべて"));
    AVAILABLE_SERIES.forEach(function (s) {
      var label = s === "promo" ? "プロモーション" : (s + "弾");
      els.seriesTabs.appendChild(makeTabButton(s, label));
    });
  }

  function makeTabButton(value, label) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tab-btn";
    btn.dataset.series = value;
    btn.textContent = label;
    var active = filters.series === value;
    btn.setAttribute("aria-pressed", String(active));
    if (active) btn.classList.add("is-active");
    return btn;
  }

  function syncSeriesTabs() {
    Array.prototype.forEach.call(els.seriesTabs.querySelectorAll(".tab-btn"), function (btn) {
      var active = btn.dataset.series === filters.series;
      btn.setAttribute("aria-pressed", String(active));
      btn.classList.toggle("is-active", active);
    });
  }

  function syncRarityChips() {
    var allActive = RARITIES.every(function (r) { return filters.rarities.has(r); });
    Array.prototype.forEach.call(els.rarityChips.querySelectorAll(".chip-btn"), function (btn) {
      var val = btn.dataset.rarity;
      var pressed = val === "all" ? allActive : filters.rarities.has(val);
      btn.setAttribute("aria-pressed", String(pressed));
      btn.classList.toggle("is-active", pressed);
    });
  }

  function getManageFilterValue() {
    return mode === MODES.TRADE ? filters.tradeManage : filters.ownManage;
  }

  function setManageFilterValue(value) {
    if (mode === MODES.TRADE) filters.tradeManage = value;
    else filters.ownManage = value;
  }

  function renderManageChips() {
    var current = getManageFilterValue();
    els.manageChips.innerHTML = "";
    MANAGE_CHIPS[mode].forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip-btn";
      btn.dataset.manage = opt.value;
      btn.textContent = opt.label;
      var active = current === opt.value;
      btn.setAttribute("aria-pressed", String(active));
      if (active) btn.classList.add("is-active");
      els.manageChips.appendChild(btn);
    });
  }

  function syncManageChips() {
    var current = getManageFilterValue();
    Array.prototype.forEach.call(els.manageChips.querySelectorAll(".chip-btn"), function (btn) {
      var active = btn.dataset.manage === current;
      btn.setAttribute("aria-pressed", String(active));
      btn.classList.toggle("is-active", active);
    });
  }

  // ---- モード切替（所持管理 / 交換） ----

  function setMode(newMode) {
    if (mode === newMode) return;
    mode = newMode;
    syncModeButtons();
    updateActionButtons();
    renderManageChips();
    renderGrid();
  }

  function syncModeButtons() {
    Array.prototype.forEach.call(els.modeSwitch.querySelectorAll(".mode-btn"), function (btn) {
      var active = btn.dataset.mode === mode;
      btn.setAttribute("aria-pressed", String(active));
      btn.classList.toggle("is-active", active);
    });
  }

  // ---- 絞り込み ----

  function getFilteredCards() {
    var q = filters.query;
    return DISPLAY_ORDER.filter(function (c) {
      if (!filters.showParallel && c.parallel) return false;
      if (filters.series !== "all" && c.series !== filters.series) return false;
      if (!filters.rarities.has(c.rarity)) return false;
      if (q && c.id.toLowerCase().indexOf(q) === -1 && c.name.toLowerCase().indexOf(q) === -1) return false;

      var manageVal = getManageFilterValue();
      if (manageVal !== "all") {
        if (mode === MODES.OWN) {
          var ownedVal = getOwned(c.id);
          if (manageVal === "owned" && ownedVal === 0) return false;
          if (manageVal === "unowned" && ownedVal !== 0) return false;
        } else {
          var sel = selections[c.id];
          var status = sel ? sel.status : null;
          var pending = sel ? !!sel.pending : false;
          if (manageVal === "want" && !(status === "want" && !pending)) return false;
          if (manageVal === "yield" && !(status === "yield" && !pending)) return false;
          if (manageVal === "want_pending" && !(status === "want" && pending)) return false;
          if (manageVal === "yield_pending" && !(status === "yield" && pending)) return false;
        }
      }
      return true;
    });
  }

  // ---- カードグリッド ----

  function renderGrid() {
    var filtered = getFilteredCards();
    var frag = document.createDocumentFragment();
    filtered.forEach(function (card) {
      frag.appendChild(buildCardCell(card));
    });
    els.cardGrid.innerHTML = "";
    els.cardGrid.appendChild(frag);
    filtered.forEach(function (card) { updateCardCellUI(card.id); });
    els.resultCount.textContent = String(filtered.length);
  }

  function getStatusBadgeInfo(sel) {
    if (sel.status === "want") {
      return sel.pending ? { text: "もらう予定", cls: "is-want-pending" } : { text: "求", cls: "is-want" };
    }
    return sel.pending ? { text: "あげる予定", cls: "is-yield-pending" } : { text: "譲", cls: "is-yield" };
  }

  function formatOwnedLabel(value) {
    return String(value);
  }

  function buildCardCell(card) {
    var cell = document.createElement("div");
    cell.className = "card-cell";
    cell.dataset.id = card.id;

    var imgWrap = document.createElement("div");
    imgWrap.className = "card-image-wrap";

    var img = document.createElement("img");
    img.src = IMAGE_BASE + card.image;
    img.alt = card.name;
    img.loading = "lazy";
    img.crossOrigin = "anonymous";
    imgWrap.appendChild(img);

    cell.appendChild(imgWrap);

    if (mode === MODES.TRADE) {
      var badge = document.createElement("span");
      badge.className = "status-badge";
      badge.hidden = true;
      imgWrap.appendChild(badge);

      var qtyPill = document.createElement("span");
      qtyPill.className = "qty-pill";
      qtyPill.hidden = true;
      imgWrap.appendChild(qtyPill);

      var ownedReadout = document.createElement("div");
      ownedReadout.className = "owned-readout";
      cell.appendChild(ownedReadout);

      var statusRow = document.createElement("div");
      statusRow.className = "status-buttons";

      var wantBtn = document.createElement("button");
      wantBtn.type = "button";
      wantBtn.className = "status-btn status-btn-want";
      wantBtn.dataset.action = "want";
      wantBtn.setAttribute("aria-pressed", "false");
      wantBtn.setAttribute("aria-label", card.name + "（" + card.rarity + "）を求にする");
      wantBtn.textContent = "求";

      var yieldBtn = document.createElement("button");
      yieldBtn.type = "button";
      yieldBtn.className = "status-btn status-btn-yield";
      yieldBtn.dataset.action = "yield";
      yieldBtn.setAttribute("aria-pressed", "false");
      yieldBtn.setAttribute("aria-label", card.name + "（" + card.rarity + "）を譲にする");
      yieldBtn.textContent = "譲";

      var pendingBtn = document.createElement("button");
      pendingBtn.type = "button";
      pendingBtn.className = "status-btn status-btn-pending";
      pendingBtn.dataset.action = "pending";
      pendingBtn.disabled = true;
      pendingBtn.setAttribute("aria-pressed", "false");
      pendingBtn.setAttribute("aria-label", card.name + "（" + card.rarity + "）を交換予定にする（求・譲のいずれかを選ぶと有効になります）");
      pendingBtn.textContent = "予定";

      statusRow.appendChild(wantBtn);
      statusRow.appendChild(yieldBtn);
      statusRow.appendChild(pendingBtn);
      cell.appendChild(statusRow);

      var stepper = document.createElement("div");
      stepper.className = "qty-stepper";
      stepper.hidden = true;

      var dec = document.createElement("button");
      dec.type = "button";
      dec.className = "qty-btn";
      dec.dataset.action = "dec";
      dec.setAttribute("aria-label", "枚数を減らす");
      dec.textContent = "−";

      var qtyValue = document.createElement("span");
      qtyValue.className = "qty-value";
      qtyValue.textContent = "1";

      var inc = document.createElement("button");
      inc.type = "button";
      inc.className = "qty-btn";
      inc.dataset.action = "inc";
      inc.setAttribute("aria-label", "枚数を増やす");
      inc.textContent = "+";

      stepper.appendChild(dec);
      stepper.appendChild(qtyValue);
      stepper.appendChild(inc);
      cell.appendChild(stepper);
    } else {
      var ownedRow = document.createElement("div");
      ownedRow.className = "owned-row";

      var ownedStepper = document.createElement("div");
      ownedStepper.className = "qty-stepper owned-stepper";
      ownedStepper.setAttribute("role", "group");
      ownedStepper.setAttribute("aria-label", card.name + "（" + card.rarity + "）の所持枚数");

      var ownedDec = document.createElement("button");
      ownedDec.type = "button";
      ownedDec.className = "qty-btn";
      ownedDec.dataset.action = "owned-dec";
      ownedDec.setAttribute("aria-label", "所持枚数を減らす");
      ownedDec.textContent = "−";

      var ownedValue = document.createElement("span");
      ownedValue.className = "qty-value owned-value";
      ownedValue.textContent = "0";

      var ownedInc = document.createElement("button");
      ownedInc.type = "button";
      ownedInc.className = "qty-btn";
      ownedInc.dataset.action = "owned-inc";
      ownedInc.setAttribute("aria-label", "所持枚数を増やす");
      ownedInc.textContent = "+";

      ownedStepper.appendChild(ownedDec);
      ownedStepper.appendChild(ownedValue);
      ownedStepper.appendChild(ownedInc);

      ownedRow.appendChild(ownedStepper);
      cell.appendChild(ownedRow);
    }

    return cell;
  }

  function updateCardCellUI(id) {
    var cell = els.cardGrid.querySelector('.card-cell[data-id="' + CSS.escape(id) + '"]');
    if (!cell) return;
    var sel = selections[id];
    var ownedVal = getOwned(id);

    if (mode === MODES.TRADE) {
      var badge = cell.querySelector(".status-badge");
      var qtyPill = cell.querySelector(".qty-pill");
      var stepper = cell.querySelector(".qty-stepper");
      var qtyValue = cell.querySelector(".qty-value");
      var wantBtn = cell.querySelector(".status-btn-want");
      var yieldBtn = cell.querySelector(".status-btn-yield");
      var pendingBtn = cell.querySelector(".status-btn-pending");
      var ownedReadout = cell.querySelector(".owned-readout");

      cell.classList.remove("is-want", "is-yield", "is-want-pending", "is-yield-pending");
      wantBtn.classList.toggle("is-active", !!sel && sel.status === "want");
      wantBtn.setAttribute("aria-pressed", String(!!sel && sel.status === "want"));
      yieldBtn.classList.toggle("is-active", !!sel && sel.status === "yield");
      yieldBtn.setAttribute("aria-pressed", String(!!sel && sel.status === "yield"));

      var pendingActive = !!sel && !!sel.pending;
      pendingBtn.classList.toggle("is-active", pendingActive);
      pendingBtn.setAttribute("aria-pressed", String(pendingActive));
      pendingBtn.disabled = !sel;

      if (sel) {
        var info = getStatusBadgeInfo(sel);
        cell.classList.add(info.cls);
        badge.textContent = info.text;
        badge.hidden = false;
        stepper.hidden = false;
        qtyValue.textContent = String(sel.qty);
        qtyPill.hidden = sel.qty <= 1;
        qtyPill.textContent = "×" + sel.qty;
      } else {
        badge.hidden = true;
        stepper.hidden = true;
        qtyPill.hidden = true;
      }

      ownedReadout.textContent = "所持" + formatOwnedLabel(ownedVal);
    } else {
      var ownedValueEl = cell.querySelector(".owned-value");
      if (ownedValueEl) ownedValueEl.textContent = String(ownedVal);
    }

    cell.classList.toggle("is-unowned", ownedVal === 0);
  }

  // ---- 選択状態（求/譲ボタンの排他トグル） ----

  function toggleStatus(id, status) {
    var cur = selections[id];
    if (cur && cur.status === status) {
      delete selections[id];
    } else {
      // 求/譲の切替は新しい交換方向の宣言なので、以前の交換予定フラグは引き継がない
      selections[id] = { status: status, qty: cur ? cur.qty : 1, pending: false };
    }
    saveSelections();
    updateCardCellUI(id);
    renderSummary();
  }

  function togglePending(id) {
    var cur = selections[id];
    if (!cur) return;
    cur.pending = !cur.pending;
    saveSelections();
    updateCardCellUI(id);
    renderSummary();
  }

  function changeQty(id, delta) {
    var cur = selections[id];
    if (!cur) return;
    cur.qty = Math.min(MAX_QTY, Math.max(1, cur.qty + delta));
    saveSelections();
    updateCardCellUI(id);
  }

  function changeOwned(id, delta) {
    setOwned(id, getOwned(id) + delta);
    renderSummary();
  }

  function renderSummary() {
    var want = 0, yield_ = 0, pending = 0;
    Object.keys(selections).forEach(function (id) {
      var sel = selections[id];
      if (sel.status === "want") want++;
      else if (sel.status === "yield") yield_++;
      if (sel.pending) pending++;
    });
    var ownedCount = 0;
    Object.keys(owned).forEach(function (id) {
      if (owned[id] > 0) ownedCount++;
    });
    els.summaryWant.textContent = String(want);
    els.summaryYield.textContent = String(yield_);
    els.summaryPending.textContent = String(pending);
    els.summaryOwned.textContent = String(ownedCount);
  }

  // ---- イベント ----

  function bindEvents() {
    els.modeSwitch.addEventListener("click", function (e) {
      var btn = e.target.closest(".mode-btn");
      if (!btn) return;
      setMode(btn.dataset.mode);
    });

    els.searchInput.addEventListener("input", function () {
      filters.query = els.searchInput.value.trim().toLowerCase();
      renderGrid();
    });

    els.seriesTabs.addEventListener("click", function (e) {
      var btn = e.target.closest(".tab-btn");
      if (!btn) return;
      filters.series = btn.dataset.series;
      syncSeriesTabs();
      renderGrid();
    });

    els.rarityChips.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip-btn");
      if (!btn) return;
      var val = btn.dataset.rarity;
      if (val === "all") {
        filters.rarities = new Set(RARITIES);
      } else if (filters.rarities.has(val)) {
        filters.rarities.delete(val);
      } else {
        filters.rarities.add(val);
      }
      syncRarityChips();
      renderGrid();
    });

    els.manageChips.addEventListener("click", function (e) {
      var manageBtn = e.target.closest(".chip-btn");
      if (!manageBtn) return;
      setManageFilterValue(manageBtn.dataset.manage);
      syncManageChips();
      renderGrid();
    });

    els.parallelToggle.addEventListener("change", function () {
      filters.showParallel = els.parallelToggle.checked;
      renderGrid();
    });

    els.cardGrid.addEventListener("click", function (e) {
      var qtyBtn = e.target.closest(".qty-btn");
      if (qtyBtn) {
        var cell = qtyBtn.closest(".card-cell");
        var act = qtyBtn.dataset.action;
        if (act === "owned-inc") changeOwned(cell.dataset.id, 1);
        else if (act === "owned-dec") changeOwned(cell.dataset.id, -1);
        else changeQty(cell.dataset.id, act === "inc" ? 1 : -1);
        return;
      }
      var statusBtn = e.target.closest(".status-btn");
      if (statusBtn) {
        var id = statusBtn.closest(".card-cell").dataset.id;
        if (statusBtn.dataset.action === "pending") togglePending(id);
        else toggleStatus(id, statusBtn.dataset.action);
      }
    });

    els.clearBtn.addEventListener("click", onClearClick);
    els.generateBtn.addEventListener("click", onGenerateClick);
    els.ownImageBtn.addEventListener("click", onOwnImageClick);
  }

  function onClearClick() {
    if (!clearArmed) {
      clearArmed = true;
      els.clearBtn.textContent = "もう一度押して確定";
      els.clearBtn.classList.add("armed");
      clearArmTimer = setTimeout(disarmClear, 3000);
      return;
    }
    disarmClear();
    selections = {};
    saveSelections();
    renderGrid();
    renderSummary();
    showToast("選択をすべてクリアしました");
  }

  function disarmClear() {
    clearArmed = false;
    clearTimeout(clearArmTimer);
    els.clearBtn.textContent = "選択をすべてクリア";
    els.clearBtn.classList.remove("armed");
  }

  // ---- 画像生成 ----

  function checkHtml2canvasAvailability() {
    if (typeof html2canvas !== "function") {
      els.html2canvasWarning.hidden = false;
      els.generateBtn.disabled = true;
      els.ownImageBtn.disabled = true;
    }
  }

  function onGenerateClick() {
    if (typeof html2canvas !== "function") {
      showToast("画像生成にはネット接続が必要です（html2canvasの読み込みに失敗しました）");
      return;
    }

    var wantEntries = [];
    var yieldEntries = [];
    Object.keys(selections).forEach(function (id) {
      var sel = selections[id];
      if (sel.pending) return; // 交換成立済み（もらう予定／あげる予定）は画像に含めない
      if (sel.status === "want") wantEntries.push([id, sel]);
      else if (sel.status === "yield") yieldEntries.push([id, sel]);
    });

    if (wantEntries.length === 0 && yieldEntries.length === 0) {
      showToast("求・譲のカードを1枚以上選んでください");
      return;
    }

    sortEntriesByDisplayOrder(wantEntries);
    sortEntriesByDisplayOrder(yieldEntries);

    els.generateBtn.disabled = true;
    var originalLabel = els.generateBtn.textContent;
    els.generateBtn.textContent = "生成中…";

    buildExportStage(wantEntries, yieldEntries);

    waitForStageImages()
      .then(function () {
        var target = els.exportStage.querySelector(".export-card");
        return html2canvas(target, {
          useCORS: true,
          backgroundColor: "#ffffff",
          scale: 2
        });
      })
      .then(function (canvas) {
        var dataUrl = canvas.toDataURL("image/png");
        downloadDataUrl(dataUrl, buildFileName("aikatsu-trade"));
        showToast("交換画像を作成しました");
      })
      .catch(function (err) {
        console.error("[aikatsu-trade] 画像生成に失敗しました", err);
        showToast("画像生成に失敗しました: " + err.message);
      })
      .then(function () {
        els.generateBtn.disabled = false;
        els.generateBtn.textContent = originalLabel;
        els.exportStage.innerHTML = "";
      });
  }

  function sortEntriesByDisplayOrder(entries) {
    entries.sort(function (a, b) {
      return (DISPLAY_INDEX.get(a[0]) || 0) - (DISPLAY_INDEX.get(b[0]) || 0);
    });
  }

  function buildExportStage(wantEntries, yieldEntries) {
    els.exportStage.innerHTML = "";

    var card = document.createElement("div");
    card.className = "export-card";

    var header = document.createElement("div");
    header.className = "export-header";
    var title = document.createElement("div");
    title.className = "export-title";
    title.textContent = "アイカツ！アンコール カード交換";
    header.appendChild(title);
    card.appendChild(header);

    card.appendChild(buildExportSection("yield", "【譲】 YIELD", yieldEntries));
    card.appendChild(buildExportSection("want", "【求】 WANT", wantEntries));

    var footer = document.createElement("div");
    footer.className = "export-footer";
    footer.textContent = "アイカツ！アンコール カード交換画像メーカーで作成";
    card.appendChild(footer);

    els.exportStage.appendChild(card);
  }

  function buildExportSection(kind, label, entries) {
    var section = document.createElement("div");
    section.className = "export-section export-" + kind;

    var band = document.createElement("div");
    band.className = "export-band band-" + kind;
    band.textContent = label;
    section.appendChild(band);

    if (entries.length === 0) {
      var empty = document.createElement("div");
      empty.className = "export-empty";
      empty.textContent = "なし";
      section.appendChild(empty);
      return section;
    }

    var grid = document.createElement("div");
    grid.className = "export-grid";
    entries.forEach(function (entry) {
      var card = CARD_BY_ID.get(entry[0]);
      if (!card) return;
      grid.appendChild(buildExportTile(card, entry[1].qty));
    });
    section.appendChild(grid);
    return section;
  }

  function buildExportTile(card, qty) {
    var tile = document.createElement("div");
    tile.className = "export-tile";

    var img = document.createElement("img");
    img.src = IMAGE_BASE + card.image;
    img.crossOrigin = "anonymous";
    img.alt = card.name;
    tile.appendChild(img);

    if (qty > 1) {
      var qtyPill = document.createElement("span");
      qtyPill.className = "export-tile-qty";
      qtyPill.textContent = "×" + qty;
      tile.appendChild(qtyPill);
    }

    return tile;
  }

  function waitForStageImages() {
    var imgs = Array.prototype.slice.call(els.exportStage.querySelectorAll("img"));
    return Promise.all(imgs.map(function (img) {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise(function (resolve) {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    }));
  }

  function downloadDataUrl(dataUrl, filename) {
    var a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function buildFileName(prefix) {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return (prefix || "aikatsu-trade") + "_" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) +
      "_" + pad(d.getHours()) + pad(d.getMinutes()) + ".png";
  }

  // ---- 所持画像の生成 ----

  function seriesLabel(series) {
    if (series === "all") return "全弾";
    if (series === "promo") return "プロモーション";
    return series + "弾";
  }

  function onOwnImageClick() {
    if (typeof html2canvas !== "function") {
      showToast("画像生成にはネット接続が必要です（html2canvasの読み込みに失敗しました）");
      return;
    }

    var series = filters.series;
    var cards = DISPLAY_ORDER.filter(function (c) {
      if (c.parallel) return false;
      if (series !== "all" && c.series !== series) return false;
      return true;
    });
    if (cards.length === 0) {
      showToast("対象のカードがありません");
      return;
    }

    els.ownImageBtn.disabled = true;
    var originalLabel = els.ownImageBtn.textContent;
    els.ownImageBtn.textContent = "生成中…";

    buildOwnSheet(cards, series)
      .then(function () { return waitForStageImages(); })
      .then(function () {
        var target = els.exportStage.querySelector(".own-sheet");
        return html2canvas(target, {
          useCORS: true,
          backgroundColor: "#ffffff",
          scale: 2
        });
      })
      .then(function (canvas) {
        downloadDataUrl(canvas.toDataURL("image/png"), buildFileName("aikatsu-owned"));
        showToast("所持画像を作成しました");
      })
      .catch(function (err) {
        console.error("[aikatsu-trade] 所持画像の生成に失敗しました", err);
        showToast("画像生成に失敗しました: " + err.message);
      })
      .then(function () {
        els.ownImageBtn.disabled = false;
        els.ownImageBtn.textContent = originalLabel;
        els.exportStage.innerHTML = "";
      });
  }

  function buildOwnSheet(cards, series) {
    els.exportStage.innerHTML = "";

    var sheet = document.createElement("div");
    sheet.className = "own-sheet";

    var ownedCount = cards.filter(function (c) { return getOwned(c.id) > 0; }).length;
    var total = cards.length;
    var pct = total ? (ownedCount / total * 100).toFixed(1) : "0.0";

    var header = document.createElement("div");
    header.className = "own-sheet-header";
    var title = document.createElement("div");
    title.className = "own-sheet-title";
    title.textContent = "🎀 アイカツ！アンコール カード所持状況 🎀";
    var sub = document.createElement("div");
    sub.className = "own-sheet-sub";
    sub.textContent = seriesLabel(series) + "　PR / R / N / ER　　所持：" + ownedCount + " / " + total + "枚（" + pct + "%）";
    header.appendChild(title);
    header.appendChild(sub);
    sheet.appendChild(header);

    var grid = document.createElement("div");
    grid.className = "own-sheet-grid";
    var tasks = [];
    cards.forEach(function (c) {
      var tile = document.createElement("div");
      tile.className = "own-tile";

      var img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.alt = c.name;
      var url = IMAGE_BASE + c.image;
      var n = getOwned(c.id);

      if (n > 0) {
        img.src = url;
      } else {
        tile.classList.add("is-unowned");
        tasks.push(toGrayscaleDataUrl(url).then(function (dataUrl) { img.src = dataUrl; }));
      }
      tile.appendChild(img);

      if (n > 0) {
        var badge = document.createElement("span");
        badge.className = "own-tile-count";
        badge.textContent = String(n);
        tile.appendChild(badge);
      }

      grid.appendChild(tile);
    });
    sheet.appendChild(grid);
    els.exportStage.appendChild(sheet);

    return Promise.all(tasks);
  }

  // 未所持カードは html2canvas が CSS filter:grayscale を無視するため、事前に
  // グレースケール化した dataURL を使う。ctx.filter は Safari 17 未満など未対応の
  // 環境があるので、ピクセル単位の輝度変換（全ブラウザで動く）でグレー化する。
  function toGrayscaleDataUrl(url) {
    return new Promise(function (resolve) {
      var im = new Image();
      im.crossOrigin = "anonymous";
      im.onload = function () {
        try {
          var cv = document.createElement("canvas");
          cv.width = im.naturalWidth;
          cv.height = im.naturalHeight;
          var ctx = cv.getContext("2d");
          ctx.drawImage(im, 0, 0);
          var imageData = ctx.getImageData(0, 0, cv.width, cv.height);
          var px = imageData.data;
          for (var i = 0; i < px.length; i += 4) {
            var g = (px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114) | 0;
            px[i] = px[i + 1] = px[i + 2] = g;
          }
          ctx.putImageData(imageData, 0, 0);
          resolve(cv.toDataURL("image/png"));
        } catch (e) {
          resolve(url);
        }
      };
      im.onerror = function () { resolve(url); };
      im.src = url;
    });
  }

  // ---- トースト通知 ----

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.hidden = false;
    requestAnimationFrame(function () {
      els.toast.classList.add("show");
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      els.toast.classList.remove("show");
      setTimeout(function () { els.toast.hidden = true; }, 200);
    }, 3000);
  }
})();
