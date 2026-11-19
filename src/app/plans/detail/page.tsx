import { Suspense } from 'react';
import { PlanDetailTemplate } from '@features/Plan/views/templates/PlanDetail.template';

export default function PlanDetailPage() {
  return (
    <Suspense fallback={null}>
      <PlanDetailTemplate />
    </Suspense>
  );
}
