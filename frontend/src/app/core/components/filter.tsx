import FilterIcon from '~/assets/filterIcon.svg';

export const Filter = () => {
    return (
        <div className="flex gap-5 mb-5">
            <p className="font-bold text-lg">Filter</p>
            <img src={`${FilterIcon}`} />
        </div>
    );
};
