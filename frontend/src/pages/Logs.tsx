import React from 'react';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import type { Log } from '../types';
import { Loader2, AlertCircle } from 'lucide-react';

const Logs: React.FC = () => {
    const { data: logs, isLoading, error } = useQuery<Log[]>({
        queryKey: ['logs'],
        queryFn: async () => {
            const response = await client.get('/logs');
            return response.data;
        },
        refetchInterval: 5000, // Poll every 5 seconds
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                Failed to load logs. Is the backend running?
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Recent Logs</h3>
                <span className="text-sm text-gray-500">
                    Showing {logs?.length || 0} entries
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-900 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3">Timestamp</th>
                            <th className="px-6 py-3">Source</th>
                            <th className="px-6 py-3">Event Type</th>
                            <th className="px-6 py-3">Severity</th>
                            <th className="px-6 py-3">Payload</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {logs?.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-3 whitespace-nowrap">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-3">{log.source}</td>
                                <td className="px-6 py-3 font-medium text-gray-900">
                                    {log.event_type}
                                </td>
                                <td className="px-6 py-3">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${log.severity === 'error' || log.severity === 'critical'
                                            ? 'bg-red-100 text-red-800'
                                            : log.severity === 'warning'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}
                                    >
                                        {log.severity}
                                    </span>
                                </td>
                                <td className="px-6 py-3 font-mono text-xs text-gray-500 truncate max-w-xs">
                                    {JSON.stringify(log.payload)}
                                </td>
                            </tr>
                        ))}
                        {logs?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No logs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Logs;
