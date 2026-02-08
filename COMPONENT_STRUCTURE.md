# Component Structure

```
App.tsx (Main Container)
│
├── ToastContainer (react-toastify)
│
├── Header
│   ├── Logo
│   ├── Connection Status Badge
│   └── Action Buttons
│       ├── Connect Button → Opens SettingsModal
│       ├── Import JSON Button → Opens ImportJsonModal
│       └── Push Cloud Button → Triggers handleSubmit
│
├── DashboardInfo (shown when tasks.length === 0)
│   ├── Detail Sheet Card
│   │   ├── Sheet Name
│   │   ├── Connection Status
│   │   └── Active Sheets List
│   └── Leader Sheet Card
│       ├── Sheet Name
│       ├── Connection Status
│       └── Active Sheets List
│
├── Tasks List (shown when tasks.length > 0)
│   └── Epic Groups (grouped by epicName)
│       ├── EpicHeader
│       │   ├── Epic Title
│       │   ├── Task Count Badge
│       │   └── Meta Inputs
│       │       ├── Code Input
│       │       ├── System Input (with prefix dropdown)
│       │       └── Actor Input (with prefix dropdown)
│       │
│       └── TaskItem[] (for each task in epic)
│           ├── Main Task Row
│           │   ├── Index Number
│           │   ├── Main Task Input
│           │   └── Task Metadata Grid
│           │       ├── Priority Dropdown
│           │       ├── Complexity Dropdown
│           │       ├── Start Date Input
│           │       ├── End Date Input
│           │       ├── Dev Points Dropdown
│           │       ├── Time Input
│           │       └── Version Input
│           │
│           └── Subtasks Row
│               ├── Subtasks Textarea
│               └── Details Grid
│                   ├── Leader Status Dropdown
│                   ├── Leader Points Dropdown
│                   ├── PM Status Dropdown
│                   ├── PM Points Dropdown
│                   ├── Finish Date Input
│                   ├── Delay Date Input
│                   └── Business Input
│
├── ImportJsonModal (conditional render)
│   ├── Modal Header
│   ├── JSON Editor (with syntax highlighting)
│   └── Modal Footer
│       ├── Cancel Button
│       └── Import Button
│
├── SettingsModal (conditional render)
│   ├── Modal Header
│   ├── Configuration Form
│   │   ├── Google Apps Script URL Input
│   │   ├── Leader File ID Input
│   │   ├── Google Doc URL Input
│   │   └── Connection Status Display
│   └── Modal Footer
│       ├── Test Connection Button
│       ├── Cancel Button
│       └── Save Button
│
└── UploadProgressModal (conditional render)
    ├── Modal Header (with percentage)
    ├── Progress Bar
    ├── Logs Display
    └── Close Button (when complete)
```

## Data Flow

```
User Actions → App.tsx State → Child Components → UI Updates
     ↓
Toast Notifications (showSuccess, showError, showWarning)
```

## State Management

```
App.tsx maintains all state:
├── tasks[] - Array of Task objects
├── jsonInput - JSON string for import
├── loading - Boolean for async operations
├── showImportModal - Boolean
├── showSettingsModal - Boolean
├── uploadProgress - Object with progress data
├── scriptUrl - Google Apps Script URL
├── leaderFileId - Leader file ID
├── docUrl - Google Doc URL
├── connectedSheetName - Connection status
└── sheetsInfo - Dashboard information
```

## Props Flow

```
App.tsx
  │
  ├─→ Header
  │     Props: connectedSheetName, loading, tasksLength, callbacks
  │
  ├─→ DashboardInfo
  │     Props: sheetsInfo
  │
  ├─→ EpicHeader (for each epic)
  │     Props: epicName, epicTasks, options, updateCallback
  │
  ├─→ TaskItem (for each task)
  │     Props: task, idx, options, getChipStyle, updateCallback
  │
  ├─→ ImportJsonModal
  │     Props: show, jsonInput, callbacks, utilities
  │
  ├─→ SettingsModal
  │     Props: show, loading, config values, callbacks
  │
  └─→ UploadProgressModal
        Props: show, percentage, currentEpic, logs, callback
```
