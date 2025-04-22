import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import './login.css';

export default defineComponent({
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const login = async (e: Event) => {
      e.preventDefault();
      
      try {
        // 로그인 API 호출
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username.value,
            password: password.value,
          }),
        });

        if (!response.ok) {
          throw new Error('로그인에 실패했습니다.');
        }

        const data = await response.json();

        // 토큰 저장
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);

        // 홈 페이지로 이동
        router.push('/');
      } catch (error) {
        console.error('로그인 오류:', error);
        errorMessage.value = '아이디 또는 비밀번호가 올바르지 않습니다.';
      }
    };

    // TSX 문법으로 템플릿 반환
    return () => (
      <div class="login-container">
        <div class="login-card">
          <h1 class="login-title">MMG</h1>
          <h2 class="login-subtitle">뭐먹지?</h2>
          
          <form onSubmit={login} class="login-form">
            <div class="form-group">
              <label>아이디</label>
              <input 
                type="text" 
                id="username" 
                v-model={username.value}
                placeholder="아이디를 입력하세요" 
                required
              />
            </div>
            
            <div class="form-group">
              <label>비밀번호</label>
              <input 
                type="password" 
                id="password" 
                v-model={password.value}
                placeholder="비밀번호를 입력하세요" 
                required
              />
            </div>
            
            {errorMessage.value && <div class="error-message">{errorMessage.value}</div>}
            
            <button type="submit" class="login-button">
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }
});