import { useState } from 'react';

export function useLibrarianCatalogFormsState() {
    const [newAuthor, setNewAuthor] = useState('');
    const [digitalTitle, setDigitalTitle] = useState('');
    const [digitalDescription, setDigitalDescription] = useState('');
    const [digitalPublisher, setDigitalPublisher] = useState('');
    const [digitalPublishYear, setDigitalPublishYear] = useState('2026');
    const [digitalFileUrl, setDigitalFileUrl] = useState('');
    const [digitalIsbn, setDigitalIsbn] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newRoom, setNewRoom] = useState('');
    const [newShelf, setNewShelf] = useState('');

    return {
        newAuthor,
        setNewAuthor,
        digitalTitle,
        setDigitalTitle,
        digitalDescription,
        setDigitalDescription,
        digitalPublisher,
        setDigitalPublisher,
        digitalPublishYear,
        setDigitalPublishYear,
        digitalFileUrl,
        setDigitalFileUrl,
        digitalIsbn,
        setDigitalIsbn,
        newCategory,
        setNewCategory,
        newRoom,
        setNewRoom,
        newShelf,
        setNewShelf,
    };
}