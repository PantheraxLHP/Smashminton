import { Icon } from "@iconify/react";
import { useState } from "react";

interface MaskedFieldProps {
    value: string;
}

const maskfield = (value: string) => {
    if (value.length <= 4) return "X".repeat(value.length);
    const maskedValue = value.replace(/(?<=.{2}).(?=.{2})/g, "X");
    return maskedValue;
}

const MaskedField: React.FC<MaskedFieldProps> = ({
    value,
}) => {
    const [isRevealed, setIsRevealed] = useState(false);
    return (
        <div className="flex items-center gap-5">
            <span className="text-sm">
                {isRevealed ? value : maskfield(value)}
            </span>
            <Icon
                icon={isRevealed ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                className={`size-5 cursor-pointer hover:text-primary`}
                onClick={() => setIsRevealed(!isRevealed)}
            />
        </div>
    );
};

export default MaskedField;