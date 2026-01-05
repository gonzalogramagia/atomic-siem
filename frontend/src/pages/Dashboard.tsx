import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium">Total Logs (24h)</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium">Active Alerts</h3>
                <p className="text-3xl font-bold text-red-600 mt-2">5</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium">Active Rules</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
            </div>
        </div>
    );
};

export default Dashboard;
