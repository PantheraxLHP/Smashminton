import ServiceFilter from './ServiceFilter';
import ServiceList from './ServiceList';

export default function ServicesPage() {
    return (
        <div className="px-4 md:px-8 lg:px-12 py-6 max-w-8xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-2">
                {/* Filter bên trái */}
                <aside className="w-full lg:w-1/4 pt-2">
                    <ServiceFilter />
                </aside>

                {/* Danh sách sản phẩm bên phải */}
                <main className="w-full lg:w-3/4 pt-4">
                    <ServiceList />
                </main>
            </div>
        </div>
    );
}
