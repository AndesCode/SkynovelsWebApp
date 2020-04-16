export interface Novel {
    id: string;
    nvl_author: string;
    nvl_title: string;
    nvl_name: string;
    nvl_content: string;
    nvl_writer: string;
    nvl_img: any;
    nvl_status: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface NovelRating {
    user_id: string;
    novel_id: string;
    rate_value: number;
    rate_comment: string;
}


export class NovelModel {

    id: string;
    nvl_author: string;
    nvl_title: string;
    nvl_name: string;
    nvl_content: string;
    nvl_writer: string;
    nvl_img: any;
    nvl_status: string;
    genres: Array<any>;
    chapters: Array<any>;
    collaborators: Array<any>;
    author: any;
    createdAt: Date;
    updatedAt: Date;

}
