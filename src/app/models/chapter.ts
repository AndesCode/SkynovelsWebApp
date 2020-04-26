// tslint:disable: variable-name
export class Chapter {
    id?: number;
    chp_author?: number;
    chp_translator?: string;
    chp_translator_eng?: string;
    nvl_id?: number;
    vlm_id?: number;
    chp_number?: number;
    createdAt?: Date;
    chp_content?: string;
    chp_review?: string;
    chp_title?: string;
    chp_index_title?: string;
    chp_status?: 'Active' | 'Disabled';
    chp_comment_status?: string;
    chp_name?: string;
    updatedAt?: Date;
    chp_comment_count?: number;
    comments?: Array<any>;
}
