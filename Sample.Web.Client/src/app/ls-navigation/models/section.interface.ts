export interface SectionInterface {
    getId(): string; 
    getOffsetTop(): number;
    match(url: string): boolean;
}
