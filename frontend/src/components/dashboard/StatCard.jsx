const StatCard = ({ title, count, icon, colorClass }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5">
            <div className={`p-4 rounded-xl ${colorClass}`}>
                <span className="text-2xl">{icon}</span>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{count}</h3>
            </div>
        </div>
    );
};

export default StatCard;
