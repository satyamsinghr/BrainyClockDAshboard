export function jwtDecode(token: string) {
  try {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isTokenExpired(exp: number) {
  const currentTimeInSecs = new Date().getTime() / 1000;
  return currentTimeInSecs < exp ? false : true;
}

export function expiredAt(exp: number) {
  const currentTimeInSecs = new Date().getTime() / 1000;
  if (currentTimeInSecs < exp) return 'Not expired';
  const diff = currentTimeInSecs - exp;
  // 2
  const hours = Math.floor(diff / 60 / 60);

  // 37
  const minutes = Math.floor(diff / 60) - hours * 60;

  // 42
  const seconds = Math.floor(diff % 60);
  const formatted =
    hours.toString().padStart(2, '0') +
    ':' +
    minutes.toString().padStart(2, '0') +
    ':' +
    seconds.toString().padStart(2, '0');
  return formatted;
}
