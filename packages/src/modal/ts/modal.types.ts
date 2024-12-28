/**
 * @typedef ModalConfig
 * Configuration options for the modal.
 * @property {boolean} [backdrop=true] - Whether to show a backdrop behind the modal.
 * @property {boolean} [keyboard=true] - Whether the Escape key should close the modal.
 * @property {boolean} [closeOnOutsideClick=true] - Whether clicking outside the modal content should close the modal.
 * @property {string[]} [backdropClasses=['fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'z-10']] - Custom classes for the backdrop.
 */
export type ModalConfig = {
  backdrop?: boolean;
  keyboard?: boolean;
  closeOnOutsideClick?: boolean;
  backdropClasses?: string[];
};

/**
 * @typedef IModal
 * Interface for modal methods.
 * @property {() => void} show - Show the modal.
 * @property {() => void} hide - Hide the modal.
 * @property {() => void} toggle - Toggle the modal's visibility.
 * @property {() => boolean} isVisible - Check if the modal is currently visible.
 */
export interface IModal {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  isVisible: () => boolean;
}
