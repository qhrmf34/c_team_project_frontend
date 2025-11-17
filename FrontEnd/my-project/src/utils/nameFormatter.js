export function formatMemberName(userInfo) {
  if (!userInfo) return 'Guest';
  
  const { provider, firstName, lastName, email } = userInfo;
  
  // leave: 탈퇴한 회원 (firstName만 반환)
  if (provider === 'leave') {
    return firstName || '탈퇴한 회원';
  }
  
  // local: firstName + lastName (이름 + 성)
  if (provider === 'local') {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (firstName) return firstName;
    if (lastName) return lastName;
    if (email) return email.split('@')[0];
    return 'User';
  }
  
  // google: lastName + firstName (성 + 이름)
  if (provider === 'google') {
    if (lastName && firstName) {
      return `${lastName} ${firstName}`;
    }
    if (firstName) return firstName;
    if (lastName) return lastName;
    if (email) return email.split('@')[0];
    return 'Google User';
  }
  
  // kakao: firstName만
  if (provider === 'kakao') {
    return firstName || email?.split('@')[0] || 'Kakao User';
  }
  
  // naver: firstName만
  if (provider === 'naver') {
    return firstName || email?.split('@')[0] || 'Naver User';
  }
  
  // 기타
  return firstName || 'Anonymous';
}