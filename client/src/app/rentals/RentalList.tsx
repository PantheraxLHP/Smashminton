// components/ServiceList.tsx
'use client';

const mockItems = Array.from({ length: 12 }, (_, index) => ({
    id: index,
    name: 'Vợt Yonex Nanoflare 001F 2025',
    image: '/ZoneC.png',
    price: '34,000 đ / giờ',
}));

export default function RentalList() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 flex-1">
            {mockItems.map((item) => (
                <div
                    key={item.id}
                    className="p-2 text-center flex flex-col items-center"
                >
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-40 object-contain mb-2"
                    />
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-primary-600 font-semibold">{item.price}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <button className="px-2 border rounded">-</button>
                        <span>0</span>
                        <button className="px-2 border rounded">+</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
