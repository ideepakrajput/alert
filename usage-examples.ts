// Example 1: Using the hook in a component
import React from 'react';
import { View, Button } from 'react-native';
import { useShowAlert } from '@/libs/utils/alert';

const DeleteButton = ({ itemId, onDeleted }) => {
    const { showConfirmAlert } = useShowAlert();

    const handleDelete = () => {
        showConfirmAlert(
            'Are you sure you want to delete this item?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Delete cancelled'),
                    type: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        // Perform delete operation
                        deleteItem(itemId);
                        onDeleted();
                    },
                    type: 'destructive'
                }
            ],
            'warning'
        );
    };

    const deleteItem = (id) => {
        // API call or state update to delete the item
        console.log(`Deleting item ${id}`);
    };

    return (
        <Button title= "Delete" onPress = { handleDelete } />
  );
};

// Example 2: Using the convenience function for delete confirmation
import React from 'react';
import { View, Button } from 'react-native';
import { showDeleteConfirmation } from '@/libs/utils/alert';

const DeleteItemButton = ({ itemId, onDeleted }) => {
    const handleDelete = () => {
        showDeleteConfirmation(
            'Are you sure you want to delete this item?',
            () => {
                // Delete logic here
                console.log(`Deleting item ${itemId}`);
                onDeleted();
            },
            () => console.log('Delete cancelled')
        );
    };

    return (
        <Button title= "Delete" onPress = { handleDelete } />
  );
};

// Example 3: Using with more than two buttons
import React from 'react';
import { View, Button } from 'react-native';
import { useShowAlert } from '@/libs/utils/alert';

const DocumentActions = ({ docId }) => {
    const { showConfirmAlert } = useShowAlert();

    const handleDocumentOptions = () => {
        showConfirmAlert(
            'What would you like to do with this document?',
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    type: 'cancel'
                },
                {
                    text: 'Archive',
                    onPress: () => archiveDocument(docId),
                    type: 'default'
                },
                {
                    text: 'Delete',
                    onPress: () => deleteDocument(docId),
                    type: 'destructive'
                }
            ],
            'info'
        );
    };

    const archiveDocument = (id) => {
        console.log(`Archiving document ${id}`);
    };

    const deleteDocument = (id) => {
        console.log(`Deleting document ${id}`);
    };

    return (
        <Button title= "Document Options" onPress = { handleDocumentOptions } />
  );
};