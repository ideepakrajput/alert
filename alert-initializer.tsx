import { useEffect } from 'react';
import { useAlert } from '@/libs/contexts/AlertProvider';
import { setGlobalShowAlert } from '@/libs/utils/alert';

export const AlertInitializer = () => {
    const { showAlert, showConfirmAlert, showDeleteConfirmation } = useAlert();

    useEffect(() => {
        setGlobalShowAlert(showAlert, showConfirmAlert, showDeleteConfirmation);
    }, [showAlert, showConfirmAlert, showDeleteConfirmation]);

    return null;
};