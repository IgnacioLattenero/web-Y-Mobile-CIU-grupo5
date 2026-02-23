import './modal.css';

function Modal({ isOpen, onClose, onConfirm, children}) {
    if (!isOpen) {
        return null;
    }

    return (
        // El fondo oscuro
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-body">
                    {children}
                </div>
                {/* Los botones de acción */}
                <div className="modal-footer">
                    <button onClick={onClose} className="btn-cancel">Cancelar</button>
                    <button onClick={onConfirm} className="btn-confirm">Borrar</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;