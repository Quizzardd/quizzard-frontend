import { useState } from 'react';
import { useParams } from 'react-router';
import { useGroupAnnouncements } from '@/hooks/useAnnouncement';
import AnnouncementCard from './components/AnnouncementCard';
import CreateAnnouncementButton from './components/CreateAnnouncementButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

const Announcements = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useGroupAnnouncements(groupId!, {
    page,
    limit: 10,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Error loading announcements. Please try again.
      </div>
    );
  }

  const announcements = data?.announcements || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <CreateAnnouncementButton groupId={groupId!} />

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search announcements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No announcements yet.</p>
            <p className="text-sm mt-2">Be the first to post one!</p>
          </div>
        ) : (
          announcements
            .filter((announcement) =>
              searchQuery
                ? announcement.text.toLowerCase().includes(searchQuery.toLowerCase())
                : true,
            )
            .map((announcement) => (
              <AnnouncementCard key={announcement._id} announcement={announcement} />
            ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Announcements;
