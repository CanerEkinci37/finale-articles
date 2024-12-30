import { meApi } from '../api/me'
import { useState, useEffect } from 'react';
import { UserRead } from '../types/User';
import Navbar from '../components/Navbar';

const Me = () => {
    const [currentUser, setCurrentUser] = useState<UserRead | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await meApi.getMe();
            setCurrentUser(user);
        };
        fetchUser();
    }, []);

  return (
    <div>
        <Navbar />
      <h1>Me</h1>
      <p>User ID: {currentUser?.id}</p>
      <p>User Name: {currentUser?.username}</p>
      <p>User Email: {currentUser?.email}</p>
    </div>
  )
}

export default Me
