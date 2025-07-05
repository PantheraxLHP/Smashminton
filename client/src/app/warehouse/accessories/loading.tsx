export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="border-primary-500 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
    );
}
