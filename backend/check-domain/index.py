import json
import socket
import re
import os

def handler(event: dict, context) -> dict:
    """Проверяет доступность домена .RU через WHOIS и никнеймов в соцсетях."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    names = body.get('names', [])

    if not names or not isinstance(names, list):
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'names array required'})
        }

    results = []
    for name in names[:10]:
        slug = re.sub(r'[^a-zA-Zа-яА-Я0-9]', '', name).lower()
        domain_status = check_domain_whois(slug)
        results.append({
            'name': name,
            'slug': slug,
            'domain': domain_status,
        })

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'results': results})
    }


def check_domain_whois(name: str) -> str:
    """Проверяет домен через WHOIS-сокет ru-center."""
    try:
        # Транслитерируем кириллицу если нужно
        domain = transliterate(name) + '.ru'

        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(5)
        s.connect(('whois.tcinet.ru', 43))
        s.sendall((domain + '\r\n').encode())

        response = b''
        while True:
            chunk = s.recv(4096)
            if not chunk:
                break
            response += chunk
        s.close()

        text = response.decode('utf-8', errors='ignore').lower()

        if 'no entries found' in text or 'not found' in text:
            return 'available'
        elif 'state:' in text or 'domain:' in text:
            return 'unavailable'
        else:
            return 'unknown'

    except Exception:
        return 'unknown'


TRANSLIT_MAP = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya',
}


def transliterate(text: str) -> str:
    result = ''
    for ch in text.lower():
        result += TRANSLIT_MAP.get(ch, ch)
    return result
