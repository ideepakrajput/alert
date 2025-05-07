import { useAlert } from '@/libs/contexts/AlertProvider';

type AlertType = 'success' | 'error' | 'info' | 'warning';

// This is a hook that returns the showAlert function
export const useShowAlert = () => {
    const { showAlert } = useAlert();
    return showAlert;
};

// This is a global function that can be used without hooks
// Note: This should only be used in non-React contexts or where hooks can't be used
let globalShowAlert: ((message: string, type?: AlertType, duration?: number) => void) | null = null;

export const setGlobalShowAlert = (
    showAlertFn: (message: string, type?: AlertType, duration?: number) => void
) => {
    globalShowAlert = showAlertFn;
};

export const showAlert = (message: string, type: AlertType = 'info', duration: number = 3000) => {
    if (globalShowAlert) {
        globalShowAlert(message, type, duration);
    } else {
        console.warn('Alert system not initialized yet. Make sure to use this after the AlertProvider is mounted.');
    }
};
