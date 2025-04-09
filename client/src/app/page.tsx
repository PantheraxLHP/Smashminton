// import Banner from './_homepage/banner';
import dynamic from 'next/dynamic';

const Categories = dynamic(() => import('./_homepage/categories'));
const FeaturedCourts = dynamic(() => import('./_homepage/featured-zones'));
const HeroSection = dynamic(() => import('./_homepage/hero-section'));

export default function Page() {
    return (
        <div className="container min-w-full">
            <HeroSection />
            <FeaturedCourts />
            <Categories />
        </div>
    );
}
