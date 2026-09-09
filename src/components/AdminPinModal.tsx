import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Delete, X, AlertCircle } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPin: string;
  targetModuleName?: string;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  correctPin,
  targetModuleName = 'Suite ERP'
}) => {
  const [pin, setPin] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setHasError(false);
      setErrorMessage('');
    }
  }, [isOpen]);

  // Physical Keyboard Listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleAddDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDeleteDigit();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pin, correctPin]);

  if (!isOpen) return null;

  const handleAddDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setHasError(false);
    setErrorMessage('');

    if (newPin.length === 4) {
      verifyPin(newPin);
    }
  };

  const handleDeleteDigit = () => {
    setPin((prev) => prev.slice(0, -1));
    setHasError(false);
    setErrorMessage('');
  };

  const handleClearPin = () => {
    setPin('');
    setHasError(false);
    setErrorMessage('');
  };

  const verifyPin = (inputPin: string) => {
    if (inputPin === correctPin) {
      onSuccess();
      onClose();
    } else {
      setHasError(true);
      setErrorMessage('PIN incorrecto. (PIN por defecto: 1234)');
      setTimeout(() => {
        setPin('');
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in zoom-in-95 duration-150">
      <div className="bg-surface border border-border-medium rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 bg-surface-elevated border-b border-border-subtle flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/30">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Acceso de Administrador
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {targetModuleName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface hover:bg-surface-hover text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer border border-border-subtle transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* PIN Display */}
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center text-slate-400 mb-3 border border-border-subtle">
            <Lock size={20} className={hasError ? 'text-red-500 animate-bounce' : 'text-amber-500'} />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 font-bold mb-4 text-center">
            Ingresa tu PIN de 4 dígitos para desbloquear
          </p>

          {/* Dots Indicator */}
          <div className="flex items-center gap-4 mb-4">
            {[0, 1, 2, 3].map((index) => {
              const isFilled = pin.length > index;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-150 ${
                    isFilled
                      ? 'bg-red-600 scale-110 shadow-md shadow-red-600/30'
                      : 'bg-surface-elevated border-2 border-border-subtle'
                  } ${hasError ? 'bg-red-500 animate-pulse' : ''}`}
                />
              );
            })}
          </div>

          {/* Error Message */}
          {hasError && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-bold mb-3 animate-shake">
              <AlertCircle size={14} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tactile Keypad */}
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-[260px] mt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleAddDigit(digit)}
                className="h-13 rounded-2xl bg-surface-elevated hover:bg-surface-hover border border-border-subtle text-slate-900 dark:text-white font-black text-lg flex items-center justify-center active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                {digit}
              </button>
            ))}

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClearPin}
              className="h-13 rounded-2xl bg-surface-elevated hover:bg-surface-hover border border-border-subtle text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold text-xs flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            >
              Borrar
            </button>

            {/* Zero Digit */}
            <button
              type="button"
              onClick={() => handleAddDigit('0')}
              className="h-13 rounded-2xl bg-surface-elevated hover:bg-surface-hover border border-border-subtle text-slate-900 dark:text-white font-black text-lg flex items-center justify-center active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              0
            </button>

            {/* Delete Single Digit */}
            <button
              type="button"
              onClick={handleDeleteDigit}
              className="h-13 rounded-2xl bg-surface-elevated hover:bg-surface-hover border border-border-subtle text-slate-500 hover:text-red-500 font-bold flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            >
              <Delete size={20} />
            </button>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-surface-elevated border-t border-border-subtle text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            PIN por defecto: <span className="font-mono font-bold text-amber-600 dark:text-amber-400">1234</span> (configurable en Configuración)
          </p>
        </div>
      </div>
    </div>
  );
};

