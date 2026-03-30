export interface DigitalDoc {
    id: number;
    title: string;
    publishYear: number;
    description: string;
    format: string;
}

export interface ReaderConfig {
    title: string;
    allowDownload: boolean;
    allowRightClick: boolean;
    toolbar: string[];
}
