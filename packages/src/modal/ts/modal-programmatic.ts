import { ModalConfig, IModal } from './modal.types';

/**
 * A class to handle programmatic modal behavior.
 * @implements {IModal}
 */
export class Modal implements IModal {
  private _isVisible: boolean = false;
  private _config: ModalConfig;
  private _modalElement: HTMLElement;
  private _backdropElement: HTMLElement | null = null;

  /**
   * Initialize the modal.
   * @param {HTMLElement} modalElement - The modal element.
   * @param {ModalConfig} [config={}] - Configuration options for the modal.
   */
  constructor(modalElement: HTMLElement, config: ModalConfig = {}) {
    this._modalElement = modalElement;
    this._config = {
      backdrop: true,
      keyboard: true,
      closeOnOutsideClick: true,
      backdropClasses: ['fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'z-10'],
      ...config,
    };

    this.setupModal();
  }

  /**
   * Show the modal.
   */
  public show(): void {
    if (this._isVisible) return;
    this._isVisible = true;

    // Show the modal element
    this._modalElement.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
    this._modalElement.classList.add('opacity-100', 'block');
    this._modalElement.setAttribute('aria-hidden', 'false');

    // Show the backdrop if enabled
    if (this._config.backdrop) this.showBackdrop();

    // Add listeners
    if (this._config.keyboard) {
      document.addEventListener('keydown', this.handleKeydown);
    }
    if (this._config.closeOnOutsideClick) {
      document.addEventListener('click', this.handleOutsideClick, true); // Capture phase
    }
  }

  /**
   * Hide the modal.
   */
  public hide(): void {
    if (!this._isVisible) return;
    this._isVisible = false;

    // Hide the modal element
    this._modalElement.classList.add('hidden', 'opacity-0', 'pointer-events-none');
    this._modalElement.classList.remove('opacity-100', 'block');
    this._modalElement.setAttribute('aria-hidden', 'true');

    // Remove the backdrop if enabled
    if (this._config.backdrop) this.hideBackdrop();

    // Remove listeners
    if (this._config.keyboard) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
    if (this._config.closeOnOutsideClick) {
      document.removeEventListener('click', this.handleOutsideClick, true);
    }
  }

  /**
   * Toggle the modal's visibility.
   */
  public toggle(): void {
    this._isVisible ? this.hide() : this.show();
  }

  /**
   * Check if the modal is currently visible.
   * @returns {boolean}
   */
  public isVisible(): boolean {
    return this._isVisible;
  }

  /**
   * Set up initial modal state.
   * Hides the modal if it's not already hidden.
   */
  private setupModal(): void {
    const isHidden = this._modalElement.classList.contains('hidden') ||
                     this._modalElement.getAttribute('aria-hidden') === 'true';
    this._isVisible = !isHidden;

    // Ensure proper aria attributes
    this._modalElement.setAttribute('aria-hidden', String(isHidden));
  }

  /**
   * Show the backdrop element with custom classes.
   */
  private showBackdrop(): void {
    if (this._backdropElement) return;

    // Create the backdrop element
    this._backdropElement = document.createElement('div');
    this._backdropElement.className = this._config.backdropClasses?.join(' ') ?? 'backdrop';

    // Wrap the modal inside the backdrop
    this._backdropElement.appendChild(this._modalElement);

    // Append the backdrop to the body
    document.body.appendChild(this._backdropElement);

    console.log('Backdrop created:', this._backdropElement);
  }


  /**
   * Hide and remove the backdrop element.
   */
  private hideBackdrop(): void {
    if (this._backdropElement) {
      this._backdropElement.remove();
      this._backdropElement = null;
    }
  }

  /**
   * Handle keydown events (e.g., Escape to close the modal).
   * @param {KeyboardEvent} event
   */
  private handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.hide();
    }
  };

  /**
   * Handle clicks outside the modal content to close the modal.
   * @param {MouseEvent} event
   */
  private handleOutsideClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;

    // Reference to the first child of the modal element
    const modalContent = this._modalElement.firstElementChild;

    console.log('handleOutsideClick triggered', {
      target,
      modalContent,
    });

    // Check if the click is outside the modal content
    if (modalContent && !modalContent.contains(target)) {
      console.log('Clicked outside modal content');
      this.hide();
    } else {
      console.log('Clicked inside modal content');
    }
  };
}
