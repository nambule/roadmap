const STORAGE_KEY = "roadmap-designer-state-v1";
const PANEL_STORAGE_KEY = "roadmap-designer-panel-collapsed-v1";
const COLUMNS_PER_VERSION = 3;
const DEFAULT_START_YEAR = 2026;
const BODY_FONT_STACK = '"Avenir Next", "Segoe UI", sans-serif';
const DISPLAY_FONT_STACK = '"Gill Sans", "Avenir Next Condensed", sans-serif';

const demoState = {
  company: "ADVENT CO.",
  title: "ENVISION 6.0",
  versions: [
    { id: crypto.randomUUID(), name: "2026" },
    { id: crypto.randomUUID(), name: "2027" }
  ],
  sections: [
    {
      id: crypto.randomUUID(),
      name: "WEB TEAM",
      icon: "▣",
      color: "#e8b54f"
    },
    {
      id: crypto.randomUUID(),
      name: "MOBILE\nMOCK UP",
      icon: "▤",
      color: "#9ec8dc"
    },
    {
      id: crypto.randomUUID(),
      name: "MARKETING\nTEAM",
      icon: "◔",
      color: "#b9b2e4"
    }
  ],
  subjects: []
};

function seedSubjects() {
  const [web, mobile, marketing] = demoState.sections;
  demoState.subjects = [
    { id: crypto.randomUUID(), sectionId: web.id, title: "New admin\nconsole", start: 0, span: 1, row: 0, color: "#f6df9a" },
    { id: crypto.randomUUID(), sectionId: web.id, title: "3rd party integrations", start: 1, span: 2, row: 0, color: "#f6df9a" },
    { id: crypto.randomUUID(), sectionId: web.id, title: "Security 2.0", start: 2, span: 1, row: 1, color: "#efc15f" },
    { id: crypto.randomUUID(), sectionId: web.id, title: "On premise backup", start: 3, span: 2, row: 1, color: "#efc15f" },
    { id: crypto.randomUUID(), sectionId: web.id, title: "Code review", start: 5, span: 1, row: 1, color: "#efc15f" },
    { id: crypto.randomUUID(), sectionId: web.id, title: "Self-service\nportal", start: 3, span: 1, row: 2, color: "#dd9a42" },
    { id: crypto.randomUUID(), sectionId: web.id, title: "API", start: 4, span: 1, row: 2, color: "#dd9a42" },
    { id: crypto.randomUUID(), sectionId: web.id, title: "Shopping cart\nimprovements", start: 5, span: 1, row: 2, color: "#dd9a42" },
    { id: crypto.randomUUID(), sectionId: mobile.id, title: "Mobile\nmock up", start: 0, span: 1, row: 0, color: "#abd0e0" },
    { id: crypto.randomUUID(), sectionId: mobile.id, title: "UX\nimprovements", start: 1, span: 1, row: 0, color: "#abd0e0" },
    { id: crypto.randomUUID(), sectionId: mobile.id, title: "Cloud\nsupport", start: 2, span: 1, row: 0, color: "#abd0e0" },
    { id: crypto.randomUUID(), sectionId: mobile.id, title: "UX\nimprovements", start: 3, span: 1, row: 0, color: "#abd0e0" },
    { id: crypto.randomUUID(), sectionId: mobile.id, title: "Android application", start: 1, span: 2, row: 1, color: "#93c2d8" },
    { id: crypto.randomUUID(), sectionId: mobile.id, title: "Interactive\ndialogue box", start: 3, span: 1, row: 1, color: "#93c2d8" },
    { id: crypto.randomUUID(), sectionId: mobile.id, title: "Automatic\nrenewal service", start: 4, span: 1, row: 2, color: "#7fb0c8" },
    { id: crypto.randomUUID(), sectionId: mobile.id, title: "Application\nupgrade", start: 4, span: 1, row: 3, color: "#7fb0c8" },
    { id: crypto.randomUUID(), sectionId: mobile.id, title: "Ticketing\nsystem", start: 5, span: 1, row: 2, color: "#7fb0c8" },
    { id: crypto.randomUUID(), sectionId: mobile.id, title: "Q3\ninitiative", start: 5, span: 1, row: 3, color: "#7fb0c8" },
    { id: crypto.randomUUID(), sectionId: marketing.id, title: "Market\nanalysis", start: 0, span: 1, row: 0, color: "#c8c1ef" },
    { id: crypto.randomUUID(), sectionId: marketing.id, title: "Customer outreach", start: 1, span: 2, row: 0, color: "#c8c1ef" },
    { id: crypto.randomUUID(), sectionId: marketing.id, title: "SEO\nplan", start: 3, span: 1, row: 0, color: "#c8c1ef" },
    { id: crypto.randomUUID(), sectionId: marketing.id, title: "Legal\ngeneration", start: 2, span: 1, row: 1, color: "#b1abd6" },
    { id: crypto.randomUUID(), sectionId: marketing.id, title: "Pricing review", start: 3, span: 2, row: 1, color: "#b1abd6" },
    { id: crypto.randomUUID(), sectionId: marketing.id, title: "Content review", start: 5, span: 1, row: 1, color: "#b1abd6" },
    { id: crypto.randomUUID(), sectionId: marketing.id, title: "Analytics", start: 4, span: 1, row: 2, color: "#8d87b9" },
    { id: crypto.randomUUID(), sectionId: marketing.id, title: "Performance\nmanagement", start: 5, span: 1, row: 2, color: "#8d87b9" }
  ];
}

