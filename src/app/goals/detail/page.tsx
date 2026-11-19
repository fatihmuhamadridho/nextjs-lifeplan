import { Suspense } from 'react';
import { GoalDetailTemplate } from '@features/Goal/views/templates/GoalDetail.template';

export default function GoalDetailPage() {
  return (
    <Suspense fallback={null}>
      <GoalDetailTemplate />
    </Suspense>
  );
}
