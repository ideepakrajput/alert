import { useEffect } from 'react';
import { useAlert } from '@/libs/contexts/AlertProvider';
import { setGlobalShowAlert } from '@/libs/utils/alert';

export const AlertInitializer = () => {
    const { showAlert } = useAlert();

    useEffect(() => {
        setGlobalShowAlert(showAlert);
    }, [showAlert]);

    return null;
};