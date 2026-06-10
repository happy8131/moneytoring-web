-- Phase 3 Task 3-3: 포트폴리오 공유 및 팔로우 테이블

-- 공유 포트폴리오 테이블
CREATE TABLE IF NOT EXISTS portfolio_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  share_link TEXT UNIQUE NOT NULL,
  views_count INT DEFAULT 0,
  followers_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  CONSTRAINT portfolio_shares_title_not_empty CHECK (LENGTH(title) > 0)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_portfolio_shares_user_id ON portfolio_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_shares_is_public ON portfolio_shares(is_public);

-- RLS 활성화
ALTER TABLE portfolio_shares ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 공개 포트폴리오는 모두 읽기 가능, 비공개는 본인만 (기존 정책 먼저 삭제)
DROP POLICY IF EXISTS "portfolio_shares_read_public_or_own" ON portfolio_shares;
DROP POLICY IF EXISTS "portfolio_shares_insert_own" ON portfolio_shares;
DROP POLICY IF EXISTS "portfolio_shares_update_own" ON portfolio_shares;
DROP POLICY IF EXISTS "portfolio_shares_delete_own" ON portfolio_shares;

CREATE POLICY "portfolio_shares_read_public_or_own" ON portfolio_shares
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "portfolio_shares_insert_own" ON portfolio_shares
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "portfolio_shares_update_own" ON portfolio_shares
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "portfolio_shares_delete_own" ON portfolio_shares
  FOR DELETE USING (auth.uid() = user_id);

-- 팔로우 테이블
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  UNIQUE(follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

-- RLS 활성화
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모두 팔로우 정보 읽기 가능, 인증된 사용자만 팔로우/언팔로우 가능 (기존 정책 먼저 삭제)
DROP POLICY IF EXISTS "follows_read_all" ON follows;
DROP POLICY IF EXISTS "follows_insert_own" ON follows;
DROP POLICY IF EXISTS "follows_delete_own" ON follows;

CREATE POLICY "follows_read_all" ON follows
  FOR SELECT USING (true);

CREATE POLICY "follows_insert_own" ON follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "follows_delete_own" ON follows
  FOR DELETE USING (auth.uid() = follower_id);

-- 포트폴리오 벤치마킹 테이블
CREATE TABLE IF NOT EXISTS portfolio_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id_1 UUID NOT NULL REFERENCES portfolio_shares(id) ON DELETE CASCADE,
  portfolio_id_2 UUID NOT NULL REFERENCES portfolio_shares(id) ON DELETE CASCADE,
  similarity_score NUMERIC(5, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  UNIQUE(portfolio_id_1, portfolio_id_2),
  CONSTRAINT valid_similarity_score CHECK (similarity_score >= 0 AND similarity_score <= 100)
);

-- RLS 활성화
ALTER TABLE portfolio_benchmarks ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모두 읽기 가능 (기존 정책 먼저 삭제)
DROP POLICY IF EXISTS "portfolio_benchmarks_read_all" ON portfolio_benchmarks;

CREATE POLICY "portfolio_benchmarks_read_all" ON portfolio_benchmarks
  FOR SELECT USING (true);

-- 트리거: portfolio_shares.updated_at 자동 갱신
DROP TRIGGER IF EXISTS portfolio_shares_updated_at ON portfolio_shares;
DROP FUNCTION IF EXISTS update_portfolio_shares_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION update_portfolio_shares_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER portfolio_shares_updated_at BEFORE UPDATE ON portfolio_shares
  FOR EACH ROW EXECUTE FUNCTION update_portfolio_shares_updated_at();
