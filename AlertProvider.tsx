import React, { createContext, useContext, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextView } from '@/components/ui/textview';
import { useColors } from '@/hooks/useColors';

type AlertType = 'success' | 'error' | 'info' | 'warning';

// Define a button interface for alerts
interface AlertButton {
  text: string;
  onPress: () => void;
  type?: 'default' | 'cancel' | 'destructive';
}

interface AlertContextType {
  showAlert: (message: string, type?: AlertType, duration?: number) => void;
  showConfirmAlert: (
    message: string,
    buttons: AlertButton[],
    type?: AlertType
  ) => void;
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
  buttons?: AlertButton[];
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, buttons, onClose }) => {
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

  const getButtonColor = (buttonType?: 'default' | 'cancel' | 'destructive') => {
    switch (buttonType) {
      case 'destructive':
        return '#FF3B30';
      case 'cancel':
        return '#8E8E93';
      case 'default':
      default:
        return '#FFFFFF';
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
      <TextView style={styles.alertText}>
        {message}
      </TextView>

      {buttons && buttons.length > 0 && (
        <View style={styles.buttonContainer}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                index > 0 && styles.buttonMargin
              ]}
              onPress={() => {
                button.onPress();
                onClose();
              }}
            >
              <TextView style={[
                styles.buttonText,
                { color: getButtonColor(button.type) }
              ]}>
                {button.text}
              </TextView>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertState, setAlertState] = useState<{
    visible: boolean;
    message: string;
    type: AlertType;
    buttons?: AlertButton[];
    autoHide: boolean;
  }>({
    visible: false,
    message: '',
    type: 'info',
    buttons: undefined,
    autoHide: true,
  });

  const [animation] = useState(new Animated.Value(0));

  const showAlert = (message: string, type: AlertType = 'info', duration: number = 3000) => {
    setAlertState({
      visible: true,
      message,
      type,
      buttons: undefined,
      autoHide: true,
    });

    // Animate in
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto hide after duration
    setTimeout(() => {
      hideAlert();
    }, duration);
  };

  const showConfirmAlert = (
    message: string,
    buttons: AlertButton[],
    type: AlertType = 'warning'
  ) => {
    setAlertState({
      visible: true,
      message,
      type,
      buttons,
      autoHide: false,
    });

    // Animate in
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
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
    <AlertContext.Provider value={{ showAlert, showConfirmAlert }}>
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
            buttons={alertState.buttons}
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
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonMargin: {
    marginLeft: 10,
  },
  buttonText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 14,
  }
});

// Alert component that can be used directly
export const AlertComponent: React.FC<{
  message: string;
  type?: AlertType;
  visible: boolean;
  buttons?: AlertButton[];
  onClose: () => void;
}> = ({ message, type = 'info', visible, buttons, onClose }) => {
  if (!visible) return null;

  return (
    <Alert
      message={message}
      type={type}
      buttons={buttons}
      onClose={onClose}
    />
  );
};