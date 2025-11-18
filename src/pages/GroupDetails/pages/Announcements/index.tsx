import AnnouncementCard from './components/AnnouncementCard';
import CreateAnnouncementButton from './components/CreateAnnouncementButton';

const Announcements = () => {
  return (
    <div className="">
      <CreateAnnouncementButton />
      <AnnouncementCard />
    </div>
  );
};

export default Announcements;
