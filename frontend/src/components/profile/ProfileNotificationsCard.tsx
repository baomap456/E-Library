import { Card, CardContent, Chip, Divider, List, ListItem, ListItemText, Typography } from '@mui/material';
import type { NotificationResponse } from '../../types/modules/authPersonal';

type Props = {
    notifications: NotificationResponse[];
};

export default function ProfileNotificationsCard({ notifications }: Props) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1.5 }}>
                    Thông báo của tôi
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
                <List dense>
                    {notifications.length === 0 && (
                        <ListItem>
                            <ListItemText primary="Chưa có thông báo." />
                        </ListItem>
                    )}
                    {notifications.map((item) => (
                        <ListItem key={item.id} sx={{ alignItems: 'flex-start' }}>
                            <ListItemText
                                primary={item.message}
                                secondary={
                                    <Chip
                                        size="small"
                                        label={item.read ? 'Đã đọc' : 'Mới'}
                                        color={item.read ? 'default' : 'secondary'}
                                        sx={{ mt: 0.7 }}
                                    />
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}
