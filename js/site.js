/* Topology tracing, nav current section, find-a-node. No-JS still shows the default Entra selection. */
(() => {
  const svg = document.querySelector(".tp");
  const list = document.getElementById("topo-list");
  const narrow = window.matchMedia("(max-width: 640px)");

  const syncList = () => {
    if (!list) return;
    if (narrow.matches) list.removeAttribute("inert");
    else list.setAttribute("inert", "");
  };
  syncList();
  narrow.addEventListener("change", syncList);

  if (svg) {
    const edges = [...svg.querySelectorAll(".ed[data-e]")];
    const nodes = [...svg.querySelectorAll(".nd")];
    const chain = (key) => {
      const out = new Set();
      const walk = (name, dir) => {
        edges.forEach((edge) => {
          const from = edge.dataset.a;
          const to = edge.dataset.b;
          if ((dir > 0 ? from : to) === name && !out.has(edge)) {
            out.add(edge);
            walk(dir > 0 ? to : from, dir);
          }
        });
      };
      walk(key, 1);
      walk(key, -1);
      return out;
    };
    const show = (key) => {
      const selected = chain(key);
      const hot = new Set([key]);
      selected.forEach((edge) => {
        hot.add(edge.dataset.a);
        hot.add(edge.dataset.b);
      });
      edges.forEach((edge) => {
        const on = selected.has(edge);
        edge.classList.toggle("s", on);
        edge.querySelectorAll(".pt").forEach((port) => port.classList.toggle("s", on));
      });
      const ids = new Set([...selected].map((edge) => edge.dataset.e));
      svg.querySelectorAll(".jn[data-on]").forEach((joint) => {
        joint.classList.toggle("s", joint.dataset.on.split(" ").some((id) => ids.has(id)));
      });
      nodes.forEach((node) => {
        const k = node.dataset.k;
        node.classList.toggle("sel", k === key);
        node.classList.toggle("dep", k !== key && hot.has(k));
      });
    };

    /* Keep the list highlight aligned with the node key, not the shared href. */
    const listByKey = {
      entra: 0,
      ca: 1,
      intune: 2,
      def: 3,
      avd: 4,
      azure: 5,
      dev: 6,
      srv: 7
    };
    const showList = (key) => {
      if (!list) return;
      const index = listByKey[key];
      [...list.children].forEach((item, i) => item.classList.toggle("sel", i === index));
    };
    const render = (key) => {
      show(key);
      showList(key);
    };

    const initial = "entra";
    const arm = (index) => {
      nodes.forEach((node, i) => node.setAttribute("tabindex", i === index ? "0" : "-1"));
    };
    arm(0);
    nodes.forEach((node, index) => {
      node.addEventListener("mouseenter", () => render(node.dataset.k));
      node.addEventListener("focus", () => {
        arm(index);
        render(node.dataset.k);
      });
      node.addEventListener("keydown", (event) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
        if (step) {
          event.preventDefault();
          const next = (index + step + nodes.length) % nodes.length;
          arm(next);
          nodes[next].focus();
        }
        if (event.key === "Escape") {
          node.blur();
          arm(0);
          render(initial);
        }
      });
    });
    svg.addEventListener("mouseleave", () => {
      if (!svg.contains(document.activeElement)) render(initial);
    });

    const focusNode = () => {
      if (narrow.matches) {
        list?.querySelector("a")?.focus();
        return;
      }
      svg.querySelector('[data-k="entra"]')?.focus();
    };
    document.getElementById("find-node")?.addEventListener("click", focusNode);
    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        const tag = document.activeElement?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        event.preventDefault();
        focusNode();
      }
    });
  }

  const navLinks = [...document.querySelectorAll('.nav a[href^="#"], .nav-panel a[href^="#"]')];
  const sections = [...new Set(navLinks.map((link) => document.querySelector(link.getAttribute("href"))))].filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const mark = (id) => {
      navLinks.forEach((link) => {
        const on = link.getAttribute("href") === `#${id}`;
        if (on) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    };
    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) mark(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] }
    );
    sections.forEach((section) => spy.observe(section));
  }
})();