seedSubjects();

const board = document.querySelector("#roadmapBoard");
const versionList = document.querySelector("#versionList");
const sectionList = document.querySelector("#sectionList");
const subjectForm = document.querySelector("#subjectForm");
const subjectTitleInput = document.querySelector("#subjectTitleInput");
const subjectSectionSelect = document.querySelector("#subjectSectionSelect");
const subjectStartSelect = document.querySelector("#subjectStartSelect");
const subjectSpanInput = document.querySelector("#subjectSpanInput");
const subjectRowInput = document.querySelector("#subjectRowInput");
const subjectColorInput = document.querySelector("#subjectColorInput");
const companyInput = document.querySelector("#companyInput");
const titleInput = document.querySelector("#titleInput");
const addVersionButton = document.querySelector("#addVersionButton");
const addSectionButton = document.querySelector("#addSectionButton");
const addSubjectButton = document.querySelector("#addSubjectButton");
const resetButton = document.querySelector("#resetButton");
const exportSvgButton = document.querySelector("#exportSvgButton");
const exportExcelButton = document.querySelector("#exportExcelButton");
const togglePanelButton = document.querySelector("#togglePanelButton");
const showPanelButton = document.querySelector("#showPanelButton");
const appShell = document.querySelector(".app-shell");
const subjectModal = document.querySelector("#subjectModal");
const subjectModalBackdrop = document.querySelector("#subjectModalBackdrop");
const closeSubjectModalButton = document.querySelector("#closeSubjectModalButton");
const subjectModalForm = document.querySelector("#subjectModalForm");
const modalSubjectTitleInput = document.querySelector("#modalSubjectTitleInput");
const modalSubjectSectionSelect = document.querySelector("#modalSubjectSectionSelect");
const modalSubjectStartSelect = document.querySelector("#modalSubjectStartSelect");
const modalSubjectSpanInput = document.querySelector("#modalSubjectSpanInput");
const modalSubjectRowInput = document.querySelector("#modalSubjectRowInput");
const modalSubjectColorInput = document.querySelector("#modalSubjectColorInput");
const deleteSubjectButton = document.querySelector("#deleteSubjectButton");
const versionTemplate = document.querySelector("#versionItemTemplate");
const sectionTemplate = document.querySelector("#sectionItemTemplate");

let state = loadState();
let draggedSubjectId = null;
let currentDropPreview = null;
let isPanelCollapsed = loadPanelState();
let editingSubjectId = null;
let resizeSession = null;

bindStaticEvents();
render();

function loadState() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return normalizeState(structuredClone(demoState));
  }

  try {
    return normalizeState(JSON.parse(saved));
  } catch {
    return normalizeState(structuredClone(demoState));
  }
}

function saveState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getDefaultYearLabel(index) {
  return String(DEFAULT_START_YEAR + index);
}

function isYearLabel(value) {
  return /^\d{4}$/.test(String(value || "").trim());
}

function isLegacyVersionLabel(value) {
  return /^V\d+$/i.test(String(value || "").trim());
}

function normalizeState(inputState) {
  const nextState = structuredClone(inputState);
  const versionCount = Array.isArray(nextState.versions) ? nextState.versions.length : 0;
  const alreadyGrouped =
    Array.isArray(inputState.versions) &&
    inputState.versions.length > 0 &&
    inputState.versions.every((version) => isYearLabel(version.name) || isLegacyVersionLabel(version.name));
  const groupCount = alreadyGrouped
    ? Math.max(1, versionCount)
    : Math.max(1, Math.ceil(versionCount / COLUMNS_PER_VERSION));

  nextState.versions = Array.from({ length: groupCount }, (_, index) => {
    const existing = inputState.versions?.[index];
    const existingName = String(existing?.name || "").trim();
    const isGroupedVersion = isYearLabel(existingName) || isLegacyVersionLabel(existingName);
    const legacyMatch = existingName.match(/^V(\d+)$/i);
    return {
      id: existing?.id || crypto.randomUUID(),
      name: isGroupedVersion
        ? isYearLabel(existingName)
          ? existingName
          : getDefaultYearLabel(Math.max(0, Number(legacyMatch?.[1] || index + 1) - 1))
        : getDefaultYearLabel(index)
    };
  });

  return nextState;
}

