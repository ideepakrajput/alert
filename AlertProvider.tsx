import React, { createContext, useContext, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextView } from '@/components/ui/textview';
import { useColors } from '@/hooks/useColors';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertContextType {
  showAlert: (message: string, type?: AlertType, duration?: number) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

interface AlertProps {
  message: string;
  type: AlertType;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return colors.primary;
      case 'error':
        return '#FF3B30';
      case 'warning':
        return '#FF9500';
      case 'info':
      default:
        return '#007AFF';
    }
  };

  return (
    <View
      style={[
        styles.alertContainer,
        {
          backgroundColor: getBackgroundColor(),
          top: insets.top + 10
        }
      ]}
    >
      <TextView
        style={styles.alertText}
      >
        {message}
      </TextView>
    </View>
  );
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertState, setAlertState] = useState<{
    visible: boolean;
    message: string;
    type: AlertType;
  }>({
    visible: false,
    message: '',
    type: 'info',
  });

  const [animation] = useState(new Animated.Value(0));

  const showAlert = (message: string, type: AlertType = 'info', duration: number = 3000) => {
    setAlertState({
      visible: true,
      message,
      type,
    });

    // Animate in
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto hide after duration
    setTimeout(() => {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setAlertState(prev => ({ ...prev, visible: false }));
      });
    }, duration);
  };

  const hideAlert = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setAlertState(prev => ({ ...prev, visible: false }));
    });
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alertState.visible && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            opacity: animation,
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          }}
        >
          <Alert
            message={alertState.message}
            type={alertState.type}
            onClose={hideAlert}
          />
        </Animated.View>
      )}
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertText: {
    color: '#FFFFFF',
    fontFamily: 'PoppinsMedium',
    textAlign: 'center',
  }
});

// Alert component that can be used directly
export const AlertComponent: React.FC<{
  message: string;
  type?: AlertType;
  visible: boolean;
  onClose: () => void;
}> = ({ message, type = 'info', visible, onClose }) => {
  if (!visible) return null;

  return (
    <Alert message={message} type={type} onClose={onClose} />
  );
};
