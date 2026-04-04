import { useState } from 'react';

export function useLibrarianIncidentState() {
    const [incident, setIncident] = useState('');
    const [incidentRecordId, setIncidentRecordId] = useState('');
    const [incidentType, setIncidentType] = useState<'LOST' | 'DAMAGED'>('LOST');
    const [damageSeverity, setDamageSeverity] = useState<'LIGHT' | 'HEAVY'>('LIGHT');
    const [repairCost, setRepairCost] = useState('');
    const [lostCompensationRate, setLostCompensationRate] = useState<'100' | '150'>('100');

    return {
        incident,
        setIncident,
        incidentRecordId,
        setIncidentRecordId,
        incidentType,
        setIncidentType,
        damageSeverity,
        setDamageSeverity,
        repairCost,
        setRepairCost,
        lostCompensationRate,
        setLostCompensationRate,
    };
}