function bindStaticEvents() {
  togglePanelButton.addEventListener("click", () => {
    setPanelCollapsed(true);
  });

  showPanelButton.addEventListener("click", () => {
    setPanelCollapsed(false);
  });

  subjectModalBackdrop.addEventListener("click", closeSubjectModal);
  closeSubjectModalButton.addEventListener("click", closeSubjectModal);
  deleteSubjectButton.addEventListener("click", handleDeleteSubject);
  document.addEventListener("keydown", handleGlobalKeydown);
  modalSubjectStartSelect.addEventListener("change", syncModalSpanLimit);

  addVersionButton.addEventListener("click", () => {
    const nextIndex = state.versions.length;
    state.versions.push({
      id: crypto.randomUUID(),
      name: getDefaultYearLabel(nextIndex)
    });
    clampSubjects();
    commit();
  });

  addSectionButton.addEventListener("click", () => {
    state.sections.push({
      id: crypto.randomUUID(),
      name: `NEW SECTION ${state.sections.length + 1}`,
      icon: "✦",
      color: "#d6b374"
    });
    commit();
  });

  addSubjectButton.addEventListener("click", () => {
    subjectTitleInput.focus();
  });

  exportSvgButton.addEventListener("click", exportSvg);
  exportExcelButton.addEventListener("click", exportExcel);

  resetButton.addEventListener("click", () => {
    state = structuredClone(demoState);
    commit();
  });

  companyInput.addEventListener("input", (event) => {
    state.company = event.target.value.toUpperCase();
    commit(false);
    renderBoard();
  });

  titleInput.addEventListener("input", (event) => {
    state.title = event.target.value.toUpperCase();
    commit(false);
    renderBoard();
  });

  subjectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const start = Number(subjectStartSelect.value);
    const span = Math.max(1, Number(subjectSpanInput.value) || 1);
    const row = Math.max(0, Number(subjectRowInput.value) || 0);
    const boundedSpan = Math.min(span, getTotalColumns() - start);

    state.subjects.push({
      id: crypto.randomUUID(),
      title: subjectTitleInput.value.trim(),
      sectionId: subjectSectionSelect.value,
      start,
      span: boundedSpan,
      row,
      color: subjectColorInput.value
    });

    subjectForm.reset();
    subjectSpanInput.value = 1;
    subjectRowInput.value = 0;
    subjectColorInput.value = "#efc15f";
    commit();
  });

  subjectModalForm.addEventListener("submit", handleSubjectModalSubmit);
}

function commit(shouldRender = true) {
  clampSubjects();
  saveState();
  if (shouldRender) {
    render();
  }
}

function clampSubjects() {
  const totalColumns = getTotalColumns();
  const maxIndex = Math.max(0, totalColumns - 1);
  state.subjects = state.subjects
    .filter((subject) => state.sections.some((section) => section.id === subject.sectionId))
    .map((subject) => {
      const start = Math.min(subject.start, maxIndex);
      const remaining = totalColumns - start;
      return {
        ...subject,
        start,
        row: Math.max(0, subject.row || 0),
        span: Math.max(1, Math.min(subject.span || 1, remaining))
      };
    });
}

function render() {
  renderPanelState();
  companyInput.value = state.company;
  titleInput.value = state.title;
  renderVersionEditor();
  renderSectionEditor();
  renderSubjectFormOptions();
  renderBoard();
}

function loadPanelState() {
  return window.localStorage.getItem(PANEL_STORAGE_KEY) === "true";
}

function savePanelState() {
  window.localStorage.setItem(PANEL_STORAGE_KEY, String(isPanelCollapsed));
}

function setPanelCollapsed(nextValue) {
  isPanelCollapsed = nextValue;
  savePanelState();
  renderPanelState();
}

function renderPanelState() {
  appShell.classList.toggle("panel-collapsed", isPanelCollapsed);
  togglePanelButton.setAttribute("aria-expanded", String(!isPanelCollapsed));
  showPanelButton.setAttribute("aria-expanded", String(!isPanelCollapsed));
}

