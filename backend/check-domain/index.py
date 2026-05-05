import json
import re
import urllib.request
import urllib.error

def handler(event: dict, context) -> dict:
    """Проверяет доступность доменов .RU через DNS-over-HTTPS (Google DoH)."""

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
        clean = re.sub(r'[^a-zA-Zа-яА-Я0-9]', '', name).lower()
        if re.search(r'[а-яА-Я]', clean):
            slug = transliterate(clean)
        else:
            slug = clean

        domain_status = check_domain_doh(slug)
        print(f"[CHECK] '{name}' -> '{slug}.ru' -> {domain_status}")
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


def check_domain_doh(slug: str) -> str:
    """
    DNS-over-HTTPS через Google Public DNS.
    NS-записи есть у всех зарегистрированных .RU доменов.
    NXDOMAIN (status=3) = домен свободен.
    NOERROR + Answer = занят.
    """
    if not slug:
        return 'unknown'

    domain = slug + '.ru'

    for dns_type in ['NS', 'A']:
        url = f'https://dns.google/resolve?name={domain}&type={dns_type}'
        try:
            req = urllib.request.Request(
                url,
                headers={
                    'Accept': 'application/dns-json',
                    'User-Agent': 'NameChecker/1.0',
                },
            )
            resp = urllib.request.urlopen(req, timeout=8)
            data = json.loads(resp.read().decode())
            status = data.get('Status', -1)
            answers = data.get('Answer', [])

            print(f"[DoH] {domain} type={dns_type} status={status} answers={len(answers)}")

            if status == 0 and answers:
                return 'unavailable'
            elif status == 3:
                return 'available'

        except Exception as e:
            print(f"[DoH] error {domain} type={dns_type}: {e}")
            continue

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
