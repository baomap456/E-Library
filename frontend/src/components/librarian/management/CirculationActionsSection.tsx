import {
    Button,
    Card,
    CardContent,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

interface CirculationActionsSectionProps {
    username: string;
    barcode: string;
    onUsernameChange: (value: string) => void;
    onBarcodeChange: (value: string) => void;
    onCheckout: () => void;
    onCheckin: () => void;
}

export default function CirculationActionsSection(props: CirculationActionsSectionProps) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Check-out / Check-in</Typography>
                <Stack spacing={1.2}>
                    <TextField
                        label="Username"
                        fullWidth
                        value={props.username}
                        onChange={(e) => props.onUsernameChange(e.target.value)}
                    />
                    <TextField
                        label="Mã sách (barcode)"
                        fullWidth
                        value={props.barcode}
                        onChange={(e) => props.onBarcodeChange(e.target.value)}
                    />
                    <Button variant="contained" onClick={props.onCheckout}>Xác nhận giao sách</Button>
                    <Button variant="outlined" onClick={props.onCheckin}>Xác nhận trả sách</Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