function renderVersionEditor() {
  versionList.innerHTML = "";

  if (!state.versions.length) {
    versionList.innerHTML = `<div class="empty-state">Add at least one year to build the grid.</div>`;
    return;
  }

  state.versions.forEach((version) => {
    const node = versionTemplate.content.firstElementChild.cloneNode(true);
    const nameInput = node.querySelector(".version-name");
    const removeButton = node.querySelector(".version-remove");

    nameInput.value = version.name;

    nameInput.addEventListener("input", (event) => {
      version.name = event.target.value.toUpperCase();
      commit();
    });

    removeButton.addEventListener("click", () => {
      if (state.versions.length === 1) {
        return;
      }
      state.versions = state.versions.filter((item) => item.id !== version.id);
      commit();
    });

    versionList.appendChild(node);
  });
}

function renderSectionEditor() {
  sectionList.innerHTML = "";

  if (!state.sections.length) {
    sectionList.innerHTML = `<div class="empty-state">Add a section to start grouping roadmap subjects.</div>`;
    return;
  }

  state.sections.forEach((section) => {
    const node = sectionTemplate.content.firstElementChild.cloneNode(true);
    const nameInput = node.querySelector(".section-name");
    const iconInput = node.querySelector(".section-icon");
    const colorInput = node.querySelector(".section-color");
    const removeButton = node.querySelector(".section-remove");

    nameInput.value = section.name;
    iconInput.value = section.icon;
    colorInput.value = section.color;

    nameInput.addEventListener("input", (event) => {
      section.name = event.target.value.toUpperCase();
      commit();
    });

    iconInput.addEventListener("input", (event) => {
      section.icon = event.target.value || "✦";
      commit();
    });

    colorInput.addEventListener("input", (event) => {
      section.color = event.target.value;
      commit();
    });

    removeButton.addEventListener("click", () => {
      state.sections = state.sections.filter((item) => item.id !== section.id);
      state.subjects = state.subjects.filter((subject) => subject.sectionId !== section.id);
      commit();
    });

    sectionList.appendChild(node);
  });
}

function renderSubjectFormOptions() {
  fillSectionOptions(subjectSectionSelect);
  fillColumnOptions(subjectStartSelect);
  const maxSpan = Math.max(1, getTotalColumns());
  subjectSpanInput.max = String(maxSpan);
}

function fillSectionOptions(selectNode) {
  selectNode.innerHTML = "";
  state.sections.forEach((section) => {
    const option = document.createElement("option");
    option.value = section.id;
    option.textContent = section.name.replace(/\n/g, " ");
    selectNode.appendChild(option);
  });
}

function fillColumnOptions(selectNode) {
  selectNode.innerHTML = "";
  for (let index = 0; index < getTotalColumns(); index += 1) {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = getColumnReference(index);
    selectNode.appendChild(option);
  }
}

