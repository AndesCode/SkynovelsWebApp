export class Novel {

    id: string;
    nvl_author?: string;
    nvl_title?: string;
    nvl_acronym?: string;
    nvl_name?: string;
    nvl_content?: string;
    nvl_writer?: string;
    nvl_img?: string;
    nvl_status?: 'Active' | 'Disabled' | 'Finished';
    nvl_translator_eng?: string;
    nvl_translator?: string;
    nvl_rating?: number;
    nvl_publication_date?: Date;
    nvl_chapters?: number;
    genres?: Array<any>;
    volumes?: Array<any>;
    bookmarks?: Array<any>;
    collaborators?: Array<any>;
    author?: any;
    createdAt?: Date;
    updatedAt?: Date;

}
