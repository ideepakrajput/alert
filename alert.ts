import { useAlert } from '@/libs/contexts/AlertProvider';

type AlertType = 'success' | 'error' | 'info' | 'warning';

// Define a button interface for alerts
export interface AlertButton {
    text: string;
    onPress: () => void;
    type?: 'default' | 'cancel' | 'destructive';
}

// This is a hook that returns the showAlert functions
export const useShowAlert = () => {
    const { showAlert, showConfirmAlert, showDeleteConfirmation } = useAlert();
    return { showAlert, showConfirmAlert, showDeleteConfirmation };
};

// This is a global function that can be used without hooks
// Note: This should only be used in non-React contexts or where hooks can't be used
let globalShowAlert: ((message: string, type?: AlertType, duration?: number) => void) | null = null;
let globalShowConfirmAlert: ((message: string, buttons: AlertButton[], type?: AlertType) => void) | null = null;
let globalShowDeleteConfirmation: ((message: string, onConfirm: () => void, onCancel?: () => void) => void) | null = null;

export const setGlobalShowAlert = (
    showAlertFn: (message: string, type?: AlertType, duration?: number) => void,
    showConfirmAlertFn: (message: string, buttons: AlertButton[], type?: AlertType) => void,
    showDeleteConfirmationFn: (message: string, onConfirm: () => void, onCancel?: () => void) => void
) => {
    globalShowAlert = showAlertFn;
    globalShowConfirmAlert = showConfirmAlertFn;
    globalShowDeleteConfirmation = showDeleteConfirmationFn;
};

export const showAlert = (message: string, type: AlertType = 'info', duration: number = 3000) => {
    if (globalShowAlert) {
        globalShowAlert(message, type, duration);
    } else {
        console.warn('Alert system not initialized yet. Make sure to use this after the AlertProvider is mounted.');
    }
};

export const showConfirmAlert = (message: string, buttons: AlertButton[], type: AlertType = 'info') => {
    if (globalShowConfirmAlert) {
        globalShowConfirmAlert(message, buttons, type);
    } else {
        console.warn('Alert system not initialized yet. Make sure to use this after the AlertProvider is mounted.');
    }
};

// Convenience function for common delete confirmation pattern
export const showDeleteConfirmation = (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
) => {
    if (globalShowDeleteConfirmation) {
        globalShowDeleteConfirmation(message, onConfirm, onCancel);
    } else {
        const buttons: AlertButton[] = [
            {
                text: 'Cancel',
                onPress: onCancel || (() => { }),
                type: 'cancel'
            },
            {
                text: 'Delete',
                onPress: onConfirm,
                type: 'destructive'
            }
        ];

        showConfirmAlert(message, buttons, 'info');
    }
};