function renderBoard() {
  const versionCount = state.versions.length || 1;
  const totalColumns = getTotalColumns() || COLUMNS_PER_VERSION;
  board.innerHTML = "";
  board.style.setProperty("--version-count", String(versionCount));
  board.style.setProperty("--timeline-column-count", String(totalColumns));
  board.style.setProperty("--roadmap-column-count", String(totalColumns));

  const header = document.createElement("div");
  header.className = "board-header";
  header.innerHTML = `
    <div>
      <p class="board-kicker"><span>${escapeHtml(state.company)}</span> // <strong>${escapeHtml(state.title)}</strong> // <span>PRODUCT ROADMAP</span></p>
    </div>
  `;

  const timeline = document.createElement("div");
  timeline.className = "timeline";
  const versionGroups = getVersionGroups();
  timeline.innerHTML = `<div class="timeline-spacer"></div>${versionGroups
    .map(
      (group) => `
      <div class="version-group" style="grid-column:${group.start + 2} / span ${group.span};">
        <span class="version-group-label">${escapeHtml(group.label)}</span>
      </div>`
    )
    .join("")}`;

  const sections = document.createElement("div");
  sections.className = "sections";

  state.sections.forEach((section) => {
    const sectionNode = document.createElement("section");
    sectionNode.className = "section";
    sectionNode.innerHTML = `
      <div class="section-grid" style="--roadmap-column-count:${totalColumns}; --lane-count:${getLaneCount(section.id)};">
        <div class="section-label">
          <div class="section-icon-badge" style="color:${section.color}; border: 4px solid ${applyAlpha(section.color, 0.55)};">${escapeHtml(section.icon || "✦")}</div>
          <h3 class="section-name">${escapeHtml(section.name)}</h3>
        </div>
        <div class="section-track" data-section-id="${section.id}"></div>
      </div>
    `;

    const track = sectionNode.querySelector(".section-track");
    track.addEventListener("dragover", handleTrackDragOver);
    track.addEventListener("dragleave", handleTrackDragLeave);
    track.addEventListener("drop", handleTrackDrop);

    state.subjects
      .filter((subject) => subject.sectionId === section.id)
      .forEach((subject) => {
        const card = document.createElement("article");
        card.className = "subject-card";
        card.draggable = true;
        card.dataset.subjectId = subject.id;
        card.style.background = subject.color;
        card.style.gridColumn = `${subject.start + 1} / span ${subject.span}`;
        card.style.gridRow = `${subject.row + 1}`;
        card.innerHTML = `
          <span>${escapeHtml(subject.title)}</span>
          <button class="subject-resize-handle" type="button" title="Resize subject" aria-label="Resize subject"></button>
          <div class="subject-actions">
            <button class="subject-action" type="button" data-action="edit" title="Edit subject">✎</button>
            <button class="subject-action" type="button" data-action="delete" title="Delete subject">×</button>
          </div>
        `;

        const resizeHandle = card.querySelector(".subject-resize-handle");
        resizeHandle.addEventListener("pointerdown", (event) => handleResizeStart(event, subject.id));
        card.addEventListener("dragstart", handleDragStart);
        card.addEventListener("dragend", handleDragEnd);
        card.addEventListener("click", (event) => {
          const action = event.target.dataset.action;
          if (!action) {
            return;
          }
          event.stopPropagation();
          if (action === "delete") {
            state.subjects = state.subjects.filter((item) => item.id !== subject.id);
            commit();
            return;
          }
          if (action === "edit") {
            openSubjectEditor(subject.id);
          }
        });

        track.appendChild(card);
      });

    sections.appendChild(sectionNode);
  });

  board.append(header, timeline, sections);
}

function getLaneCount(sectionId) {
  const rows = state.subjects
    .filter((subject) => subject.sectionId === sectionId)
    .map((subject) => subject.row);
  return Math.max(3, ...rows.map((row) => row + 1));
}

function getVersionGroups() {
  return state.versions.map((version, index) => ({
    start: index * COLUMNS_PER_VERSION,
    span: COLUMNS_PER_VERSION,
    label: version.name
  }));
}

function handleDragStart(event) {
  if (resizeSession) {
    event.preventDefault();
    return;
  }
  draggedSubjectId = event.currentTarget.dataset.subjectId;
  event.currentTarget.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedSubjectId);
}

function handleDragEnd(event) {
  event.currentTarget.classList.remove("dragging");
  clearDropPreview();
}

function handleTrackDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  const track = event.currentTarget;
  const subjectId = event.dataTransfer.getData("text/plain") || draggedSubjectId;
  const subject = state.subjects.find((item) => item.id === subjectId);
  if (!subject) {
    return;
  }

  track.classList.add("track-active");
  const placement = getDropPlacement(track, event, subject.span);
  renderDropPreview(track, placement, subject.color);
}

function handleTrackDragLeave(event) {
  if (event.currentTarget.contains(event.relatedTarget)) {
    return;
  }
  clearDropPreview(event.currentTarget);
}

function handleTrackDrop(event) {
  event.preventDefault();
  const track = event.currentTarget;

  const subjectId = event.dataTransfer.getData("text/plain") || draggedSubjectId;
  const subject = state.subjects.find((item) => item.id === subjectId);
  if (!subject) {
    clearDropPreview(track);
    return;
  }

  const placement = getDropPlacement(track, event, subject.span);
  const sectionId = track.dataset.sectionId;

  subject.sectionId = sectionId;
  subject.row = placement.row;
  subject.start = placement.col;
  clearDropPreview(track);
  commit();
}

function getDropPlacement(track, event, span) {
  const rect = track.getBoundingClientRect();
  const styles = getComputedStyle(document.documentElement);
  const versionWidth = parseFloat(styles.getPropertyValue("--version-width"));
  const rowHeight = parseFloat(styles.getPropertyValue("--row-height"));
  const laneCount = getLaneCount(track.dataset.sectionId);
  const maxCol = Math.max(0, getTotalColumns() - span);

  const offsetX = Math.max(0, Math.min(event.clientX - rect.left, rect.width - 1));
  const offsetY = Math.max(0, Math.min(event.clientY - rect.top, rect.height - 1));

  const rawCol = Math.floor(offsetX / versionWidth);
  const rawRow = Math.floor(offsetY / rowHeight);

  return {
    col: Math.min(maxCol, Math.max(0, rawCol)),
    row: Math.min(Math.max(0, laneCount - 1), Math.max(0, rawRow))
  };
}

