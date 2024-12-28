import { createPopper, Instance, Placement } from "@popperjs/core";
import { loadPopperJs } from "../../utils/loadPopper";
import type { DropdownConfig, IDropdown } from "./dropdown.types";

/**
 * Class representing a programmatic Dropdown component.
 */
export class Dropdown implements IDropdown {
  private menu: HTMLElement;
  private referenceElement: HTMLElement;
  private popperInstance: Instance | null = null;
  private config: DropdownConfig;
  private isOpen: boolean = false; // Internal state

  /**
   * Creates an instance of Dropdown.
   * @param reference - The element or selector to position the dropdown menu relative to.
   * @param menu - The menu element to display as the dropdown.
   * @param config - Configuration options for the dropdown.
   */
  constructor(reference: HTMLElement | string, menu: HTMLElement | string, config: DropdownConfig) {
    // Resolve referenceElement and menu
    this.referenceElement = this.resolveElement(reference, "Reference element not found");
    this.menu = this.resolveElement(menu, "Menu element not found");

    this.config = {
      placement: config.placement || "bottom-start",
      closeOnOutsideClick: config.closeOnOutsideClick ?? true,
      offset: config.offset || [0, 5],
    };

    this.init();
  }

  /**
   * Resolves an element from an HTMLElement or selector string.
   * @param elementOrSelector - HTMLElement or a selector string.
   * @param errorMessage - Error message if the element is not found.
   * @returns The resolved HTMLElement.
   */
  private resolveElement(elementOrSelector: HTMLElement | string, errorMessage: string): HTMLElement {
    if (typeof elementOrSelector === "string") {
      const resolvedElement = document.querySelector<HTMLElement>(elementOrSelector);
      if (!resolvedElement) throw new Error(errorMessage);
      return resolvedElement;
    } else if (elementOrSelector instanceof HTMLElement) {
      return elementOrSelector;
    }
    throw new Error(errorMessage);
  }

  /**
   * Initializes the Dropdown component.
   */
  private async init(): Promise<void> {
    // Load Popper.js dynamically
    await loadPopperJs();

    this.popperInstance = createPopper(this.referenceElement, this.menu, {
      placement: this.config.placement as Placement,
      modifiers: [{ name: "offset", options: { offset: this.config.offset } }],
    });

    // Close dropdown if clicked outside
    if (this.config.closeOnOutsideClick) {
      document.addEventListener("click", (e: Event) => {
        if (!this.menu.contains(e.target as Node) && !this.referenceElement.contains(e.target as Node)) {
          this.close();
        }
      });
    }
  }

  /**
   * Toggles the dropdown menu visibility.
   */
  toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  /**
   * Opens the dropdown menu programmatically.
   */
  open(): void {
    if (this.isOpen) return; // Prevent redundant calls

    this.menu.hidden = false;
    this.menu.classList.remove("hidden");
    this.popperInstance?.update();
    this.isOpen = true; // Update internal state
  }

  /**
   * Closes the dropdown menu programmatically.
   */
  close(): void {
    if (!this.isOpen) return; // Prevent redundant calls

    this.menu.hidden = true;
    this.menu.classList.add("hidden");
    this.isOpen = false; // Update internal state
  }

  /**
   * Destroys the Dropdown instance and cleans up resources.
   */
  destroy(): void {
    this.popperInstance?.destroy();
    this.popperInstance = null;
    document.removeEventListener("click", this.close);
  }
}
