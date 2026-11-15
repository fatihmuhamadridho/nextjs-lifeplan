'use client';

import { CmsDialog } from '@components/CmsDialog';
import styles from './VisionDialog.module.css';

export function VisionDialog({ onClose }: { onClose: () => void }) {
  return (
    <CmsDialog
      title="Edit Life Vision"
      description="Update your long-term vision, target age, and statement."
      actionLabel="Save Changes"
      onClose={onClose}
      onSubmit={onClose}
    >
      <label>
        Vision Statement / Title
        <input defaultValue="Financial Freedom at 60" maxLength={60} />
      </label>
      <label>
        Vision Description &amp; Details
        <textarea
          defaultValue="Have enough passive income to live comfortably, travel with family, and help others. Live a healthy and meaningful life."
          maxLength={280}
        />
      </label>
      <GroupFields />
      <label>
        Cover Banner Style
        <select defaultValue="Horizon Line">
          <option>Horizon Line</option>
          <option>Sunrise</option>
          <option>Minimal Gradient</option>
        </select>
      </label>
    </CmsDialog>
  );
}

function GroupFields() {
  return (
    <div className={styles.targets}>
      <label>
        Target Age
        <input type="number" defaultValue={60} />
      </label>
      <label>
        Target Year
        <input type="number" defaultValue={2056} />
      </label>
    </div>
  );
}