function renderDropPreview(track, placement, color) {
  clearDropPreview(track);
  const styles = getComputedStyle(document.documentElement);
  const versionWidth = parseFloat(styles.getPropertyValue("--version-width"));
  const rowHeight = parseFloat(styles.getPropertyValue("--row-height"));
  const subjectId = draggedSubjectId;
  const subject = state.subjects.find((item) => item.id === subjectId);
  if (!subject) {
    return;
  }

  const preview = document.createElement("div");
  preview.className = "drop-indicator";
  preview.style.left = `${placement.col * versionWidth}px`;
  preview.style.top = `${placement.row * rowHeight}px`;
  preview.style.width = `${subject.span * versionWidth - 12}px`;
  preview.style.height = `${rowHeight - 12}px`;
  preview.style.background = applyAlpha(color, 0.18);
  preview.style.borderColor = applyAlpha(color, 0.85);
  track.appendChild(preview);
  currentDropPreview = preview;
}

function clearDropPreview(track) {
  if (track) {
    track.classList.remove("track-active");
  } else {
    document.querySelectorAll(".section-track.track-active").forEach((node) => node.classList.remove("track-active"));
  }

  if (currentDropPreview) {
    currentDropPreview.remove();
    currentDropPreview = null;
  }
}

function handleResizeStart(event, subjectId) {
  event.preventDefault();
  event.stopPropagation();

  const subject = state.subjects.find((item) => item.id === subjectId);
  const card = event.currentTarget.closest(".subject-card");
  const track = card?.closest(".section-track");
  if (!subject || !card || !track) {
    return;
  }

  resizeSession = {
    subjectId,
    card,
    track,
    start: subject.start,
    span: subject.span
  };

  card.classList.add("resizing");
  document.body.classList.add("is-resizing-subject");
  window.addEventListener("pointermove", handleResizeMove);
  window.addEventListener("pointerup", handleResizeEnd);
}

function handleResizeMove(event) {
  if (!resizeSession) {
    return;
  }

  const subject = state.subjects.find((item) => item.id === resizeSession.subjectId);
  if (!subject) {
    handleResizeEnd();
    return;
  }

  const rect = resizeSession.track.getBoundingClientRect();
  const styles = getComputedStyle(document.documentElement);
  const columnWidth = parseFloat(styles.getPropertyValue("--version-width"));
  const totalColumns = getTotalColumns();
  const rightEdge = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
  const rawEndColumn = Math.ceil(rightEdge / columnWidth);
  const nextSpan = Math.max(1, Math.min(totalColumns - subject.start, rawEndColumn - subject.start));

  resizeSession.card.style.gridColumn = `${subject.start + 1} / span ${nextSpan}`;
  resizeSession.nextSpan = nextSpan;
}

function handleResizeEnd() {
  if (!resizeSession) {
    return;
  }

  const subject = state.subjects.find((item) => item.id === resizeSession.subjectId);
  if (subject && resizeSession.nextSpan) {
    subject.span = resizeSession.nextSpan;
  }

  resizeSession.card.classList.remove("resizing");
  resizeSession.card.style.gridColumn = "";
  resizeSession = null;
  document.body.classList.remove("is-resizing-subject");
  window.removeEventListener("pointermove", handleResizeMove);
  window.removeEventListener("pointerup", handleResizeEnd);

  if (subject) {
    commit();
  }
}

function openSubjectEditor(subjectId) {
  const subject = state.subjects.find((item) => item.id === subjectId);
  if (!subject) {
    return;
  }
  editingSubjectId = subjectId;
  fillSectionOptions(modalSubjectSectionSelect);
  fillColumnOptions(modalSubjectStartSelect);
  modalSubjectTitleInput.value = subject.title;
  modalSubjectSectionSelect.value = subject.sectionId;
  modalSubjectStartSelect.value = String(subject.start);
  modalSubjectSpanInput.value = String(subject.span);
  syncModalSpanLimit();
  modalSubjectRowInput.value = String(subject.row);
  modalSubjectColorInput.value = subject.color;
  subjectModal.classList.add("is-open");
  subjectModal.setAttribute("aria-hidden", "false");
  modalSubjectTitleInput.focus();
}

function closeSubjectModal() {
  editingSubjectId = null;
  subjectModal.classList.remove("is-open");
  subjectModal.setAttribute("aria-hidden", "true");
}

