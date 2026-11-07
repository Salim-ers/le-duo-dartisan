/**
 * « Scène » : signale aux animations d'entrée quand le visiteur voit
 * réellement la page (intro terminée, rideau de transition levé).
 */
type Listener = () => void;

let introDone = false;
let covering = false;
/** Vrai dès la première navigation interne : on n'est plus sur la page d'arrivée. */
let navigated = false;

export function hasNavigated() {
  return navigated;
}
const listeners = new Set<Listener>();

function introAlreadySeen() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("intro-done");
}

export function isStageReady() {
  if (!introDone && introAlreadySeen()) introDone = true;
  return introDone && !covering;
}

function flush() {
  if (!isStageReady()) return;
  for (const l of [...listeners]) {
    listeners.delete(l);
    l();
  }
}

export function setIntroDone() {
  introDone = true;
  flush();
}

export function setCovering(value: boolean) {
  covering = value;
  if (value) navigated = true;
  if (!value) flush();
}

export function onStageReady(cb: Listener) {
  if (isStageReady()) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
