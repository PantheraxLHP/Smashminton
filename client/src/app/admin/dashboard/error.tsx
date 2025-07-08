'use client';

import DashboardError from './DashboardError';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return <DashboardError error={error} reset={reset} />;
}
