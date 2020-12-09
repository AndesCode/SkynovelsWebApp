import { Injectable } from '@angular/core';

@Injectable()
export class Dev {
    urlNovelsDb = 'http://localhost:3000/api';
    urlCredentialsNovelsDb = '/api';
}

export class Prod {
    url = 'https://skynovelstesting.a2hosted.com';
    urlNovelsDb = 'https://skynovelstesting.a2hosted.com/api';
    urlCredentialsNovelsDb = '/api';
}
