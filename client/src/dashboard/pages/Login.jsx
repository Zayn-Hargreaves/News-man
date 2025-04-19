import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import storeContext from '../../context/storeContext';
import authAdminService from '../../service/authAdminService';

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(storeContext);
  const [loader, setLoader] = useState(false);

  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const { data } = await authAdminService.login(state);
      setLoader(false);
      document.cookie = `accessToken=${data.metadata.metadata.tokens.accessToken}; SameSite=Strict; Max-Age=7200; Path=/admin`;
      document.cookie = `refreshToken=${data.metadata.metadata.tokens.refreshToken}; SameSite=Strict; Max-Age=${7*24*60*60}; Path=/admin`;

      localStorage.setItem("AccountInfo", JSON.stringify(data.metadata.metadata.account))
      localStorage.setItem("Permissions", JSON.stringify(data.metadata.metadata.permissions))
      localStorage.setItem("Group", JSON.stringify(data.metadata.metadata.group))
      localStorage.setItem("PrivateKey", JSON.stringify(data.metadata.metadata.privateKey))

      toast.success(data.message);
      dispatch({
        type: 'login_success',
        payload: {
          account: data.metadata.metadata.account,
          token: data.metadata.metadata.tokens,
          privateKey: data.metadata.metadata.privateKey,
          permissions: data.metadata.metadata.permissions,
          group: data.metadata.metadata.group,
        },
      });

      navigate('/admin/dashboard');
    } catch (error) {
      setLoader(false);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='min-w-screen min-h-screen bg-slate-200 flex justify-center items-center'>
      <div className='w-[340px] text-slate-600 shadow-md'>
        <div className='bg-white h-full px-7 py-8 rounded-md'>
          <div className='w-full justify-center items-center flex'>
            <img
              className='w-[200px]'
              src="../../../public/logo.png"
              alt="logo"
            />
          </div>
          <form onSubmit={submit} className='mt-8'>
            <div className='flex flex-col gap-y-2'>
              <label className='text-md font-medium text-gray-600' htmlFor="email">
                Email
              </label>
              <input
                value={state.email}
                required
                onChange={inputHandle}
                type="email"
                placeholder="email"
                name="email"
                className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-green-500 h-10"
                id="email"
              />
            </div>
            <div className='flex flex-col gap-y-2'>
              <div className='flex flex-col gap-y-2'>
                <label className='text-md font-medium text-gray-600' htmlFor="password">
                  Password
                </label>
                <input
                  onChange={inputHandle}
                  required
                  value={state.password}
                  type="password"
                  placeholder="password"
                  name="password"
                  className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-green-500 h-10"
                  id="password"
                />
              </div>
            </div>
            <div className='mt-4'>
              <button
                disabled={loader}
                className="px-3 py-[6px] w-full bg-purple-500 rounded-sm text-white hover:bg-purple-600"
              >
                {loader ? 'loading...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
