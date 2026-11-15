import {
  IconBuildingBank,
  IconBriefcase,
  IconHeart,
  IconHeartHandshake,
  IconHome,
  IconPlane,
  IconSchool,
} from '@tabler/icons-react';

const icons = [IconBuildingBank, IconHeart, IconHome, IconBriefcase, IconPlane, IconSchool, IconHeartHandshake];

export function GoalCategoryIcon({ index, size = 21 }: { index: number; size?: number }) {
  const Icon = icons[index % icons.length];
  return <Icon size={size} aria-hidden="true" />;
}