function handleSubjectModalSubmit(event) {
  event.preventDefault();
  const subject = state.subjects.find((item) => item.id === editingSubjectId);
  if (!subject) {
    closeSubjectModal();
    return;
  }

  const start = Number(modalSubjectStartSelect.value);
  const span = Math.max(1, Number(modalSubjectSpanInput.value) || 1);
  const boundedSpan = Math.min(span, getTotalColumns() - start);

  subject.title = modalSubjectTitleInput.value.trim() || subject.title;
  subject.sectionId = modalSubjectSectionSelect.value;
  subject.start = start;
  subject.span = boundedSpan;
  subject.row = Math.max(0, Number(modalSubjectRowInput.value) || 0);
  subject.color = modalSubjectColorInput.value;

  closeSubjectModal();
  commit();
}

function handleDeleteSubject() {
  if (!editingSubjectId) {
    return;
  }
  state.subjects = state.subjects.filter((item) => item.id !== editingSubjectId);
  closeSubjectModal();
  commit();
}

function handleGlobalKeydown(event) {
  if (event.key === "Escape" && subjectModal.classList.contains("is-open")) {
    closeSubjectModal();
  }
}

function syncModalSpanLimit() {
  const start = Number(modalSubjectStartSelect.value) || 0;
  const maxSpan = Math.max(1, getTotalColumns() - start);
  modalSubjectSpanInput.max = String(maxSpan);
  if (Number(modalSubjectSpanInput.value) > maxSpan) {
    modalSubjectSpanInput.value = String(maxSpan);
  }
}

function getTotalColumns() {
  return Math.max(COLUMNS_PER_VERSION, state.versions.length * COLUMNS_PER_VERSION);
}

function exportSvg() {
  const svg = buildRoadmapSvg();
  downloadFile(`${buildFilenameBase()}.svg`, svg, "image/svg+xml;charset=utf-8");
}

function exportExcel() {
  const workbook = buildExcelWorkbook();
  downloadFile(`${buildFilenameBase()}.xls`, workbook, "application/vnd.ms-excel;charset=utf-8");
}

