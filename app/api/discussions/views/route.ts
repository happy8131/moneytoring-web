import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return Response.json(
        { error: '토론 ID가 필요합니다' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: discussion, error: fetchError } = await supabase
      .from('discussions')
      .select('views_count')
      .eq('id', id)
      .single();

    if (fetchError || !discussion) {
      return Response.json(
        { error: '토론을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const { error: updateError } = await supabase
      .from('discussions')
      .update({ views_count: (discussion.views_count || 0) + 1 })
      .eq('id', id);

    if (updateError) {
      console.error('조회수 증가 실패:', updateError);
      return Response.json(
        { error: '조회수 증가 실패' },
        { status: 500 }
      );
    }

    revalidatePath(`/discussions/${id}`);
    revalidatePath('/discussions');

    return Response.json({ success: true });
  } catch (error) {
    console.error('조회수 증가 실패:', error);
    return Response.json(
      { error: '조회수 증가 실패' },
      { status: 500 }
    );
  }
}
