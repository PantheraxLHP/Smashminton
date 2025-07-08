import React from 'react';

interface PredictionTableProps {
    data: { id: string; name: string }[];
}

const PredictionTable: React.FC<PredictionTableProps> = ({ data }) => {
    return (
        <table className="min-w-full text-sm text-left border rounded-lg bg-white">
            <thead>
                <tr>
                    <th className="border px-4 py-2">Mã loại sản phẩm</th>
                    <th className="border px-4 py-2">Tên loại sản phẩm</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={`${item.id}-${index}`}>
                        <td className="border px-4 py-2">{item.id}</td>
                        <td className="border px-4 py-2">{item.name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PredictionTable;
