import { useQuery } from '@tanstack/react-query';
import type { SectorHeatmapData } from '@/lib/sectorHeatmapUtils';

interface SectorHeatmapResponse {
  data: SectorHeatmapData[];
  fetchedAt: string;
  error?: string;
}

export function useSectorHeatmap() {
  return useQuery({
    queryKey: ['sector-heatmap'],
    queryFn: async (): Promise<SectorHeatmapResponse> => {
      const response = await fetch('/api/stocks/sector-heatmap');
      if (!response.ok) {
        throw new Error('Failed to fetch sector heatmap');
      }
      return response.json();
    },
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 30 * 1000,
  });
}
