-- Phase 3 Task 3-2: 토론 게시판 테이블

-- 토론 테이블
CREATE TABLE IF NOT EXISTS discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  is_hot BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  CONSTRAINT discussions_title_not_empty CHECK (LENGTH(title) > 0),
  CONSTRAINT discussions_content_not_empty CHECK (LENGTH(content) > 0)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_discussions_symbol ON discussions(symbol);
CREATE INDEX IF NOT EXISTS idx_discussions_created_at ON discussions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_is_hot ON discussions(is_hot);

-- RLS 활성화
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;

-- RLS 정책 (기존 정책 먼저 삭제)
DROP POLICY IF EXISTS "discussions_read_all" ON discussions;
DROP POLICY IF EXISTS "discussions_insert_own" ON discussions;
DROP POLICY IF EXISTS "discussions_update_own" ON discussions;
DROP POLICY IF EXISTS "discussions_delete_own" ON discussions;

CREATE POLICY "discussions_read_all" ON discussions
  FOR SELECT USING (true);

CREATE POLICY "discussions_insert_own" ON discussions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "discussions_update_own" ON discussions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "discussions_delete_own" ON discussions
  FOR DELETE USING (auth.uid() = user_id);

-- 토론 댓글 테이블
CREATE TABLE IF NOT EXISTS discussion_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES discussion_comments(id) ON DELETE CASCADE,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  CONSTRAINT discussion_comments_content_not_empty CHECK (LENGTH(content) > 0)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_discussion_comments_discussion_id ON discussion_comments(discussion_id);
CREATE INDEX IF NOT EXISTS idx_discussion_comments_user_id ON discussion_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_discussion_comments_parent_id ON discussion_comments(parent_comment_id);

-- RLS 활성화
ALTER TABLE discussion_comments ENABLE ROW LEVEL SECURITY;

-- RLS 정책 (기존 정책 먼저 삭제)
DROP POLICY IF EXISTS "discussion_comments_read_all" ON discussion_comments;
DROP POLICY IF EXISTS "discussion_comments_insert_own" ON discussion_comments;
DROP POLICY IF EXISTS "discussion_comments_update_own" ON discussion_comments;
DROP POLICY IF EXISTS "discussion_comments_delete_own" ON discussion_comments;

CREATE POLICY "discussion_comments_read_all" ON discussion_comments
  FOR SELECT USING (true);

CREATE POLICY "discussion_comments_insert_own" ON discussion_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "discussion_comments_update_own" ON discussion_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "discussion_comments_delete_own" ON discussion_comments
  FOR DELETE USING (auth.uid() = user_id);

-- 트리거: discussions.updated_at 자동 갱신
DROP TRIGGER IF EXISTS discussions_updated_at ON discussions;
DROP FUNCTION IF EXISTS update_discussions_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION update_discussions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER discussions_updated_at BEFORE UPDATE ON discussions
  FOR EACH ROW EXECUTE FUNCTION update_discussions_updated_at();

-- 트리거: discussion_comments.updated_at 자동 갱신
DROP TRIGGER IF EXISTS discussion_comments_updated_at ON discussion_comments;
DROP FUNCTION IF EXISTS update_discussion_comments_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION update_discussion_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER discussion_comments_updated_at BEFORE UPDATE ON discussion_comments
  FOR EACH ROW EXECUTE FUNCTION update_discussion_comments_updated_at();
