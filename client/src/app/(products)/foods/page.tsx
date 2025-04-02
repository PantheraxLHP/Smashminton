import FoodFilter from "@/app/(products)/foods/FoodFilter";
import FoodList from "@/app/(products)/foods/FoodList";

const FoodPage = () => {
    return (
        <div className="flex px-2 py-4 gap-4">
            <FoodFilter />
            <FoodList />
        </div>
    );
};

export default FoodPage;