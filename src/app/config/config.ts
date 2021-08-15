import { Injectable } from '@angular/core';

@Injectable()
export class Dev {
    url = 'http://localhost:4200';
    apiURL = 'http://localhost:3000';
    urlNovelsDb = 'http://localhost:3000/api';
    urlCredentialsNovelsDb = '/api';
    ws = 'ws://localhost:3000';
}

export class Prod {
    url = 'https://skynovels.net';
    apiURL = 'https://api.skynovels.net';
    urlNovelsDb = 'https://api.skynovels.net/api';
    urlCredentialsNovelsDb = 'https://api.skynovels.net/api';
    ws = 'ws://api.skynovels.net';
}
