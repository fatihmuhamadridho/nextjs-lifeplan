'use client';

import { useGetProfile } from '@core/User/infrastructure/account.hook';
import { DashboardTemplate } from '../templates/Dashboard.template';

const DashboardPage = () => {
  const { data: profileResponse } = useGetProfile();
  const fullName = profileResponse?.data.name ?? 'Guest User';
  const avatarLabel = fullName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return <DashboardTemplate userName={fullName} avatarLabel={avatarLabel || 'GU'} />;
};

export default DashboardPage;
