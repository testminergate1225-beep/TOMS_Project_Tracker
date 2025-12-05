(function (global) {
  const SECTION_ORDER = ['electrical', 'architectural', 'mechanical'];
  const ACTIVE_USER_KEY = 'projectDashboardActiveUser';
  const SECTION_DEFS = {
    electrical: {
      title: 'Electrical',
      file: 'electrical.html',
      lead: 'E-Team',
      scope: 'LV/MV, Lighting, Controls',
      summary: 'Panelboards, lighting fixtures, baseboard CO, and addressable LED deliverables.',
      items: [
        { id: 'panelboards', title: 'Panelboards', percent: 0, notes: 'Distribution boards being landed and megger-tested per riser.' },
        { id: 'lighting', title: 'Lighting Fixture', percent: 0, notes: 'Fixtures arriving weekly; ceiling zones 3-5 hung and circuited.' },
        { id: 'baseboard', title: 'Baseboard CO', percent: 0, notes: 'Branch rough-in finalized; QA walkthrough scheduled Friday.' },
        { id: 'smart-led', title: 'Smart LED Addressable', percent: 0, notes: 'TWLED effects programming mock-up slated for next sprint.' },
        { id: 'rough-in', title: 'Rough-in for power and Lighting', percent: 0, notes: 'Terminal wiring in progress; coordination with architectural elements ongoing.' },
        { id: 'cable term', title: 'Cable Terminations', percent: 0, notes: 'PB cable terminations and connections underway; awaiting final inspection.' },
        { id: 'testing', title: 'Testing & Commissioning', percent: 0, notes: 'Pre-functional checklists being compiled for LV systems.' },
        { id: 'energize', title: 'Energize', percent: 0, notes: 'System energization scheduled; coordination with utility provider pending.' },
        { id: 'as-builts', title: 'As-Built', percent: 0, notes: 'Redline markups being collected from site for documentation.'},

      ]
    },
    architectural: {
      title: 'Architectural',
      file: 'architectural.html',
      lead: 'A-Team',
      scope: 'Signages, Interiors, Wall Finishes',
      summary: 'Envelope systems, interior fit-out, public realm, and compliance packages tracked here.',
      items: [
        { id: 'signage', title: 'LED Signage ', percent: 0, notes: 'Signage installation progressing; final approvals pending.' },
        { id: 'interiors', title: 'Interior Fit-Out', percent: 0, notes: 'walls and flooring various stages of completion.' },
        { id: 'door', title: 'Doors and Cabinet', percent: 0, notes: 'Installation ongoing; hardware fitting in progress.' },
        { id: 'flooring', title: 'Wall Finishes', percent: 0, notes: 'Painting and wall treatments nearing completion.' },
        { id: 'completion', title: 'Final Inspection', percent: 0, notes: 'Ready for final walkthrough and sign-off.' },
        { id: 'as-built', title: 'As-Built', percent: 0, notes: 'Processing of occupancy permits and final documentation.' },
      ]
    },
    mechanical: {
      title: 'Mechanical',
      file: 'mechanical.html',
      lead: 'M-Team',
      scope: 'HVAC, Plumbing, Fire Protection',
      summary: 'Air systems, hydronics, suppression, and automation integrations.',
      items: [
        { id: 'ahu', title: 'Air Handling Units Ducting ', percent: 0, notes: 'AHU balancing in progress.' },
        { id: 'hydronics', title: 'Hydronic Piping', percent: 0, notes: 'Chilled-water pipe insulation and testing ongoing.' },
        { id: 'suppression', title: 'Fire Suppression', percent: 0, notes: 'Pipe installation and pressure testing ongoing.' },
        { id: 'air balancing', title: 'Air Balancing', percent: 0, notes: 'Airflow measurements and adjustments in progress.' }
      ]
    }
  };

  const STORAGE_KEY = 'projectDashboardState';
  let memoryFallback = null;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const fmtDate = (date) => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      }).format(date);
    } catch (error) {
      if (date && typeof date.toString === 'function') {
        return date.toString();
      }
      return '';
    }
  };

  const statusClass = (percent) => {
    if (percent >= 100) return { text: 'Completed', cls: 'ontrack' };
    if (percent >= 80) return { text: 'On Track', cls: 'ontrack' };
    if (percent >= 10) return { text: 'On ongoing', cls: 'atrisk' };
    if (percent >= 5) return { text: 'Just Started', cls: 'delayed' };
    return { text: 'Started', cls: 'started' };
  };

  const randomId = () => `project-${Math.random().toString(36).slice(2, 10)}`;

  const cloneItems = (items = []) => items.map((item) => ({ ...item }));

  const cloneSections = (sections = {}) => {
    const cloned = {};
    SECTION_ORDER.forEach((key) => {
      const source = sections[key];
      if (!source) {
        cloned[key] = undefined;
        return;
      }
      cloned[key] = {
        ...source,
        items: Array.isArray(source.items) ? cloneItems(source.items) : undefined
      };
    });
    return cloned;
  };

  const ensureSectionList = (list) => {
    if (!Array.isArray(list) || list.length === 0) {
      return [...SECTION_ORDER];
    }
    const filtered = list.filter((key) => SECTION_ORDER.includes(key));
    return filtered.length ? filtered : [...SECTION_ORDER];
  };

  const pruneDisabledSections = (project) => {
    if (!project || !project.sections || !project.enabledSections) { return; }
    SECTION_ORDER.forEach((key) => {
      if (project.enabledSections[key] === false) {
        delete project.sections[key];
      }
    });
  };

  const setEnabledSections = (project, includedSections) => {
    const list = ensureSectionList(includedSections);
    const selection = new Set(list);
    project.enabledSections = project.enabledSections || {};
    SECTION_ORDER.forEach((key) => {
      project.enabledSections[key] = selection.has(key);
    });
    pruneDisabledSections(project);
  };

  // Resets each item percent for enabled sections when creating/cloning projects
  const resetSectionProgress = (project) => {
    if (!project || !project.sections) { return; }
    SECTION_ORDER.forEach((key) => {
      const section = project.sections[key];
      if (section && Array.isArray(section.items)) {
        section.items = section.items.map((item) => ({ ...item, percent: 0 }));
      }
    });
  };

  const normalizeSection = (key, sourceSection = {}) => {
    const definition = SECTION_DEFS[key];
    return {
      ...definition,
      ...sourceSection,
      items: definition.items.map((item) => {
        const saved = Array.isArray(sourceSection.items)
          ? sourceSection.items.find((entry) => entry.id === item.id)
          : undefined;
        return { ...item, ...saved };
      })
    };
  };

  const normalizeProject = (project = {}) => {
    const normalized = {
      id: project.id || randomId(),
      title: project.title || 'Project Developments',
      lastUpdate: project.lastUpdate || new Date().toISOString(),
      lastUpdatedBy: project.lastUpdatedBy || 'System',
      sections: {},
      enabledSections: {}
    };

    const includedList = Array.isArray(project.includedSections)
      ? ensureSectionList(project.includedSections)
      : null;

    SECTION_ORDER.forEach((key) => {
      let enabled;
      if (project.enabledSections && typeof project.enabledSections === 'object'
        && Object.prototype.hasOwnProperty.call(project.enabledSections, key)) {
        enabled = project.enabledSections[key] !== false;
      } else if (includedList) {
        enabled = includedList.includes(key);
      } else {
        enabled = true;
      }

      normalized.enabledSections[key] = enabled;
      if (enabled) {
        const incoming = project.sections ? project.sections[key] : undefined;
        normalized.sections[key] = normalizeSection(key, incoming);
      }
    });

    if (!Object.keys(normalized.enabledSections).length) {
      setEnabledSections(normalized, SECTION_ORDER);
    } else {
      pruneDisabledSections(normalized);
    }

    return normalized;
  };

  const createProject = (title = 'Project Developments', includedSections) => {
    const project = normalizeProject({ title, includedSections });
    resetSectionProgress(project);
    return project;
  };

  const cloneProject = (project, title, resetProgress = false, includedSections) => {
    if (!project) {
      return createProject(title, includedSections);
    }
    const normalized = normalizeProject({
      title: title || project.title,
      sections: cloneSections(project.sections),
      enabledSections: project.enabledSections
    });
    if (includedSections) {
      setEnabledSections(normalized, includedSections);
    }
    if (resetProgress) {
      resetSectionProgress(normalized);
    }
    return normalized;
  };

  const createDefaultState = () => {
    const project = createProject();
    return {
      activeProjectId: project.id,
      projects: { [project.id]: project }
    };
  };

  const legacyToState = (legacy = {}) => {
    const project = normalizeProject({
      id: legacy.id,
      title: legacy.projectTitle,
      lastUpdate: legacy.lastUpdate,
      sections: legacy.sections
    });
    return {
      activeProjectId: project.id,
      projects: { [project.id]: project }
    };
  };

  const normalizeState = (rawState) => {
    if (!rawState || typeof rawState !== 'object') {
      return createDefaultState();
    }

    if (!rawState.projects || !rawState.activeProjectId) {
      return legacyToState(rawState);
    }

    const projects = {};
    Object.values(rawState.projects).forEach((project) => {
      const normalized = normalizeProject(project);
      projects[normalized.id] = normalized;
    });

    let activeProjectId = rawState.activeProjectId;
    if (!projects[activeProjectId]) {
      activeProjectId = Object.keys(projects)[0];
    }
    if (!activeProjectId) {
      const project = createProject();
      projects[project.id] = project;
      activeProjectId = project.id;
    }

    return { activeProjectId, projects };
  };

  const loadProjectState = () => {
    let parsed = null;
    try {
      const raw = global.localStorage && global.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        parsed = JSON.parse(raw);
      }
    } catch (error) {
      // ignore browser storage errors
    }

    if (!parsed && memoryFallback) {
      try {
        parsed = JSON.parse(memoryFallback);
      } catch (fallbackError) {
        parsed = null;
      }
    }

    if (!parsed) {
      return createDefaultState();
    }

    return normalizeState(parsed);
  };

  const persistProjectState = (state) => {
    const payload = JSON.stringify(state);
    memoryFallback = payload;
    try {
      if (global.localStorage) {
        global.localStorage.setItem(STORAGE_KEY, payload);
      }
    } catch (error) {
      // ignore persistence failures
    }
  };

  const getSectionPercent = (section) => {
    if (!section || !Array.isArray(section.items) || section.items.length === 0) {
      return 0;
    }
    const total = section.items.reduce((sum, item) => sum + clamp(Number(item.percent) || 0, 0, 100), 0);
    return Math.round(total / section.items.length);
  };

  const getActiveProject = (state) => state.projects[state.activeProjectId];

  const setActiveProject = (state, projectId) => {
    if (state.projects[projectId]) {
      state.activeProjectId = projectId;
    }
    return getActiveProject(state);
  };

  const addProject = (state, title, templateProject, includedSections) => {
    const project = cloneProject(templateProject, title, true, includedSections);
    state.projects[project.id] = project;
    state.activeProjectId = project.id;
    return project;
  };

  const listProjects = (state) => Object.values(state.projects).sort((a, b) => a.title.localeCompare(b.title));

  const removeProject = (state, projectId) => {
    if (!state || !state.projects || !state.projects[projectId]) {
      return false;
    }
    delete state.projects[projectId];

    const remainingIds = Object.keys(state.projects);
    if (!remainingIds.length) {
      const fallback = createProject();
      state.projects[fallback.id] = fallback;
      state.activeProjectId = fallback.id;
      return true;
    }

    if (state.activeProjectId === projectId) {
      state.activeProjectId = remainingIds[0];
    }
    return true;
  };

  const getEnabledSections = (project) => {
    if (!project || !project.enabledSections) {
      return [...SECTION_ORDER];
    }
    return SECTION_ORDER.filter((key) => project.enabledSections[key] !== false);
  };

  const isSectionEnabled = (project, key) => {
    if (!project || !project.enabledSections || typeof project.enabledSections[key] === 'undefined') {
      return true;
    }
    return project.enabledSections[key] !== false;
  };

  const getActiveUserName = () => {
    try {
      const sessionValue = global.sessionStorage && global.sessionStorage.getItem(ACTIVE_USER_KEY);
      if (sessionValue) { return sessionValue; }
      const localValue = global.localStorage && global.localStorage.getItem(ACTIVE_USER_KEY);
      if (localValue) { return localValue; }
    } catch (error) {
      // ignore storage errors
    }
    return 'User';
  };

  const touchProject = (project) => {
    project.lastUpdate = new Date().toISOString();
    project.lastUpdatedBy = getActiveUserName();
  };

  global.ProjectData = {
    SECTION_ORDER,
    SECTION_DEFS,
    STORAGE_KEY,
    clamp,
    fmtDate,
    statusClass,
    loadProjectState,
    persistProjectState,
    getSectionPercent,
    getActiveProject,
    setActiveProject,
    addProject,
    listProjects,
    touchProject,
    createProject,
    cloneProject,
    getEnabledSections,
    isSectionEnabled,
    setEnabledSections,
    removeProject
  };
})(window);
