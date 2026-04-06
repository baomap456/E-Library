import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';

type Props = {
    sessionName: string;
    sessionArea: string;
    onSessionNameChange: (value: string) => void;
    onSessionAreaChange: (value: string) => void;
    onCreateSession: () => void;
};

export default function InventorySessionCard({
    sessionName,
    sessionArea,
    onSessionNameChange,
    onSessionAreaChange,
    onCreateSession,
}: Readonly<Props>) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Phiên kiểm kê kho</Typography>
                <Stack spacing={1.2}>
                    <TextField label="Tên phiên kiểm kê" fullWidth value={sessionName} onChange={(e) => onSessionNameChange(e.target.value)} />
                    <TextField label="Khu vực" fullWidth value={sessionArea} onChange={(e) => onSessionAreaChange(e.target.value)} />
                    <Button variant="contained" onClick={onCreateSession}>Khởi tạo đợt kiểm kê</Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
