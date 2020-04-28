// tslint:disable: variable-name
export class Novel {
    id?: number;
    nvl_author?: number;
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
    chapters?: Array<any>;
    genres?: Array<any>;
    volumes?: Array<any>;
    bookmarks?: Array<any>;
    collaborators?: Array<any>;
    author?: any;
    createdAt?: Date;
    updatedAt?: Date;
}

export class NovelFilter {
    searchName: string;
    searchStatus: 'All'| 'Activa' | 'Inactiva' | 'Finalizada';
    searchGenres: Array<any>;
}

export class Genre {
    id?: number;
    genre_name?: string;
}


