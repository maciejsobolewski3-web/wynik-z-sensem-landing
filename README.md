# Wynik z sensem

Publiczna koncepcja strony biura rachunkowego przygotowana na podstawie HTML przekazanego przez klienta. Osobny projekt od WAWA Padel i NeoPadel.

## Zakres

- Nowa identyfikacja: znak równości, leśna zieleń, jasne tła, DM Sans i Instrument Serif.
- Responsywny landing: o biurze, usługi, współpraca, siedem kalkulatorów, cennik, ankieta i kontakt.
- Animacje respektują `prefers-reduced-motion`.
- Ankieta wyświetla lokalne podsumowanie. Nie wysyła i nie zapisuje danych. Brak analityki oraz skryptów reklamowych. Fonty są hostowane lokalnie.
- Ceny, adres kontaktowy i deklaracja doświadczenia pochodzą z dostarczonego materiału. Wymagają akceptacji właścicielki przed właściwym startem.
- Zdjęcie jest ilustracją AI, nie fotografią rzeczywistego biura. Oznaczono je na stronie.

## Kalkulatory

To demonstracja, nie gotowe narzędzie do rozliczeń podatkowych. Zachowano zakres źródłowego projektu i finalne wersje jego obliczeń. Usunięto nadpisujące się starsze inicjalizacje ZUS, dodano walidację pól i obliczanie dni w UTC. Podstawowe scenariusze wszystkich siedmiu narzędzi sprawdzono w przeglądarce. Pełny audyt podatkowy nie był zakresem projektu wizualnego.

Podstawowe parametry zweryfikowano 28.09.2026 z materiałami:

- [ZUS: składki na ubezpieczenia](https://www.zus.pl/en/firmy/rozliczenia-z-zus/skladki-na-ubezpieczenia)
- [MF: zwolnienie podmiotowe z VAT](https://www.podatki.gov.pl/podatki-firmowe/vat/poradniki-i-informatory/zwolnienie-podmiotowe-od-podatku-vat)
- [MF: stawki i limity PIT](https://www.podatki.gov.pl/podatki-firmowe/pit/stawki-i-limity)
- [MF: limity CIT, samochody](https://www.podatki.gov.pl/podatki-firmowe/cit/cit-klasyczny/stawki-i-limity)
- [MRPiPS: podróż służbowa](https://www.gov.pl/web/rodzina/podroz-sluzbowa)
- [Biznes.gov.pl: odsetki podatkowe](https://biznes.gov.pl/pl/portal/001355)

Ograniczenia: odsetki używają jednej ręcznie ustalonej stawki dla całego okresu; tabela diet zagranicznych i klasyfikacja PKWiU wymagają pełnej weryfikacji; obliczenia ZUS nie obejmują wszystkich szczególnych sytuacji. Wdrożenie produkcyjne wymaga akceptacji biura, aktualizacji parametrów, właściwych informacji o administratorze i podłączenia formularzy.

## Uruchomienie

Statyczny HTML, CSS i JavaScript, bez instalowania zależności. `python3 -m http.server 4193`.

## Materiał wizualny

Grafika `assets/office.webp` została wygenerowana wbudowanym narzędziem ImageGen i zoptymalizowana do publikacji. Prompt:

> Use case: photorealistic-natural. Asset: wide photographic background for a premium Polish accounting practice website, no typography. Editorial architectural photo of a quiet beautiful European office with tall windows and fine dark forest-green timber frames, textured warm pale grey walls, a substantial walnut desk in lower right with neat unbranded paper documents, an open notebook, small black calculator and a ceramic coffee cup. Side sunlight casts precise rectangular shadows across the desk. View from a few meters away, camera normal lens, refined realistic materials, subtle film grain, rich deep forest greens and warm neutral highlights. The left half is mostly dark shaded wall and soft architectural shadows, deliberately uncluttered for white website headline overlay; interesting sunlit desk and window on the right. Authentic calm working environment, not luxury hotel. No people, no letters, no charts, no logos, no watermarks. Wide landscape 16:9.

## Weryfikacja

Widoki 1440 px i 390 px, brak poziomego przepełnienia i błędów JavaScript. Sprawdzono menu mobilne, zakładki, formularz podglądowy i przykładowe wyniki VAT, ZUS, leasingu, kasy, odsetek, delegacji i ryczałtu. Zrzuty podglądowe i wyniki testów zapisano lokalnie w `qa/`.
