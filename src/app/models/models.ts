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
    nvl_status?: 'Active' | 'Disabled' | 'Finished' | 'Finalizada' | 'Activa' | 'Inactiva' | 'Oculta';
    nvl_translator_eng?: string;
    nvl_translator?: string;
    nvl_rating?: number;
    nvl_publication_date?: Date;
    nvl_chapters?: number;
    nvl_rated?: boolean;
    chapters?: Array<any>;
    genres?: Array<any>;
    volumes?: Array<any>;
    bookmarks?: Array<any>;
    novel_ratings?: Array<any>;
    collaborators?: Array<any>;
    author?: any;
    createdAt?: Date;
    updatedAt?: Date;
    nvl_last_update?: Date;
    user_bookmark?: any;
    date_data?: any;
    nvl_last_chapter?: any;
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

export class User {
    id?: number;
    user_id?: number;
    user_login?: string;
    user_pass?: string;
    user_email?: string;
    user_rol?: string;
    user_status?: 'Active' | 'Disabled';
    user_forum_auth?: 'Active' | 'Disabled';
    user_description?: string;
    user_profile_image?: string;
    createdAt?: Date;
    updatedAt?: Date;
    token?: string;
    forum_posts?: Array<any>;
    novels?: Array<any>;
    volumes?: Array<any>;
    chapters?: Array<any>;
    chapters_comments?: Array<any>;
    chapters_comments_likes?: Array<any>;
    invitations?: Array<any>;
    novels_ratings?: Array<any>;
    novels_ratings_likes?: Array<any>;
    novels_ratings_comments?: Array<any>;
    novels_ratings_comments_likes?: Array<any>;
    bookmarks?: Array<any>;
    post_comments?: Array<any>;
    collaborations?: Array<any>;
}

export class Invitation {
    id?: number;
    user_login?: string;
    invitation_from_id?: number;
    invitation_to_id?: number;
    invitation_novel?: number;
    invitation_status?: 'Active' | 'Confirmed' | 'Rejected';
    createdAt?: Date;
    updatedAt?: Date;
    invitation_from_user_image?: string;
    invitation_from_login?: string;
    invitation_nvl_title?: string;
}


