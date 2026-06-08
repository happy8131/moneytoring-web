import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/app/actions/auth';

export type User = {
  id: string;
  email: string | undefined;
  username: string | undefined;
};

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      return await getUser();
    },
    staleTime: Infinity, // 사용자 정보는 수동으로만 무효화
    gcTime: Infinity, // 메모리에 계속 유지
  });

  return {
    user: user as User | null,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
