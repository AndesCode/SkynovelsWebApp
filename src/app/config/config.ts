import { Injectable } from '@angular/core';

@Injectable()
export class Dev {
    urlNovelsDb = 'http://localhost:3000/api';
    urlCredentialsNovelsDb = '/api';
}

export class Prod {
    url = 'https://anovelsite.com';
    urlNovelsDb = 'https://api.anovelsite.com/api';
    urlCredentialsNovelsDb = 'https://api.anovelsite.com/api';
}
