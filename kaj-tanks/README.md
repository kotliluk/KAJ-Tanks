# Tanks 2D

Téma mé semestrální práce pro KAJ je jednoduchá 2D hra. Půjde o lokální multiplayer, ve kterém
se hráči budou střídat v ovládání svého tanku. Hráči se mohou pohybovat, měnit náklon děla a střílet.
Ve hře jsou různé druhy munice, které se liší dostřelem, velikostí výbuchu a poškozením. Mimo tanky
jsou na mapě přítomné i ničitelné překážky.

Hráči si mohou vytvořit stálý hráčský profil se vlastním avatarem, pro který se budou započítávat
statistiky, nebo se do hry přidat s jednorázovým hráčem.

Hra je dostupná [zde](https://kotliluk.github.io/KAJ-Tanks/).

## Ovládání

**Home**

Tlačítko **New Game** zobrazí výbšr hráčů pro novou hru.

Tlačítko **Stats** zobrazí statistiky uložených hráčů.

Tlačítko **Music on/off** zapne/vypne hudbu aplikace.

Logo **Tanks2D** je animované, zkuste vystřelit jeho náboje :)

Puntík vedle loga signalizuje připojení k internetu.

**Stats**

Tabulka zobrazuje statistiky uložených hráčů.

Po vyplnění unikátního jména v dolním poli lze vytvořit nový uložený hráč. K hráči je možné nahrát
svůj vlastní PNG avatar.

**New Game**

Tlačítko **Quick player** přidá nového jednorázového hráče do hry. Je potřeba vyplnit jeho jméno.
Jeho výsledky nebudou uloženy.

Tlačítko **Stored player** přidá hráče z uložených (viz **Stats**).

U hráčů lze změnit barva tanku pro danou hru. Po přidání alespoň dvou hráčů a vyplnění jejich jmen
hru zapnete pomocí tlačítka **Play**.

**Game**

Tankem pohybujete pomocí tlačítek okolo nápisu **MOVE**. Podobně nakláníte dělo tlačítky vedle **GUN**.
Hodnota za **Wind** udává sílu větru, jeho směr je pak vyjádřen šípkami.

Tlačítky vpravo vybíráte použitou munici. Číslo v závorce udává počete dostupné munice u omezených
nábojů. Posuvníkem pod výběrem náboje nastavíte sílu výstřelu. Při najetí nad název náboje se
zobrazí blížší informace. Tlačítkem **Fire** vystřelíte.

Boxy na spodku stránky ukazují statistiky jednotlivých hráčů.

Po zničení předposledního hráče se zobrazí výsledky hry.

## Návrh

Pro implementaci jsem zvolil TypeScript kvůli typové kontrole a React pro
jednoduché členění hierarchie obrazovek a komponent. Projekt je dělen na několik
packages, nejdůležitější je **components**, kde jsou definované GUI komponenty, a
**game_objects**, kde je definovaná heirarchie herních objektů pomocí ES6 tříd.

## Body zadání

V práci jsem se pokusil splnit následující body zadání:

* **Dokumentace**
* dokumentace - kód aplikace je komentován
* **HTML 5**
* validita 1 - validator.w3.org nehlásí žádné chyby
* validita 2 - po celou dobu vývoje jsem aplikaci testoval v nových prohlížečích,
nepouzivam zadne bleeding edge technologie
* sémantické značky - věřím, že HTML struktura stránky je logická a správná, jednotlivé obrazovky
jsou tvořeny section elementy
* grafika SVG/Canvas - samotná hra využívá requestAnimationFrame smyčky na canvas, loga aplikace
jsou v SVG s navěšenými posluchači (zkuste kliknout na náboje v logu stránky)
* média audio/video - aplikace má podkladovou hudbu a zvuky výstřelů a explozí
* formulářové prvky - při zadávání nových uložených hráčů kontoluji duplicitní jména, při nové hře
kontroluji počet hráčů a jejich jména, využívám placeholders, více typů input (text, file, color,
select), autofocus při přidávání hráčů
* offline aplikace - aplikace funguje bez přístupu k internetu
* **CSS**
* pokročilé selektory - v CSS hojně využívám CSS třídy, nebo hierarchické zanořování, dále pak
:hover, ::after, :first-child, atd.
* vendor prefixy - pomocí vendor prefixů řeším custom styling scrollbarů
* Transformace 2D/3D - využívám transformace v animaci náboje v logu (logo.css), nebo pro zvětšování
tlačítek delete (addPlayerMenu.css, messageBox.css)
* Transitions/animations - animuji výstřel náboje v logu po kliknutí (logo.css), pomocí transition
zobrazuji blížší informace o nábojích po mouse hover (gameArea.css)
* media queries - používám media queries pro rozumné zobrazení i na mobilních zařízeních,
v gameArea.css dále ještě relativní jednotky pro poměrné vykreslení na různých obrazovkách
* **JavaScript**
* OOP přístup - celá aplikace hojně využívá třídy a dědičnost (např. herní objekty)
* Použití frameworku - obrazovky aplikace využívají React
* Použití pokročilých JS API - aplikace využívá local storage pro ukládání hráčů, File API pro
nahrání obrázků hráčů, a DragNDrop pro přesouvání pořadí hráčů při NewGame
* Funkční historie - pomocí React router aplikace podporuje 3 různé url adresy - lze se historií
přesouvat mezi homepage/game/stats
* ovládání médií - audio aplikace je spouštěno JavaScriptem buď automaticky (výstřely/exploze),
nebo handlováním tlačítka music on/off
* offline aplikace - aplikace rozpoznává online/offline stav a ukazuje ho puntíkem vedla loga
* JS práce s SVG - na SVG logu jsou navěšeny posluchače, které nastavují animaci výstřelů
* **Ostatní**
* kompletnost - hra sice není nejrozsáhlejší, ale je plně funkční
* estetika - k posouzení estetiky se neumim vyjadrit a nechám ho zcela na Vás :) 
