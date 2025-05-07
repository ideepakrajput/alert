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
  showDeleteConfirmation: (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
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
        return colors.error;
      case 'warning':
        return colors.warning;
      case 'info':
        return colors.info;
      default:
        return colors.primary;
    }
  };

  const getButtonColor = (buttonType?: 'default' | 'cancel' | 'destructive') => {
    switch (buttonType) {
      case 'destructive':
        return colors.error;
      case 'cancel':
        return colors.warning;
      case 'default':
      default:
        return colors.primary;
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
        style={[
          styles.alertText,
          buttons && buttons.length > 0 ? { textAlign: 'left' } : null,
        ]}
      >
        {message}
      </TextView>

      {
        buttons && buttons.length > 0 && (
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  {
                    backgroundColor: getButtonColor(button.type),
                  },
                  index > 0 && styles.buttonMargin
                ]}
                onPress={() => {
                  button.onPress();
                  onClose();
                }}
              >
                <TextView style={styles.buttonText}>
                  {button.text}
                </TextView>
              </TouchableOpacity>
            ))}
          </View>
        )
      }
    </View >
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
    type: AlertType = 'info'
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

  // Add the showDeleteConfirmation function
  const showDeleteConfirmation = (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
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
    <AlertContext.Provider value={{ showAlert, showConfirmAlert, showDeleteConfirmation }}>
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
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonMargin: {
    marginLeft: 10,
  },
  buttonText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 14,
    color: '#FFFFFF',
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
