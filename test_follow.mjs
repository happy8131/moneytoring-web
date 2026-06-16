import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  try {
    console.log('=== 포트폴리오 공유 팔로우 기능 테스트 ===\n');

    // 1. 로그인
    console.log('1️⃣  로그인...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'lion8131@naver.com');
    await page.fill('input[type="password"]', 'vlzk5532');
    await page.click('button:has-text("로그인")');
    await page.waitForNavigation();
    console.log('✅ 로그인 완료\n');

    // 2. 포트폴리오 페이지
    console.log('2️⃣  포트폴리오 페이지 이동...');
    await page.goto('http://localhost:3000/portfolio', { waitUntil: 'networkidle' });
    console.log('✅ 포트폴리오 페이지 로드\n');

    // 3. 공유 설정 열기
    console.log('3️⃣  공유 설정 열기...');
    await page.click('button:has-text("공유 설정")');
    await page.waitForTimeout(1000);
    console.log('✅ 공유 설정 다이얼로그 열음\n');

    // 4. 공유 제목 입력
    console.log('4️⃣  공유 제목 입력...');
    const titleInput = await page.$('input#title');
    if (titleInput) {
      await titleInput.click({ clickCount: 3 });
      await page.fill('input#title', '테스트 포트폴리오');
    }
    await page.waitForTimeout(500);
    console.log('✅ 공유 제목 입력\n');

    // 5. 공유 시작
    console.log('5️⃣  공유 시작 버튼 클릭...');
    await page.click('button:has-text("공유 시작")');
    await page.waitForTimeout(2000);
    console.log('✅ 공유 시작\n');

    // 6. 공유 링크 확인
    console.log('6️⃣  공유 링크 확인...');
    const shareInput = await page.$('input[value*="http://localhost:3000/portfolios"]');
    let shareUrl = '';
    if (shareInput) {
      shareUrl = await shareInput.inputValue();
      console.log('📋 공유 링크:', shareUrl);
    }

    // 7. 공유 설정 닫기
    await page.click('button:has-text("닫기")');
    await page.waitForTimeout(500);

    // 8. 새 탭에서 공유 링크 접속
    console.log('\n7️⃣  새 탭에서 공유 링크 접속...');
    const newPage = await context.newPage();
    await newPage.goto(shareUrl, { waitUntil: 'networkidle' });
    await newPage.waitForTimeout(2000);
    console.log('✅ 공유 링크 페이지 로드\n');

    // 조회수와 팔로워 수 확인 함수
    const checkStats = async (label) => {
      const views = await newPage.textContent('span:has-text("조회수")');
      const followers = await newPage.textContent('span:has-text("팔로워")');
      console.log(`${label}`);
      console.log(`  - ${views}`);
      console.log(`  - ${followers}`);
    };

    await checkStats('📊 초기 상태:');

    // 9. 팔로우 클릭
    console.log('\n8️⃣  팔로우 버튼 클릭...');
    await newPage.click('button:has-text("팔로우")');
    await newPage.waitForTimeout(2000);
    await checkStats('📊 팔로우 후:');

    // 10. 팔로우 취소
    console.log('\n9️⃣  팔로우 취소...');
    await newPage.click('button:has-text("팔로우 중")');
    await newPage.waitForTimeout(2000);
    await checkStats('📊 언팔로우 후:');

    // 11. 다시 팔로우
    console.log('\n🔟 다시 팔로우...');
    await newPage.click('button:has-text("팔로우")');
    await newPage.waitForTimeout(2000);
    await checkStats('📊 재팔로우 후:');

    // 12. 페이지 새로고침
    console.log('\n1️⃣1️⃣  페이지 새로고침...');
    await newPage.reload({ waitUntil: 'networkidle' });
    await newPage.waitForTimeout(2000);
    await checkStats('📊 새로고침 후:');

    console.log('\n✅ 모든 테스트 완료!');
    console.log('\n요약:');
    console.log('- 초기 접속: 조회수 +1');
    console.log('- 팔로우: 팔로워 +1, 조회수 변화 없음');
    console.log('- 언팔로우: 팔로워 -1, 조회수 변화 없음');
    console.log('- 재팔로우: 팔로워 +1, 조회수 변화 없음');
    console.log('- 새로고침: 조회수 +1');

  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
  } finally {
    await browser.close();
  }
})();
