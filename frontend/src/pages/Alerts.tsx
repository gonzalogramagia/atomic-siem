import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../api/client';
import type { Alert } from '../types';
import { Loader2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const Alerts: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: alerts, isLoading, error } = useQuery<Alert[]>({
        queryKey: ['alerts'],
        queryFn: async () => {
            const response = await client.get('/alerts');
            return response.data;
        },
        refetchInterval: 5000,
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            await client.patch(`/alerts/${id}`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alerts'] });
        },
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
                <AlertTriangle size={20} />
                Failed to load alerts.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Security Alerts</h3>
                <span className="text-sm text-gray-500">
                    {alerts?.filter((a) => a.status === 'new').length} New
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-900 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3">Time</th>
                            <th className="px-6 py-3">Rule ID</th>
                            <th className="px-6 py-3">Severity</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {alerts?.map((alert) => (
                            <tr key={alert.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-3 whitespace-nowrap">
                                    {new Date(alert.created_at).toLocaleString()}
                                </td>
                                <td className="px-6 py-3 font-mono text-xs">{alert.rule_id}</td>
                                <td className="px-6 py-3">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${alert.severity === 'high' || alert.severity === 'critical'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        {alert.severity}
                                    </span>
                                </td>
                                <td className="px-6 py-3">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${alert.status === 'new'
                                            ? 'bg-blue-100 text-blue-800'
                                            : alert.status === 'resolved'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {alert.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 flex gap-2">
                                    {alert.status !== 'resolved' && (
                                        <button
                                            onClick={() =>
                                                updateStatusMutation.mutate({ id: alert.id, status: 'resolved' })
                                            }
                                            className="text-green-600 hover:text-green-800"
                                            title="Resolve"
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                    )}
                                    {alert.status === 'new' && (
                                        <button
                                            onClick={() =>
                                                updateStatusMutation.mutate({
                                                    id: alert.id,
                                                    status: 'acknowledged',
                                                })
                                            }
                                            className="text-gray-400 hover:text-gray-600"
                                            title="Acknowledge"
                                        >
                                            <XCircle size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {alerts?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No alerts found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Alerts;
