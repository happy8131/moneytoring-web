import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      console.warn('[조회수] ID 누락');
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

    if (fetchError) {
      console.error('[조회수] 조회 실패:', fetchError);
      return Response.json(
        { error: '토론을 찾을 수 없습니다', details: fetchError.message },
        { status: 404 }
      );
    }

    if (!discussion) {
      console.warn('[조회수] 토론 미존재:', id);
      return Response.json(
        { error: '토론을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const newCount = (discussion.views_count || 0) + 1;
    console.log(`[조회수] 업데이트 시도: ${id}, ${discussion.views_count} → ${newCount}`);

    const { error: updateError } = await supabase
      .from('discussions')
      .update({ views_count: newCount })
      .eq('id', id);

    if (updateError) {
      console.error('[조회수] 업데이트 실패:', updateError);
      return Response.json(
        { error: '조회수 증가 실패', details: updateError.message },
        { status: 500 }
      );
    }

    console.log(`[조회수] 성공: ${id} (${newCount})`);
    revalidatePath(`/discussions/${id}`);
    revalidatePath('/discussions');

    return Response.json({ success: true, views_count: newCount });
  } catch (error) {
    console.error('[조회수] 예외 발생:', error);
    return Response.json(
      { error: '조회수 증가 실패', details: String(error) },
      { status: 500 }
    );
  }
}
