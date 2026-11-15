'use client';

import { useEffect } from 'react';
import { useUserContext } from '@contexts/user.context';
import { useGetDetailUser } from '@core/infrastructure/user.hook';
import { DashboardTemplate } from '../templates/Dashboard.template';

const DashboardPage = () => {
  const { state, setState } = useUserContext();
  const { data: userData } = useGetDetailUser({ id: '1' });
  const fullName = `${state?.data?.firstName ?? ''} ${state?.data?.lastName ?? ''}`.trim() || 'Guest User';
  const avatarSrc = state?.data?.image;
  const avatarLabel = `${state?.data?.firstName?.[0] ?? ''}${state?.data?.lastName?.[0] ?? ''}`.trim() || 'GU';

  useEffect(() => {
    if (userData) setState(userData);
  }, [setState, userData]);

  return <DashboardTemplate userName={fullName} avatarSrc={avatarSrc} avatarLabel={avatarLabel} />;
};

export default DashboardPage;
