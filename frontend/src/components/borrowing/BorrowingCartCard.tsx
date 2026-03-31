import { Button, Card, CardContent, Typography } from '@mui/material';
import type { BorrowingCartItem } from '../../types/modules/borrowing';

type Props = {
    cart: BorrowingCartItem[];
};

export default function BorrowingCartCard({ cart }: Props) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>Giỏ sách đặt mượn</Typography>
                {cart.length === 0 && <Typography>Giỏ đang trống</Typography>}
                {cart.map((item, index) => (
                    <Typography key={item.bookId}>{index + 1}. {item.title}</Typography>
                ))}
                <Button variant="contained" sx={{ mt: 2 }} disabled={cart.length === 0}>Xác nhận đặt chỗ</Button>
            </CardContent>
        </Card>
    );
}
