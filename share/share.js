(() => {
  const id = new URLSearchParams(location.search).get('post');
  const valid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '');
  const message = document.getElementById('message');
  const open = document.getElementById('open');
  const android = document.getElementById('android');
  const ios = document.getElementById('ios');
  const appStoreUrl = window.ROUTINETALK_SHARE_CONFIG?.appStoreUrl || '';
  const hasAppStore = /^https:\/\/apps\.apple\.com\/[^\s]*\/id\d+/.test(appStoreUrl);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (hasAppStore) {
    ios.href = appStoreUrl;
    ios.hidden = false;
  }
  if (!valid) {
    message.textContent = '올바르지 않은 게시글 링크입니다.';
    return;
  }

  const scheme = `routinetalk://post/${id}`;
  open.href = isAndroid
    ? `intent://post/${id}#Intent;scheme=routinetalk;package=com.nooklabs.routinetalk;S.browser_fallback_url=${encodeURIComponent(android.href)};end`
    : scheme;
  open.hidden = false;

  if (isIOS) {
    android.hidden = true;
    if (!hasAppStore) message.textContent = '공유받은 게시글을 루틴톡에서 확인해보세요. 앱이 설치되어 있다면 아래 버튼을 눌러주세요.';
  }

  // 미설치 시 열리는 웹페이지에서는 스토어로 이동한다.
  // 앱 전환으로 페이지가 숨겨지거나 사용자가 버튼을 누르면 예약을 취소한다.
  const store = isAndroid ? android.href : isIOS && hasAppStore ? appStoreUrl : null;
  if (store) {
    const timer = setTimeout(() => {
      if (document.visibilityState === 'visible') location.replace(store);
    }, 2500);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearTimeout(timer);
    });
    document.addEventListener('click', () => clearTimeout(timer), { once: true });
    window.addEventListener('pagehide', () => clearTimeout(timer), { once: true });
  }
})();
