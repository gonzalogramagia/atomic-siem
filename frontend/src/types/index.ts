export interface Log {
    id: string;
    timestamp: string;
    received_at: string;
    source: string;
    event_type: string;
    severity: string;
    payload: Record<string, any>;
}

export interface Rule {
    id: string;
    name: string;
    description?: string;
    severity: string;
    logic: Record<string, any>;
    enabled: boolean;
}

export interface Alert {
    id: string;
    rule_id: string;
    log_id: string;
    severity: string;
    status: string;
    created_at: string;
}
