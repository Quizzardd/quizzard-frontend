import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useGroupAnnouncements } from '@/hooks/useAnnouncement';
import AnnouncementCard from './components/AnnouncementCard';
import CreateAnnouncementButton from './components/CreateAnnouncementButton';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useGroupContext } from '../../contexts/GroupContext';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type PaginationEntry = number | 'dots';

const buildPaginationItems = (currentPage: number, pages: number): PaginationEntry[] => {
  if (pages <= 0) return [];

  const siblingCount = 1;
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPageNumbers >= pages) {
    return Array.from({ length: pages }, (_, index) => index + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, pages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < pages - 2;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + siblingCount * 2;
    const leftRange = Array.from({ length: leftItemCount }, (_, index) => index + 1);
    return [...leftRange, 'dots', pages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + siblingCount * 2;
    const start = pages - rightItemCount + 1;
    const rightRange = Array.from({ length: rightItemCount }, (_, index) => start + index);
    return [1, 'dots', ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, index) => leftSiblingIndex + index,
  );

  return [1, 'dots', ...middleRange, 'dots', pages];
};

const Announcements = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { isTeacher } = useGroupContext();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useGroupAnnouncements(groupId!, {
    page,
    limit: 5,
  });
  console.log('data: ', data);
  const announcements = data?.announcements || [];
  const pages = data?.pages || 1;
  console.log('total pages:', pages);
  const paginationItems = useMemo(() => buildPaginationItems(page, pages), [page, pages]);

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page || nextPage < 1 || nextPage > pages) return;
    setPage(nextPage);
  };

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

  return (
    <div className="space-y-6">
      {isTeacher && <CreateAnnouncementButton groupId={groupId!} />}

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
      {pages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={page === 1}
                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                onClick={(event) => {
                  event.preventDefault();
                  handlePageChange(page - 1);
                }}
              />
            </PaginationItem>

            {paginationItems.map((item, index) => (
              <PaginationItem key={`${item}-${index}`}>
                {item === 'dots' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={item === page}
                    onClick={(event) => {
                      event.preventDefault();
                      handlePageChange(item);
                    }}
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={page === pages}
                className={page === pages ? 'pointer-events-none opacity-50' : ''}
                onClick={(event) => {
                  event.preventDefault();
                  handlePageChange(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Announcements;
