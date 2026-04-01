import {
    Button,
    Card,
    CardContent,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

interface IncidentReportSectionProps {
    incident: string;
    incidentRecordId: string;
    incidentType: 'LOST' | 'DAMAGED';
    damageSeverity: 'LIGHT' | 'HEAVY';
    repairCost: string;
    lostCompensationRate: '100' | '150';
    onIncidentChange: (value: string) => void;
    onIncidentRecordIdChange: (value: string) => void;
    onIncidentTypeChange: (value: 'LOST' | 'DAMAGED') => void;
    onDamageSeverityChange: (value: 'LIGHT' | 'HEAVY') => void;
    onRepairCostChange: (value: string) => void;
    onLostCompensationRateChange: (value: '100' | '150') => void;
    onCreateIncident: () => void;
    onReportBorrowIncident: () => void;
}

export default function IncidentReportSection(props: Readonly<IncidentReportSectionProps>) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Lập biên bản sự cố</Typography>
                <Stack spacing={1.2}>
                    <TextField
                        label="Mã phiếu mượn"
                        value={props.incidentRecordId}
                        onChange={(e) => props.onIncidentRecordIdChange(e.target.value)}
                    />
                    <TextField
                        select
                        label="Loại sự cố"
                        value={props.incidentType}
                        onChange={(e) => props.onIncidentTypeChange(e.target.value as 'LOST' | 'DAMAGED')}
                    >
                        <MenuItem value="LOST">Mất sách</MenuItem>
                        <MenuItem value="DAMAGED">Hư hại sách</MenuItem>
                    </TextField>
                    {props.incidentType === 'LOST' && (
                        <TextField
                            select
                            label="Tỷ lệ bồi thường"
                            value={props.lostCompensationRate}
                            onChange={(e) => props.onLostCompensationRateChange(e.target.value as '100' | '150')}
                        >
                            <MenuItem value="100">100%</MenuItem>
                            <MenuItem value="150">150%</MenuItem>
                        </TextField>
                    )}
                    {props.incidentType === 'DAMAGED' && (
                        <>
                            <TextField
                                select
                                label="Mức độ hư hại"
                                value={props.damageSeverity}
                                onChange={(e) => props.onDamageSeverityChange(e.target.value as 'LIGHT' | 'HEAVY')}
                            >
                                <MenuItem value="LIGHT">Hư hại nhẹ</MenuItem>
                                <MenuItem value="HEAVY">Hư hại nặng</MenuItem>
                            </TextField>
                            <TextField
                                label="Chi phí sửa chữa (VND)"
                                type="number"
                                value={props.repairCost}
                                onChange={(e) => props.onRepairCostChange(e.target.value)}
                            />
                        </>
                    )}
                    <TextField
                        label="Biên bản sự cố"
                        multiline
                        minRows={4}
                        value={props.incident}
                        onChange={(e) => props.onIncidentChange(e.target.value)}
                    />
                    <Button variant="contained" color="secondary" onClick={props.onCreateIncident}>
                        Lập biên bản
                    </Button>
                    <Button variant="contained" color="error" onClick={props.onReportBorrowIncident}>
                        Ghi nhận sự cố mất/hư hại
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
