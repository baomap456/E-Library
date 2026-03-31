export interface LibrarianDashboard {
    totalBooks: number;
    borrowingNow: number;
    borrowingsToday: number;
}

export interface LibrarianBook {
    id: number;
    title: string;
    publishYear: number;
    publisher: string;
}

export interface LibrarianDebtor {
    recordId: number;
    username: string;
    bookTitle: string;
    fineAmount: number;
}

export interface LibrarianAuthor {
    id: number;
    name: string;
}

export interface LibrarianCategory {
    id: number;
    name: string;
}

export interface LibrarianLocation {
    id: number;
    roomName: string;
    shelfNumber: string;
}
