'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect('/');
}

export async function register(email: string, password: string, username: string) {
  const supabase = await createClient();

  // 1. 닉네임 중복 확인
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single();

  if (existingUser) {
    throw new Error('이미 사용 중인 닉네임입니다');
  }

  // 2. 회원가입
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    throw new Error(signUpError.message);
  }

  if (!authData.user) {
    throw new Error('회원가입 중 오류가 발생했습니다');
  }

  // 3. 자동 로그인 (세션 설정)
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error('자동 로그인 오류:', signInError);
    // 로그인 실패해도 계속 진행 (프로필은 생성하되, 수동 로그인 필요)
  }

  // 4. 프로필 생성
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    username,
  });

  if (profileError) {
    console.error('프로필 생성 오류:', profileError);
    throw new Error(`프로필 생성 중 오류: ${profileError.message}`);
  }

  redirect('/');
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  redirect('/login');
}

export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // 프로필 정보 조회 (실패해도 계속 진행)
  let username: string | undefined;
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    if (!error && profile) {
      username = profile.username;
    }
  } catch (err) {
    console.error('프로필 조회 에러 (무시함):', err);
  }

  return {
    id: user.id,
    email: user.email,
    username,
  };
}

export async function checkUsernameExists(username: string): Promise<boolean> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single();

  return !!data;
}
