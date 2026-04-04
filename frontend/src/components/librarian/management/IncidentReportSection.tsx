import {
    Autocomplete,
    Button,
    Card,
    CardContent,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useLibrarianManagementContext } from './LibrarianManagementContext';

export default function IncidentReportSection() {
    const props = useLibrarianManagementContext();
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Lập biên bản sự cố</Typography>
                <Stack spacing={1.2}>
                    <Autocomplete
                        options={props.incidentRecordOptions}
                        value={props.incidentRecordOptions.find((item) => String(item.recordId) === props.incidentRecordId) || null}
                        onChange={(_, option) => props.onIncidentRecordIdChange(option ? String(option.recordId) : '')}
                        getOptionLabel={(option) => option.label}
                        noOptionsText="Chưa có dữ liệu"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Tìm mã phiếu mượn"
                                placeholder="Nhập mã phiếu hoặc tên người mượn"
                            />
                        )}
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
                        <>
                            <TextField
                                select
                                label="Tỷ lệ bồi thường"
                                value={props.lostCompensationRate}
                                onChange={(e) => props.onLostCompensationRateChange(e.target.value as '100' | '150')}
                            >
                                <MenuItem value="100">100%</MenuItem>
                                <MenuItem value="150">150%</MenuItem>
                            </TextField>
                            {props.compensationAmount > 0 && (
                                <TextField
                                    label="Tiền bồi thường (VND)"
                                    type="number"
                                    value={props.compensationAmount.toFixed(0)}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    disabled
                                />
                            )}
                        </>
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