function buildRoadmapSvg() {
  const totalColumns = getTotalColumns();
  const colWidth = 118;
  const labelWidth = 190;
  const rowHeight = 78;
  const sectionGap = 28;
  const headerHeight = 96;
  const sectionTopPadding = 18;
  const sectionBottomPadding = 20;
  const titleX = 40;
  const boardWidth = labelWidth + totalColumns * colWidth;
  const sectionLayouts = state.sections.map((section) => ({
    section,
    lanes: getLaneCount(section.id),
    subjects: state.subjects.filter((subject) => subject.sectionId === section.id)
  }));
  const sectionsHeight = sectionLayouts.reduce((sum, layout) => {
    return sum + sectionTopPadding + layout.lanes * rowHeight + sectionBottomPadding + sectionGap;
  }, 0);
  const width = titleX * 2 + boardWidth;
  const height = 56 + headerHeight + sectionsHeight;
  let currentY = 56 + headerHeight;

  const sectionMarkup = sectionLayouts.map((layout, index) => {
    const y = currentY;
    const laneHeight = layout.lanes * rowHeight;
    currentY += sectionTopPadding + laneHeight + sectionBottomPadding + sectionGap;
    const dividerTop = index === 0 ? "" : `<line x1="${titleX}" y1="${y}" x2="${titleX + boardWidth}" y2="${y}" stroke="#3e3a37" stroke-width="4" />`;
    const labelY = y + 26;
    const trackX = titleX + labelWidth;
    const trackY = y + sectionTopPadding;
    const columns = Array.from({ length: totalColumns }, (_, col) => {
      if (col % 2 !== 0) {
        return "";
      }
      return `<rect x="${trackX + col * colWidth}" y="${trackY}" width="${colWidth}" height="${laneHeight}" fill="rgba(94,77,49,0.08)" />`;
    }).join("");
    const cards = layout.subjects.map((subject) => {
      const x = trackX + subject.start * colWidth + 6;
      const yCard = trackY + subject.row * rowHeight + 6;
      const w = subject.span * colWidth - 12;
      const h = rowHeight - 12;
      const lines = wrapText(subject.title, Math.max(1, Math.floor((w - 18) / 8)), 3);
      const textY = yCard + h / 2 - ((lines.length - 1) * 14) / 2;
      return `
        <rect x="${x}" y="${yCard}" width="${w}" height="${h}" fill="${subject.color}" />
        ${lines
          .map(
            (line, lineIndex) => `
          <text x="${x + w / 2}" y="${textY + lineIndex * 14}" text-anchor="middle" dominant-baseline="middle" font-size="13" font-weight="600" fill="rgba(48,37,20,0.88)">${escapeXml(
              line
            )}</text>`
          )
          .join("")}
      `;
    }).join("");

    return `
      ${dividerTop}
      <text class="svg-display-text" x="${titleX + 36}" y="${labelY}" font-size="40" fill="${layout.section.color}" font-weight="700">${escapeXml(layout.section.icon || "✦")}</text>
      ${layout.section.name
        .split("\n")
        .map(
          (line, lineIndex) => `
        <text class="svg-display-text" x="${titleX + 8}" y="${labelY + 44 + lineIndex * 26}" font-size="24" fill="#2b2b2b">${escapeXml(line)}</text>`
        )
        .join("")}
      ${columns}
      ${cards}
    `;
  }).join("");

  const header = state.versions
    .map((version, index) => {
      const x = titleX + labelWidth + index * COLUMNS_PER_VERSION * colWidth + 10;
      const w = COLUMNS_PER_VERSION * colWidth - 20;
      return `
        <line x1="${x}" y1="112" x2="${x + w}" y2="112" stroke="#3e3a37" stroke-width="4" />
        <rect x="${x + w / 2 - 38}" y="92" width="76" height="40" rx="20" fill="#363636" />
        <text class="svg-display-text" x="${x + w / 2}" y="112" text-anchor="middle" dominant-baseline="middle" font-size="20" font-weight="700" fill="#ffffff">${escapeXml(version.name)}</text>
      `;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <style>
    text { font-family: ${BODY_FONT_STACK}; }
    .svg-display-text { font-family: ${DISPLAY_FONT_STACK}; }
  </style>
  <rect width="${width}" height="${height}" fill="#fffdf8" />
  <text x="${titleX}" y="42" font-size="22" fill="#6d6d6d">${escapeXml(state.company)}</text>
  <text class="svg-display-text" x="${titleX + 200}" y="42" font-size="22" fill="#2b2b2b" font-weight="700">${escapeXml(state.title)}</text>
  <text x="${titleX + 388}" y="42" font-size="22" fill="#6d6d6d">PRODUCT ROADMAP</text>
  ${header}
  ${sectionMarkup}
</svg>`;
}

function buildExcelWorkbook() {
  const rows = [];
  rows.push(["Company", state.company]);
  rows.push(["Title", state.title]);
  rows.push([]);
  rows.push(["Version", "Section", "Subject", "Start", "Length", "Row", "Color"]);
  state.subjects.forEach((subject) => {
    rows.push([
      getVersionNameForColumn(subject.start),
      getSectionName(subject.sectionId),
      subject.title.replace(/\n/g, " "),
      getColumnReference(subject.start),
      String(subject.span),
      String(subject.row + 1),
      subject.color
    ]);
  });

  const cells = rows
    .map((row) => {
      const serialized = row
        .map((cell) => {
          const value = cell == null ? "" : String(cell);
          return `<Cell><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`;
        })
        .join("");
      return `<Row>${serialized}</Row>`;
    })
    .join("");

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Roadmap">
    <Table>${cells}</Table>
  </Worksheet>
</Workbook>`;
}

function getVersionNameForColumn(columnIndex) {
  const versionIndex = Math.floor(columnIndex / COLUMNS_PER_VERSION);
  return state.versions[versionIndex]?.name || getDefaultYearLabel(versionIndex);
}

function getColumnReference(columnIndex) {
  const versionName = getVersionNameForColumn(columnIndex);
  const columnNumber = (columnIndex % COLUMNS_PER_VERSION) + 1;
  return `${versionName}-${columnNumber}`;
}

function getSectionName(sectionId) {
  return state.sections.find((section) => section.id === sectionId)?.name.replace(/\n/g, " ") || "";
}

function wrapText(value, charsPerLine, maxLines) {
  const words = String(value).replace(/\n/g, " ").split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= charsPerLine || !current) {
      current = candidate;
      return;
    }
    lines.push(current);
    current = word;
  });
  if (current) {
    lines.push(current);
  }
  return lines.slice(0, maxLines);
}

function buildFilenameBase() {
  return `${slugify(state.company)}-${slugify(state.title)}-roadmap`;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "roadmap";
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function applyAlpha(hexColor, alpha) {
  const hex = hexColor.replace("#", "");
  const expanded = hex.length === 3 ? hex.split("").map((char) => char + char).join("") : hex;
  const red = parseInt(expanded.slice(0, 2), 16);
  const green = parseInt(expanded.slice(2, 4), 16);
  const blue = parseInt(expanded.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("\n", "<br>");
}
