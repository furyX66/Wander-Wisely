import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface ChatRequestDto {
    message: string;
}

interface ChatResponseDto {
    reply: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private apiUrl = '/api/chat'; // dopasuj jeśli potrzebujesz pełny URL

    constructor(private http: HttpClient) { }

    sendMessage(message: string) {
        const body: ChatRequestDto = { message };
        return this.http.post<ChatResponseDto>(this.apiUrl, body);
    }
}
