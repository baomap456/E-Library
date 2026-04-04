import { Typography } from '@mui/material';

export default function CatalogPageHeader() {
    return (
        <>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Tra cứu và khám phá sách
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Tìm sách theo nhu cầu, xem chi tiết và vị trí trên kệ.
            </Typography>
        </>
    );
}
