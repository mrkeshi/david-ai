// Utilities
import { loadPopperJs } from './utils/loadPopper';

// Alert Component
import { initAlert } from './alert/ts/alert';

// Collapse Component
import { initCollapse } from './collapse/ts/collapse';

// Dropdown Component
import { initDropdowns, cleanupDropdowns } from './dropdown/ts/dropdown';

// Popover Component
// import { initPopovers, cleanupPopovers } from './popover/ts/popover';

// Tooltip Component
// import { initTooltips, cleanupTooltips } from './tooltip/ts/tooltip';

// Tabs Component
// import { initTabs, cleanupTabs } from './tabs/ts/tabs';

// Modal Component
import { initModal, cleanupModals } from './modal/ts/modal';

// Accordion Component
// import { initAccordion, cleanupAccordions } from './accordion/ts/accordion';

// Stepper Component
// import { initStepper, cleanupSteppers } from './stepper/ts/stepper';

// Export individual components
export {
  initAlert,
  initCollapse,
  initDropdowns,
  cleanupDropdowns,
  // initPopovers,
  // cleanupPopovers,
  // initTooltips,
  // cleanupTooltips,
  // initTabs,
  // cleanupTabs,
  initModal,
  cleanupModals,
  // initAccordion,
  // cleanupAccordions,
  // initStepper,
  // cleanupSteppers,
};

// Aggregate all exports into a single object for UMD consumers
export const DavidAI = {
  initAlert,
  initCollapse,
  initDropdowns,
  cleanupDropdowns,
  // initPopovers,
  // cleanupPopovers,
  // initTooltips,
  // cleanupTooltips,
  // initTabs,
  // cleanupTabs,
  initModal,
  cleanupModals,
  // initAccordion,
  // cleanupAccordions,
  // initStepper,
  // cleanupSteppers,
};

// Global initialization function
export function initDavidAI(): void {
  // Initialize non-Popper components
  initAlert();
  initCollapse();
  // initTabs();
  initModal();
  // initAccordion();
  // initStepper();

  // Dynamically load Popper.js and initialize Popper-dependent components
  loadPopperJs()
    .then(() => {
      initDropdowns();
      // initPopovers();
      // initTooltips();
    })
    .catch((error:any) => {
      console.error('Failed to load Popper.js:', error);
    });
}

// Automatically initialize in the browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initDavidAI();

    // Observe DOM changes for dynamically added elements
    const observer = new MutationObserver(() => {
      initAlert();
      initCollapse();
      // initAccordion();
      // initStepper();
      // initTabs();
      initModal();
      initDropdowns();
      // initPopovers();
      // initTooltips();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Expose DavidAI globally for UMD usage
    (window as any).DavidAI = { ...DavidAI, initDavidAI };
  });
}

// Default export for ES modules
export default { ...DavidAI, initDavidAI };
