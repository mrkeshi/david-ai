import { ModalEvent } from "./modal.types";

const initializedModals = new WeakSet<HTMLElement>();
let activeModals: HTMLElement[] = []; // Track active modals for cleanup

export function toggleModal(event: ModalEvent): void {
  const modalID = event.currentTarget.getAttribute("data-dui-target");
  
  if (!modalID) {
    console.error("No modal ID provided for toggleModal.");
    return; // Exit if modalID is null
  }

  const modal = document.querySelector(modalID) as HTMLElement | null;

  if (modal) {
    const isHidden = modal.classList.contains("pointer-events-none");
    modal.classList.toggle("opacity-0", !isHidden);

    if (isHidden) {
      modal.classList.remove("pointer-events-none");
    } else {
      setTimeout(() => modal.classList.add("pointer-events-none"), 300);
    }

    modal.classList.toggle("opacity-100", isHidden);
    const modalContent = modal.querySelector(
      isHidden ? ".scale-95" : ".scale-100"
    ) as HTMLElement | null;

    if (modalContent) {
      modalContent.classList.toggle("scale-95", !isHidden);
      modalContent.classList.toggle("scale-100", isHidden);
    }

    modal.setAttribute("aria-hidden", String(!isHidden));

    // Add or remove event listener for clicks outside modal content
    if (isHidden) {
      modal.addEventListener("click", closeOnOutsideClick as EventListener);
      activeModals.push(modal);
    } else {
      modal.removeEventListener("click", closeOnOutsideClick as EventListener);
      activeModals = activeModals.filter((m) => m !== modal);
    }
  }
}

export function closeModal(event: ModalEvent): void {
  const modal = event.currentTarget.closest(".fixed") as HTMLElement | null;

  if (modal) {
    modal.classList.add("opacity-0");
    modal.classList.remove("opacity-100");
    const modalContent = modal.querySelector(".scale-100") as HTMLElement | null;

    if (modalContent) {
      modalContent.classList.add("scale-95");
      modalContent.classList.remove("scale-100");
    }

    setTimeout(() => {
      modal.classList.add("pointer-events-none");
      modal.setAttribute("aria-hidden", "true");
    }, 300);

    modal.removeEventListener("click", closeOnOutsideClick as EventListener);

    // Remove from active modals
    activeModals = activeModals.filter((m) => m !== modal);
  }
}

function closeOnOutsideClick(event: ModalEvent): void {
  const modalContent = event.currentTarget.querySelector(
    ".scale-100, .scale-95"
  ) as HTMLElement | null;

  if (modalContent && !modalContent.contains(event.target)) {
    closeModal({ currentTarget: event.currentTarget, target: event.target } as ModalEvent);
  }
}

export function initModal(): void {
  document.querySelectorAll<HTMLElement>("[data-dui-toggle='modal']").forEach((trigger) => {
    if (!initializedModals.has(trigger)) {
      trigger.addEventListener("click", toggleModal as EventListener);
      initializedModals.add(trigger);
    }
  });

  document.querySelectorAll<HTMLElement>("[data-dui-dismiss='modal']").forEach((button) => {
    if (!initializedModals.has(button)) {
      button.addEventListener("click", closeModal as EventListener);
      initializedModals.add(button);
    }
  });
}

// Cleanup function to destroy active modals and event listeners
export function cleanupModals(): void {
  // Remove event listeners for active modals
  activeModals.forEach((modal) => {
    modal.removeEventListener("click", closeOnOutsideClick as EventListener);
  });
  activeModals = []; // Clear active modals array

  // Reinitialize WeakSet to effectively "clear" it
  (initializedModals as WeakSet<HTMLElement>) = new WeakSet<HTMLElement>();
}


// Auto-initialize Modals in the Browser Environment
if (typeof window !== "undefined" && typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    initModal();

    // Observe the DOM for dynamically added modals
    const observer = new MutationObserver(() => {
      initModal(); // Reinitialize modals when new elements are added
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}
