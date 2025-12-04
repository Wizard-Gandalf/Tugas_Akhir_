// src/components/layout/LayoutWrapper.jsx
export default function LayoutWrapper({ children }) {
    return (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
            {children}
        </div>
    );
}
