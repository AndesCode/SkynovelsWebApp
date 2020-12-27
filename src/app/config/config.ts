import { Injectable } from '@angular/core';

@Injectable()
export class Dev {
    url = 'http://localhost:4200';
    apiURL = 'http://localhost:3000';
    urlNovelsDb = 'http://localhost:3000/api';
    urlCredentialsNovelsDb = '/api';
}

export class Prod {
    url = 'https://snpruebas.skynovels.net';
    apiURL = 'https://api.snpruebas.skynovels.net';
    urlNovelsDb = 'https://api.snpruebas.skynovels.net/api';
    urlCredentialsNovelsDb = 'https://api.snpruebas.skynovels.net/api';
}
