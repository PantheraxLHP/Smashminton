// import Banner from './_homepage/banner';
import Categories from './_homepage/categories';
import FeaturedCourts from './_homepage/featured-courts';
import HeroSection from './_homepage/hero-section';

export default function Page() {
    return (
        <div className="container min-w-full">
            <HeroSection />
            <FeaturedCourts />
            <Categories />
            {/* <Banner /> */}
        </div>
    );
}
