import { Injectable } from '@angular/core';

@Injectable()
export class Dev {
    urlNovelsDb = 'http://localhost:3000/api';
    urlCredentialsNovelsDb = '/api';
}

export class Prod {
    urlNovelsDb = 'https://skynovelstesting.a2hosted.com:40000/api';
    urlCredentialsNovelsDb = '/api';
}
