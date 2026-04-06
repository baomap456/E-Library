import {
    Button,
    Card,
    CardContent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import LibrarianTablePagination from '../LibrarianTablePagination';
import type { LibrarianDigitalDocument } from '../../../types/modules/librarian';
import { useLibrarianManagementContext } from './LibrarianManagementContext';

export default function DigitalCrudSection() {
    const props = useLibrarianManagementContext();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const pagedDocuments = useMemo(() => {
        const start = page * rowsPerPage;
        return props.digitalDocuments.slice(start, start + rowsPerPage);
    }, [props.digitalDocuments, page, rowsPerPage]);

    const handlePageChange = (_: unknown, nextPage: number) => {
        setPage(nextPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(Number.parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEditDocument = (doc: LibrarianDigitalDocument) => {
        const title = globalThis.prompt('Tên tài liệu', doc.title);
        if (title === null) {
            return;
        }
        const fileUrl = globalThis.prompt('File URL', doc.fileUrl);
        if (fileUrl === null) {
            return;
        }
        const publisher = globalThis.prompt('Nhà xuất bản', doc.publisher || '');
        if (publisher === null) {
            return;
        }
        const yearRaw = globalThis.prompt('Năm xuất bản', String(doc.publishYear));
        if (yearRaw === null) {
            return;
        }
        const publishYear = Number.parseInt(yearRaw, 10);
        if (!Number.isFinite(publishYear) || publishYear <= 0) {
            return;
        }
        const isbn = globalThis.prompt('ISBN', doc.isbn || '');
        if (isbn === null) {
            return;
        }
        const description = globalThis.prompt('Mô tả', doc.description || '');
        if (description === null) {
            return;
        }

        props.onUpdateDigitalDocument(doc.id, {
            title: title.trim(),
            description: description.trim(),
            publishYear,
            publisher: publisher.trim(),
            fileUrl: fileUrl.trim(),
            isbn: isbn.trim(),
        });
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Quản lý tài liệu số</Typography>
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <TextField label="Tên tài liệu" value={props.digitalTitle} onChange={(e) => props.onDigitalTitleChange(e.target.value)} />
                    <TextField label="Mô tả" value={props.digitalDescription} onChange={(e) => props.onDigitalDescriptionChange(e.target.value)} />
                    <TextField label="Nhà xuất bản" value={props.digitalPublisher} onChange={(e) => props.onDigitalPublisherChange(e.target.value)} />
                    <TextField label="Năm xuất bản" value={props.digitalPublishYear} onChange={(e) => props.onDigitalPublishYearChange(e.target.value)} />
                    <TextField label="ISBN" value={props.digitalIsbn} onChange={(e) => props.onDigitalIsbnChange(e.target.value)} />
                    <TextField label="File URL" value={props.digitalFileUrl} onChange={(e) => props.onDigitalFileUrlChange(e.target.value)} />
                    <Button variant="contained" onClick={props.onCreateDigitalDocument}>Thêm</Button>
                </Stack>

                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên</TableCell>
                            <TableCell>Năm</TableCell>
                            <TableCell>URL</TableCell>
                            <TableCell align="right">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.digitalDocuments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">Chưa có dữ liệu</TableCell>
                            </TableRow>
                        ) : (
                            pagedDocuments.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell>{doc.title}</TableCell>
                                    <TableCell>{doc.publishYear}</TableCell>
                                    <TableCell>{doc.fileUrl}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            onClick={() => handleEditDocument(doc)}
                                        >
                                            Sửa
                                        </Button>
                                        <Button size="small" color="error" onClick={() => props.onDeleteDigitalDocument(doc.id)}>Xóa</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <LibrarianTablePagination
                    count={props.digitalDocuments.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 20]}
                />
            </CardContent>
        </Card>
    );
}
