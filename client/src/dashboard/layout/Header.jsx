import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import profile from '../../assets/profile.png';
import storeContext from '../../context/storeContext';

const Header = () => {
  const { store } = useContext(storeContext);
  const navigate = useNavigate(); // Khởi tạo navigate

  const handleProfileClick = () => {
    navigate('/admin/profile'); // Điều hướng đến /admin/profile
  };

  return (
    <div className='pl-4 sticky top-0 z-50 w-full max-w-[calc(100vw-285px)]'>
      <div className='w-full rounded h-[70px] flex justify-between items-center p-4 bg-white shadow'>
        <input
          type="text"
          placeholder="search"
          className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-green-500 h-10"
        />
        <div className="mr-4">
          <div className="flex gap-x-2">
            <div className="flex flex-col justify-center items-end">
              <span>{store.userInfo?.name}</span>
              <span>{store.userInfo?.role}</span>
            </div>
            {/* Bọc img trong một thẻ button hoặc thẻ div có sự kiện onClick */}
            <img
              className="w-10 h-10 rounded-full cursor-pointer"
              src={profile}
              alt="Profile"
              onClick={handleProfileClick} // Gắn sự kiện onClick
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
