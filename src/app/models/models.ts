// tslint:disable: variable-name
export class Novel {
    id?: number;
    nvl_author?: number;
    nvl_title?: string;
    nvl_acronym?: string;
    nvl_name?: string;
    nvl_content?: string;
    nvl_writer?: string;
    image?: string;
    nvl_status?: 'Active' | 'Disabled' | 'Finished' | 'Finalizada' | 'Activa' | 'Inactiva' | 'Oculta';
    nvl_translator_eng?: string;
    nvl_translator?: string;
    nvl_rating?: number;
    nvl_publication_date?: string;
    nvl_chapters?: number;
    nvl_rated?: boolean;
    nvl_recommended?: boolean;
    chapters?: Array<Chapter>;
    genres?: Array<any>;
    volumes?: Array<Volume>;
    bookmarks?: Array<any>;
    novel_ratings?: Array<NovelRating>;
    collaborators?: Array<any>;
    author?: any;
    createdAt?: string;
    updatedAt?: string;
    nvl_last_update?: string;
    user_bookmark?: Bookmark;
    date_data?: any;
    nvl_last_chapter?: Chapter;
    nvl_currentChapter?: string;
    nvl_currentChapterN?: string;
}

export class NovelFilter {
    searchName: string;
    orderBy: string;
    searchStatus: 'All'| 'Activa' | 'Inactiva' | 'Finalizada';
    searchGenres: Array<any>;
}

export class NovelRating {
    id: number;
    likes?: Array<Like>;
    user_id: number;
    createdAt?: string;
    updatedAt?: string;
    rate_value?: number;
    user_login?: string;
    replys?: Array<Reply>;
    rate_comment?: string;
    image?: string;
    edition?: boolean;
    show_more?: boolean;
    show_replys?: boolean;
    liked?: boolean;
    like_id?: number;
    reply?: string;
    replys_count?: number;
}

export class Genre {
    id?: number;
    genre_name?: string;
}

export class User {
    id?: number;
    user_id?: number;
    user_login?: string;
    user_email?: string;
    user_rol?: string;
    user_status?: 'Active' | 'Disabled';
    user_forum_auth?: 'Active' | 'Disabled';
    user_description?: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
    token?: string;
    forum_posts?: Array<any>;
    novels?: Array<any>;
    volumes?: Array<any>;
    chapters?: Array<any>;
    chapters_comments?: Array<any>;
    chapters_comments_likes?: Array<Like>;
    invitations?: Array<any>;
    novels_ratings?: Array<any>;
    novels_ratings_likes?: Array<Like>;
    novels_ratings_comments?: Array<any>;
    novels_ratings_comments_likes?: Array<Like>;
    bookmarks?: Array<any>;
    post_comments?: Array<any>;
    collaborations?: Array<any>;
}

export class LoginUser {
    user_login: string;
    user_pass: string;
}

export class NewUser {
    user_login: string;
    user_pass: string;
    user_email: string;
}

export class Bookmark {
    id?: number;
    nvl_id?: number;
    chp_id: number;
    chp_name?: string;
    user_id?: number;
    createdAt?: string;
    updatedAt?: string;
}

export class Invitation {
    id?: number;
    user_login?: string;
    invitation_from_id?: number;
    invitation_to_id?: number;
    invitation_novel?: number;
    invitation_status?: 'Active' | 'Confirmed' | 'Rejected';
    createdAt?: string;
    updatedAt?: string;
    invitation_from_user_image?: string;
    invitation_from_login?: string;
    invitation_nvl_title?: string;
}

export class novelCollaborator {
    user_login?: string;
    novel_id?: number;
}

export class Advertisement {
    id?: number;
    adv_title?: string;
    adv_name?: string;
    user_id?: number;
    user_login?: string;
    adv_content?: string;
    adv_status?: 'Active' | 'Disabled' | 'Finished' | 'Finalizada' | 'Activa' | 'Inactiva' | 'Oculta';
    image?: string;
    adv_order?: number;
    comments?: Array<Comment>;
    comment?: string;
    likes?: Array<Like>;
    liked?: boolean;
    like_id?: number;
    date_data?: any;
    createdAt?: string;
    updatedAt?: string;
}

export class Like {
    id?: number;
    user_id?: number;
    user_login?: string;
    adv_id?: number;
    novel_rating_id?: number;
    comment_id?: number;
    reply_id?: number;
    forum_post_id?: number;
    post_comment_id?: number;
}

export class Chapter {
    id?: number;
    chp_author?: number;
    user_login?: string;
    chp_translator?: string;
    nvl_id?: number;
    vlm_id?: number;
    chp_number?: number;
    chp_content?: string;
    chp_content_array?: Array<string>;
    chp_review?: string;
    chp_title?: string;
    chp_index_title?: string;
    chp_status?: 'Active' | 'Disabled';
    chp_comment_status?: string;
    chp_name?: string;
    createdAt?: string;
    updatedAt?: string;
    chp_comment_count?: number;
    comments?: Array<Comment>;
    comment?: string;
    nvl_title?: string;
    nvl_name?: string;
    new?: boolean;
    date_data?: any;
}

export class Volume {
    id?: number;
    vlm_title?: string;
    nvl_id?: number;
    user_id?: number;
    chapters?: Array<Chapter>;
    open?: boolean;
}

export class Comment {
    id?: number;
    comment_content?: string;
    replys_count?: number;
    user_id?: number;
    user_login?: string;
    image?: string;
    adv_id?: number;
    chp_id?: number;
    replys?: Array<Reply>;
    likes?: Array<Like>;
    likes_count?: number;
    createdAt?: string;
    updatedAt?: string;
    edition?: boolean;
    show_more?: boolean;
    show_replys?: boolean;
    reply?: string;
    liked?: boolean;
    like_id?: number;
    date_data?: any;
}

export class Reply {
    id?: number;
    reply_content?: string;
    replys_count?: number;
    user_id?: number;
    user_login?: string;
    image?: string;
    comment_id?: number;
    novel_rating_id?: number;
    likes?: Array<Like>;
    likes_count?: number;
    createdAt?: string;
    updatedAt?: string;
    edition?: boolean;
    show_more?: boolean;
    show_replys?: boolean;
    reply?: string;
    liked?: boolean;
    like_id?: number;
    date_data?: any;
}



