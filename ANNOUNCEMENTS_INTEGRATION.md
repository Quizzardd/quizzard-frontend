# Announcement Integration Documentation

This document explains the announcement feature integration between the backend and frontend.

## Overview

The announcement feature allows users to create, read, update, delete, and search announcements within groups. Each announcement can optionally be linked to a quiz.

## Backend API Endpoints

All endpoints require authentication via Bearer token.

### 1. Create Announcement
- **Endpoint**: `POST /api/v1/announcements`
- **Body**:
  ```json
  {
    "text": "string (required)",
    "group": "string (required)",
    "quiz": "string (optional)"
  }
  ```
- **Response**: 201 - Announcement created successfully

### 2. Get Announcement by ID
- **Endpoint**: `GET /api/v1/announcements/:id`
- **Response**: 200 - Announcement details

### 3. Get Group Announcements (Paginated)
- **Endpoint**: `GET /api/v1/announcements/group/:groupId`
- **Query Parameters**:
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
- **Response**: 200 - Paginated announcements

### 4. Get Author Announcements (Paginated)
- **Endpoint**: `GET /api/v1/announcements/author/:userId`
- **Query Parameters**:
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
- **Response**: 200 - Paginated announcements

### 5. Search Announcements
- **Endpoint**: `GET /api/v1/announcements/search/:groupId`
- **Query Parameters**:
  - `q`: string (required) - search query
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
- **Response**: 200 - Search results

### 6. Update Announcement
- **Endpoint**: `PUT /api/v1/announcements/:id`
- **Authorization**: Only the author can update
- **Body**:
  ```json
  {
    "text": "string (optional)",
    "quiz": "string (optional)"
  }
  ```
- **Response**: 200 - Announcement updated

### 7. Delete Announcement
- **Endpoint**: `DELETE /api/v1/announcements/:id`
- **Authorization**: Only the author can delete
- **Response**: 200 - Announcement deleted

## Frontend Integration

### Files Created/Updated

1. **`src/services/announcementService.ts`** - API service layer
2. **`src/hooks/useAnnouncement.ts`** - React Query hooks
3. **`src/types/announcements.ts`** - TypeScript types
4. **`src/components/announcements/AnnouncementList.tsx`** - Example component

### Using the Hooks

#### 1. Fetch Group Announcements

```typescript
import { useGroupAnnouncements } from '@/hooks/useAnnouncement';

function MyComponent({ groupId }: { groupId: string }) {
  const { data, isLoading, error } = useGroupAnnouncements(groupId, {
    page: 1,
    limit: 10,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading announcements</div>;

  return (
    <div>
      {data?.announcements.map((announcement) => (
        <div key={announcement._id}>{announcement.text}</div>
      ))}
    </div>
  );
}
```

#### 2. Create Announcement

```typescript
import { useCreateAnnouncement } from '@/hooks/useAnnouncement';

function CreateAnnouncement({ groupId }: { groupId: string }) {
  const createMutation = useCreateAnnouncement();

  const handleSubmit = async (text: string) => {
    await createMutation.mutateAsync({
      text,
      group: groupId,
    });
  };

  return (
    <button
      onClick={() => handleSubmit('Hello World!')}
      disabled={createMutation.isPending}
    >
      Create
    </button>
  );
}
```

#### 3. Update Announcement

```typescript
import { useUpdateAnnouncement } from '@/hooks/useAnnouncement';

function EditAnnouncement({ announcementId }: { announcementId: string }) {
  const updateMutation = useUpdateAnnouncement();

  const handleUpdate = async (newText: string) => {
    await updateMutation.mutateAsync({
      id: announcementId,
      payload: { text: newText },
    });
  };

  return (
    <button onClick={() => handleUpdate('Updated text')}>
      Update
    </button>
  );
}
```

#### 4. Delete Announcement

```typescript
import { useDeleteAnnouncement } from '@/hooks/useAnnouncement';

function DeleteButton({ announcementId }: { announcementId: string }) {
  const deleteMutation = useDeleteAnnouncement();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(announcementId);
  };

  return (
    <button onClick={handleDelete} disabled={deleteMutation.isPending}>
      Delete
    </button>
  );
}
```

#### 5. Search Announcements

```typescript
import { useSearchAnnouncements } from '@/hooks/useAnnouncement';

function SearchAnnouncements({ groupId }: { groupId: string }) {
  const [query, setQuery] = useState('');
  
  const { data, isLoading } = useSearchAnnouncements(groupId, {
    q: query,
    page: 1,
    limit: 10,
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {data?.announcements.map((announcement) => (
        <div key={announcement._id}>{announcement.text}</div>
      ))}
    </div>
  );
}
```

## Features

### Optimistic Updates
All mutations (create, update, delete) use optimistic updates for better UX. This means:
- The UI updates immediately before the server responds
- If the server request fails, the UI automatically rolls back
- Users get instant feedback

### Automatic Cache Invalidation
When an announcement is created, updated, or deleted:
- Related queries are automatically invalidated
- The UI re-fetches fresh data
- Ensures data consistency across components

### Toast Notifications
Success and error messages are automatically shown using `react-hot-toast`:
- ✅ "Announcement created successfully!"
- ✅ "Announcement updated successfully!"
- ✅ "Announcement deleted successfully!"
- ❌ Error messages with details

### Pagination
The `useGroupAnnouncements` and `useSearchAnnouncements` hooks support pagination:
```typescript
const { data } = useGroupAnnouncements(groupId, { page: 2, limit: 20 });
// data contains: announcements, totalPages, currentPage, totalAnnouncements
```

## Type Definitions

```typescript
interface IAnnouncement {
  _id: string;
  group: string | IGroup;
  author: string | IUser;
  text: string;
  quiz?: string | IQuiz;
  createdAt: Date;
  updatedAt?: Date;
}

interface PaginatedAnnouncementsResponse {
  announcements: IAnnouncement[];
  totalPages: number;
  currentPage: number;
  totalAnnouncements: number;
}
```

## Example Usage in Group Details Page

```typescript
import { AnnouncementList } from '@/components/announcements/AnnouncementList';

function GroupDetailsPage({ groupId }: { groupId: string }) {
  return (
    <div>
      <h1>Group Announcements</h1>
      <AnnouncementList groupId={groupId} />
    </div>
  );
}
```

## Authorization

- **Create**: Any authenticated user can create announcements in groups they belong to
- **Read**: Any authenticated user can read announcements
- **Update**: Only the author can update their announcements
- **Delete**: Only the author can delete their announcements

## Error Handling

All hooks use the `getApiErrorMessage` utility to extract meaningful error messages from API responses. Common errors:
- 401: Unauthorized (not logged in)
- 403: Forbidden (not the author)
- 404: Not found
- 400: Validation error

## Next Steps

To use announcements in your app:

1. Import the `AnnouncementList` component in your group details page
2. Or build custom UI using the hooks directly
3. Ensure the user is authenticated (JWT token is set in axios)
4. The backend API is already configured at `/api/v1/announcements`
