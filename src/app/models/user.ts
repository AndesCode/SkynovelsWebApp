export class User {
    user_id: string;
    user_rol: string;
    jwt: string;
    user_pass?: string;
}

export class UpdatePass {
    user_id: string;
    user_pass: string;
}

export interface UserProfile {
    id: string;
    user_login: string;
    user_description: string;
    user_profile_image: string;
}
