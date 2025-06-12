import HistoryDetailClient from './HistoryDetailClient';

export const dynamic = 'force-dynamic';

interface HistoryDetailPageProps {
  params: {
    historyId: string;
  };
}

export default function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  return <HistoryDetailClient params={params} />;
}