import { Injectable } from '@angular/core';

@Injectable()
export class Dev {
    url = 'http://localhost:4200';
    apiURL = 'http://localhost:3000';
    urlNovelsDb = 'http://localhost:3000/api';
    urlCredentialsNovelsDb = '/api';
}

export class Prod {
    url = 'https://anovelsite.com';
    apiURL = 'https://api.anovelsite.com';
    urlNovelsDb = 'https://api.anovelsite.com/api';
    urlCredentialsNovelsDb = 'https://api.anovelsite.com/api';
}
