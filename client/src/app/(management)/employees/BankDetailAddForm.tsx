import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { postBankDetail } from '@/services/employees.service';
import { Loader2 } from 'lucide-react';

interface BankDetailAddFormProps {
    onSuccess: () => void;
    employeeId: number;
}

const BANKS = [
    { value: 'vietcombank', label: 'Vietcombank' },
    { value: 'techcombank', label: 'Techcombank' },
    { value: 'bidv', label: 'BIDV' },
    { value: 'agribank', label: 'Agribank' },
    { value: 'sacombank', label: 'Sacombank' },
    { value: 'vietinbank', label: 'VietinBank' },
    { value: 'mbbank', label: 'MBBank' },
    { value: 'acb', label: 'ACB' },
];

const BankDetailAddForm = ({ onSuccess, employeeId }: BankDetailAddFormProps) => {
    const [bankNumber, setBankNumber] = useState('');
    const [bankHolder, setBankHolder] = useState('');
    const [bankName, setBankName] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const result = await postBankDetail({
            employeeid: employeeId,
            banknumber: bankNumber,
            bankholder: bankHolder,
            bankname: bankName,
            isactive: isActive,
        });
        if (result.ok) {
            toast.success('Thêm thông tin ngân hàng thành công');
            onSuccess();
        } else {
            toast.error(result.message || 'Thêm thông tin ngân hàng thất bại');
        }
        setIsSubmitting(false);
    };

    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex w-full gap-10">
                <div className="flex w-full flex-col gap-1">
                    <Label htmlFor="employee-banknumber" className="text-xs font-semibold">
                        Số tài khoản ngân hàng
                    </Label>
                    <Input
                        id="employee-banknumber"
                        name="employee-banknumber"
                        type="text"
                        placeholder="Nhập số tài khoản ngân hàng"
                        className="w-full"
                        required
                        value={bankNumber}
                        onChange={(e) => setBankNumber(e.target.value)}
                    />
                </div>
                <div className="flex w-full flex-col gap-1">
                    <Label htmlFor="employee-bankholder" className="text-xs font-semibold">
                        Tên chủ tài khoản
                    </Label>
                    <Input
                        id="employee-bankholder"
                        name="employee-bankholder"
                        type="text"
                        placeholder="Nhập tên chủ tài khoản"
                        className="w-full"
                        required
                        value={bankHolder}
                        onChange={(e) => setBankHolder(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex w-full gap-10">
                <div className="flex w-full flex-col gap-1">
                    <span className="text-xs font-semibold">Tên ngân hàng</span>
                    <Select value={bankName} onValueChange={setBankName}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn ngân hàng" />
                        </SelectTrigger>
                        <SelectContent>
                            {BANKS.map((bank) => (
                                <SelectItem key={bank.value} value={bank.value}>
                                    {bank.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex h-full w-full flex-col justify-end gap-1">
                    <div className="mb-3 flex w-full items-center gap-2">
                        <Checkbox
                            id="employee-active"
                            name="employee-active"
                            className="size-6 cursor-pointer"
                            checked={isActive}
                            onCheckedChange={(checked) => setIsActive(!!checked)}
                        />
                        <Label htmlFor="employee-active" className="cursor-pointer">
                            Được sử dụng để trả lương
                        </Label>
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-end gap-2">
                <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                        setBankNumber('');
                        setBankHolder('');
                        setBankName('');
                        setIsActive(false);
                    }}
                >
                    Hủy
                </Button>
                <Button variant="outline" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Lưu'}
                    <span className="sr-only">Lưu</span>
                </Button>
            </div>
        </form>
    );
};

export default BankDetailAddForm;
