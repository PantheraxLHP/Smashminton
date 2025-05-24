import {
    Pagination,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
    PaginationContent,
} from "@/components/ui/pagination";

interface PaginationComponentProps {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    onNextPage?: () => void;
    onPreviousPage?: () => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
    page,
    setPage,
    totalPages,
    onNextPage,
    onPreviousPage,
}) => {
    return (
        <Pagination className="flex justify-end">
            <PaginationContent>
                {page > 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onPreviousPage?.();
                            }}
                        />
                    </PaginationItem>
                )}

                {(() => {
                    const items = [];
                    let start = Math.max(1, page - 2);
                    let end = Math.min(totalPages, page + 2);

                    if (end - start < 4) {
                        if (start === 1) {
                            end = Math.min(totalPages, start + 4);
                        } else if (end === totalPages) {
                            start = Math.max(1, end - 4);
                        }
                    }

                    if (start > 1) {
                        items.push(
                            <PaginationItem key="start-ellipsis">
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    for (let i = start; i <= end; i++) {
                        items.push(
                            <PaginationItem key={i}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === i}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage(i);
                                    }}
                                >
                                    {i}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }

                    if (end < totalPages) {
                        items.push(
                            <PaginationItem key="end-ellipsis">
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    return items;
                })()} {/* Gọi hàm */}

                {page < totalPages && (
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onNextPage?.();
                            }}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}

export default PaginationComponent;