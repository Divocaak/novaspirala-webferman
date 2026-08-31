<script>
	import MarkdownIt from 'markdown-it';
	const md = new MarkdownIt();
	const source = `
### build 0.2.0, release 31. 8. 2026
#### 1) přidáno
- podstránka \`/changelog\`
- tlačítka _Vybrat vše_ a _Odebrat vše_ ve všech formulářích pro výběr uživatelů
- podpora Excel a Word formátů při nahrávání souborů
- možnost zobrazovat dny bez eventů (v kalendáři i tabulce)
- v hlavičce webu se zobrazují popisky práv
- v kalendáři se zobrazuje _ID objednávky_
- _sysadmin_ může změnit kdo vytvořil event
- požadovaný počet lidí
	- vedoucí sekce může při přidání/úpravě eventu zapsat, kolik lidí z dané sekce bude chtít
	- toto číslo se zobrazuje pouze ve formuláři pro přidání/úpravu eventu a na podstránce \`/booking\`
- vedoucí sekce má na domovské stránce nové tlačítko pro Export docházky do Excelu
	- ukládá pouze uživatele v jeho sekci
	- pouze přiřazené uživatele, včetně poznámek k nim
- ve formuláři pro přidání/úpravu eventu se zobrazuje čas zabookování eventu uživatelem
- pokud je ve formuláři při vytváření eventu více datumů, zobrazuje se u jednotlivých sekcí více sloupců pro přiřazení uživatele
##### a) IT podpora
- nové právo _it podpora_
- odemyká podstránku \`/itsupport\` s přehledem požadavků
- formulář pro přidání nového požadavku
- _sysadmin_ může u požadavků měnit stav (_ohlášeno_ => _v řešení_ => _vyřešeno_)
	- při každé změně stavu se ukládá datum a čas, kdy byl stav upraven
- _sysadmin_ může k požadavkům psát komentáře
	- vidí je ale pouze _sysadmin_
##### b) Dovolená
- nové právo _dovolená_
- odemyká podstránku \`/vacation\` s přehledem dovolených
- formulář pro zápis dovolené (každy uživatel zapisuje pouze sebe)
- v kalendáři i tabulce se u jednotlivých dnů zobrazuje kdo má v ten den zapsanou dovolenou
- dovolená se zobrazuje i ve formuláři pro přidání/úpravu eventu pod jménem konkrétního uživatele
- dovolenou po zápisu už nelze upravit/odstranit
##### c) Notifikace
- nové právo _dostávat notifikace_
- ve formuláři pro přidání/úpravu eventu se uživatelé s tímto právem zobrazují pod tlačítkem _Uložit_
	- zaškrtnutím jim systém pošle notifikaci o úpravě/přidání eventu
- pokud mám nepřečtené notifikace, zobrazí se mi na domovské stránce něco jako schránka
	- lze zaškrtnout přečtení jednotlivých notifikací
	- lze zaškrtnout všechny notifikace najednou
##### d) Booking
- pro vedoucí sekce nová podstránka \`/booking\`
	- zobrazuje zabookované uživatele u jednotlivých eventů po sekcích
	- u každého uživatele zobrazuje čas, kdy si event zabookoval
	- funguje stejně, jako přiřazování ve formuláři přidat/upravit event
		- vybrat/zrušit vše
		- poznámky k uživatelům
	- u každé sekce se zobrazuje nastavený limit

#### 2) upraveno
- zbarvení sloupců v kalendáři podle barvy prostoru
- zbarvení práv v hlavičce
- defaultně se nezobrazují telefonní čísla a emaily
	- přidána nová práva _Zobrazovat tel. čísla_ a _Zobrazovat emaily_

#### 3) opraveno
- bookování akcí
- poznámka u jména při přiřazování k eventu
- validace práv při přístupu na zabezpečené podstránky
##### a) booking na vícedenní eventy
- položka ve formuláři _Do_ je nově pouze časová
- pokud event přesahuje jeden den, je potřeba přidat další datum
	- pro každý datum vzniká samostatný event (=> samostatné ID v databázi), na lze přiřazovat a bookovat lidi samostatně


### build 0.1.6, release 25. 7. 2026
### build 0.1.7, release 22. 4. 2026
### build 0.1.6, release 12. 4. 2026
### build 0.1.5, release 23. 2. 2026
### build 0.1.4, release 22. 2. 2026
### build 0.1.3, release 9. 2. 2026
### build 0.1.2, release 17. 1. 2026
### build 0.1.1, release 20. 12. 2025
### build 0.1.0, release 16. 12. 2025
### build 0.0.5, release 20. 8. 2025
### build 0.0.4, release 12. 8. 2025
### build 0.0.3, release 4. 8. 2025
### build 0.0.2, release 2. 8. 2025
### build 0.0.1, release 23. 6. 2025
    `;

	$: html = md.render(source);
</script>

<h2>Changelog</h2>
<div class="markdown">{@html html}</div>
