import {
    Button,
    Card,
    CardContent,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

interface IncidentReportSectionProps {
    incident: string;
    onIncidentChange: (value: string) => void;
    onCreateIncident: () => void;
}

export default function IncidentReportSection(props: IncidentReportSectionProps) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Lập biên bản sự cố</Typography>
                <Stack spacing={1.2}>
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
                </Stack>
            </CardContent>
        </Card>
    );
}
