import { useEffect } from 'react';
import { useAlert } from '@/libs/contexts/AlertProvider';
import { setGlobalShowAlert } from '@/libs/utils/alert';

export const AlertInitializer = () => {
    const { showAlert, showConfirmAlert } = useAlert();

    useEffect(() => {
        setGlobalShowAlert(showAlert, showConfirmAlert);
    }, [showAlert, showConfirmAlert]);

    return null;
};