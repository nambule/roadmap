const STORAGE_KEY = "roadmap-designer-state-v1";
const PANEL_STORAGE_KEY = "roadmap-designer-panel-collapsed-v1";
const COLUMNS_PER_VERSION = 4;

const demoState = {
  company: "ADVENT CO.",
  title: "ENVISION 6.0",
  versions: [
    { id: crypto.randomUUID(), name: "V1" },
    { id: crypto.randomUUID(), name: "V2" }
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

function normalizeState(inputState) {
  const nextState = structuredClone(inputState);
  const versionCount = Array.isArray(nextState.versions) ? nextState.versions.length : 0;
  const groupCount = Math.max(1, Math.ceil(versionCount / COLUMNS_PER_VERSION));

  nextState.versions = Array.from({ length: groupCount }, (_, index) => {
    const existing = inputState.versions?.[index];
    const isGroupedVersion = existing?.name?.startsWith("V");
    return {
      id: existing?.id || crypto.randomUUID(),
      name: isGroupedVersion ? existing.name.toUpperCase() : `V${index + 1}`
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
      name: `V${nextIndex + 1}`
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
    const boundedSpan = Math.min(span, state.versions.length - start);

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
    versionList.innerHTML = `<div class="empty-state">Add at least one version to build the grid.</div>`;
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
    option.textContent = `C${index + 1}`;
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
          <div class="subject-actions">
            <button class="subject-action" type="button" data-action="edit" title="Edit subject">✎</button>
            <button class="subject-action" type="button" data-action="delete" title="Delete subject">×</button>
          </div>
        `;

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
