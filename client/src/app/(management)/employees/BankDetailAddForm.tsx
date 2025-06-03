import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

const BankDetailAddForm = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-10 w-full">
                <div className="flex flex-col gap-1 w-full">
                    <Label
                        htmlFor="employee-banknumber"
                        className="text-xs font-semibold"
                    >
                        Số tài khoản ngân hàng
                    </Label>
                    <Input
                        id="employee-banknumber"
                        name="employee-banknumber"
                        type="text"
                        placeholder="Nhập số tài khoản ngân hàng"
                        className="w-full"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <Label
                        htmlFor="employee-bankholder"
                        className="text-xs font-semibold"
                    >
                        Tên chủ tài khoản
                    </Label>
                    <Input
                        id="employee-bankholder"
                        name="employee-bankholder"
                        type="text"
                        placeholder="Nhập tên chủ tài khoản"
                        className="w-full"
                        required
                    />
                </div>
            </div>
            <div className="flex gap-10 w-full">
                <div className="flex flex-col gap-1 w-full">
                    <span
                        className="text-xs font-semibold"
                    >
                        Tên ngân hàng
                    </span>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn ngân hàng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="vietcombank">Vietcombank</SelectItem>
                            <SelectItem value="techcombank">Techcombank</SelectItem>
                            <SelectItem value="bidv">BIDV</SelectItem>
                            <SelectItem value="agribank">Agribank</SelectItem>
                            <SelectItem value="sacombank">Sacombank</SelectItem>
                            <SelectItem value="vietinbank">VietinBank</SelectItem>
                            <SelectItem value="mbbank">MBBank</SelectItem>
                            <SelectItem value="acb">ACB</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col justify-end gap-1 h-full w-full">
                    <div className="flex items-center gap-2 w-full mb-3">
                        <Checkbox
                            id="employee-active"
                            name="employee-active"
                            className="cursor-pointer size-6"
                        />
                        <Label
                            htmlFor="employee-active"
                            className="cursor-pointer"
                        >
                            Được sử dụng để trả lương
                        </Label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BankDetailAddForm;