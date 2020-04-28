// tslint:disable: variable-name
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
