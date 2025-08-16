import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const CoinBalance = () => {
    const { coinBalance, token } = useContext(ShopContext);

    if (!token) return null;

    return (
        <Link to="/coins" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-xl">🪙</span>
            <span className="font-medium text-gray-700">{coinBalance}</span>
        </Link>
    );
};

export default CoinBalance;
