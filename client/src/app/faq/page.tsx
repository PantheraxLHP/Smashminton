import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function FAQPage() {
    return (
        <div className="container mx-auto flex max-w-3xl justify-center px-4 py-10">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Câu hỏi thường gặp</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Smashminton là gì?</AccordionTrigger>
                            <AccordionContent>
                                Smashminton là nền tảng đặt sân, quản lý sân cầu lông, thiết bị và sự kiện cầu lông trực
                                tuyến.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Làm thế nào để đặt sân?</AccordionTrigger>
                            <AccordionContent>
                                Bạn có thể đặt sân bằng cách đăng ký tài khoản, đăng nhập và chọn khung giờ, địa điểm
                                mong muốn.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Tôi có thể liên hệ ai khi cần hỗ trợ?</AccordionTrigger>
                            <AccordionContent>Vui lòng truy cập trang Liên hệ để được hỗ trợ.</AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
