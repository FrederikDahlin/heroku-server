# Del 1 - Projektopgave HI-FI

## Om opgaven
Denne opgave er første del af HI-FI og omhandler opsætning, navigation og hentning af data. Læs hele opgavebeskrivelsen grundigt igennem inden du stiller spørgsmål.

## Opgavebeskrivelse

Du skal fremstille en webapplikation til en HI-FI webbutik, som præsenterer butikkens produkter inddelt efter kategori eller producent. Brugeren af sitet skal nemt og overskueligt kunne finde rundt i de forskellige produkter og kunne fremsøge produkter vha. søgeord. Der er udelukkende tale om præsentation af produkterne, man skal ikke kunne handle produkter på siden.

Den første del af opgaven, som varer en 1 uge (dvs 5 arbejds dage), omhandler udarbejdelse af wireframes, design og E/R diagram, samt en oversigt over det forventede tidsforbrug for hver arbejdsopgave du skal producere, samt produktionen af client-side samt database og API-routes. Forvent at bruge maks en dags tid på kravspecifikation opgaverne, dvs du vil have 4 dages tid til at udføre arbejdet.

Det arbejde der forventes udført når de 5 dage er gået, er en funktionel offentlig tilgængelig client-side som henter data og billeder fra en funktionel API. Siden er sat op så den passer til de wireframes du har produceret, samt siden i browseren matcher det design du har udtænkt, og databasen stemmer overens med det E/R diagram du har udarbejdet.

Et produkt består af et navn, en beskrivelse, en pris, et billede, samt hører til i en kategori og er knyttet til en producent. Du skal selv udtænke hvordan databasen sættes op.
*(billederne findes i den medfølgende .zip fil, men alle andre produktdata finder du selv på noget, benyt evt https://lipsum.com/feed/html )*

**OBS!** Selve administrations panelet skal først udarbejdes i del 2, så i første omgang indsættes al data manuelt i databasen.

### Tekniske krav
**Client-Side** skal løses vha. HTML, CSS og Javascript, som gennem et API henter data. Det er tilladt, at bruge Bootstrap og lignende frameworks. Det er ikke et krav.

**API / Server-Side** skal via routes tilbyde forskellige udtræk af databasen, hvor alt dynamisk data er lagret. 

### Design og layout
Du skal udarbejde et design og layout, dokumenteret via wireframes *(enten på papir eller elektronisk)*.<br>
Produktet skal designes efter mobile first princippet, men nødvendigvis ikke implementeret til begge medier *(prioriter browser varianten som den primære der produceres)*.

### Forslag til arbejdsprocess
* Planlægning: Afklaring af opgavens indhold defineret i en opgaveoversigt (husk hvad I har arbejdet med i IT)
* Layout: Udarbejdelse af designskitser og wireframes. Der er nok med et design forslag til forsidenm, men der skal være wireframes for ALLE unikke client-side sider.
* Design databasen i et E/R diagram
* GODKENDELSE AF SKITSER OG DIAGRAMMER, inden der kodes videre.
* Opsæt HTML sider med navigation og dummy-data (statisk site)
* Opret databasen og indsæt dummy-data
* Opsæt server og routes
* Programmér modules til dataudtræk
* Byg alle nødvendige fetch, og udskriv data fra fetch.
* Dokumentér kode og funktionalitet i markdown-filer 


### Sider og indhold
* Forside 
* Produkter
* Kontaktside 
 
### Forsiden 
* Forsidetekst og billeder af produkter
* Visning af ét eller flere udvalgte produkter (kan være de senest oprettede, et tilfældigt produkt eller andet du finder relevant)
 
### Produktsider
Der er flere forskellige funktioner under produkter:
* Visning af alle produkter inden for en bestemt kategori, uden produkt beskrivelse
* Visning af alle produkter der hører til en bestemt producent, uden produkt beskrivelse
* Visning af ét produkt ved klik på et produkt fra listerne
* Visning af produkter efter søgning 

Alle produkter hentes via et API og udskrives med fetch, alle produkter vises med deres billede.
 
### Kontaktsiden 
* Kontaktsiden indeholder informationer om HI-FI butikken samt en kontaktformular.
* Formulardata indsættes i databasen via et API *(dette gøres udelukkende fordi vi endnu ikke har været igennem mailafsendelse fra nodeJS)*
* Formularfelter skal selvfølgelig valideres
* Besked til brugeren om at formularen er sendt og modtaget
 
### Alle sider 
* Menu 
* Fritekst-søgefunktion til produkter og producenter (visning på produktsiden) 
* Footer med kontaktinfo 
 
### Forslag til routes 
/forside

/produkt/:id 

/produkt/kategori/:id 

/produkt/producent/:id 

/produkt/soeg/:tekst 

/kontakt 
 
### Database 
* E/R diagram 
* Passende datatyper _(int, varchar, osv)_
* Relationer i databasen

### Github
* Projektet opsættes i dette github repo.
* Der skal commites ved væsentlige ændringer eller færdiggørelse af en funktionalitet - og altid inden fyraften.
* Alle commit tekster på Github skal kort beskrive ændringerne. Der må ikke skrives ligegyldige beskrivelser!.

### Billedfiler
Alle billeder ligger i en zippet fil fordelt i mapper.

Du vælger om alle billeder skal ligge i én mappe eller om du vil bevare mappestrukturen. I næste del af opgaven skal du via kode uploade billeder til serveren og der har vi erfaring med at det kan være lidt mere indviklet, hvis filerne er fordelt i mapper - du bestemmer! (spørg evt. din vejleder).

 
Brug følgende liste, hvis I er i tvivl om hvilke kategorier de forskellige billeder tilhører:

  
**CD Afspillere**

    * creek_classic_cd.jpg
    * creek_Destiny_CD.jpg
    * creek_evo_cd.jpg
    * Exp_2010S_CD.gif


**DVD Afspillere**

    * creek_classic.jpg
    * exposure_2010S.jpg
    * parasound_d200.jpg
    * parasound_halod3.jpg

**Effektforstærkere**

    * manley_mahi.jpg
    * manley_neoclassic300b.jpg
    * manley_snapper.jpg
    * parasound_haloa23.jpg


**Forforstærkere**

    * Creek_OBH_22_Passive_Preamp.jpg
    * parasound_classic7100.jpg
    * parasound_halop3.jpg
    * Project_prebox.jpg


**Højtalere**

    * boesendorfer_vcs_wall.gif
    * epos_m5.gif
    * harbeth_hl7es2.jpg
    * harbeth_monitor30.jpg
    * harbeth_p3es2.jpg


**Int. Forstærkere**

    * creek_a50I.jpg
    * creek_classic5350SE.jpg
    * creek_destinyamp.jpg
    * manley_snapper.jpg
    * Manley_Stingray.jpg


**Pladespillere**

    * Pro_ject_Debut_3_bl.jpg
    * Pro_ject_Debut_III_red_1.jpg
    * Pro_ject_Debut_III_yellow_1.jpg
    * Pro_ject_rpm_5.jpg
    * Pro_ject_rpm10.jpg


**Rørforstærkere**

    * jolida_JD102b.jpg
    * jolida_JD202a.jpg
    * jolida_JD300b.jpg
    * jolida_JD302b.jpg
    * jolida_JD502b.jpg 
 
