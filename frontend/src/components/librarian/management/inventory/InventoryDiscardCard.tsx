import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';

type Props = {
    discardBookIdsRaw: string;
    discardReason: string;
    onDiscardBookIdsRawChange: (value: string) => void;
    onDiscardReasonChange: (value: string) => void;
    onDiscardBooks: () => void;
};

export default function InventoryDiscardCard({
    discardBookIdsRaw,
    discardReason,
    onDiscardBookIdsRawChange,
    onDiscardReasonChange,
    onDiscardBooks,
}: Readonly<Props>) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Thanh lý sách (DISCARDED)</Typography>
                <Stack spacing={1.2}>
                    <TextField label="Book IDs (vd: 1,2,3)" value={discardBookIdsRaw} onChange={(e) => onDiscardBookIdsRawChange(e.target.value)} />
                    <TextField label="Lý do thanh lý" value={discardReason} onChange={(e) => onDiscardReasonChange(e.target.value)} />
                    <Button color="error" variant="contained" onClick={onDiscardBooks}>Thanh lý</Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
