# React Native Alert System

A flexible and customizable alert system for React Native applications that provides toast notifications, confirmation dialogs, and delete confirmations.

## Features

-   🚀 Simple toast notifications with auto-dismiss
-   🔔 Confirmation dialogs with customizable buttons
-   🗑️ Specialized delete confirmation dialogs
-   🎨 Different alert types: success, error, info, warning
-   🔄 Use as React hooks or direct function calls
-   🛡️ Safe area aware (works with notches and dynamic islands)

## Installation

1. Install the package dependencies:

```bash
npm install react-native-safe-area-context
```

2. Copy the following files to your project:
    - `AlertProvider.tsx` → `src/libs/contexts/AlertProvider.tsx`
    - `alert.ts` → `src/libs/utils/alert.ts`
    - `alert-initializer.tsx` → `src/components/alert-initializer.tsx`

## Setup

### 1. Wrap your app with AlertProvider

In your main App component or navigation container:

```tsx:App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/libs/contexts/AlertProvider';
import { AlertInitializer } from '@/components/alert-initializer';

const App = () => {
  return (
    <SafeAreaProvider>
      <AlertProvider>
        <AlertInitializer />
        {/* Rest of your app */}
      </AlertProvider>
    </SafeAreaProvider>
  );
};

export default App;
```

### 2. Make sure AlertInitializer is included

The `AlertInitializer` component is crucial as it connects the hook-based alert system with the global function-based alert system. It should be placed at the top level of your app, right after the `AlertProvider`.

## Usage

### Method 1: Using React Hooks (Recommended for React Components)

```tsx:YourComponent.tsx
import React from 'react';
import { Button } from 'react-native';
import { useAlert } from '@/libs/contexts/AlertProvider';
// OR
import { useShowAlert } from '@/libs/utils/alert';

const YourComponent = () => {
  // Option 1: Direct from context
  const { showAlert, showConfirmAlert, showDeleteConfirmation } = useAlert();

  // Option 2: Using the utility hook (same result)
  // const { showAlert, showConfirmAlert, showDeleteConfirmation } = useShowAlert();

  const handleShowAlert = () => {
    showAlert('This is a success message!', 'success', 3000);
  };

  const handleShowConfirm = () => {
    showConfirmAlert(
      'Are you sure you want to proceed?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancelled'),
          type: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => console.log('Confirmed'),
          type: 'default'
        }
      ],
      'info'
    );
  };

  const handleDelete = () => {
    showDeleteConfirmation(
      'Are you sure you want to delete this item?',
      () => console.log('Item deleted'),
      () => console.log('Deletion cancelled')
    );
  };

  return (
    <>
      <Button title="Show Alert" onPress={handleShowAlert} />
      <Button title="Show Confirm" onPress={handleShowConfirm} />
      <Button title="Show Delete Confirmation" onPress={handleDelete} />
    </>
  );
};

export default YourComponent;
```

### Method 2: Using Direct Function Calls (For Non-React Contexts)

```typescript:yourService.ts
import { showAlert, showConfirmAlert, showDeleteConfirmation } from '@/libs/utils/alert';

export const yourApiService = {
  fetchData: async () => {
    try {
      // API call logic
      showAlert('Data fetched successfully!', 'success');
    } catch (error) {
      showAlert('Failed to fetch data', 'error');
    }
  },

  deleteItem: async (id: string) => {
    showDeleteConfirmation(
      'Are you sure you want to delete this item?',
      async () => {
        try {
          // Delete API call
          showAlert('Item deleted successfully!', 'success');
        } catch (error) {
          showAlert('Failed to delete item', 'error');
        }
      }
    );
  }
};
```

## API Reference

### Alert Types

```typescript
type AlertType = "success" | "error" | "info" | "warning";
```

### Alert Buttons

```typescript
interface AlertButton {
    text: string;
    onPress: () => void;
    type?: "default" | "cancel" | "destructive";
}
```

### Hook Methods

#### showAlert

```typescript
showAlert(message: string, type?: AlertType, duration?: number): void
```

-   `message`: The text to display in the alert
-   `type`: Alert type (default: 'info')
-   `duration`: Time in milliseconds before auto-dismiss (default: 3000)

#### showConfirmAlert

```typescript
showConfirmAlert(message: string, buttons: AlertButton[], type?: AlertType): void
```

-   `message`: The text to display in the alert
-   `buttons`: Array of button configurations
-   `type`: Alert type (default: 'info')

#### showDeleteConfirmation

```typescript
showDeleteConfirmation(message: string, onConfirm: () => void, onCancel?: () => void): void
```

-   `message`: The text to display in the alert
-   `onConfirm`: Function to call when delete is confirmed
-   `onCancel`: Optional function to call when delete is cancelled

## Customization

You can customize the appearance of alerts by modifying the styles in `AlertProvider.tsx`. The alert colors are pulled from a `useColors` hook, which you should adapt to your app's theming system.

## Notes

-   Make sure to include the `AlertInitializer` component at the top level of your app to enable global function calls.
-   The direct function calls (`showAlert`, `showConfirmAlert`, `showDeleteConfirmation`) should only be used in non-React contexts or where hooks can't be used.
-   For React components, prefer using the hook approach (`useAlert` or `useShowAlert`).
