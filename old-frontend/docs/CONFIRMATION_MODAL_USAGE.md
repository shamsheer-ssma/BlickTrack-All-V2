# Confirmation Modal Usage Guide

## Overview
The `ConfirmationModal` component provides a beautiful, reusable confirmation dialog that can be used throughout the application to replace browser's default `window.confirm()`.

## Features
- ✅ Professional UI/UX design
- ✅ Multiple types: danger, warning, info, success
- ✅ Customizable text and colors
- ✅ Loading states
- ✅ Keyboard navigation support
- ✅ Responsive design
- ✅ Reusable across the entire application

## Basic Usage

### 1. Import the Component
```tsx
import ConfirmationModal from '@/components/ui/ConfirmationModal';
```

### 2. Add State for Modal
```tsx
const [showConfirm, setShowConfirm] = useState({
  isOpen: false,
  itemId: '',
  itemName: ''
});
```

### 3. Create Handler Functions
```tsx
const handleDeleteClick = (id: string, name: string) => {
  setShowConfirm({
    isOpen: true,
    itemId: id,
    itemName: name
  });
};

const handleConfirmDelete = async () => {
  // Your delete logic here
  console.log('Deleting item:', showConfirm.itemId);
  
  // Close modal
  setShowConfirm({
    isOpen: false,
    itemId: '',
    itemName: ''
  });
};

const handleCancelDelete = () => {
  setShowConfirm({
    isOpen: false,
    itemId: '',
    itemName: ''
  });
};
```

### 4. Add the Modal Component
```tsx
<ConfirmationModal
  isOpen={showConfirm.isOpen}
  onClose={handleCancelDelete}
  onConfirm={handleConfirmDelete}
  title="Delete Item"
  message={`Are you sure you want to delete "${showConfirm.itemName}"? This action cannot be undone.`}
  type="danger"
  confirmText="Delete"
  cancelText="Cancel"
/>
```

## Modal Types

### Danger (Red)
```tsx
<ConfirmationModal
  type="danger"
  title="Delete Item"
  message="This action cannot be undone."
  confirmText="Delete"
/>
```

### Warning (Yellow)
```tsx
<ConfirmationModal
  type="warning"
  title="Warning"
  message="This action may have unintended consequences."
  confirmText="Continue"
/>
```

### Info (Blue)
```tsx
<ConfirmationModal
  type="info"
  title="Information"
  message="Please review the details before proceeding."
  confirmText="OK"
/>
```

### Success (Green)
```tsx
<ConfirmationModal
  type="success"
  title="Success"
  message="Operation completed successfully."
  confirmText="Great!"
/>
```

## Advanced Usage with Loading States

```tsx
const [isDeleting, setIsDeleting] = useState(false);

const handleConfirmDelete = async () => {
  setIsDeleting(true);
  
  try {
    await deleteItem(showConfirm.itemId);
    // Success logic
  } catch (error) {
    // Error handling
  } finally {
    setIsDeleting(false);
    setShowConfirm({ isOpen: false, itemId: '', itemName: '' });
  }
};

<ConfirmationModal
  isOpen={showConfirm.isOpen}
  onClose={handleCancelDelete}
  onConfirm={handleConfirmDelete}
  title="Delete Item"
  message={`Are you sure you want to delete "${showConfirm.itemName}"?`}
  type="danger"
  confirmText="Delete"
  cancelText="Cancel"
  isLoading={isDeleting}
/>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | false | Controls modal visibility |
| `onClose` | function | - | Called when modal is closed |
| `onConfirm` | function | - | Called when confirm button is clicked |
| `title` | string | - | Modal title |
| `message` | string | - | Modal message content |
| `type` | 'danger' \| 'warning' \| 'info' \| 'success' | 'danger' | Modal type/color scheme |
| `confirmText` | string | 'Confirm' | Confirm button text |
| `cancelText` | string | 'Cancel' | Cancel button text |
| `isLoading` | boolean | false | Shows loading state on confirm button |

## Best Practices

1. **Always provide clear, descriptive messages**
2. **Use appropriate types for different actions**
3. **Handle loading states for async operations**
4. **Provide meaningful button text**
5. **Test keyboard navigation (Tab, Enter, Escape)**
6. **Ensure accessibility with proper ARIA labels**

## Examples in Codebase

- **Feature Management**: Delete category confirmation
- **Tenant Management**: Delete tenant confirmation
- **User Management**: Delete user confirmation
- **Settings**: Reset settings confirmation

## Migration from window.confirm()

### Before (Browser confirm)
```tsx
const handleDelete = () => {
  if (window.confirm('Are you sure?')) {
    deleteItem();
  }
};
```

### After (Custom modal)
```tsx
const [showConfirm, setShowConfirm] = useState(false);

const handleDelete = () => {
  setShowConfirm(true);
};

const handleConfirmDelete = () => {
  deleteItem();
  setShowConfirm(false);
};

<ConfirmationModal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleConfirmDelete}
  title="Delete Item"
  message="Are you sure you want to delete this item?"
  type="danger"
/>
```

This provides a much better user experience with consistent branding and professional appearance!

