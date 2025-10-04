import { Suspense } from 'react';
import ResetPasswordOtpPage from '@/components/auth/ResetPasswordOtpPage';

export default function ResetPasswordOtp() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordOtpPage />
    </Suspense>
  );
}
