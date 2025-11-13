import type { IUser } from "@/types";
import Profile from "./components/Profile";

export default function ProfilePage() {
  const user : IUser = {
    _id: '1',
    firstname: 'Omar',
    lastname: 'Wael',
    email: 'omar@example.com',
    photoURL: '',
    role: 'user',
    phone: '+20123456789',
    location: 'Cairo, Egypt',
    tokenBalance: 120,
    createdAt: new Date(),
  };

  return (
    <div className="">
      <Profile user={user} />
    </div>
  );
}
