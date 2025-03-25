import React from 'react';
import Image from 'next/image';

const path = '/banner.png';

const Banner = () => {
    return (
        <div className="container mx-auto my-8 max-w-full">
            <div className="flex flex-wrap justify-center gap-4">
                <Image src={path} alt="Banner 1" width={300} height={200} className="object-contain sm:w-1/3" />
                <Image src={path} alt="Banner 1" width={300} height={200} className="object-contain sm:w-1/3" />
            </div>
        </div>
    );
};

export default Banner;
