import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  public handleReset = () => {
    try {
      localStorage.removeItem('rapeephat_chat_sessions_master_v2');
      localStorage.removeItem('rapeephat_chat_sessions_master_v1');
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">ระบบกำลังรีเฟรชข้อมูล</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                ระบบได้รีเซ็ตแคชหน้าจอให้เรียบร้อยแล้ว กดปุ่มด้านล่างเพื่อกลับเข้าสู่หน้าจอตามปกติได้เลยค่ะ
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>รีเฟรชเข้าใช้งานทันที</span>
              </button>

              <button
                onClick={() => {
                  window.location.hash = '';
                  window.location.reload();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                <span>กลับสู่หน้าแรกเว็บไซต์</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
