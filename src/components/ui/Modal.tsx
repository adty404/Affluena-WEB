import type { ReactNode } from 'react';
import { Button } from './Button';
import { AppIcon } from './AppIcon';

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ open, title, description, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-sheet-handle" aria-hidden="true" />
        <div className="modal-head">
          <div>
            <h3>{title}</h3>
            {description ? <p>{description}</p> : null}
          </div>
          <Button size="icon" onClick={onClose} aria-label="Close modal"><AppIcon name="close" /></Button>
        </div>
        {children}
      </div>
    </div>
  );
}
