// Utilities
import { loadPopperJs } from './utils/loadPopper';

// Alert Component
import { initAlert } from './alert/ts/alert';

// Collapse Component
import { initCollapse } from './collapse/ts/collapse';
import { Collapse } from './collapse/ts/collapse-programmatic';
import type { CollapseConfig, ICollapse } from './collapse/ts/collapse.types';

// Dropdown Component
import { initDropdowns, cleanupDropdowns } from './dropdown/ts/dropdown';
import { Dropdown } from './dropdown/ts/dropdown-programmatic';
import type { DropdownConfig, IDropdown } from './dropdown/ts/dropdown.types';

// Popover Component
import { initPopovers, cleanupPopovers } from './popover/ts/popover';
import { Popover } from './popover/ts/popover-programmatic';
import type { PopoverConfig, IPopover } from './popover/ts/popover.types';

// Tooltip Component
// import { initTooltips, cleanupTooltips } from './tooltip/ts/tooltip';

// Tabs Component
// import { initTabs, cleanupTabs } from './tabs/ts/tabs';

// Modal Component
import { initModal, cleanupModals } from './modal/ts/modal';
import { Modal } from './modal/ts/modal-programmatic'; // Export the Modal class
import type { ModalConfig, IModal } from './modal/ts/modal.types'; // Export types for external use


// Accordion Component
// import { initAccordion, cleanupAccordions } from './accordion/ts/accordion';

// Stepper Component
// import { initStepper, cleanupSteppers } from './stepper/ts/stepper';

// Export individual components
export {
  initAlert,
  initCollapse,
  Collapse,
  initDropdowns,
  cleanupDropdowns,
  Dropdown,
  initPopovers,
  cleanupPopovers,
  Popover,
  // initTooltips,
  // cleanupTooltips,
  // initTabs,
  // cleanupTabs,
  initModal,
  cleanupModals,
  Modal,
  // initAccordion,
  // cleanupAccordions,
  // initStepper,
  // cleanupSteppers,
};

export type { ModalConfig, IModal, DropdownConfig, IDropdown, CollapseConfig, ICollapse, PopoverConfig, IPopover };

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
