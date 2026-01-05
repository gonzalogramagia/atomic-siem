import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../api/client';
import type { Rule } from '../types';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const Rules: React.FC = () => {
    const queryClient = useQueryClient();
    const [isCreating, setIsCreating] = useState(false);
    const [newRule, setNewRule] = useState({
        name: '',
        severity: 'medium',
        logic: '{"field": "event_type", "operator": "eq", "value": ""}',
    });

    const { data: rules, isLoading } = useQuery<Rule[]>({
        queryKey: ['rules'],
        queryFn: async () => {
            const response = await client.get('/rules');
            return response.data;
        },
    });

    const createRuleMutation = useMutation({
        mutationFn: async (rule: any) => {
            await client.post('/rules', {
                ...rule,
                logic: JSON.parse(rule.logic),
                enabled: true,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules'] });
            setIsCreating(false);
            setNewRule({
                name: '',
                severity: 'medium',
                logic: '{"field": "event_type", "operator": "eq", "value": ""}',
            });
        },
    });

    const deleteRuleMutation = useMutation({
        mutationFn: async (id: string) => {
            await client.delete(`/rules/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules'] });
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Create Rule Form */}
            {isCreating ? (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Create New Rule</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                value={newRule.name}
                                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Severity</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                value={newRule.severity}
                                onChange={(e) => setNewRule({ ...newRule, severity: e.target.value })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Logic (JSON)
                            </label>
                            <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 font-mono"
                                rows={3}
                                value={newRule.logic}
                                onChange={(e) => setNewRule({ ...newRule, logic: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => createRuleMutation.mutate(newRule)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Save Rule
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Create Rule
                    </button>
                </div>
            )}

            {/* Rules List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Active Rules</h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {rules?.map((rule) => (
                        <div key={rule.id} className="p-6 flex justify-between items-start">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">{rule.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Severity: <span className="font-medium capitalize">{rule.severity}</span>
                                </p>
                                <pre className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-100 font-mono text-gray-600">
                                    {JSON.stringify(rule.logic, null, 2)}
                                </pre>
                            </div>
                            <button
                                onClick={() => deleteRuleMutation.mutate(rule.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {rules?.length === 0 && (
                        <div className="p-6 text-center text-gray-500">No rules defined.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Rules;
