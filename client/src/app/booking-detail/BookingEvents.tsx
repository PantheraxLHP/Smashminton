import { formatDate, formatPrice } from "@/lib/utils";
import { Icon } from "@iconify/react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

interface BookingEventsProps {
    zone: string,
    courtId: string,
    date: Date,
}

const BookingEvents: React.FC<BookingEventsProps> = ({
    zone,
    courtId,
    date,
}) => {
    return (
        <div className="flex flex-col gap-4">
            {/* Map events ở đây nè */}
            <div className="flex flex-col">
                <div className="h-3 rounded-t-lg bg-gray-500"></div>
                <div className="rounded=b-lg p-4 shadow-md border-l-2 border-r-2 border-b-2 flex flex-col gap-2">
                    <div className="text-lg flex items-center gap-4">
                        06:00 - 10:00
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:clock-outline" className="size-6" />
                            <span className="">4h</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon icon="material-symbols:attach-money-rounded" className="size-6" />
                            <span className="">{formatPrice(500000)}</span>
                        </div>
                    </div>
                    <div className="text-lg flex items-center gap-2">
                        <Icon icon="mdi:calendar-outline" className="size-6" />
                        <span className="">{formatDate(date || "")}</span>
                    </div>
                    <div className="text-lg flex items-center gap-2">
                        <Icon icon="ph:court-basketball" className="size-6" />
                        <span className="">Sân {courtId} (Zone {zone})</span>
                    </div>
                    <div className="text-lg flex items-center gap-2">
                        <Icon icon="lucide:user-round-check" className="size-6" />
                        <span className="">0123456789</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="h-3 rounded-t-lg bg-primary"></div>
                <div className="rounded=b-lg p-4 shadow-md border-l-2 border-r-2 border-b-2 flex flex-col gap-2">
                    <div className="text-lg flex items-center gap-4">
                        06:00 - 10:00
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:clock-outline" className="size-6" />
                            <span className="">4h</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon icon="material-symbols:attach-money-rounded" className="size-6" />
                            <span className="">{formatPrice(690000)}</span>
                        </div>
                    </div>
                    <div className="text-lg flex items-center gap-2">
                        <Icon icon="mdi:calendar-outline" className="size-6" />
                        <span className="">{formatDate(date || "")}</span>
                    </div>
                    <div className="text-lg flex items-center gap-2">
                        <Icon icon="ph:court-basketball" className="size-6" />
                        <span className="">Sân {courtId} (Zone {zone})</span>
                    </div>
                    <div className="text-lg flex items-center gap-2">
                        <Icon icon="lucide:user-round-check" className="size-6" />
                        <span className="">0123456789</span>
                    </div>
                    {/*Check length của sản phẩm vs dịch vụ ở đây để tạo Accordion*/}
                    <Accordion type="multiple" className="w-full">
                        {/*Check length của sản phẩm để tạo     AccordionItem*/}
                        <AccordionItem value="accordion-item-1" className="">
                            <AccordionTrigger className="text-lg !py-1 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Icon icon="mdi:package-variant-closed-check" className="size-6" />
                                    <span>10 Sản phẩm - {formatPrice(1000000)}</span>
                                </div>
                            </AccordionTrigger>
                            {/*Map data của sản phẩm ở đây nè*/}
                            <AccordionContent className="text-base">
                                {/*Map trong div nhé*/}
                                <div className="flex flex-col gap-1">
                                    <span>10 Chai nước suối Lavie - {formatPrice(150000)}</span>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        {/*Check length của dịch vụ để tạo AccordionItem*/}
                        <AccordionItem value="accordion-item-2" className="">
                            <AccordionTrigger className="text-lg !py-1 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Icon icon="mdi:package-variant" className="size-6" />
                                    <span>5 Dịch vụ - {formatPrice(400000)}</span>
                                </div>
                            </AccordionTrigger>
                            {/*Map data của dịch vụ ở đây nè*/}
                            <AccordionContent className="text-base">
                                {/*Map trong div nhé*/}
                                <div className="flex flex-col gap-1">
                                    <span>2 Vợt - {formatPrice(100000)}</span>
                                    <span>3 Giày - {formatPrice(300000)}</span>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="h-3 rounded-t-lg bg-yellow-500"></div>
                <div className="rounded=b-lg p-4 shadow-md border-l-2 border-r-2 border-b-2 flex flex-col gap-2">
                    <div className="text-lg flex items-center gap-4">
                        06:00 - 10:00
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:clock-outline" className="size-6" />
                            <span className="">4h</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon icon="material-symbols:attach-money-rounded" className="size-6" />
                            <span className="">{formatPrice(250000)}</span>
                        </div>
                    </div>
                    <div className="text-lg flex items-center gap-2">
                        <Icon icon="mdi:calendar-outline" className="size-6" />
                        <span className="">{formatDate(date || "")}</span>
                    </div>
                    <div className="text-lg flex items-center gap-2">
                        <Icon icon="ph:court-basketball" className="size-6" />
                        <span className="">Sân {courtId} (Zone {zone})</span>
                    </div>
                    <div className="text-lg flex items-center gap-2">
                        <Icon icon="lucide:user-round-check" className="size-6" />
                        <span className="">0123456789</span>
                    </div>
                    {/*Check length của sản phẩm vs dịch vụ ở đây để tạo Accordion*/}
                    <Accordion type="multiple" className="w-full">
                        {/*Check length của dịch vụ để tạo AccordionItem*/}
                        <AccordionItem value="accordion-item-2" className="">
                            <AccordionTrigger className="text-lg !py-1 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Icon icon="mdi:package-variant" className="size-6" />
                                    <span>5 Dịch vụ - {formatPrice(500000)}</span>
                                </div>
                            </AccordionTrigger>
                            {/*Map data của dịch vụ ở đây nè*/}
                            <AccordionContent className="text-base">
                                {/*Map trong div nhé*/}
                                <div className="flex flex-col gap-1">
                                    <span>1 Vợt - {formatPrice(50000)}</span>
                                    <span>4 Giày - {formatPrice(400000)}</span>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}

export default BookingEvents;