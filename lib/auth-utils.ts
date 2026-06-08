/**
 * 이메일 유효성 검사
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 유효성 검사
 * 최소 8자 이상 필수
 */
export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * 닉네임 유효성 검사
 * 2-30자, 영문/숫자/언더스코어만 허용
 */
export function validateUsername(username: string): boolean {
  if (username.length < 2 || username.length > 30) {
    return false;
  }
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return usernameRegex.test(username);
}

/**
 * 비밀번호 강도 평가
 * weak, medium, strong 중 하나 반환
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 8) {
    return 'weak';
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const strengthScore =
    (hasUpperCase ? 1 : 0) +
    (hasLowerCase ? 1 : 0) +
    (hasNumbers ? 1 : 0) +
    (hasSpecialChar ? 1 : 0);

  if (strengthScore >= 3) {
    return 'strong';
  }

  if (strengthScore >= 2) {
    return 'medium';
  }

  return 'weak';
}
