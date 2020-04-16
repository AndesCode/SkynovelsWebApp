export interface Chapter {
    id: string;
    nvl_id: string;
    chp_number: number;
    chp_author: string;
    chp_title: string;
    chp_content: string;
    chp_review: string;
    chp_status: string;
}

export class ChapterModel {
    id: string;
    nvl_id: string;
    chp_number: number;
    chp_author: string;
    chp_title: string;
    chp_content: string;
    chp_review: string;
    chp_status: string;
}
