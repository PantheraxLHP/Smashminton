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
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
    page,
    setPage,
    totalPages,
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
                                if (page > 1) {
                                    setPage(page - 1);
                                }
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
                            <PaginationItem key={1}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === 1}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage(1);
                                    }}
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>
                        )
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
                        items.push(
                            <PaginationItem key={totalPages}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === totalPages}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage(totalPages);
                                    }}
                                >
                                    {totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    }

                    return items;
                })()} {/* Gọi hàm */}

                {page < totalPages && (
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (page < totalPages) {
                                    setPage(page + 1);
                                }
                            }}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}

export default PaginationComponent;