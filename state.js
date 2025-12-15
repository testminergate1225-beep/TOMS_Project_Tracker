(function (global) {
  const SECTION_ORDER = ['electrical', 'architectural', 'mechanical', 'plumbing', 'electronics'];
  const ACTIVE_USER_KEY = 'projectDashboardActiveUser';
  const SECTION_DEFS = {
    electrical: {
      title: 'Electrical',
      file: 'e_manage_subitems.html',
      lead: 'E-Team',
      scope: 'Lighting, Power and Controls',
      summary: 'Panelboards, Rough-ins, Raceway and Cables, lighting fixtures, baseboard CO, and addressable LED deliverables.',
      items: [
        { id: 'temp power', title: 'Temporary Power', percent: 0, notes: 'Temporary power setup and load testing ongoing.' },
        { id: 'panelboards', title: 'Panelboards / Distribution boards', percent: 0, notes: 'Distribution boards being landed and megger-tested per riser.' },
        { id: 'lighting', title: 'Lighting Fixture', percent: 0, notes: 'All lighting fixtures arrived?; ceiling zones hung and circuited.' },
        { id: 'raceway', title: 'Raceway and Cabling', percent: 0, notes: 'Conduits installed; cable pulling in progress.' },
        { id: 'power', title: 'Office Power Outlets - CO', percent: 0, notes: 'Outlet boxes installed; wiring connections underway.' },
        { id: 'power1', title: 'Electrical Room Power Outlets - CO', percent: 0, notes: 'Outlet installation and wiring ongoing.' },
        { id: 'power2', title: 'Pantry Power Outlets - CO', percent: 0, notes: 'Outlet boxes installed; wiring connections underway.' },
        { id: 'power3', title: 'Restroom Power Outlets - CO', percent: 0, notes: 'Outlet installation and wiring ongoing.' },
        { id: 'power4', title: 'Redemption Booth Power Outlets - CO', percent: 0, notes: 'Outlet boxes installed; wiring connections underway.' },
        { id: 'emergency power', title: 'Emergency Power Outlets - CO', percent: 0, notes: 'Outlet boxes installed; wiring connections underway.' },
        { id: 'emergency light', title: 'Emergency Light Fixture', percent: 0, notes: 'Emergency lighting circuits being tested; battery backup units being installed.' },
        { id: 'baseboard', title: 'Baseboard CO', percent: 0, notes: 'Branch rough-in finalized; QA walkthrough scheduled.' },
        { id: 'lighting control', title: 'Lighting Control System', percent: 0, notes: 'Control panels installed; programming and integration testing ongoing.' },
        { id: 'switch', title: 'Lighting Switches', percent: 0, notes: 'Manual switch installation and testing ongoing.' },
        { id: 'smart-led', title: 'Smart LED Addressable', percent: 0, notes: 'TWLED effects programming mock-up slated for next sprint.' },
        { id: 'rough-in', title: 'Rough-in for power and Lighting', percent: 0, notes: 'Terminal wiring in progress; coordination with architectural elements ongoing.' },
        { id: 'cable term', title: 'Cable Terminations', percent: 0, notes: 'PB cable terminations and connections underway; awaiting final inspection.' },
        { id: 'testing', title: 'Testing & Commissioning', percent: 0, notes: 'Pre-functional checklists being compiled for LV systems.' },
        { id: 'controls', title: 'Control Box / Control board', percent: 0, notes: 'Check ladder diagram if implemented and integration testing scheduled.' },
        { id: 'energize np', title: 'Normal Power', percent: 0, notes: 'System energization scheduled; coordination with utility provider pending.' },
        { id: 'insulation test', title: 'Megger testing', percent: 0, notes: 'Preparing documentation and punch list for final electrical inspection.' },
        { id: 'final inspection', title: 'Final Inspection', percent: 0, notes: 'Final walkthrough with authority having jurisdiction scheduled.' },
        { id: 'Feeder line', title: 'Feeder Line', percent: 0, notes: 'Feeder line and additional feeder lines being installed and tested.' },
        { id: 'as-builts', title: 'As-Built', percent: 0, notes: 'Redline markups being collected from site for documentation.'},

      ]
    },
    architectural: {
      title: 'Architectural',
      file: 'a_manage_subitems.html',
      lead: 'A-Team',
      scope: 'Signages, Interiors, Wall Finishes, Doors, Ceiling, Flooring, Final Inspection, As-Built',
      summary: 'Envelope systems, interior fit-out, public realm, and compliance packages tracked here.',
      items: [
        { id: 'signage', title: 'Signages Back Drop', percent: 0, notes: 'Signage installation progressing; final approvals to follow.' },
        { id: 'envelope', title: 'Building Envelope', percent: 0, notes: 'Envelope sealing and insulation works ongoing; weatherproofing in progress.' },
        { id: 'windows', title: 'Windows and Glazing', percent: 0, notes: 'Window frames installed; glazing panels being fitted.' },
        { id: 'façade', title: 'Façade Works', percent: 0, notes: 'Cladding installation underway; finishing touches being applied.' },
        { id: 'roof', title: 'Roofing', percent: 0, notes: 'Roof membrane installation in progress; drainage systems being finalized.' },
        { id: 'interiors', title: 'Interior Fit-Out', percent: 0, notes: 'walls and flooring various stages of completion.' },
        { id: 'door0', title: 'Redemption Booth Doors and Cabinets', percent: 0, notes: 'Installation ongoing; hardware fitting in progress.' },
        { id: 'door1', title: 'Office Doors and Cabinets', percent: 0, notes: 'Door frames set; glass panels being installed.' },
        { id: 'door1a', title: 'Office Sliding Doors', percent: 0, notes: 'Sliding mechanisms installed; glass panels being fitted.' },
        { id: 'door1b', title: 'Conference Room Doors and Cabinets', percent: 0, notes: 'Frames erected; door hardware installation ongoing.' },
        { id: 'door1c', title: 'Pantry Doors and Cabinets', percent: 0, notes: 'Door frames set; hardware fitting in progress.' },
        { id: 'table', title: 'Office Tables and Cabinets', percent: 0, notes: 'Installation ongoing; final adjustments being made.' },
        { id: 'table1', title: 'Conference Room Table and Cabinets', percent: 0, notes: 'Table assembly in progress; finishing touches being applied.' },
        { id: 'pantry', title: 'Pantry Fixtures and Cabinets', percent: 0, notes: 'Fixture installation underway; cabinet adjustments ongoing.' },
        { id: 'shelving', title: 'Shelving Units', percent: 0, notes: 'Shelving units being installed; alignment checks in progress.' },
        { id: 'table2', title: 'Electrical Room Tables and Cabinets', percent: 0, notes: 'Table assembly in progress; cabinet installation ongoing.' },
        { id: 'cabinet', title: 'Storage Cabinets', percent: 0, notes: 'Cabinet units being installed; shelving adjustments in progress.' },
        { id: 'storage', title: 'Storage Doors and Lockers', percent: 0, notes: 'Locker installation underway; final alignment checks being made.' },
        { id: 'door2', title: 'Restroom Doors and Cabinets', percent: 0, notes: 'Partitions erected; door hardware installation ongoing.' },
        { id: 'door3', title: 'Electrical Room Doors and Cabinets', percent: 0, notes: 'Frames installed; final adjustments being made.' },
        { id: 'rollup door', title: 'Roll-Up Doors', percent: 0, notes: 'Roll-up door frames installed; motorized mechanisms being tested.' },
        { id: 'walls', title: 'Wall Finishes', percent: 0, notes: 'Painting and wall treatments nearing completion.' },
        { id: 'ceiling', title: 'Ceiling Works', percent: 0, notes: 'Ceiling grid installation and tile fitting ongoing.' },
        { id: 'domelight', title: 'Dome Light Fixture', percent: 0, notes: 'Fixture installation in progress; awaiting final adjustments.' },
        { id: 'Canopy', title: 'Canopy', percent: 0, notes: 'Installation scheduled completed; final measurements being confirmed.' },
        { id: 'flooring', title: 'Flooring', percent: 0, notes: 'Tiles and floor finishes being applied; polishing and sealing scheduled.' },
        { id: 'completion', title: 'Final Inspection', percent: 0, notes: 'Ready for final walkthrough and sign-off.' },
        { id: 'as-built', title: 'As-Built', percent: 0, notes: 'For processing of occupancy permits and final documentation.' },
      ]
    },
    mechanical: {
      title: 'Mechanical',
      file: 'm_manage_subitems.html',
      lead: 'M-Team',
      scope: 'HVAC, Plumbing, Fire Protection',
      summary: 'Air systems, hydronics, suppression, and automation integrations.',
      items: [
        { id: 'ahu', title: 'Air Handling Units Ducting ', percent: 0, notes: 'AHU balancing in progress.' },
        { id: 'hydronics', title: 'Hydronic Piping', percent: 0, notes: 'Chilled-water pipe insulation and testing ongoing.' },
        { id: 'suppression', title: 'Fire Suppression', percent: 0, notes: 'Pipe installation and pressure testing ongoing.' },
        { id: 'air balancing', title: 'Air Balancing', percent: 0, notes: 'Airflow measurements and adjustments in progress.' }
      ]
    },
    plumbing: {
      title: 'Plumbing',
      file: 'p_manage_subitems.html',
      lead: 'P-Team',
      scope: 'Pipes, Fixtures, Valves',
      summary: 'Water supply, drainage, and fixture installations tracked here.',
      items: [
        { id: 'pipes', title: 'Pipes Installation', percent: 0, notes: 'Main and branch piping installation in progress.' },
        { id: 'fixtures', title: 'Fixtures', percent: 0, notes: 'Fixture installation and testing ongoing.' },
        { id: 'valves', title: 'Valves', percent: 0, notes: 'Valve installation and calibration underway.' }
      ]
    },
    electronics: {
      title: 'Electronics',
      file: 'el_manage_subitems.html',
      lead: 'EL-Team',
      scope: 'Data Cabinets, CCTV, Smoke Detectors, Data and Telephone Cables',
      summary: 'Data cabinet, CCTV, Smoke detectors, Data and Telephone cables.',
      items: [
        { id: 'data-cabinet', title: 'Data Cabinet', percent: 0, notes: 'Installation and configuration in progress.' },
        { id: 'cctv', title: 'CCTV', percent: 0, notes: 'Camera installation and testing ongoing.' },
        { id: 'smoke-detectors', title: 'Smoke Detectors', percent: 0, notes: 'Installation and calibration underway.' },
        { id: 'cables', title: 'Data and Telephone Cables', percent: 0, notes: 'Cable laying and termination in progress.' }
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
  const merged = { ...item, ...saved };
  if (typeof merged.tracked === 'undefined') {
    merged.tracked = true;
  }
  return merged;
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
    const trackedItems = section.items.filter((item) => item.tracked !== false);
    if (!trackedItems.length) {
      return 0;
    }
    const total = trackedItems.reduce((sum, item) =>
      sum + clamp(Number(item.percent) || 0, 0, 100), 0);
    return Math.round(total / trackedItems.length);
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

  const isProjectCompleted = (project) => {
    if (!project) {
      return false;
    }
    const activeKeys = getEnabledSections(project);
    if (!activeKeys.length) {
      return false;
    }
    return activeKeys.every((key) => {
      const section = project.sections ? project.sections[key] : null;
      return section && getSectionPercent(section) >= 100;
    });
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

  const LOGS_KEY = 'projectDashboardUpdateLogs';

  const loadUpdateLogs = () => {
    try {
      const raw = global.localStorage && global.localStorage.getItem(LOGS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  };

  const appendUpdateLog = (entry) => {
    const persistLog = (locationData) => {
      const logs = loadUpdateLogs();
      logs.push({ ...entry, timestamp: new Date().toISOString(), location: locationData || null });
      try {
        global.localStorage && global.localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
      } catch (error) {
        // ignore persistence issues
      }
    };

    const nav = global.navigator;
    try {
      if (nav && nav.geolocation && typeof nav.geolocation.getCurrentPosition === 'function') {
        nav.geolocation.getCurrentPosition(
          (position) => {
            const coords = position && position.coords;
            if (!coords) {
              persistLog(null);
              return;
            }
            persistLog({
              latitude: typeof coords.latitude === 'number' ? coords.latitude : null,
              longitude: typeof coords.longitude === 'number' ? coords.longitude : null,
              accuracy: typeof coords.accuracy === 'number' ? coords.accuracy : null
            });
          },
          () => persistLog(null),
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
        return;
      }
    } catch (error) {
      // fall back to logging without coordinates
    }

    persistLog(null);
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
    loadUpdateLogs,
    appendUpdateLog,
    getActiveUserName,
    createProject,
    cloneProject,
    getEnabledSections,
    isSectionEnabled,
    isProjectCompleted,
    setEnabledSections,
    removeProject
  };
})(window);
