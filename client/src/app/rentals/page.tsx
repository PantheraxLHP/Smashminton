import RentalFilter from './RentalFilter';
import RentalList from './RentalList';

export default function RentalsPage() {
    return (
        <div className="max-w-8xl mx-auto px-4 py-6 md:px-8 lg:px-12">
            <div className="flex flex-col gap-2 lg:flex-row">
                {/* Filter bên trái */}
                <aside className="w-full pt-2 lg:w-1/4">
                    <RentalFilter />
                </aside>

                {/* Danh sách sản phẩm bên phải */}
                <main className="w-full pt-4 lg:w-3/4">
                    <RentalList />
                </main>
            </div>
        </div>
    );
}
