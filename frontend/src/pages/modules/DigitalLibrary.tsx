import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useDigitalLibrary } from '../../hooks/modules/useDigitalLibrary';

export default function DigitalLibrary() {
    const {
        docs,
        selectedDoc,
        setSelectedDoc,
        readerConfig,
        filters,
        setFilters,
        loading,
        error,
        loadDocs,
    } = useDigitalLibrary();

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Module 4: Digital Library
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Danh mục tài liệu số và trình đọc PDF toàn màn hình.
            </Typography>

            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2.2}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.5 }}>Danh mục tài liệu số</Typography>
                            <Stack spacing={1.4}>
                                <TextField label="Từ khóa" value={filters.q} onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))} fullWidth />
                                <TextField select label="Năm" value={filters.year} onChange={(e) => setFilters((p) => ({ ...p, year: e.target.value }))} fullWidth>
                                    <MenuItem value="">Tất cả</MenuItem>
                                    <MenuItem value="2026">2026</MenuItem>
                                    <MenuItem value="2025">2025</MenuItem>
                                    <MenuItem value="2024">2024</MenuItem>
                                </TextField>
                                <Button variant="contained" onClick={() => void loadDocs()}>Lọc tài liệu</Button>
                                {docs.map((doc) => (
                                    <Box
                                        key={doc.id}
                                        onClick={() => setSelectedDoc(doc)}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 1.5,
                                            border: selectedDoc?.id === doc.id ? '2px solid #2f6edb' : '1px solid #d4ddf2',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 700 }}>{doc.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">{doc.publishYear} - {doc.format}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1.5 }}>PDF Reader</Typography>
                            <Box
                                sx={{
                                    borderRadius: 2,
                                    border: '1px solid #d4ddf2',
                                    overflow: 'hidden',
                                    background: '#f0f4ff',
                                }}
                            >
                                <Stack direction="row" spacing={1} sx={{ p: 1, borderBottom: '1px solid #d4ddf2', background: '#fff' }}>
                                    {(readerConfig?.toolbar || ['zoom-in', 'zoom-out']).map((tool) => (
                                        <Button key={tool} size="small" variant="outlined">{tool}</Button>
                                    ))}
                                </Stack>
                                <Box
                                    sx={{
                                        height: 320,
                                        display: 'grid',
                                        placeItems: 'center',
                                        color: '#5b6472',
                                        fontWeight: 600,
                                        p: 2,
                                        textAlign: 'center',
                                    }}
                                    onContextMenu={(e) => {
                                        if (readerConfig?.allowRightClick === false) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <div>
                                        <Typography sx={{ fontWeight: 800 }}>{readerConfig?.title || selectedDoc?.title || 'Chưa chọn tài liệu'}</Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Download: {readerConfig?.allowDownload ? 'Allowed' : 'Blocked'} | Right click: {readerConfig?.allowRightClick ? 'Allowed' : 'Blocked'}
                                        </Typography>
                                    </div>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
