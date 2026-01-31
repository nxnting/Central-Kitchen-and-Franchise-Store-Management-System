import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook để xử lý logout
 * Xóa token khỏi localStorage và redirect về trang login
 */
export const useLogout = () => {
    const navigate = useNavigate();

    const logout = useCallback(() => {
        // Xóa tất cả thông tin auth từ localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');

        // Dispatch event để AuthContext cập nhật state
        window.dispatchEvent(new Event('auth-logout'));

        // Redirect về trang login
        navigate('/login', { replace: true });
    }, [navigate]);

    return { logout };
};

export default useLogout;
